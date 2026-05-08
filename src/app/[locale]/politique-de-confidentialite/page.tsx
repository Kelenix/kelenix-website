import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { ChevronRight } from "lucide-react";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === "en";
  return {
    title: isEn ? "Privacy Policy" : "Politique de Confidentialité",
    description: isEn ? "Kelenix privacy policy and GDPR information" : "Politique de confidentialité et informations RGPD de Kelenix",
    robots: { index: false, follow: false },
  };
}

export default async function PrivacyPolicyPage({ params }: Props) {
  const { locale } = await params;
  const isEn = locale === "en";

  return (
    <main>
      <nav className="bg-white border-b border-gray-100 py-3">
        <div className="container mx-auto px-4 xl:px-8 max-w-7xl">
          <ol className="flex items-center gap-2 text-sm text-gray-500">
            <li><Link href="/" className="hover:text-sky transition-colors">{isEn ? "Home" : "Accueil"}</Link></li>
            <ChevronRight size={14} className="text-gray-300" />
            <li className="text-navy font-medium">{isEn ? "Privacy Policy" : "Politique de Confidentialité"}</li>
          </ol>
        </div>
      </nav>

      <section className="bg-gradient-to-br from-navy to-sky/20 py-16">
        <div className="container mx-auto px-4 xl:px-8 max-w-7xl text-center">
          <h1 className="font-heading text-4xl sm:text-5xl font-extrabold text-white mb-4">
            {isEn ? "Privacy Policy" : "Politique de Confidentialité"}
          </h1>
          <p className="text-gray-300">{isEn ? "Last updated: January 1, 2025" : "Dernière mise à jour : 01/01/2025"}</p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 xl:px-8 max-w-4xl">
          <div className="prose-kelenix space-y-10">
            <div>
              <h2>{isEn ? "1. Introduction" : "1. Introduction"}</h2>
              <p>
                {isEn
                  ? "Kelenix SAS, as data controller, attaches great importance to the protection of your personal data. This privacy policy describes how we collect, use and protect your personal information in accordance with the General Data Protection Regulation (GDPR) and the French Data Protection Act."
                  : "Kelenix SAS, en tant que responsable du traitement, accorde une grande importance à la protection de vos données personnelles. La présente politique de confidentialité décrit comment nous collectons, utilisons et protégeons vos informations personnelles conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi Informatique et Libertés."}
              </p>
            </div>

            <div>
              <h2>{isEn ? "2. Data Collected" : "2. Données collectées"}</h2>
              <p>{isEn ? "We collect the following categories of data:" : "Nous collectons les catégories de données suivantes :"}</p>
              <ul>
                <li>{isEn ? "Contact information (name, first name, email, phone, company)" : "Informations de contact (nom, prénom, email, téléphone, entreprise)"}</li>
                <li>{isEn ? "Information related to your project requests (service type, budget, description)" : "Informations liées à vos demandes de projet (type de service, budget, description)"}</li>
                <li>{isEn ? "Navigation data (IP address, cookies, pages visited)" : "Données de navigation (adresse IP, cookies, pages visitées)"}</li>
                <li>{isEn ? "Newsletter subscriptions (email)" : "Abonnements newsletter (email)"}</li>
              </ul>
            </div>

            <div>
              <h2>{isEn ? "3. Purpose of Processing" : "3. Finalités du traitement"}</h2>
              <p>{isEn ? "Your data is processed for the following purposes:" : "Vos données sont traitées pour les finalités suivantes :"}</p>
              <ul>
                <li>{isEn ? "Managing your contact and quote requests" : "Gestion de vos demandes de contact et de devis"}</li>
                <li>{isEn ? "Sending commercial communications (with your consent)" : "Envoi de communications commerciales (avec votre consentement)"}</li>
                <li>{isEn ? "Improving our services and website" : "Amélioration de nos services et de notre site web"}</li>
                <li>{isEn ? "Complying with our legal obligations" : "Respect de nos obligations légales"}</li>
              </ul>
            </div>

            <div>
              <h2>{isEn ? "4. Legal Basis for Processing" : "4. Base légale du traitement"}</h2>
              <p>
                {isEn
                  ? "The legal bases for processing your data are: contractual execution for project management, your consent for marketing communications, and our legitimate interest for site improvement."
                  : "Les bases légales du traitement de vos données sont : l'exécution contractuelle pour la gestion des projets, votre consentement pour les communications marketing, et notre intérêt légitime pour l'amélioration du site."}
              </p>
            </div>

            <div>
              <h2>{isEn ? "5. Data Retention" : "5. Durée de conservation"}</h2>
              <ul>
                <li>{isEn ? "Contact data: 3 years from last contact" : "Données de contact : 3 ans à compter du dernier contact"}</li>
                <li>{isEn ? "Client data: duration of the contractual relationship + 5 years" : "Données clients : durée de la relation contractuelle + 5 ans"}</li>
                <li>{isEn ? "Navigation data: 13 months" : "Données de navigation : 13 mois"}</li>
                <li>{isEn ? "Newsletter: until unsubscription" : "Newsletter : jusqu'à désinscription"}</li>
              </ul>
            </div>

            <div>
              <h2>{isEn ? "6. Your Rights" : "6. Vos droits"}</h2>
              <p>
                {isEn
                  ? "In accordance with the GDPR, you have the following rights: right of access, rectification, erasure, limitation of processing, portability, and opposition. To exercise these rights, contact us at: privacy@kelenix.com"
                  : "Conformément au RGPD, vous disposez des droits suivants : droit d'accès, de rectification, d'effacement, de limitation du traitement, de portabilité et d'opposition. Pour exercer ces droits, contactez-nous à : privacy@kelenix.com"}
              </p>
            </div>

            <div>
              <h2>{isEn ? "7. Data Security" : "7. Sécurité des données"}</h2>
              <p>
                {isEn
                  ? "We implement appropriate technical and organizational measures to protect your data against unauthorized access, loss or destruction: SSL/TLS encryption, restricted access, regular audits."
                  : "Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données contre tout accès non autorisé, perte ou destruction : chiffrement SSL/TLS, accès restreints, audits réguliers."}
              </p>
            </div>

            <div>
              <h2>{isEn ? "8. Third Parties and Transfers" : "8. Tiers et transferts"}</h2>
              <p>
                {isEn
                  ? "Your data may be shared with trusted service providers (hosting, email, analytics) under strict contractual conditions ensuring an equivalent level of protection."
                  : "Vos données peuvent être partagées avec des prestataires de services de confiance (hébergement, email, analytics) dans le cadre de conditions contractuelles strictes garantissant un niveau de protection équivalent."}
              </p>
            </div>

            <div>
              <h2>{isEn ? "9. Cookies" : "9. Cookies"}</h2>
              <p>
                {isEn
                  ? "For more information about our use of cookies, please consult our "
                  : "Pour plus d'informations sur notre utilisation des cookies, consultez notre "}
                <Link href="/cookies" className="text-sky underline">
                  {isEn ? "cookie policy" : "politique cookies"}
                </Link>.
              </p>
            </div>

            <div>
              <h2>{isEn ? "10. Contact" : "10. Contact"}</h2>
              <p>
                {isEn
                  ? "For any questions regarding the processing of your personal data, you can contact our DPO at: privacy@kelenix.com. You also have the right to lodge a complaint with the CNIL."
                  : "Pour toute question concernant le traitement de vos données personnelles, vous pouvez contacter notre DPO à l'adresse : privacy@kelenix.com. Vous avez également le droit d'introduire une réclamation auprès de la CNIL."}
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
