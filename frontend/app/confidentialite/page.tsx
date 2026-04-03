"use client";

import LegalPage, { LegalContent } from "@/components/LegalPage";

const fr: LegalContent = {
  title:    "Politique de confidentialité",
  subtitle: "En vigueur au 03/04/2026",
  sections: [
    {
      title: "1. Responsable du traitement",
      body: (
        <>
          <p>Le site walanodesign.com est édité par Walano Design, marque de création graphique freelance représentée par Hermane.</p>
          <p style={{ marginTop: "0.5rem" }}>Email : <a href="mailto:contact@walanodesign.com" style={{ color: "#855c9d", textDecoration: "none" }}>contact@walanodesign.com</a></p>
        </>
      ),
    },
    {
      title: "2. Données collectées",
      body: (
        <>
          <p>Dans le cadre de l'utilisation du site et du formulaire de devis, Walano Design peut collecter les données suivantes :</p>
          <ul style={{ marginTop: "0.75rem", paddingLeft: "1.25rem", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
            <li>Nom ou pseudonyme</li>
            <li>Adresse email</li>
            <li>Numéro de téléphone (WhatsApp)</li>
            <li>Description du projet</li>
            <li>Fichiers ou éléments transmis par le client (photos, références, briefs)</li>
          </ul>
          <p style={{ marginTop: "0.75rem" }}>Ces données sont collectées uniquement lorsque le client les transmet volontairement via le formulaire de devis, par email ou par messagerie.</p>
        </>
      ),
    },
    {
      title: "3. Finalité du traitement",
      body: (
        <>
          <p>Les données collectées sont utilisées exclusivement pour :</p>
          <ul style={{ marginTop: "0.75rem", paddingLeft: "1.25rem", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
            <li>Répondre aux demandes de devis et de contact</li>
            <li>Assurer le suivi et la bonne exécution des prestations</li>
            <li>Communiquer avec le client dans le cadre du projet</li>
          </ul>
          <p style={{ marginTop: "0.75rem" }}>Walano Design ne commercialise pas, ne vend pas et ne transmet pas les données personnelles de ses clients à des tiers.</p>
        </>
      ),
    },
    {
      title: "4. Conservation des données",
      body: (
        <p>Les données personnelles sont conservées pendant une durée maximale de 3 ans à compter de la dernière interaction avec le client, couvrant la période de prescription contractuelle applicable.</p>
      ),
    },
    {
      title: "5. Droits du client",
      body: (
        <>
          <p>Conformément aux réglementations en matière de protection des données, le client dispose d'un droit d'accès, de rectification, d'opposition et de suppression de ses données personnelles.</p>
          <p style={{ marginTop: "0.5rem" }}>Pour exercer ces droits : <a href="mailto:contact@walanodesign.com" style={{ color: "#855c9d", textDecoration: "none" }}>contact@walanodesign.com</a></p>
        </>
      ),
    },
    {
      title: "6. Cookies",
      body: (
        <p>Le site walanodesign.com peut utiliser des cookies techniques nécessaires à son fonctionnement ainsi que des cookies de mesure d'audience. L'utilisateur peut refuser ou paramétrer les cookies depuis son navigateur.</p>
      ),
    },
    {
      title: "7. Hébergement",
      body: (
        <>
          <p>Le site est hébergé par Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis.</p>
          <p style={{ marginTop: "0.5rem" }}>Les images du portfolio sont hébergées par Cloudinary Ltd.</p>
        </>
      ),
    },
    {
      title: "8. Sécurité",
      body: (
        <p>Walano Design met en œuvre les mesures techniques raisonnables pour protéger les données personnelles contre tout accès non autorisé, perte ou altération. Le site est servi exclusivement en HTTPS.</p>
      ),
    },
  ],
};

const en: LegalContent = {
  title:    "Privacy Policy",
  subtitle: "Effective as of 04/03/2026",
  sections: [
    {
      title: "1. Data Controller",
      body: (
        <>
          <p>The website walanodesign.com is published by Walano Design, a freelance graphic design brand represented by Hermane.</p>
          <p style={{ marginTop: "0.5rem" }}>Email: <a href="mailto:contact@walanodesign.com" style={{ color: "#855c9d", textDecoration: "none" }}>contact@walanodesign.com</a></p>
        </>
      ),
    },
    {
      title: "2. Data Collected",
      body: (
        <>
          <p>In connection with the use of the website and the quote form, Walano Design may collect the following data:</p>
          <ul style={{ marginTop: "0.75rem", paddingLeft: "1.25rem", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
            <li>Name or pseudonym</li>
            <li>Email address</li>
            <li>Phone number (WhatsApp)</li>
            <li>Project description</li>
            <li>Files or elements provided by the client (photos, references, briefs)</li>
          </ul>
          <p style={{ marginTop: "0.75rem" }}>This data is collected only when the client voluntarily submits it through the quote form, by email or by messaging.</p>
        </>
      ),
    },
    {
      title: "3. Purpose of Data Processing",
      body: (
        <>
          <p>The collected data is used exclusively to:</p>
          <ul style={{ marginTop: "0.75rem", paddingLeft: "1.25rem", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
            <li>Respond to quote and contact requests</li>
            <li>Ensure the follow-up and proper execution of services</li>
            <li>Communicate with the client within the scope of the project</li>
          </ul>
          <p style={{ marginTop: "0.75rem" }}>Walano Design does not sell, trade or transfer its clients' personal data to third parties.</p>
        </>
      ),
    },
    {
      title: "4. Data Retention",
      body: (
        <p>Personal data is retained for a maximum period of 3 years from the last interaction with the client, covering the applicable contractual limitation period.</p>
      ),
    },
    {
      title: "5. Client Rights",
      body: (
        <>
          <p>In accordance with data protection regulations, the client has the right to access, rectify, object to and delete their personal data.</p>
          <p style={{ marginTop: "0.5rem" }}>To exercise these rights: <a href="mailto:contact@walanodesign.com" style={{ color: "#855c9d", textDecoration: "none" }}>contact@walanodesign.com</a></p>
        </>
      ),
    },
    {
      title: "6. Cookies",
      body: (
        <p>The website walanodesign.com may use technical cookies necessary for its operation as well as audience measurement cookies. Users can refuse or configure cookies through their browser settings.</p>
      ),
    },
    {
      title: "7. Hosting",
      body: (
        <>
          <p>The site is hosted by Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, USA.</p>
          <p style={{ marginTop: "0.5rem" }}>Portfolio images are hosted by Cloudinary Ltd.</p>
        </>
      ),
    },
    {
      title: "8. Security",
      body: (
        <p>Walano Design implements reasonable technical measures to protect personal data against unauthorized access, loss or alteration. The site is served exclusively over HTTPS.</p>
      ),
    },
  ],
};

export default function ConfidentialitePage() {
  return <LegalPage fr={fr} en={en} />;
}
