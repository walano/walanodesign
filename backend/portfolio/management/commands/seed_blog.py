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
    {
        "slug":        "difference-logo-identite-visuelle-charte-graphique",
        "title":       "La différence entre un logo, une identité visuelle et une charte graphique",
        "description": "Beaucoup confondent logo, identité visuelle et charte graphique. Voici ce que chaque terme signifie concrètement et ce dont tu as vraiment besoin.",
        "category":    "branding",
        "content":     """\
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
    },
    {
        "slug":        "combien-coute-graphiste-freelance-2026",
        "title":       "Combien coûte un graphiste freelance en 2026",
        "description": "Grille tarifaire réaliste pour les prestations graphiques en 2026 : covers, logos, affiches, vidéos. Ce que tu paies et pourquoi.",
        "category":    "tarifs",
        "content":     """\
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
    },
    {
        "slug":        "comment-briefer-un-graphiste",
        "title":       "Comment briefer un graphiste pour obtenir exactement ce que tu veux",
        "description": "Un bon brief = un bon résultat. Voici comment communiquer clairement avec ton graphiste pour éviter les allers-retours inutiles.",
        "category":    "process",
        "content":     """\
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
    },
    {
        "slug":        "choisir-style-visuel-pochette-album",
        "title":       "Comment choisir le bon style visuel pour sa pochette d'album",
        "description": "Ta pochette c'est la première impression de ta musique. Voici comment choisir un style visuel qui correspond à ton univers artistique.",
        "category":    "musique",
        "content":     """\
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
    },
    {
        "slug":        "ia-allie-ou-menace-graphiste",
        "title":       "L'IA, alliée ou menace pour le graphiste ?",
        "description": "L'intelligence artificielle va-t-elle remplacer les graphistes ? Retour d'expérience d'un graphiste freelance qui utilise l'IA au quotidien.",
        "category":    "tendances",
        "content":     """\
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

Pour obtenir un résultat presque parfait avec l'IA, il faut savoir décrire un style, une composition, un éclairage, une palette, un cadrage, un mood. Bref, il faut penser comme un directeur artistique. Et si tu sais faire ça, tu n'avais pas besoin de l'IA, tu avais besoin d'un exécutant. Le graphiste, lui, est les deux : il pense et il exécute.

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
                    "title":        data["title"],
                    "description":  data["description"],
                    "category":     data["category"],
                    "content":      data["content"],
                    "published":    True,
                    "published_at": PUBLISHED_AT,
                },
            )
            if created:
                created_posts += 1

        self.stdout.write(self.style.SUCCESS(
            f"{created_posts} article(s) created (skipped {len(ARTICLES) - created_posts} already existing)"
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
            f"{created_clients} client(s) created (skipped {len(CLIENTS) - created_clients} already existing)"
        ))
