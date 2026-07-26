import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { ChevronRight } from "lucide-react";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === "en";
  return {
    title: isEn ? "Terms of Use" : "Conditions Générales d'Utilisation",
    description: isEn ? "Kelenix Tech terms of use" : "Conditions générales d'utilisation de Kelenix Tech",
    robots: { index: false, follow: false },
  };
}

export default async function CGUPage({ params }: Props) {
  const { locale } = await params;
  const isEn = locale === "en";

  return (
    <main>
      <nav className="bg-white border-b border-gray-100 py-3">
        <div className="container mx-auto px-4 xl:px-8 max-w-7xl">
          <ol className="flex items-center gap-2 text-sm text-gray-500">
            <li><Link href="/" className="hover:text-sky transition-colors">{isEn ? "Home" : "Accueil"}</Link></li>
            <ChevronRight size={14} className="text-gray-300" />
            <li className="text-navy font-medium">{isEn ? "Terms of Use" : "CGU"}</li>
          </ol>
        </div>
      </nav>

      <section className="bg-gradient-to-br from-navy to-sky/20 py-16">
        <div className="container mx-auto px-4 xl:px-8 max-w-7xl text-center">
          <h1 className="font-heading text-4xl sm:text-5xl font-extrabold text-white mb-4">
            {isEn ? "Terms of Use" : "Conditions Générales d'Utilisation"}
          </h1>
          <p className="text-gray-300">{isEn ? "Last updated: January 1, 2025" : "Dernière mise à jour : 01/01/2025"}</p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 xl:px-8 max-w-4xl">
          <div className="prose-kelenix space-y-10">
            <div>
              <h2>{isEn ? "1. Purpose" : "1. Objet"}</h2>
              <p>
                {isEn
                  ? "These Terms of Use (hereinafter 'ToU') govern access to and use of the Kelenix Tech website accessible at www.kelenix.com. By accessing this site, you agree to these ToU without reservation."
                  : "Les présentes Conditions Générales d'Utilisation (ci-après « CGU ») régissent l'accès et l'utilisation du site web Kelenix Tech accessible à l'adresse www.kelenix.com. En accédant à ce site, vous acceptez sans réserve les présentes CGU."}
              </p>
            </div>

            <div>
              <h2>{isEn ? "2. Access to the Site" : "2. Accès au site"}</h2>
              <p>
                {isEn
                  ? "Access to the site is free. Kelenix Tech reserves the right to interrupt, suspend or modify access without notice for technical or legal reasons."
                  : "L'accès au site est gratuit. Kelenix Tech se réserve le droit d'interrompre, de suspendre ou de modifier l'accès sans préavis pour des raisons techniques ou légales."}
              </p>
            </div>

            <div>
              <h2>{isEn ? "3. Use of the Site" : "3. Utilisation du site"}</h2>
              <p>{isEn ? "Users undertake to:" : "Les utilisateurs s'engagent à :"}</p>
              <ul>
                <li>{isEn ? "Use the site for lawful purposes only" : "Utiliser le site uniquement à des fins licites"}</li>
                <li>{isEn ? "Not attempt to disrupt or compromise the site's security" : "Ne pas tenter de perturber ou de compromettre la sécurité du site"}</li>
                <li>{isEn ? "Not spread false, misleading or harmful information" : "Ne pas diffuser d'informations fausses, trompeuses ou nuisibles"}</li>
                <li>{isEn ? "Respect Kelenix Tech's intellectual property rights" : "Respecter les droits de propriété intellectuelle de Kelenix Tech"}</li>
              </ul>
            </div>

            <div>
              <h2>{isEn ? "4. Intellectual Property" : "4. Propriété intellectuelle"}</h2>
              <p>
                {isEn
                  ? "All elements of the site (texts, images, logos, icons, videos, databases) are protected by intellectual property law. Any reproduction or use without prior written authorization from Kelenix Tech is prohibited."
                  : "Tous les éléments du site (textes, images, logos, icônes, vidéos, bases de données) sont protégés par le droit de la propriété intellectuelle. Toute reproduction ou utilisation sans autorisation écrite préalable de Kelenix Tech est interdite."}
              </p>
            </div>

            <div>
              <h2>{isEn ? "5. External Links" : "5. Liens externes"}</h2>
              <p>
                {isEn
                  ? "The Kelenix Tech website may contain links to third-party sites. Kelenix Tech has no control over the content of these sites and declines all liability regarding the information published on them."
                  : "Le site Kelenix Tech peut contenir des liens vers des sites tiers. Kelenix Tech n'a aucun contrôle sur le contenu de ces sites et décline toute responsabilité quant aux informations qui y sont publiées."}
              </p>
            </div>

            <div>
              <h2>{isEn ? "6. Limitation of Liability" : "6. Limitation de responsabilité"}</h2>
              <p>
                {isEn
                  ? "Kelenix Tech cannot be held liable for any direct or indirect, material or immaterial damages resulting from the use of the site, including but not limited to: data loss, business interruption, loss of revenue."
                  : "Kelenix Tech ne peut être tenue responsable des dommages directs ou indirects, matériels ou immatériels résultant de l'utilisation du site, notamment : perte de données, interruption d'activité, manque à gagner."}
              </p>
            </div>

            <div>
              <h2>{isEn ? "7. Personal Data" : "7. Données personnelles"}</h2>
              <p>
                {isEn
                  ? "The processing of personal data is governed by our "
                  : "Le traitement des données personnelles est régi par notre "}
                <Link href="/politique-de-confidentialite" className="text-sky underline">
                  {isEn ? "privacy policy" : "politique de confidentialité"}
                </Link>.
              </p>
            </div>

            <div>
              <h2>{isEn ? "8. Modification of ToU" : "8. Modification des CGU"}</h2>
              <p>
                {isEn
                  ? "Kelenix Tech reserves the right to modify these ToU at any time. Users are advised to consult them regularly. Continued use of the site after modification constitutes acceptance of the new ToU."
                  : "Kelenix Tech se réserve le droit de modifier les présentes CGU à tout moment. Les utilisateurs sont invités à les consulter régulièrement. La poursuite de l'utilisation du site après modification vaut acceptation des nouvelles CGU."}
              </p>
            </div>

            <div>
              <h2>{isEn ? "9. Applicable Law" : "9. Droit applicable"}</h2>
              <p>
                {isEn
                  ? "These ToU are governed by French law. Any dispute relating to their interpretation or execution shall be subject to the exclusive jurisdiction of Paris courts."
                  : "Les présentes CGU sont soumises au droit français. Tout litige relatif à leur interprétation ou à leur exécution sera soumis à la compétence exclusive des tribunaux de Paris."}
              </p>
            </div>

            <div>
              <h2>{isEn ? "10. Contact" : "10. Contact"}</h2>
              <p>
                {isEn
                  ? "For any questions regarding these ToU, contact us at: legal@kelenix.com"
                  : "Pour toute question concernant les présentes CGU, contactez-nous à : legal@kelenix.com"}
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
