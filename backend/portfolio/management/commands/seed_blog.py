"""
Usage:
    python manage.py seed_blog

Creates the 5 initial blog articles and 3 initial clients
if they don't already exist (safe to run multiple times).
"""

from django.core.management.base import BaseCommand
from django.utils.timezone import make_aware
from datetime import datetime
from portfolio.models import BlogPost, Client


PUBLISHED_AT = make_aware(datetime(2026, 4, 4))


ARTICLES = [
    # ── Article 1 : branding ──────────────────────────────────────────────────
    {
        "slug":        "difference-logo-identite-visuelle-charte-graphique",
        "title":       "La différence entre un logo, une identité visuelle et une charte graphique",
        "title_en":    "The difference between a logo, a visual identity and brand guidelines",
        "description": "Beaucoup confondent logo, identité visuelle et charte graphique. Voici ce que chaque terme signifie concrètement et ce dont tu as vraiment besoin.",
        "description_en": "Many people confuse logo, visual identity and brand guidelines. Here's what each term actually means and what you really need.",
        "category":    "branding",
        "content": """\
C'est la question que je reçois le plus souvent. Un client me dit "je veux un logo" alors qu'en réalité il a besoin d'une identité visuelle complète. Un autre me demande "une charte graphique" mais ce qu'il veut c'est juste un logo avec ses couleurs. Clarifions tout ça.

**Le logo**

Le logo c'est un symbole, un signe, une marque. C'est l'élément le plus simple et le plus reconnaissable de ta marque. Il peut être un pictogramme (une icône), un logotype (ton nom stylisé), ou une combinaison des deux.

Quand tu commandes un logo chez moi, tu reçois le design final en plusieurs formats (PNG, JPG, parfois SVG), avec des déclinaisons : version couleur, version noir et blanc, version sur fond clair, version sur fond sombre. C'est un livrable précis, limité, qui répond à un besoin précis.

Un logo seul ne te dit pas comment construire tes visuels, tes posts, tes affiches. Il te dit juste "voilà ta marque en image".

**L'identité visuelle**

L'identité visuelle c'est l'univers autour du logo. Elle comprend le logo, mais aussi la palette de couleurs, la ou les typographies, le style photographique ou illustratif, les textures, les motifs, le ton visuel global.

Quand je crée une identité visuelle pour un artiste ou une entreprise, je ne livre pas juste un fichier logo. Je livre une direction artistique. Quelque chose qui permet à n'importe qui de regarder un visuel et de dire "ça c'est toi" sans même voir ton nom.

Concrètement, l'identité visuelle inclut : le logo et ses déclinaisons, la palette de couleurs (codes hex, RGB), les typographies principales et secondaires, des exemples d'application (mockups sur des supports réels), et le ton visuel général.

**La charte graphique**

La charte graphique c'est le document qui formalise tout. C'est le mode d'emploi de ton identité visuelle. Elle dit exactement comment utiliser le logo (taille minimale, espaces de protection, ce qu'il ne faut pas faire), quelles couleurs utiliser et dans quelles proportions, quelles typographies pour les titres, les textes, les légendes.

C'est un PDF ou un document structuré que tu donnes à un imprimeur, un développeur web, un community manager, pour qu'ils respectent ta marque même sans toi dans la pièce.

Tout le monde n'a pas besoin d'une charte graphique. Si tu es un artiste solo qui gère ses propres visuels, une identité visuelle suffit largement. Si tu travailles avec une équipe ou des prestataires externes, la charte devient essentielle.

**Ce dont tu as besoin**

Si tu démarres et que tu veux juste être reconnaissable : un logo.

Si tu veux que tout ton univers soit cohérent (pochettes, réseaux, merch) : une identité visuelle.

Si tu travailles avec d'autres personnes qui doivent produire des visuels pour toi : une charte graphique.

Et si tu ne sais pas encore, on en discute. C'est exactement à ça que sert le devis gratuit sur walanodesign.com/devis.""",
        "content_en": """\
This is the question I get asked the most. A client says "I want a logo" when they actually need a full visual identity. Another asks for "brand guidelines" but really just wants a logo with their colours. Let's clear this up.

**The logo**

A logo is a symbol, a sign, a mark. It's the simplest and most recognisable element of your brand. It can be a pictogram (an icon), a logotype (your name styled), or a combination of both.

When you order a logo from me, you receive the final design in multiple formats (PNG, JPG, sometimes SVG), with variations: colour version, black and white version, version on light background, version on dark background. It's a precise, contained deliverable that answers a precise need.

A logo alone doesn't tell you how to build your visuals, posts or posters. It just says "this is your brand in image form".

**The visual identity**

A visual identity is the universe around the logo. It includes the logo, but also the colour palette, the typography or typographies, the photographic or illustrative style, textures, patterns, the overall visual tone.

When I create a visual identity for an artist or a business, I don't just deliver a logo file. I deliver an artistic direction. Something that lets anyone look at a visual and say "that's you" without even seeing your name.

Concretely, a visual identity includes: the logo and its variations, the colour palette (hex and RGB codes), primary and secondary typefaces, application examples (mockups on real supports), and the overall visual tone.

**The brand guidelines**

Brand guidelines are the document that formalises everything. It's the instruction manual for your visual identity. It states exactly how to use the logo (minimum size, clear space, what not to do), which colours to use and in what proportions, which typefaces for titles, body text and captions.

It's a PDF or structured document you give to a printer, a web developer, a community manager, so they respect your brand even when you're not in the room.

Not everyone needs brand guidelines. If you're a solo artist managing your own visuals, a visual identity is more than enough. If you work with a team or external contractors, guidelines become essential.

**What you actually need**

If you're starting out and just want to be recognisable: a logo.

If you want your whole universe to be consistent (covers, social media, merch): a visual identity.

If you work with others who need to produce visuals for you: brand guidelines.

And if you're not sure yet, let's talk about it. That's exactly what the free quote on walanodesign.com/devis is for.""",
    },

    # ── Article 2 : process ───────────────────────────────────────────────────
    {
        "slug":        "combien-coute-graphiste-freelance-2026",
        "title":       "Combien coûte un graphiste freelance en 2026",
        "title_en":    "How much does a freelance graphic designer cost in 2026",
        "description": "Grille tarifaire réaliste pour les prestations graphiques en 2026 : covers, logos, affiches, vidéos. Ce que tu paies et pourquoi.",
        "description_en": "Realistic price ranges for graphic design services in 2026: covers, logos, posters, videos. What you pay and why.",
        "category":    "process",
        "content": """\
C'est la question que tout le monde se pose mais que personne n'ose poser clairement. "Tu prends combien ?". Alors voilà une réponse honnête, basée sur ce que je vois dans le marché et sur ma propre pratique.

D'abord, il faut comprendre que le prix d'un graphiste freelance dépend de trois choses : la complexité du projet, le délai, et l'expérience du graphiste. Un logo minimaliste ne coûte pas la même chose qu'une identité visuelle complète avec charte. Une pochette d'album en 48h ne coûte pas la même chose qu'une pochette en 2 semaines.

**Les fourchettes réalistes en 2026**

Pochette de single (cover simple) : entre 15 000 et 50 000 FCFA (25 à 80 EUR). C'est le format le plus courant. Un visuel carré, souvent basé sur une photo retouchée ou une composition graphique.

Pochette d'album (cover complexe, direction artistique) : entre 50 000 et 150 000 FCFA (80 à 250 EUR). Plus de recherche, souvent plusieurs propositions, un univers visuel à créer.

Logo simple : entre 30 000 et 80 000 FCFA (50 à 130 EUR). Un logo propre, décliné en plusieurs formats.

Identité visuelle complète (logo + couleurs + typo + applications) : entre 100 000 et 300 000 FCFA (160 à 500 EUR). C'est un vrai travail de direction artistique.

Affiche événementielle : entre 20 000 et 60 000 FCFA (30 à 100 EUR). Dépend de la complexité et des éléments à intégrer.

Miniature YouTube : entre 5 000 et 20 000 FCFA (8 à 30 EUR). Rapide à produire mais demande un œil pour le clic.

Lyrics video : entre 50 000 et 200 000 FCFA (80 à 330 EUR). Dépend énormément de la durée, du style (2D, cinématique, typographique) et des animations.

**Pourquoi ces prix varient autant**

Un graphiste qui débute ne facture pas comme un graphiste avec 5 ans d'expérience. C'est normal. Ce que tu paies ce n'est pas le temps passé sur Photoshop, c'est les années passées à développer un œil, un style, une maîtrise des outils.

Tu paies aussi le nombre de révisions incluses, la rapidité de livraison, et la qualité du suivi. Un freelance qui te répond en 2h et qui livre en 48h ne facture pas comme quelqu'un qui met 3 semaines à répondre.

**Ce qui est inclus et ce qui ne l'est pas**

Chez moi, chaque devis précise exactement ce que tu reçois. Les fichiers sources (PSD, AI, etc.) ne sont pas inclus par défaut sauf si c'est explicitement dans le devis. Les révisions sont limitées en nombre. Les concepts alternatifs au-delà de ce qui est prévu sont facturés séparément.

C'est standard dans le métier. Si quelqu'un te propose "révisions illimitées", méfie-toi : soit il n'a pas d'expérience, soit il va bâcler le travail.

**Comment obtenir un prix exact**

Le plus simple c'est de passer par le formulaire de devis sur walanodesign.com/devis. Tu sélectionnes ton type de projet, tu décris ce que tu veux, et tu reçois une estimation. Ensuite on en discute et on ajuste si besoin.""",
        "content_en": """\
It's the question everyone has but nobody dares to ask directly. "How much do you charge?" Here's an honest answer, based on what I see in the market and my own practice.

First, you need to understand that a freelance graphic designer's price depends on three things: the complexity of the project, the deadline, and the designer's experience. A minimalist logo doesn't cost the same as a full visual identity with guidelines. An album cover in 48h doesn't cost the same as one over two weeks.

**Realistic price ranges in 2026**

Single cover (simple cover): between 15,000 and 50,000 FCFA (25 to 80 EUR). This is the most common format. A square visual, usually based on a retouched photo or a graphic composition.

Album cover (complex cover, artistic direction): between 50,000 and 150,000 FCFA (80 to 250 EUR). More research, often several proposals, a visual universe to create.

Simple logo: between 30,000 and 80,000 FCFA (50 to 130 EUR). A clean logo, delivered in multiple formats.

Full visual identity (logo + colours + typography + applications): between 100,000 and 300,000 FCFA (160 to 500 EUR). This is real artistic direction work.

Event poster: between 20,000 and 60,000 FCFA (30 to 100 EUR). Depends on complexity and the elements to integrate.

YouTube thumbnail: between 5,000 and 20,000 FCFA (8 to 30 EUR). Quick to produce but requires an eye for what gets clicks.

Lyrics video: between 50,000 and 200,000 FCFA (80 to 330 EUR). Depends heavily on duration, style (2D, cinematic, typographic) and animations.

**Why these prices vary so much**

A designer starting out doesn't charge the same as one with 5 years of experience. That's normal. What you're paying for isn't the time spent in Photoshop, it's the years spent developing an eye, a style, a mastery of tools.

You're also paying for the number of revisions included, the speed of delivery, and the quality of the follow-up. A freelancer who replies within 2 hours and delivers in 48h doesn't charge the same as someone who takes 3 weeks to respond.

**What's included and what isn't**

With me, every quote specifies exactly what you receive. Source files (PSD, AI, etc.) are not included by default unless explicitly stated in the quote. Revisions are limited in number. Alternative concepts beyond what's planned are billed separately.

This is standard in the industry. If someone offers you "unlimited revisions", be cautious: either they have no experience, or they'll rush the work.

**How to get an exact price**

The simplest way is to use the quote form on walanodesign.com/devis. You select your project type, describe what you want, and receive an estimate. Then we discuss and adjust if needed.""",
    },

    # ── Article 3 : process ───────────────────────────────────────────────────
    {
        "slug":        "comment-briefer-un-graphiste",
        "title":       "Comment briefer un graphiste pour obtenir exactement ce que tu veux",
        "title_en":    "How to brief a graphic designer to get exactly what you want",
        "description": "Un bon brief = un bon résultat. Voici comment communiquer clairement avec ton graphiste pour éviter les allers-retours inutiles.",
        "description_en": "A good brief = a good result. Here's how to communicate clearly with your graphic designer to avoid unnecessary back-and-forth.",
        "category":    "process",
        "content": """\
90 % des projets qui tournent mal ne tournent pas mal à cause du graphiste. Ils tournent mal à cause du brief. Un brief flou donne un résultat flou. Un brief précis donne un résultat précis. Voici comment faire les choses bien.

**Qu'est-ce qu'un brief**

Un brief c'est simplement les informations que tu donnes à ton graphiste avant qu'il commence à travailler. C'est la base de tout. Sans brief clair, le graphiste devine ce que tu veux, et deviner c'est rater.

**Les informations essentielles**

Quel est le projet : une pochette de single ? Un logo ? Une affiche ? Sois précis. "Je veux un visuel" ne suffit pas.

Pour qui : c'est pour toi en tant qu'artiste ? Pour ton label ? Pour un événement ? Le public cible change tout. Un visuel pour un artiste rap n'a rien à voir avec un visuel pour une entreprise de cosmétiques.

Le message ou l'émotion : qu'est-ce que tu veux que les gens ressentent en voyant le visuel ? Sombre, énergique, mélancolique, luxueux, brut, futuriste ? Même un seul mot aide énormément.

Les références visuelles : envoie des images qui correspondent à ce que tu as en tête. Ça peut être des pochettes d'autres artistes, des photos, des palettes de couleurs, des screenshots de choses que tu as vues sur Instagram. 3 à 5 références c'est parfait. 20 références c'est confus.

Les éléments à intégrer : le nom de l'artiste, le titre du morceau, une photo à utiliser, un logo existant, des couleurs imposées. Tout ce qui doit apparaître sur le visuel final, dis-le dès le départ.

Le format et les specs techniques : carré 3000x3000 pour une pochette Spotify ? 1920x1080 pour une bannière YouTube ? 1080x1350 pour un post Instagram ? Si tu ne sais pas, dis-le, le graphiste te guidera.

Le budget et le délai : sois honnête. Si tu as 20 000 FCFA et que tu en as besoin dans 3 jours, dis-le. Le graphiste adaptera sa proposition.

**Les erreurs classiques**

"Fais ce que tu veux, je te fais confiance" : c'est gentil mais c'est un piège. Le graphiste va proposer quelque chose basé sur son interprétation, et si elle ne correspond pas à ce que tu avais en tête (mais que tu n'as pas dit), tout le monde perd du temps.

Changer de direction après validation du concept : si tu valides une direction et que tu changes d'avis ensuite, c'est un nouveau projet. C'est pour ça que le brief initial est si important.

Envoyer les éléments au compte-goutte : "ah j'ai oublié, il faut aussi mettre le logo du label" après que le visuel est terminé. Rassemble tout avant de commencer.

**Un bon brief en 5 lignes**

Si tu devais résumer ton brief en un message WhatsApp, ça ressemblerait à ça :

"Salut, j'ai besoin d'une pochette pour mon single [titre]. C'est du [genre musical]. Je veux un mood [émotion/ambiance]. Voici la photo à utiliser [fichier joint]. Voici 3 refs visuelles qui me parlent [liens ou images]. Format carré 3000x3000. J'en ai besoin pour [date]. Mon budget c'est [montant]."

Avec ça, n'importe quel bon graphiste peut commencer à travailler immédiatement.""",
        "content_en": """\
90% of projects that go wrong don't go wrong because of the designer. They go wrong because of the brief. A vague brief gives a vague result. A precise brief gives a precise result. Here's how to do it right.

**What is a brief**

A brief is simply the information you give your designer before they start working. It's the foundation of everything. Without a clear brief, the designer guesses what you want, and guessing means missing.

**The essential information**

What is the project: a single cover? A logo? A poster? Be specific. "I want a visual" is not enough.

For whom: is this for you as an artist? For your label? For an event? The target audience changes everything. A visual for a rap artist has nothing to do with a visual for a cosmetics company.

The message or emotion: what do you want people to feel when they see the visual? Dark, energetic, melancholic, luxurious, raw, futuristic? Even a single word helps enormously.

Visual references: send images that match what you have in mind. They can be covers by other artists, photos, colour palettes, screenshots of things you've seen on Instagram. 3 to 5 references is perfect. 20 references is confusing.

Elements to include: the artist's name, the track title, a photo to use, an existing logo, imposed colours. Everything that must appear on the final visual, say it from the start.

Format and technical specs: square 3000x3000 for a Spotify cover? 1920x1080 for a YouTube banner? 1080x1350 for an Instagram post? If you don't know, say so — the designer will guide you.

Budget and deadline: be honest. If you have 20,000 FCFA and need it in 3 days, say so. The designer will adapt their proposal.

**Classic mistakes**

"Do whatever you want, I trust you": it's well-meaning but it's a trap. The designer will propose something based on their interpretation, and if it doesn't match what you had in mind (but didn't say), everyone wastes time.

Changing direction after validating the concept: if you validate a direction and change your mind afterwards, it's a new project. That's why the initial brief is so important.

Sending elements drip by drip: "oh I forgot, the label logo also needs to go on it" after the visual is finished. Gather everything before you start.

**A good brief in 5 lines**

If you had to summarise your brief in a WhatsApp message, it would look like this:

"Hi, I need a cover for my single [title]. It's [genre]. I want a [emotion/vibe] mood. Here's the photo to use [attached file]. Here are 3 visual references that speak to me [links or images]. Square format 3000x3000. I need it by [date]. My budget is [amount]."

With that, any good designer can start working immediately.""",
    },

    # ── Article 4 : branding ──────────────────────────────────────────────────
    {
        "slug":        "choisir-style-visuel-pochette-album",
        "title":       "Comment choisir le bon style visuel pour sa pochette d'album",
        "title_en":    "How to choose the right visual style for your album cover",
        "description": "Ta pochette c'est la première impression de ta musique. Voici comment choisir un style visuel qui correspond à ton univers artistique.",
        "description_en": "Your cover is the first impression of your music. Here's how to choose a visual style that matches your artistic universe.",
        "category":    "branding",
        "content": """\
Ta pochette c'est la première chose que les gens voient avant d'écouter un seul son. Sur Spotify, Apple Music, Deezer, YouTube, c'est une image carrée de quelques centimètres qui doit raconter une histoire. Si elle ne capte pas l'attention, personne ne clique.

**Les grands styles visuels**

La photo portrait retouchée : c'est le style le plus courant dans le rap et la pop. Une photo de l'artiste, retouchée avec un traitement colorimétrique fort. Ça marche parce que les gens veulent voir le visage de l'artiste. C'est personnel, direct.

Le graphisme typographique : pas de photo, juste du texte et des formes. Le nom de l'artiste et le titre du projet deviennent le visuel. Ça fonctionne très bien pour les projets minimalistes ou les artistes qui veulent se démarquer par l'audace.

L'illustration : un dessin, une peinture digitale, un univers illustré. Ça crée un monde imaginaire autour de la musique. C'est plus rare mais très mémorable quand c'est bien fait.

Le montage conceptuel : des éléments combinés pour créer une scène surréaliste ou symbolique. Un artiste devant un paysage qui n'existe pas, un objet flottant dans le vide, un mix de textures et de photos. C'est le style que je fais le plus souvent.

La 3D : des objets ou des scènes modélisés en 3D. Ça donne un rendu moderne et premium. De plus en plus demandé, surtout pour les singles.

**Comment choisir**

Écoute ta musique. Sérieusement. Mets le morceau en boucle et demande-toi : si ce son avait une couleur, ce serait quoi ? Si c'était un lieu, ce serait où ? Si c'était une scène de film, ça ressemblerait à quoi ?

La réponse à ces questions te donne la direction visuelle.

Un morceau sombre et introspectif appelle des couleurs froides, des ombres, du contraste. Un morceau festif et énergique appelle des couleurs vives, du mouvement, de la lumière. Un morceau mélancolique appelle des tons désaturés, du flou, de l'espace vide.

**Regarde ce que font les autres (mais ne copie pas)**

Va sur Spotify, cherche des artistes qui font le même genre de musique que toi. Regarde leurs pochettes. Pas pour copier, mais pour comprendre les codes visuels de ton genre. Le rap gabonais n'a pas les mêmes codes que le rap français ou le R&B américain. Chaque scène a ses tendances.

Note ce qui te plaît et ce qui ne te plaît pas. C'est exactement ça que tu enverras à ton graphiste comme références (voir l'article sur comment briefer un graphiste).

**Les erreurs qui tuent une pochette**

Trop de texte : le titre, le nom, le featuring, la date, le label, le logo. Non. Sur une pochette carrée, moins c'est plus. Le nom et le titre suffisent.

Une photo floue ou mal cadrée : la qualité de la photo de base détermine 80 % du résultat final. Une photo prise avec un bon téléphone en bonne lumière vaut mieux qu'une photo pro mal éclairée.

Suivre une tendance périmée : les effets 3D chrome brillant de 2022 sont morts. Les filtres néon violet de 2020 aussi. Regarde ce qui se fait maintenant, pas il y a 3 ans.

Ignorer le format : ta pochette sera affichée en 300x300 pixels sur un téléphone. Si ton design n'est pas lisible à cette taille, il ne fonctionne pas.

**En résumé**

Choisis un style qui correspond à ta musique, pas à tes goûts personnels en déco. Envoie des références claires à ton graphiste. Assure-toi que la photo de base est de qualité. Et garde le design simple.

Si tu veux en discuter, le devis est gratuit sur walanodesign.com/devis.""",
        "content_en": """\
Your cover is the first thing people see before hearing a single note. On Spotify, Apple Music, Deezer, YouTube, it's a square image a few centimetres wide that has to tell a story. If it doesn't grab attention, nobody clicks.

**The main visual styles**

The retouched portrait photo: this is the most common style in rap and pop. A photo of the artist, retouched with a strong colour treatment. It works because people want to see the artist's face. It's personal, direct.

Typographic design: no photo, just text and shapes. The artist's name and the project title become the visual. Works very well for minimalist projects or artists who want to stand out through boldness.

Illustration: a drawing, digital painting, an illustrated universe. It creates an imaginary world around the music. Rarer but very memorable when done well.

Conceptual montage: elements combined to create a surreal or symbolic scene. An artist in front of a landscape that doesn't exist, an object floating in the void, a mix of textures and photos. This is the style I do most often.

3D: objects or scenes modelled in 3D. Gives a modern, premium look. Increasingly requested, especially for singles.

**How to choose**

Listen to your music. Seriously. Put the track on repeat and ask yourself: if this sound had a colour, what would it be? If it were a place, where would it be? If it were a film scene, what would it look like?

The answer to these questions gives you the visual direction.

A dark, introspective track calls for cold colours, shadows, contrast. A festive, energetic track calls for vivid colours, movement, light. A melancholic track calls for desaturated tones, blur, empty space.

**Look at what others do (but don't copy)**

Go on Spotify, search for artists who make the same kind of music as you. Look at their covers. Not to copy, but to understand the visual codes of your genre. Gabonese rap doesn't have the same codes as French rap or American R&B. Every scene has its trends.

Note what you like and what you don't. That's exactly what you'll send your designer as references (see the article on how to brief a designer).

**Mistakes that kill a cover**

Too much text: the title, the name, the featuring, the date, the label, the logo. No. On a square cover, less is more. The name and title are enough.

A blurry or badly framed photo: the quality of the base photo determines 80% of the final result. A photo taken with a good phone in good light is worth more than a professional photo with bad lighting.

Following an outdated trend: the shiny 3D chrome effects of 2022 are dead. The neon violet filters of 2020 too. Look at what's happening now, not 3 years ago.

Ignoring the format: your cover will be displayed at 300x300 pixels on a phone. If your design isn't readable at that size, it doesn't work.

**In summary**

Choose a style that matches your music, not your personal taste in decoration. Send clear references to your designer. Make sure the base photo is quality. And keep the design simple.

If you want to talk about it, the quote is free at walanodesign.com/devis.""",
    },

    # ── Article 5 : tendances ─────────────────────────────────────────────────
    {
        "slug":        "ia-allie-ou-menace-graphiste",
        "title":       "L'IA, alliée ou menace pour le graphiste ?",
        "title_en":    "AI: ally or threat for the graphic designer?",
        "description": "L'intelligence artificielle va-t-elle remplacer les graphistes ? Retour d'expérience d'un graphiste freelance qui utilise l'IA au quotidien.",
        "description_en": "Will artificial intelligence replace graphic designers? A freelance designer's take on using AI every day.",
        "category":    "tendances",
        "content": """\
Depuis que Midjourney, DALL-E et les autres générateurs d'images ont explosé, je reçois cette question au moins une fois par semaine. "Tu n'as pas peur que l'IA te remplace ?". La réponse courte : non. La réponse longue : c'est plus compliqué que ça.

**Ce que l'IA sait faire**

Soyons honnêtes. L'IA génère des images impressionnantes. Tu tapes un prompt, tu attends 30 secondes, et tu obtiens un visuel qui aurait pris des heures à produire manuellement. Pour quelqu'un qui n'a aucune compétence en design, c'est magique.

L'IA est très forte pour générer des concepts rapidement, explorer des directions visuelles, créer des textures et des fonds, et produire des images d'ambiance ou d'inspiration. J'utilise moi-même des outils IA dans mon workflow. Pas pour produire le livrable final, mais pour accélérer certaines étapes. Chercher une direction artistique, tester des palettes de couleurs, générer des éléments de fond que je retravaille ensuite.

**Ce que l'IA ne sait pas faire**

L'IA ne comprend pas ton projet. Elle ne sait pas que ton single parle de ta rupture avec quelqu'un à Libreville un soir de décembre. Elle ne sait pas que ton label veut un visuel qui rappelle les codes du rap gabonais sans copier ce qui existe déjà. Elle ne sait pas que tu veux exactement ce bleu là, celui de la photo que tu as prise sur ton balcon.

L'IA ne gère pas la cohérence d'une identité visuelle. Elle peut générer 50 images magnifiques qui n'ont aucun lien entre elles. Une identité visuelle c'est un système, pas une collection d'images aléatoires.

L'IA ne fait pas de typographie propre. Les textes générés par IA sont souvent illisibles, mal placés, avec des lettres inventées. Pour une pochette d'album où le nom de l'artiste et le titre doivent être parfaitement intégrés au visuel, c'est inutilisable tel quel.

L'IA ne fait pas de direction artistique. Elle exécute un prompt, elle ne challenge pas ton idée. Un bon graphiste te dit "ce que tu demandes ne va pas fonctionner, voici pourquoi, et voici ce que je propose à la place". L'IA te donne exactement ce que tu demandes, même si c'est mauvais.

**Et encore faudrait-il savoir ce que tu veux**

L'IA a besoin d'un prompt précis pour donner un bon résultat. Et c'est là que le problème se pose : la plupart des clients ne savent pas exactement ce qu'ils veulent. C'est normal, c'est justement pour ça qu'ils font appel à un graphiste.

Un client me dit "je veux un truc qui claque" ou "quelque chose de sombre mais pas trop". Un graphiste comprend ça. Il pose des questions, il propose des pistes, il traduit un ressenti flou en direction visuelle concrète. L'IA ne fait pas ça. Si ton prompt est vague, le résultat est vague. Si ton prompt est précis, tu as déjà fait la moitié du travail du graphiste toi-même, et tu vas quand même passer des heures à régénérer parce que le résultat ne correspond jamais tout à fait.

**Et surtout, l'IA ne gère pas la relation client**

Les allers-retours, la compréhension du brief, l'adaptation après un "j'aime bien mais c'est pas tout à fait ça", le fait de livrer au bon format, au bon moment, avec les bonnes déclinaisons. Ça c'est un métier humain.

**Le vrai danger**

Le danger de l'IA ce n'est pas qu'elle remplace les bons graphistes. C'est qu'elle donne l'illusion que le design est facile et que ça ne vaut rien.

Un client qui peut générer une image en 30 secondes se dit "pourquoi je paierais quelqu'un pour ça ?". Sauf que l'image générée en 30 secondes n'est pas utilisable telle quelle. Elle n'a pas les bons formats, pas les bonnes specs pour Spotify ou l'imprimeur, pas de cohérence avec le reste de ta communication, pas de droits d'auteur clairs.

L'autre danger c'est les "graphistes" qui prennent une image IA, mettent un texte par-dessus et facturent ça comme un travail original. Ça existe et ça tire le métier vers le bas. Mais ça ne dure pas, parce que les clients finissent par voir la différence.

**Comment je vois les choses**

L'IA est un outil. Comme Photoshop était un outil quand il est sorti. Comme Illustrator, After Effects, Figma. Chaque nouvel outil a fait peur aux graphistes de son époque. Et à chaque fois, ceux qui ont appris à l'utiliser sont devenus plus forts.

J'utilise l'IA pour aller plus vite sur les phases d'exploration. Je l'utilise pour générer des éléments que je retravaille ensuite dans Photoshop ou Illustrator. Je ne l'utilise jamais pour livrer un visuel tel quel à un client. Le client paie pour ma vision, mon œil, mon expérience, ma capacité à comprendre ce qu'il veut et à le traduire visuellement. L'IA ne remplace rien de tout ça.

Les graphistes qui vont disparaître ce sont ceux qui faisaient déjà un travail que n'importe qui pouvait faire. Ceux qui se contentaient de templates modifiés et de filtres Instagram. L'IA fait ça mieux et plus vite.

Les graphistes qui vont rester (et prospérer) ce sont ceux qui ont un style, une vision, une capacité à résoudre des problèmes visuels, et une relation humaine avec leurs clients. L'IA ne remplace pas ça. Elle l'amplifie.

**En résumé**

L'IA est un allié si tu sais l'utiliser comme un outil dans ton process créatif. C'est une menace si ton seul skill c'était d'exécuter des tâches répétitives que la machine fait mieux. Le métier de graphiste ne disparaît pas, il évolue. Comme il a toujours évolué.

Si tu cherches un graphiste qui combine vision créative et outils modernes, on peut en parler sur walanodesign.com/devis.""",
        "content_en": """\
Since Midjourney, DALL-E and the other image generators exploded, I've been getting this question at least once a week. "Aren't you afraid AI will replace you?" The short answer: no. The long answer: it's more complicated than that.

**What AI can do**

Let's be honest. AI generates impressive images. You type a prompt, wait 30 seconds, and you get a visual that would have taken hours to produce manually. For someone with no design skills, it's magic.

AI is very strong at quickly generating concepts, exploring visual directions, creating textures and backgrounds, and producing mood or inspiration images. I use AI tools in my workflow myself. Not to produce the final deliverable, but to speed up certain steps: searching for an artistic direction, testing colour palettes, generating background elements I rework afterwards.

**What AI can't do**

AI doesn't understand your project. It doesn't know your single is about your breakup with someone in Libreville on a December evening. It doesn't know your label wants a visual that references the codes of Gabonese rap without copying what already exists. It doesn't know you want exactly that blue, the one from the photo you took on your balcony.

AI can't manage the consistency of a visual identity. It can generate 50 beautiful images that have nothing to do with each other. A visual identity is a system, not a collection of random images.

AI doesn't do clean typography. AI-generated text is often unreadable, badly placed, with invented letters. For an album cover where the artist's name and title must be perfectly integrated into the visual, it's unusable as-is.

AI doesn't do artistic direction. It executes a prompt, it doesn't challenge your idea. A good designer says "what you're asking for won't work, here's why, and here's what I propose instead". AI gives you exactly what you ask for, even if it's bad.

**And you'd still need to know what you want**

AI needs a precise prompt to give a good result. And that's where the problem lies: most clients don't know exactly what they want. That's normal, it's precisely why they hire a designer.

A client tells me "I want something that pops" or "something dark but not too much". A designer understands that. They ask questions, propose directions, translate a vague feeling into a concrete visual direction. AI doesn't do that. If your prompt is vague, the result is vague. If your prompt is precise, you've already done half the designer's work yourself, and you'll still spend hours regenerating because the result never quite matches.

**And above all, AI can't manage the client relationship**

The back-and-forth, understanding the brief, adapting after a "I like it but it's not quite right", delivering in the right format, at the right time, with the right variations. That's a human craft.

**The real danger**

The danger of AI isn't that it replaces good designers. It's that it creates the illusion that design is easy and worthless.

A client who can generate an image in 30 seconds thinks "why would I pay someone for that?" Except the image generated in 30 seconds isn't usable as-is. It doesn't have the right formats, the right specs for Spotify or the printer, no consistency with the rest of your communication, no clear copyright.

The other danger is "designers" who take an AI image, put text on top and charge it as original work. It happens and it drags the industry down. But it doesn't last, because clients eventually see the difference.

**How I see things**

AI is a tool. Just like Photoshop was a tool when it came out. Like Illustrator, After Effects, Figma. Every new tool scared designers of its era. And every time, those who learned to use it became stronger.

I use AI to move faster in exploration phases. I use it to generate elements I rework in Photoshop or Illustrator. I never use it to deliver a visual as-is to a client. The client pays for my vision, my eye, my experience, my ability to understand what they want and translate it visually. AI replaces none of that.

The designers who will disappear are those who were already doing work anyone could do. Those who settled for modified templates and Instagram filters. AI does that better and faster.

The designers who will remain (and thrive) are those who have a style, a vision, an ability to solve visual problems, and a human relationship with their clients. AI doesn't replace that. It amplifies it.

**In summary**

AI is an ally if you know how to use it as a tool in your creative process. It's a threat if your only skill was executing repetitive tasks the machine does better. The graphic design profession isn't disappearing, it's evolving. As it always has.

If you're looking for a designer who combines creative vision and modern tools, let's talk at walanodesign.com/devis.""",
    },
]


CLIENTS = [
    {"name": "Toossaint H.", "role": "artiste",    "order": 0},
    {"name": "Trianon Homes","role": "entreprise", "order": 1},
    {"name": "QLB Club",     "role": "label",      "order": 2},
]


class Command(BaseCommand):
    help = "Seed initial blog articles and clients"

    def handle(self, *args, **options):
        # Blog posts
        created_posts = 0
        for data in ARTICLES:
            _, created = BlogPost.objects.get_or_create(
                slug=data["slug"],
                defaults={
                    "title":          data["title"],
                    "title_en":       data["title_en"],
                    "description":    data["description"],
                    "description_en": data["description_en"],
                    "category":       data["category"],
                    "content":        data["content"],
                    "content_en":     data["content_en"],
                    "published":      True,
                    "published_at":   PUBLISHED_AT,
                },
            )
            if created:
                created_posts += 1

        self.stdout.write(self.style.SUCCESS(
            f"{created_posts} article(s) created "
            f"(skipped {len(ARTICLES) - created_posts} already existing)"
        ))

        # Clients
        created_clients = 0
        for data in CLIENTS:
            _, created = Client.objects.get_or_create(
                name=data["name"],
                defaults={"role": data["role"], "order": data["order"]},
            )
            if created:
                created_clients += 1

        self.stdout.write(self.style.SUCCESS(
            f"{created_clients} client(s) created "
            f"(skipped {len(CLIENTS) - created_clients} already existing)"
        ))
