import os
import json
import logging
import threading
import requests as http

logger = logging.getLogger(__name__)
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.core.mail import send_mail
from .models import Project, Devis, SiteConfig, Client, ServicePrice, ContactMessage, PortfolioPreviewSlot
from .serializers import ProjectSerializer, SiteConfigSerializer, ClientSerializer, PortfolioPreviewSlotSerializer


@api_view(["GET"])
@permission_classes([AllowAny])
def site_config(request):
    config = SiteConfig.get()
    return Response(SiteConfigSerializer(config).data)


@api_view(["GET"])
@permission_classes([AllowAny])
def clients(request):
    return Response(ClientSerializer(Client.objects.all(), many=True).data)


@api_view(["GET"])
@permission_classes([AllowAny])
def preview_slots(request):
    device = request.query_params.get("device")
    qs = PortfolioPreviewSlot.objects.filter(active=True).select_related("project")
    if device:
        qs = qs.filter(device=device)
    return Response(PortfolioPreviewSlotSerializer(qs, many=True).data)


@api_view(["GET"])
@permission_classes([AllowAny])
def projects(request):
    category = request.query_params.get("category")
    qs = Project.objects.filter(published=True)
    if category:
        qs = qs.filter(category=category)
    return Response(ProjectSerializer(qs, many=True).data)


CATEGORIES_LABELS = {
    "covers":     "Covers",
    "branding":   "Logo & Branding",
    "videos":     "Lyrics Video",
    "affiches":   "Affiches",
    "miniatures": "Miniatures YouTube",
    "bannieres":  "Bannières & Profils",
}

SUBTYPES_LABELS = {
    "covers": {
        "single":    "Cover Single",
        "album":     "Cover Album",
        "single_3d": "Cover Single 3D",
        "album_3d":  "Cover Album 3D",
    },
    "branding": {
        "logo":     "Logo simple",
        "mini":     "Mini Branding",
        "complet":  "Branding complet",
        "premium":  "Branding premium",
    },
    "videos": {
        "simple":      "Typo & BG simples",
        "bg_anime":    "Background animé",
        "lyric_card":  "Lyric Card Style",
        "minimaliste": "Minimaliste animé",
        "cinematique": "Cinématique",
        "glitch":      "Particle / Glitch",
        "3d":          "3D",
    },
    "affiches": {
        "unique":      "Affiche unique",
        "pack":        "Pack événement",
        "compilation": "Compilation",
        "entreprise":  "Projet entreprise",
    },
    "miniatures": {
        "unique":     "Miniature unique",
        "pack":       "Pack miniatures",
        "rebranding": "Rebranding miniatures",
    },
    "bannieres": {
        "banniere":   "Bannière seule",
        "profil":     "Photo de profil",
        "both":       "Bannière + Profil",
        "rebranding": "Rebranding de page",
    },
}

DURATION_LABELS = {
    "short":  "Moins de 2 min",
    "medium": "2 à 4 min",
    "long":   "4 à 6 min",
    "xlong":  "Plus de 6 min",
}

DEADLINE_LABELS = {
    "urgent":   ("Urgent",   "Moins de 3 jours",    30),
    "rapide":   ("Rapide",   "3 à 7 jours",         15),
    "normal":   ("Normal",   "1 à 3 semaines",       0),
    "flexible": ("Flexible", "Pas de date précise",  0),
}

BUDGET_LABELS_BY_CURRENCY = {
    "FCFA": {
        "b1": "Moins de 50.000 FCFA",
        "b2": "50.000 – 150.000 FCFA",
        "b3": "150.000 – 300.000 FCFA",
        "b4": "300.000 – 500.000 FCFA",
        "b5": "500.000 FCFA et plus",
    },
    "EUR": {
        "b1": "Moins de 80€",
        "b2": "80€ – 250€",
        "b3": "250€ – 500€",
        "b4": "500€ – 800€",
        "b5": "800€ et plus",
    },
    "USD": {
        "b1": "Moins de 90$",
        "b2": "90$ – 270$",
        "b3": "270$ – 540$",
        "b4": "540$ – 850$",
        "b5": "850$ et plus",
    },
}


FALLBACK_PRICES = """TARIFS DE BASE WALANO (ne jamais tous les montrer) :
- Covers : Single 30k / Album 50k / Single 3D 70k / Album 3D 120k FCFA
- Branding : Logo simple 30k / Mini Branding 70k / Branding complet 150k / Manifeste 280k / Opus 600k FCFA
- Lyrics Video : Typographie & Arrière-plan 45k / BG animé 65k / Lyric Card 65k / Minimaliste 75k / Cinématique 90k / Glitch 100k / 3D sur devis
- Affiches : Unique 20k / Pack 3 = 55k / Pack 5 = 85k / Pack 10 = 150k FCFA
- Miniatures : Unique 20k / Pack 5 = 90k / Pack 10 = 170k FCFA
- Bannières : Seule 30k / Profil 25k / Les deux 50k FCFA"""


def _get_prices_block() -> str:
    prices = ServicePrice.objects.filter(active=True).order_by("category", "order")
    if not prices.exists():
        return FALLBACK_PRICES

    lines = ["TARIFS DE BASE WALANO (ne jamais tous les montrer) :"]
    current_cat = None
    cat_items = []

    def flush(cat, items):
        if cat and items:
            cat_label = CATEGORIES_LABELS.get(cat, cat)
            lines.append(f"- {cat_label} : " + " / ".join(items))

    for p in prices:
        if p.category != current_cat:
            flush(current_cat, cat_items)
            current_cat = p.category
            cat_items = []
        price_str = f"{p.price_fcfa:,}".replace(",", ".") + " FCFA"
        cat_items.append(f"{p.label} {price_str}")
    flush(current_cat, cat_items)

    return "\n".join(lines)


def _build_prompt(data: dict) -> str:
    category       = data.get("category", "")
    subtype        = data.get("subtype", "")
    video_duration = data.get("videoDuration", "")
    extra          = data.get("extra", "")
    deadline       = data.get("deadline", "")
    currency       = data.get("currency", "FCFA")
    budget         = data.get("budget", "")
    name           = data.get("name", "")

    cat_label      = CATEGORIES_LABELS.get(category, category)
    sub_label      = SUBTYPES_LABELS.get(category, {}).get(subtype, subtype)
    dur_label      = DURATION_LABELS.get(video_duration, "") if video_duration else ""
    dl_label, dl_sub, dl_surcharge = DEADLINE_LABELS.get(deadline, ("", "", 0))
    budget_labels  = BUDGET_LABELS_BY_CURRENCY.get(currency, BUDGET_LABELS_BY_CURRENCY["FCFA"])
    budget_label   = budget_labels.get(budget, budget)

    surcharge_note = f" (supplément +{dl_surcharge}%)" if dl_surcharge else ""

    lang       = data.get("lang", "fr")
    lang_note  = "Write in English." if lang == "en" else "Écris en français."

    return f"""Tu es la voix de Walano, graphiste et artiste visuel spécialisé dans l'industrie musicale. Tu ne parles pas comme un commercial, tu parles comme un artiste qui prend le travail au sérieux. Tu t'adresses directement au client, avec chaleur, sans fioriture, sans sur-vente. Aucun emoji. {lang_note}

MANIÈRE DE PARLER :
- Tu es direct et humain. Pas de formules creuses ("je serais ravi de", "n'hésitez pas à").
- Tu montres que t'as vraiment lu le projet du client — tu fais le lien entre ce qu'il décrit et ce que tu proposes.
- Tu parles en artiste : le message visuel compte autant que la technique. Tu peux glisser cette dimension naturellement.
- Tu mélanges français et termes techniques anglais quand c'est naturel (color grading, mood, layout, draft…).
- Les phrases sont directes, parfois courtes, parfois longues quand tu construis une idée.
- Tu ne survends pas. Si le budget est là pour faire quelque chose de bien, tu le dis clairement et tu proposes en conséquence.
- Tu sais que le client vient souvent parce qu'il a déjà été touché par le travail de Walano, tu pars de là, pas de zéro.
- Tu n'utilises jamais de tiret long ou trait horizontal (pas de "—", pas de "–") dans le texte du message.
- La signature est uniquement le mot "Walano" seul sur sa ligne, précédé de deux sauts de ligne. Rien d'autre.

PROJET DU CLIENT :
- Catégorie : {cat_label}
- Type : {sub_label}{f" ({dur_label})" if dur_label else ""}
- Description libre : {extra or "Non précisé"}
- Deadline : {dl_label} — {dl_sub}{surcharge_note}
- Devise : {currency}
- Budget sélectionné : {budget_label}
- Prénom : {name}

{_get_prices_block()}

SERVICES COMPLÉMENTAIRES DISPONIBLES CHEZ WALANO (add-ons possibles selon le contexte) :

COVERS — add-ons cohérents :
→ Motion design de cover (cover animée pour réseaux), teaser de sortie (15-30s), trailer de sortie (30-60s), visualizer audio (waveform animée), lyric card animé (extrait pour story/reels), loop Spotify Canvas, générique artiste animé, kit de posts pour sortie (série feed instagram), stories & reels covers (formats verticaux), annonce teaser visuelle, countdown de sortie (J-7 / J-3 / J-1), quote card (paroles en visuel), press kit visuel, miniature YouTube assortie, pack miniatures chaîne, bannière YouTube assortie, photo de profil assortie, typography sheet, colour palette, moodboard visuel, wordmark, affiche de concert liée au projet, flyer numérique, CD/vinyl artwork, merch design (t-shirt / hoodie)
→ Cover 3D = dernière option seulement si budget très large et tout le reste déjà couvert

LOGO & BRANDING — add-ons cohérents :
→ Charte graphique complète (PDF règles d'utilisation), déclinaisons du logo (noir / blanc / couleur / icône), carte de visite design, signature email design, kit réseaux brandé (profil + bannière + stories), merch design (appliquer le logo sur vêtements), sticker pack design, wordmark si non inclus, affiche / flyer à l'image de la marque, miniature YouTube brandée, bannière YouTube brandée

LYRICS VIDEO — add-ons cohérents :
→ Sous-titres stylisés pour reels/shorts (version courte), teaser du clip (15-30s monté pour les réseaux), version carrée / verticale pour Instagram/TikTok, thumbnail YouTube assortie, bannière YouTube thème du clip, kit de posts autour du clip (annonce, extrait, behind the scene), générique / intro artiste animé réutilisable

AFFICHES — add-ons cohérents :
→ Adaptation stories (format vertical de l'affiche), adaptation bannière web / header, version bilingue de l'affiche, déclinaison couleurs (sombre + claire), programme / livret événement, badge / accréditation design, roll-up / kakemono design, ticket d'entrée design, kit de posts autour de l'événement, stories & reels de l'affiche

MINIATURES YOUTUBE — add-ons cohérents :
→ Pack miniatures par série / playlist, vignette de fin de vidéo (end screen design), carte info pour shorts / vidéos courtes, bannière YouTube assortie, photo de profil assortie, kit de posts autour des vidéos

BANNIÈRES & PROFILS — add-ons cohérents :
→ Kit complet réseaux (X, Instagram, YouTube, Twitch, Facebook — même direction visuelle), overlay stream Twitch (cadre webcam, alertes, écran de pause), emotes / badges Twitch personnalisés, avatar animé (GIF ou court loop), frame photo de profil (cadre événement ou sortie), miniature YouTube assortie

NOTE : L'audit visuel de chaîne est une prestation premium à part entière — ne jamais le proposer comme add-on. Si le contexte s'y prête, mentionner qu'une consultation séparée est possible.

RÈGLES :
1. Si deadline urgente ou rapide, applique le supplément (+30% ou +15%) sur le prix de base et mentionne-le naturellement.
2. Propose une seule offre principale, celle que le client a choisie. Pas de substitution.
3. BUDGET INSUFFISANT — Si le budget sélectionné est inférieur au prix de base du service choisi, sois honnête. Explique ce qui est faisable dans ce budget (version plus simple du même type de service si possible). Ne complète pas le manque avec des add-ons, ce serait incohérent.
4. BUDGET SUFFISANT — Si le prix de base du service est inférieur au budget sélectionné, enrichis l'offre principale avec des add-ons cohérents (voir liste) pour atteindre la tranche budgétaire. Le client est prêt à investir ce montant, propose quelque chose à la hauteur.
5. LOGIQUE D'ADD-ON — Les add-ons doivent prolonger naturellement le projet du client, jamais le remplacer. Cover → motion design, teaser, kit de posts, miniature. Pas une autre cover. La cover 3D uniquement si budget très large et tout le reste déjà couvert.
6. Le champ "upsell" sert à suggérer une prochaine étape naturelle, pas un add-on déjà inclus dans l'offre. 1 phrase max, dans la continuité du projet.
7. Le message doit montrer que t'as vraiment lu le projet. Utilise la description libre pour personnaliser.
8. Si description libre vide, reste naturel et chaleureux sans inventer.
9. Aucun emoji, aucun symbole décoratif, aucun tiret long (— ou –).
10. Si la devise n'est pas FCFA, convertis et affiche les prix dans la devise choisie ({currency}).

FORMAT JSON uniquement (pas de markdown, pas de backticks) :
{{
  "packName": "nom créatif du pack (ex: Pack Lancement Single, Pack Campagne EP…)",
  "offerTitle": "nom du service principal + add-ons inclus si applicable",
  "price": "prix total formaté dans la devise {currency} avec supplément si applicable",
  "offerDetails": "2-4 livrables concrets inclus dans l'offre, ton conversationnel court",
  "message": "message personnalisé 3-4 phrases. Termine par deux sauts de ligne puis uniquement le mot Walano sur sa propre ligne, sans tiret ni trait avant.",
  "upsell": "1 suggestion complémentaire naturelle, dans la continuité du projet, 1 phrase max"
}}"""


@api_view(["POST"])
@authentication_classes([])
@permission_classes([AllowAny])
def devis(request):
    data = request.data

    required = ["category", "subtype", "deadline", "currency", "budget", "name", "email"]
    for field in required:
        if not data.get(field):
            return Response({"error": f"Champ requis : {field}"}, status=status.HTTP_400_BAD_REQUEST)

    api_key = os.getenv("ANTHROPIC_API_KEY", "")
    if not api_key:
        return Response({"error": "Clé API manquante"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    prompt = _build_prompt(data)

    try:
        resp = http.post(
            "https://api.anthropic.com/v1/messages",
            headers={
                "x-api-key":         api_key,
                "anthropic-version": "2023-06-01",
                "content-type":      "application/json",
            },
            json={
                "model":      "claude-sonnet-4-6",
                "max_tokens": 1000,
                "messages":   [{"role": "user", "content": prompt}],
            },
            timeout=90,
        )
        resp.raise_for_status()
        text = resp.json()["content"][0]["text"].strip()
        text = text.replace("```json", "").replace("```", "").strip()
        ai_result = json.loads(text)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_502_BAD_GATEWAY)

    client_name  = data.get("name", "")
    client_email = data.get("email", "")

    Devis.objects.create(
        category       = data.get("category", ""),
        subtype        = data.get("subtype", ""),
        video_duration = data.get("videoDuration", ""),
        extra          = data.get("extra", ""),
        deadline       = data.get("deadline", ""),
        currency       = data.get("currency", "FCFA"),
        budget         = data.get("budget", ""),
        name           = client_name,
        email          = client_email,
        ai_response    = ai_result,
    )

    # ── Emails (thread séparé pour ne pas bloquer la réponse) ──
    def _send_emails():
        try:
            pack    = ai_result.get("packName", "")
            offer   = ai_result.get("offerTitle", "")
            price   = ai_result.get("price", "")
            details = ai_result.get("offerDetails", "")
            message = ai_result.get("message", "")
            upsell  = ai_result.get("upsell", "")
            from_email = os.getenv("DEFAULT_FROM_EMAIL", "contact@walanodesign.com")

            body_client = f"""Bonjour {client_name},

Voici votre estimation Walano Design.

{pack}
{offer}
Prix estimé : {price}

Ce qui est inclus :
{details}

{message}

{"---" + chr(10) + upsell if upsell else ""}

---
Cette estimation est indicative et peut être ajustée selon les détails finaux de votre projet.
Pour aller plus loin : contact@walanodesign.com
"""
            send_mail(
                subject        = f"[Walano Design] Votre estimation — {pack}",
                message        = body_client,
                from_email     = from_email,
                recipient_list = [client_email],
                fail_silently  = False,
            )

            contact_email = os.getenv("CONTACT_EMAIL", "")
            if contact_email:
                body_internal = f"""Nouveau devis soumis.

Prénom : {client_name}
Email   : {client_email}
Catégorie : {data.get("category")} / {data.get("subtype")}
Budget : {data.get("budget")} ({data.get("currency")})
Deadline : {data.get("deadline")}

Description : {data.get("extra", "—")}

Résultat IA :
{pack} — {price}
{details}
"""
                send_mail(
                    subject        = f"[Walano Devis] {client_name} — {pack}",
                    message        = body_internal,
                    from_email     = from_email,
                    recipient_list = [contact_email],
                    fail_silently  = False,
                )
        except Exception as e:
            logger.error(f"[devis email error] {e}")

    threading.Thread(target=_send_emails, daemon=True).start()

    return Response(ai_result, status=status.HTTP_200_OK)


@api_view(["POST"])
@authentication_classes([])
@permission_classes([AllowAny])
def contact(request):
    data = request.data
    required = ["name", "email", "subject", "message"]
    for field in required:
        if not data.get(field, "").strip():
            return Response({"error": f"Champ requis : {field}"}, status=status.HTTP_400_BAD_REQUEST)

    msg = ContactMessage.objects.create(
        name    = data["name"].strip(),
        email   = data["email"].strip(),
        subject = data["subject"].strip(),
        message = data["message"].strip(),
    )

    contact_email = os.getenv("CONTACT_EMAIL", "")
    if contact_email:
        try:
            send_mail(
                subject      = f"[Walano Design] {msg.subject}",
                message      = f"De : {msg.name} <{msg.email}>\n\n{msg.message}",
                from_email   = os.getenv("DEFAULT_FROM_EMAIL", "noreply@walanodesign.com"),
                recipient_list = [contact_email],
                fail_silently  = True,
            )
        except Exception:
            pass

    return Response({"ok": True}, status=status.HTTP_201_CREATED)
