"use client";

import LegalPage, { LegalContent } from "@/components/LegalPage";

const fr: LegalContent = {
  title:    "Conditions générales de vente",
  subtitle: "En vigueur au 03/04/2026",
  sections: [
    {
      title: "Article 1 — Champ d'application",
      body: (
        <>
          <p>Les présentes conditions générales de vente (CGV) s'appliquent, sans restriction ni réserve, à tout achat des services suivants proposés par Walano Design :</p>
          <ul style={{ marginTop: "0.75rem", paddingLeft: "1.25rem", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
            <li>Pochettes de singles et d'albums (covers)</li>
            <li>Création de logos et identités visuelles complètes (logo & branding)</li>
            <li>Lyrics videos et montage vidéo</li>
            <li>Affiches événementielles et visuels promotionnels</li>
            <li>Miniatures YouTube et visuels web</li>
            <li>Bannières et profils pour Twitch, YouTube, X (Twitter) et autres plateformes</li>
          </ul>
          <p style={{ marginTop: "0.75rem" }}>Les caractéristiques principales des services sont présentées sur le site walanodesign.com. Le client est tenu d'en prendre connaissance avant toute passation de commande.</p>
          <p style={{ marginTop: "0.5rem" }}>Ces CGV sont accessibles à tout moment sur le site et prévaudront sur tout autre document. Le client déclare avoir pris connaissance des présentes CGV et les avoir acceptées avant toute commande.</p>
        </>
      ),
    },
    {
      title: "Article 2 — Commandes",
      body: (
        <>
          <p>Le processus de commande est le suivant :</p>
          <ol style={{ marginTop: "0.75rem", paddingLeft: "1.25rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <li><strong>Prise de contact</strong> — Le client contacte Walano Design pour discuter de ses besoins, via le formulaire de devis en ligne (walanodesign.com/devis) ou par échange direct (email, WhatsApp).</li>
            <li><strong>Élaboration du devis</strong> — Un devis détaillé est fourni gratuitement, précisant les services, délais, tarifs et livrables inclus.</li>
            <li><strong>Validation et paiement</strong> — Toute commande est validée après réception de l'acompte tel que défini à l'article 4.</li>
          </ol>
          <p style={{ marginTop: "0.75rem" }}>Le devis généré via le formulaire en ligne est une estimation indicative. Il peut être révisé après échange détaillé sur les spécificités du projet. Le devis est valable 15 jours à compter de sa date d'émission.</p>
        </>
      ),
    },
    {
      title: "Article 3 — Tarifs",
      body: (
        <>
          <p>Les tarifs sont communiqués dans le devis. Ils peuvent être exprimés en FCFA, EUR ou USD selon la localisation du client. Une majoration peut être appliquée en cas de délai réduit (urgence).</p>
          <p style={{ marginTop: "0.5rem" }}>Toute demande supplémentaire non prévue dans le devis initial fera l'objet d'un avenant facturé séparément.</p>
        </>
      ),
    },
    {
      title: "Article 4 — Modalités de paiement",
      body: (
        <>
          <ul style={{ paddingLeft: "1.25rem", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
            <li>60 % à la commande (acompte), correspondant au début des travaux</li>
            <li>40 % à la livraison finale, avant remise des livrables définitifs</li>
          </ul>
          <p style={{ marginTop: "0.75rem" }}>L'acompte n'est pas remboursable en cas d'annulation par le client une fois les travaux entamés. En cas de retard de paiement du solde, le prestataire se réserve le droit de suspendre la livraison.</p>
        </>
      ),
    },
    {
      title: "Article 5 — Livraison et livrables",
      body: (
        <p>Les créations sont livrées sous format numérique (PNG, JPG, PDF ou tout autre format convenu) dans les délais indiqués au devis. Sauf mention contraire, les fichiers sources éditables (PSD, AI, AEP, Figma, etc.) ne font pas partie des livrables. Le client dispose de 7 jours après livraison pour demander des modifications mineures.</p>
      ),
    },
    {
      title: "Article 6 — Révisions et modifications",
      body: (
        <p>Chaque prestation inclut un nombre de révisions défini dans le devis. Toute demande de modification majeure (changement de concept, de direction artistique ou de brief) après validation du concept initial est considérée comme une nouvelle prestation et sera facturée en conséquence.</p>
      ),
    },
    {
      title: "Article 7 — Propriété intellectuelle et droits d'auteur",
      body: (
        <>
          <p>Conformément à la convention de Berne, le prestataire est l'auteur et le titulaire des droits d'auteur sur l'ensemble des créations réalisées.</p>
          <p style={{ marginTop: "0.5rem" }}><strong>Cession des droits d'utilisation</strong> — Après paiement intégral, le client obtient un droit d'utilisation non exclusif des créations livrées pour l'usage prévu dans le devis.</p>
          <p style={{ marginTop: "0.5rem" }}><strong>Droit de paternité</strong> — Le prestataire conserve le droit d'être crédité. Le client s'engage à créditer le prestataire lorsque cela est raisonnablement possible (mention « design by walano design » ou « @saint_walano »).</p>
          <p style={{ marginTop: "0.5rem" }}><strong>Droit de portfolio</strong> — Le prestataire se réserve le droit d'utiliser les créations dans son portfolio et sur ses supports de communication professionnelle, sauf accord contraire écrit.</p>
          <p style={{ marginTop: "0.5rem" }}><strong>Interdictions</strong> — Le client ne peut pas revendre, redistribuer ou présenter les créations comme étant les siennes.</p>
        </>
      ),
    },
    {
      title: "Article 8 — Contenu fourni par le client",
      body: (
        <p>Le client est responsable de fournir tous les éléments nécessaires (textes, photos, logos, brief créatif, etc.) dans les délais convenus. Le client garantit qu'il dispose des droits nécessaires sur ces éléments et dégage le prestataire de toute responsabilité en cas de litige lié à ces éléments.</p>
      ),
    },
    {
      title: "Article 9 — Annulation et résiliation",
      body: (
        <>
          <ul style={{ paddingLeft: "1.25rem", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
            <li>Avant le début des travaux : remboursement intégral de l'acompte</li>
            <li>Après le début des travaux : l'acompte reste acquis au prestataire</li>
            <li>Après livraison d'une première version : le solde reste dû</li>
          </ul>
        </>
      ),
    },
    {
      title: "Article 10 — Responsabilité",
      body: (
        <p>Le prestataire s'engage à réaliser les prestations avec soin et professionnalisme. Sa responsabilité est limitée au montant total de la prestation concernée. Il ne pourra être tenu responsable des dommages indirects résultant de l'utilisation des créations livrées.</p>
      ),
    },
    {
      title: "Article 11 — Force majeure",
      body: (
        <p>Le prestataire ne saurait être tenu responsable de tout retard ou manquement résultant d'un cas de force majeure, notamment : coupure d'électricité, panne internet, catastrophe naturelle, épidémie, conflit armé, ou tout autre événement échappant à son contrôle raisonnable.</p>
      ),
    },
    {
      title: "Article 12 — Litiges",
      body: (
        <p>En cas de désaccord, les parties s'engagent à rechercher une solution amiable avant toute procédure. À défaut de résolution amiable, le litige sera soumis aux tribunaux compétents.</p>
      ),
    },
  ],
};

const en: LegalContent = {
  title:    "General Terms and Conditions of Sale",
  subtitle: "Effective as of 04/03/2026",
  sections: [
    {
      title: "Article 1 — Scope",
      body: (
        <>
          <p>These general terms and conditions of sale (T&C) apply, without restriction or reservation, to all purchases of the following services offered by Walano Design:</p>
          <ul style={{ marginTop: "0.75rem", paddingLeft: "1.25rem", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
            <li>Single and album covers</li>
            <li>Logo creation and complete visual identities (logo & branding)</li>
            <li>Lyrics videos and video editing</li>
            <li>Event posters and promotional visuals</li>
            <li>YouTube thumbnails and web visuals</li>
            <li>Banners and profiles for Twitch, YouTube, X (Twitter) and other platforms</li>
          </ul>
          <p style={{ marginTop: "0.75rem" }}>The client acknowledges having read and accepted these T&C before placing any order.</p>
        </>
      ),
    },
    {
      title: "Article 2 — Orders",
      body: (
        <>
          <ol style={{ paddingLeft: "1.25rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <li><strong>Initial contact</strong> — The client contacts Walano Design via the online quote form (walanodesign.com/devis) or by direct exchange (email, WhatsApp).</li>
            <li><strong>Quote preparation</strong> — A detailed quote is provided free of charge, specifying services, deadlines, pricing and deliverables.</li>
            <li><strong>Validation and payment</strong> — Any order is confirmed upon receipt of the deposit as defined in article 4.</li>
          </ol>
          <p style={{ marginTop: "0.75rem" }}>The quote is valid for 15 days from its date of issue.</p>
        </>
      ),
    },
    {
      title: "Article 3 — Pricing",
      body: (
        <p>Prices are communicated in the quote and may be expressed in FCFA, EUR or USD. A surcharge may be applied for rush orders. Any additional request not included in the original quote will be subject to a separate invoice.</p>
      ),
    },
    {
      title: "Article 4 — Payment Terms",
      body: (
        <>
          <ul style={{ paddingLeft: "1.25rem", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
            <li>60% upon order (deposit), corresponding to the start of work</li>
            <li>40% upon final delivery, before handover of final deliverables</li>
          </ul>
          <p style={{ marginTop: "0.75rem" }}>The deposit is non-refundable in case of cancellation by the client once work has begun.</p>
        </>
      ),
    },
    {
      title: "Article 5 — Delivery and Deliverables",
      body: (
        <p>Creations are delivered in digital format within the deadlines indicated in the quote. Unless otherwise stated, editable source files (PSD, AI, AEP, Figma, etc.) are not part of the deliverables. The client has 7 days after delivery to request minor modifications.</p>
      ),
    },
    {
      title: "Article 6 — Revisions and Modifications",
      body: (
        <p>Each service includes a number of revisions defined in the quote. Any request for a major modification after validation of the initial concept is considered a new service and will be billed accordingly.</p>
      ),
    },
    {
      title: "Article 7 — Intellectual Property and Copyright",
      body: (
        <>
          <p>In accordance with the Berne Convention, the service provider is the author and copyright holder of all creations produced.</p>
          <p style={{ marginTop: "0.5rem" }}><strong>Transfer of usage rights</strong> — After full payment, the client obtains a non-exclusive right to use the delivered creations for the purpose specified in the quote.</p>
          <p style={{ marginTop: "0.5rem" }}><strong>Attribution right</strong> — The client agrees to credit the service provider whenever reasonably possible (mention "design by walano design" or "@saint_walano").</p>
          <p style={{ marginTop: "0.5rem" }}><strong>Portfolio right</strong> — The service provider reserves the right to use the creations in their portfolio and professional promotional materials, unless otherwise agreed in writing.</p>
          <p style={{ marginTop: "0.5rem" }}><strong>Restrictions</strong> — The client may not resell, redistribute or present the creations as their own.</p>
        </>
      ),
    },
    {
      title: "Article 8 — Content Provided by the Client",
      body: (
        <p>The client is responsible for providing all elements necessary for the completion of the service within agreed deadlines. The client guarantees that they hold the necessary rights to all elements provided and releases the service provider from any related liability.</p>
      ),
    },
    {
      title: "Article 9 — Cancellation",
      body: (
        <ul style={{ paddingLeft: "1.25rem", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
          <li>Before work begins: full refund of the deposit</li>
          <li>After work begins: the deposit is retained by the service provider</li>
          <li>After delivery of a first version: the balance remains due</li>
        </ul>
      ),
    },
    {
      title: "Article 10 — Liability",
      body: (
        <p>The service provider commits to carrying out services with care and professionalism. Their liability is limited to the total amount of the service in question. They cannot be held liable for indirect damages resulting from the use of delivered creations.</p>
      ),
    },
    {
      title: "Article 11 — Force Majeure",
      body: (
        <p>The service provider shall not be held liable for any delay or failure resulting from a case of force majeure, including but not limited to: power outages, internet failures, natural disasters, epidemics, armed conflicts, or any other event beyond their reasonable control.</p>
      ),
    },
    {
      title: "Article 12 — Disputes",
      body: (
        <p>In the event of a disagreement, the parties agree to seek an amicable resolution before any proceedings. Failing amicable resolution, the dispute shall be submitted to the competent courts.</p>
      ),
    },
  ],
};

export default function ConditionsPage() {
  return <LegalPage fr={fr} en={en} />;
}
