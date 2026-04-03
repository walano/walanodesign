"use client";

import LegalPage, { LegalContent } from "@/components/LegalPage";

const fr: LegalContent = {
  title:    "Conditions générales de vente et de prestation",
  subtitle: "En vigueur au 03/04/2026.",
  sections: [
    {
      title: "Article 1 : champ d'application",
      body: (
        <>
          <p>Les présentes conditions générales de vente (CGV) s'appliquent, sans restriction ni réserve, à tout achat des services suivants proposés par Walano Design :</p>
          <ul style={{ marginTop: "0.6rem", paddingLeft: "1.25rem", display: "flex", flexDirection: "column", gap: "0.2rem" }}>
            <li>Pochettes de singles et d'albums (covers)</li>
            <li>Création de logos et identités visuelles complètes (logo & branding)</li>
            <li>Lyrics videos et montage vidéo</li>
            <li>Affiches événementielles et visuels promotionnels</li>
            <li>Miniatures youtube et visuels web</li>
            <li>Bannières et profils pour twitch, youtube, x (twitter) et autres plateformes</li>
          </ul>
          <p style={{ marginTop: "0.6rem" }}>Les caractéristiques principales des services sont présentées sur le site walanodesign.com. Le client est tenu d'en prendre connaissance avant toute passation de commande. Le choix et l'achat d'un service relèvent de la seule responsabilité du client.</p>
          <p style={{ marginTop: "0.4rem" }}>Ces CGV sont accessibles à tout moment sur le site et prévaudront sur tout autre document. Le client déclare avoir pris connaissance des présentes CGV et les avoir acceptées avant toute commande.</p>
        </>
      ),
    },
    {
      title: "Article 2 : commandes",
      body: (
        <>
          <p>Le processus de commande est le suivant :</p>
          <ol style={{ marginTop: "0.6rem", paddingLeft: "1.25rem", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
            <li>Prise de contact : le client contacte Walano Design pour discuter de ses besoins en création graphique, soit via le formulaire de devis en ligne (walanodesign.com/devis), soit par échange direct (email, whatsapp).</li>
            <li>Élaboration du devis : un devis détaillé est fourni gratuitement, précisant les services, délais, tarifs et livrables inclus.</li>
            <li>Validation et paiement : toute commande est validée après réception de l'acompte tel que défini à l'article 4.</li>
          </ol>
          <p style={{ marginTop: "0.6rem" }}>Le devis généré via le formulaire en ligne est une estimation indicative basée sur les informations fournies par le client. Il peut être révisé à la hausse ou à la baisse après échange détaillé sur les spécificités réelles du projet. Le devis définitif est celui validé par les deux parties avant le versement de l'acompte.</p>
          <p style={{ marginTop: "0.4rem" }}>Le devis est valable pendant 15 jours à compter de sa date d'émission. Passé ce délai, le prestataire se réserve le droit de modifier les tarifs.</p>
        </>
      ),
    },
    {
      title: "Article 3 : tarifs",
      body: (
        <>
          <p>Les tarifs sont communiqués au client dans le devis. Ils peuvent être exprimés en francs CFA (FCFA), en euros (EUR) ou en dollars américains (USD) selon la localisation du client et l'accord entre les parties.</p>
          <p style={{ marginTop: "0.4rem" }}>Les tarifs peuvent varier selon la complexité du projet, les délais demandés et les options choisies. Une majoration peut être appliquée en cas de délai de livraison réduit (urgence) conformément au barème communiqué dans le devis.</p>
          <p style={{ marginTop: "0.4rem" }}>Toute demande supplémentaire non prévue dans le devis initial fera l'objet d'un avenant facturé séparément. En particulier, si le client souhaite une proposition de logo ou de concept alternatif au-delà de ce qui est inclus dans le devis, celle-ci sera facturée comme prestation additionnelle.</p>
        </>
      ),
    },
    {
      title: "Article 4 : modalités de paiement",
      body: (
        <>
          <p>Le paiement s'effectue selon la répartition suivante :</p>
          <ul style={{ marginTop: "0.6rem", paddingLeft: "1.25rem", display: "flex", flexDirection: "column", gap: "0.2rem" }}>
            <li>60 % à la commande (acompte), correspondant au début des travaux</li>
            <li>40 % à la livraison finale, avant remise des livrables définitifs</li>
          </ul>
          <p style={{ marginTop: "0.6rem" }}>L'acompte n'est pas remboursable en cas d'annulation par le client une fois les travaux entamés.</p>
          <p style={{ marginTop: "0.4rem" }}>Les moyens de paiement acceptés sont communiqués au client lors de la confirmation de commande.</p>
          <p style={{ marginTop: "0.4rem" }}>En cas de retard de paiement du solde, le prestataire se réserve le droit de suspendre la livraison de tout travail en cours et de tout livrable restant.</p>
        </>
      ),
    },
    {
      title: "Article 5 : livraison et livrables",
      body: (
        <>
          <p>Les créations sont livrées sous format numérique (PNG, JPG, PDF ou tout autre format convenu) dans les délais indiqués au devis.</p>
          <p style={{ marginTop: "0.4rem" }}>Les livrables inclus dans chaque prestation sont explicitement définis dans le devis. Sauf mention contraire dans le devis, les fichiers sources éditables (PSD, AI, AEP, FIGMA, etc.) ne font pas partie des livrables et restent la propriété exclusive du prestataire.</p>
          <p style={{ marginTop: "0.4rem" }}>Lorsque le devis prévoit expressément la remise de fichiers sources, ceux-ci ne sont transmis au client qu'après paiement intégral du solde.</p>
          <p style={{ marginTop: "0.4rem" }}>Le client dispose d'un délai de 7 jours après livraison pour demander des modifications mineures (retouches). Au-delà, toute modification sera facturée.</p>
        </>
      ),
    },
    {
      title: "Article 6 : révisions et modifications",
      body: (
        <>
          <p>Chaque prestation inclut un nombre de révisions défini dans le devis. Les révisions portent sur des ajustements mineurs (couleurs, typographie, positionnement).</p>
          <p style={{ marginTop: "0.4rem" }}>Toute demande de modification majeure (changement de concept, de direction artistique ou de brief) après validation du concept initial est considérée comme une nouvelle prestation et sera facturée en conséquence.</p>
        </>
      ),
    },
    {
      title: "Article 7 : propriété intellectuelle et droits d'auteur",
      body: (
        <>
          <p>Conformément aux dispositions internationales en matière de propriété intellectuelle (convention de Berne), le prestataire est l'auteur et le titulaire des droits d'auteur sur l'ensemble des créations réalisées dans le cadre de la prestation.</p>
          <p style={{ marginTop: "0.4rem" }}>Cession des droits d'utilisation : après paiement intégral, le client obtient un droit d'utilisation non exclusif des créations livrées, pour l'usage prévu dans le devis (par exemple, pochette d'album pour distribution digitale et physique, identité visuelle pour communication de marque). Tous les concepts, croquis ou propositions non retenus restent la propriété exclusive du prestataire.</p>
          <p style={{ marginTop: "0.4rem" }}>Droit de paternité : le prestataire conserve le droit d'être crédité en tant qu'auteur des créations. Le client s'engage à créditer le prestataire lorsque cela est raisonnablement possible (mention « design by Walano Design » ou « @saint_walano »).</p>
          <p style={{ marginTop: "0.4rem" }}>Droit de portfolio : le prestataire se réserve le droit d'utiliser les créations réalisées dans son portfolio, sur son site web (walanodesign.com), ses réseaux sociaux et tout support de promotion professionnelle, sauf accord contraire écrit.</p>
          <p style={{ marginTop: "0.4rem" }}>Interdictions : le client ne peut pas revendre, redistribuer, sous-licencier ou présenter les créations comme étant les siennes. Toute utilisation non prévue au devis nécessite un accord préalable du prestataire.</p>
        </>
      ),
    },
    {
      title: "Article 8 : contenu fourni par le client",
      body: (
        <>
          <p>Le client est responsable de fournir au prestataire tous les éléments nécessaires à la réalisation de la prestation (textes, photos, logos, brief créatif, etc.) dans les délais convenus.</p>
          <p style={{ marginTop: "0.4rem" }}>Tout retard dans la transmission des éléments par le client peut entraîner un report du délai de livraison. Le prestataire ne saurait être tenu responsable des retards liés à un manque de réactivité du client.</p>
          <p style={{ marginTop: "0.4rem" }}>Le client garantit qu'il dispose des droits nécessaires sur tous les éléments fournis (photos, textes, marques) et dégage le prestataire de toute responsabilité en cas de litige lié à ces éléments.</p>
        </>
      ),
    },
    {
      title: "Article 9 : annulation et résiliation",
      body: (
        <>
          <p>En cas d'annulation par le client :</p>
          <ul style={{ marginTop: "0.4rem", paddingLeft: "1.25rem", display: "flex", flexDirection: "column", gap: "0.2rem" }}>
            <li>Avant le début des travaux, remboursement intégral de l'acompte</li>
            <li>Après le début des travaux, l'acompte reste acquis au prestataire</li>
            <li>Après livraison d'une première version, le solde reste dû</li>
          </ul>
          <p style={{ marginTop: "0.6rem" }}>Le prestataire se réserve le droit de résilier une commande en cas de comportement irrespectueux, de non-paiement ou de demandes contraires à ses valeurs. Dans ce cas, seul le travail effectivement réalisé sera facturé.</p>
        </>
      ),
    },
    {
      title: "Article 10 : responsabilité",
      body: (
        <>
          <p>Le prestataire s'engage à réaliser les prestations avec soin et professionnalisme. Toutefois, sa responsabilité est limitée au montant total de la prestation concernée.</p>
          <p style={{ marginTop: "0.4rem" }}>Le prestataire ne pourra être tenu responsable des dommages indirects (perte de revenus, perte de clients, atteinte à l'image) résultant de l'utilisation des créations livrées.</p>
          <p style={{ marginTop: "0.4rem" }}>Le prestataire n'est pas responsable de l'utilisation que le client fait des créations après livraison, ni de leur conformité avec les réglementations locales applicables au client.</p>
        </>
      ),
    },
    {
      title: "Article 11 : force majeure",
      body: (
        <p>Le prestataire ne saurait être tenu responsable de tout retard ou manquement dans l'exécution de ses obligations résultant d'un cas de force majeure, notamment : coupure d'électricité, panne internet, catastrophe naturelle, épidémie, conflit armé, ou tout autre événement échappant au contrôle raisonnable du prestataire.</p>
      ),
    },
    {
      title: "Article 12 : litiges",
      body: (
        <p>En cas de désaccord relatif à l'exécution des présentes CGV, les parties s'engagent à rechercher une solution amiable avant toute procédure. À défaut de résolution amiable, le litige sera soumis aux tribunaux compétents.</p>
      ),
    },
  ],
};

const en: LegalContent = {
  title:    "General terms and conditions of sale",
  subtitle: "Effective as of 04/03/2026.",
  sections: [
    {
      title: "Article 1 : scope",
      body: (
        <>
          <p>These general terms and conditions of sale (T&C) apply, without restriction or reservation, to all purchases of the following services offered by Walano Design:</p>
          <ul style={{ marginTop: "0.6rem", paddingLeft: "1.25rem", display: "flex", flexDirection: "column", gap: "0.2rem" }}>
            <li>Single and album covers</li>
            <li>Logo creation and complete visual identities (logo & branding)</li>
            <li>Lyrics videos and video editing</li>
            <li>Event posters and promotional visuals</li>
            <li>Youtube thumbnails and web visuals</li>
            <li>Banners and profiles for twitch, youtube, x (twitter) and other platforms</li>
          </ul>
          <p style={{ marginTop: "0.6rem" }}>The main characteristics of the services are presented on walanodesign.com. The client is responsible for reviewing them before placing an order.</p>
          <p style={{ marginTop: "0.4rem" }}>These T&C are available at all times on the website and shall prevail over any other document. The client acknowledges having read and accepted these T&C before placing any order.</p>
        </>
      ),
    },
    {
      title: "Article 2 : orders",
      body: (
        <>
          <p>The order process is as follows:</p>
          <ol style={{ marginTop: "0.6rem", paddingLeft: "1.25rem", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
            <li>Initial contact : the client contacts Walano Design to discuss their graphic design needs, either through the online quote form (walanodesign.com/devis) or by direct exchange (email, whatsapp).</li>
            <li>Quote preparation : a detailed quote is provided free of charge, specifying services, deadlines, pricing and included deliverables.</li>
            <li>Validation and payment : any order is confirmed upon receipt of the deposit as defined in article 4.</li>
          </ol>
          <p style={{ marginTop: "0.6rem" }}>The quote generated through the online form is an indicative estimate based on the information provided by the client. It may be revised upward or downward after a detailed discussion about the actual specifics of the project. The final quote is the one validated by both parties before the deposit is paid.</p>
          <p style={{ marginTop: "0.4rem" }}>The quote is valid for 15 days from its date of issue. After this period, the service provider reserves the right to modify the pricing.</p>
        </>
      ),
    },
    {
      title: "Article 3 : pricing",
      body: (
        <>
          <p>Prices are communicated to the client in the quote. They may be expressed in CFA francs (FCFA), euros (EUR) or US dollars (USD) depending on the client's location and the agreement between the parties.</p>
          <p style={{ marginTop: "0.4rem" }}>Prices may vary depending on project complexity, requested deadlines and chosen options. A surcharge may be applied for reduced delivery times (rush orders) in accordance with the schedule communicated in the quote.</p>
          <p style={{ marginTop: "0.4rem" }}>Any additional request not included in the original quote will be subject to a separate invoice. In particular, if the client wishes for an alternative logo or concept proposal beyond what is included in the quote, it will be billed as an additional service.</p>
        </>
      ),
    },
    {
      title: "Article 4 : payment terms",
      body: (
        <>
          <p>Payment is made as follows:</p>
          <ul style={{ marginTop: "0.6rem", paddingLeft: "1.25rem", display: "flex", flexDirection: "column", gap: "0.2rem" }}>
            <li>60% upon order (deposit), corresponding to the start of work</li>
            <li>40% upon final delivery, before handover of final deliverables</li>
          </ul>
          <p style={{ marginTop: "0.6rem" }}>The deposit is non-refundable in case of cancellation by the client once work has begun.</p>
          <p style={{ marginTop: "0.4rem" }}>Accepted payment methods are communicated to the client upon order confirmation.</p>
          <p style={{ marginTop: "0.4rem" }}>In the event of late payment of the balance, the service provider reserves the right to suspend delivery of all ongoing work and remaining deliverables.</p>
        </>
      ),
    },
    {
      title: "Article 5 : delivery and deliverables",
      body: (
        <>
          <p>Creations are delivered in digital format (PNG, JPG, PDF or any other agreed format) within the deadlines indicated in the quote.</p>
          <p style={{ marginTop: "0.4rem" }}>The deliverables included in each service are explicitly defined in the quote. Unless otherwise stated in the quote, editable source files (PSD, AI, AEP, FIGMA, etc.) are not part of the deliverables and remain the exclusive property of the service provider.</p>
          <p style={{ marginTop: "0.4rem" }}>When the quote expressly provides for the delivery of source files, these are only transmitted to the client after full payment of the balance.</p>
          <p style={{ marginTop: "0.4rem" }}>The client has 7 days after delivery to request minor modifications (touch-ups). Beyond this period, any modification will be billed.</p>
        </>
      ),
    },
    {
      title: "Article 6 : revisions and modifications",
      body: (
        <>
          <p>Each service includes a number of revisions defined in the quote. Revisions cover minor adjustments (colors, typography, positioning).</p>
          <p style={{ marginTop: "0.4rem" }}>Any request for a major modification (change of concept, artistic direction or brief) after validation of the initial concept is considered a new service and will be billed accordingly.</p>
        </>
      ),
    },
    {
      title: "Article 7 : intellectual property and copyright",
      body: (
        <>
          <p>In accordance with international intellectual property provisions (Berne Convention), the service provider is the author and copyright holder of all creations produced as part of the service.</p>
          <p style={{ marginTop: "0.4rem" }}>Transfer of usage rights : after full payment, the client obtains a non-exclusive right to use the delivered creations for the purpose specified in the quote (for example, album cover for digital and physical distribution, visual identity for brand communication). All concepts, sketches or unselected proposals remain the exclusive property of the service provider.</p>
          <p style={{ marginTop: "0.4rem" }}>Attribution right : the service provider retains the right to be credited as the author of the creations. The client agrees to credit the service provider whenever reasonably possible (mention "design by Walano Design" or "@saint_walano").</p>
          <p style={{ marginTop: "0.4rem" }}>Portfolio right : the service provider reserves the right to use the creations in their portfolio, on their website (walanodesign.com), social media and any professional promotional material, unless otherwise agreed in writing.</p>
          <p style={{ marginTop: "0.4rem" }}>Restrictions : the client may not resell, redistribute, sublicense or present the creations as their own. Any use not specified in the quote requires prior agreement from the service provider.</p>
        </>
      ),
    },
    {
      title: "Article 8 : content provided by the client",
      body: (
        <>
          <p>The client is responsible for providing the service provider with all elements necessary for the completion of the service (texts, photos, logos, creative brief, etc.) within agreed deadlines.</p>
          <p style={{ marginTop: "0.4rem" }}>Any delay in the transmission of elements by the client may result in a postponement of the delivery deadline. The service provider cannot be held responsible for delays related to a lack of responsiveness on the client's part.</p>
          <p style={{ marginTop: "0.4rem" }}>The client guarantees that they hold the necessary rights to all elements provided (photos, texts, trademarks) and releases the service provider from any liability in the event of a dispute related to these elements.</p>
        </>
      ),
    },
    {
      title: "Article 9 : cancellation",
      body: (
        <>
          <p>In the event of cancellation by the client:</p>
          <ul style={{ marginTop: "0.4rem", paddingLeft: "1.25rem", display: "flex", flexDirection: "column", gap: "0.2rem" }}>
            <li>Before work begins, full refund of the deposit</li>
            <li>After work begins, the deposit is retained by the service provider</li>
            <li>After delivery of a first version, the balance remains due</li>
          </ul>
          <p style={{ marginTop: "0.6rem" }}>The service provider reserves the right to terminate an order in case of disrespectful behavior, non-payment or requests contrary to their values. In such cases, only work actually completed will be billed.</p>
        </>
      ),
    },
    {
      title: "Article 10 : liability",
      body: (
        <>
          <p>The service provider commits to carrying out services with care and professionalism. However, their liability is limited to the total amount of the service in question.</p>
          <p style={{ marginTop: "0.4rem" }}>The service provider cannot be held liable for indirect damages (loss of revenue, loss of clients, damage to image) resulting from the use of delivered creations.</p>
          <p style={{ marginTop: "0.4rem" }}>The service provider is not responsible for the use the client makes of the creations after delivery, nor for their compliance with local regulations applicable to the client.</p>
        </>
      ),
    },
    {
      title: "Article 11 : force majeure",
      body: (
        <p>The service provider shall not be held liable for any delay or failure in the performance of their obligations resulting from a case of force majeure, including but not limited to: power outages, internet failures, natural disasters, epidemics, armed conflicts, or any other event beyond the reasonable control of the service provider.</p>
      ),
    },
    {
      title: "Article 12 : disputes",
      body: (
        <p>In the event of a disagreement relating to the execution of these T&C, the parties agree to seek an amicable resolution before any proceedings. Failing amicable resolution, the dispute shall be submitted to the competent courts.</p>
      ),
    },
  ],
};

export default function ConditionsPage() {
  return <LegalPage fr={fr} en={en} />;
}
