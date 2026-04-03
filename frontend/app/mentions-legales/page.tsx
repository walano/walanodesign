"use client";

import LegalPage, { LegalContent } from "@/components/LegalPage";

const fr: LegalContent = {
  title:    "Mentions légales",
  subtitle: "En vigueur au 03/04/2026.",
  sections: [
    {
      title: "Éditeur du site",
      body: (
        <>
          <p>Le site <a href="https://www.walanodesign.com" style={{ color: "#855c9d", textDecoration: "none" }}>https://www.walanodesign.com</a> est édité par Walano Design, marque de création graphique freelance représentée par Hermane.</p>
          <p style={{ marginTop: "0.4rem" }}>Email : <a href="mailto:contact@walanodesign.com" style={{ color: "#855c9d", textDecoration: "none" }}>contact@walanodesign.com</a></p>
          <p>Site : <a href="https://www.walanodesign.com" style={{ color: "#855c9d", textDecoration: "none" }}>https://www.walanodesign.com</a></p>
          <p>Réseaux sociaux : @saint_walano (instagram, threads, facebook)</p>
        </>
      ),
    },
    {
      title: "Hébergement",
      body: (
        <>
          <p>Le site est hébergé par :</p>
          <p style={{ marginTop: "0.4rem" }}>Vercel inc.<br />340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis<br /><a href="https://vercel.com" style={{ color: "#855c9d", textDecoration: "none" }}>https://vercel.com</a></p>
        </>
      ),
    },
    {
      title: "Propriété intellectuelle",
      body: (
        <>
          <p>L'ensemble du contenu présent sur ce site (textes, images, illustrations, logos, vidéos, graphismes, animations, maquettes, créations visuelles, etc.) est la propriété exclusive de Walano Design, sauf mention contraire explicite.</p>
          <p style={{ marginTop: "0.4rem" }}>Toute reproduction, représentation, modification, publication, adaptation ou diffusion de tout ou partie des éléments du site, quel que soit le moyen ou le procédé utilisé, est interdite sans autorisation écrite préalable de Walano Design.</p>
          <p style={{ marginTop: "0.4rem" }}>Les créations présentées dans le portfolio sont protégées par le droit d'auteur conformément à la convention de Berne. Elles sont publiées à titre de démonstration du travail du prestataire et ne peuvent être téléchargées, copiées, reproduites ou utilisées à quelque fin que ce soit sans accord express.</p>
        </>
      ),
    },
    {
      title: "Images du site",
      body: (
        <>
          <p>Les visuels présentés sur walanodesign.com, y compris les pochettes d'albums, logos, affiches et autres créations graphiques, sont des œuvres originales réalisées par Walano Design pour ses clients. Leur présence sur le site est strictement limitée à la promotion du portfolio du prestataire.</p>
          <p style={{ marginTop: "0.4rem" }}>Ces images sont diffusées en qualité web optimisée et ne constituent pas les fichiers de production. Toute utilisation non autorisée de ces images constitue une violation du droit d'auteur et pourra faire l'objet de poursuites.</p>
        </>
      ),
    },
    {
      title: "Conditions générales de vente",
      body: (
        <p>Les prestations proposées par Walano Design sont régies par les conditions générales de vente accessibles à l'adresse : <a href="/conditions" style={{ color: "#855c9d", textDecoration: "none" }}>walanodesign.com/conditions</a></p>
      ),
    },
    {
      title: "Politique de confidentialité",
      body: (
        <p>La collecte et le traitement des données personnelles sont décrits dans la politique de confidentialité accessible à l'adresse : <a href="/confidentialite" style={{ color: "#855c9d", textDecoration: "none" }}>walanodesign.com/confidentialite</a></p>
      ),
    },
    {
      title: "Responsabilité",
      body: (
        <p>Walano design s'efforce de fournir des informations exactes et à jour sur le site. Toutefois, l'éditeur ne saurait être tenu responsable d'éventuelles erreurs ou omissions, ni des dommages résultant de l'accès ou de l'utilisation du site.</p>
      ),
    },
    {
      title: "Litiges",
      body: (
        <p>En cas de litige relatif à l'utilisation du site, les parties s'engagent à rechercher une solution amiable. À défaut, le litige sera soumis aux tribunaux compétents.</p>
      ),
    },
  ],
};

const en: LegalContent = {
  title:    "Legal notice",
  subtitle: "Effective as of 04/03/2026.",
  sections: [
    {
      title: "Site publisher",
      body: (
        <>
          <p>The website <a href="https://www.walanodesign.com" style={{ color: "#855c9d", textDecoration: "none" }}>https://www.walanodesign.com</a> is published by Walano Design, a freelance graphic design brand represented by Hermane.</p>
          <p style={{ marginTop: "0.4rem" }}>Email : <a href="mailto:contact@walanodesign.com" style={{ color: "#855c9d", textDecoration: "none" }}>contact@walanodesign.com</a></p>
          <p>Website : <a href="https://www.walanodesign.com" style={{ color: "#855c9d", textDecoration: "none" }}>https://www.walanodesign.com</a></p>
          <p>Social media : @saint_walano (instagram, threads, facebook)</p>
        </>
      ),
    },
    {
      title: "Hosting",
      body: (
        <>
          <p>The site is hosted by:</p>
          <p style={{ marginTop: "0.4rem" }}>Vercel inc.<br />340 S Lemon Ave #4133, Walnut, CA 91789, USA<br /><a href="https://vercel.com" style={{ color: "#855c9d", textDecoration: "none" }}>https://vercel.com</a></p>
        </>
      ),
    },
    {
      title: "Intellectual property",
      body: (
        <>
          <p>All content on this website (texts, images, illustrations, logos, videos, graphics, animations, mockups, visual creations, etc.) is the exclusive property of Walano Design, unless explicitly stated otherwise.</p>
          <p style={{ marginTop: "0.4rem" }}>Any reproduction, representation, modification, publication, adaptation or distribution of all or part of the elements on the site, by any means or process, is prohibited without prior written authorization from Walano Design.</p>
          <p style={{ marginTop: "0.4rem" }}>The creations presented in the portfolio are protected by copyright in accordance with the Berne Convention. They are published for the purpose of showcasing the service provider's work and may not be downloaded, copied, reproduced or used for any purpose without express agreement.</p>
        </>
      ),
    },
    {
      title: "Website images",
      body: (
        <>
          <p>The visuals displayed on walanodesign.com, including album covers, logos, posters and other graphic creations, are original works created by Walano Design for its clients. Their presence on the site is strictly limited to the promotion of the service provider's portfolio.</p>
          <p style={{ marginTop: "0.4rem" }}>These images are distributed in optimized web quality and do not constitute production files. Any unauthorized use of these images constitutes a copyright violation and may be subject to legal action.</p>
        </>
      ),
    },
    {
      title: "Terms and conditions",
      body: (
        <p>The services offered by Walano Design are governed by the general terms and conditions of sale available at: <a href="/conditions" style={{ color: "#855c9d", textDecoration: "none" }}>walanodesign.com/conditions</a></p>
      ),
    },
    {
      title: "Privacy policy",
      body: (
        <p>The collection and processing of personal data are described in the privacy policy available at: <a href="/confidentialite" style={{ color: "#855c9d", textDecoration: "none" }}>walanodesign.com/confidentialite</a></p>
      ),
    },
    {
      title: "Liability",
      body: (
        <p>Walano design strives to provide accurate and up-to-date information on the site. However, the publisher cannot be held responsible for any errors or omissions, nor for damages resulting from access to or use of the site.</p>
      ),
    },
    {
      title: "Disputes",
      body: (
        <p>In the event of a dispute relating to the use of the site, the parties agree to seek an amicable resolution. Failing this, the dispute shall be submitted to the competent courts.</p>
      ),
    },
  ],
};

export default function MentionsLegalesPage() {
  return <LegalPage fr={fr} en={en} />;
}
