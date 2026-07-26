import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { ChevronRight } from "lucide-react";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === "en";
  return {
    title: isEn ? "Legal Notice" : "Mentions Légales",
    description: isEn ? "Kelenix Tech legal notice" : "Mentions légales de Kelenix Tech",
    robots: { index: false, follow: false },
  };
}

export default async function LegalNoticePage({ params }: Props) {
  const { locale } = await params;
  const isEn = locale === "en";

  return (
    <main>
      <nav className="bg-white border-b border-gray-100 py-3">
        <div className="container mx-auto px-4 xl:px-8 max-w-7xl">
          <ol className="flex items-center gap-2 text-sm text-gray-500">
            <li><Link href="/" className="hover:text-sky transition-colors">{isEn ? "Home" : "Accueil"}</Link></li>
            <ChevronRight size={14} className="text-gray-300" />
            <li className="text-navy font-medium">{isEn ? "Legal Notice" : "Mentions Légales"}</li>
          </ol>
        </div>
      </nav>

      <section className="bg-gradient-to-br from-navy to-sky/20 py-16">
        <div className="container mx-auto px-4 xl:px-8 max-w-7xl text-center">
          <h1 className="font-heading text-4xl sm:text-5xl font-extrabold text-white mb-4">
            {isEn ? "Legal Notice" : "Mentions Légales"}
          </h1>
          <p className="text-gray-300">{isEn ? "Last updated: January 1, 2025" : "Dernière mise à jour : 01/01/2025"}</p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 xl:px-8 max-w-4xl">
          <div className="prose-kelenix space-y-10">
            <div>
              <h2>{isEn ? "1. Company Identification" : "1. Identification de l'entreprise"}</h2>
              <p>
                {isEn
                  ? "This website is published by Kelenix Tech SAS, a simplified joint-stock company with a capital of €10,000."
                  : "Ce site web est édité par Kelenix Tech SAS, société par actions simplifiée au capital de 10 000 €."}
              </p>
              <ul>
                <li><strong>{isEn ? "Registered office:" : "Siège social :"}</strong> Paris, France</li>
                <li><strong>SIRET :</strong> 123 456 789 00010</li>
                <li><strong>RCS :</strong> Paris B 123 456 789</li>
                <li><strong>TVA Intracommunautaire :</strong> FR 12 123456789</li>
                <li><strong>Email :</strong> contact@kelenix.com</li>
                <li><strong>{isEn ? "Phone:" : "Téléphone :"}</strong> +33 1 23 45 67 89</li>
              </ul>
            </div>

            <div>
              <h2>{isEn ? "2. Publication Director" : "2. Directeur de la publication"}</h2>
              <p>
                {isEn
                  ? "The publication director is Kevin Assou, CEO of Kelenix Tech SAS."
                  : "Le directeur de la publication est Kévin Assou, Président de Kelenix Tech SAS."}
              </p>
            </div>

            <div>
              <h2>{isEn ? "3. Hosting" : "3. Hébergement"}</h2>
              <p>
                {isEn
                  ? "This website is hosted by Vercel Inc., 340 Pine Street, Suite 900, San Francisco, CA 94104, USA."
                  : "Ce site est hébergé par Vercel Inc., 340 Pine Street, Suite 900, San Francisco, CA 94104, États-Unis."}
              </p>
            </div>

            <div>
              <h2>{isEn ? "4. Intellectual Property" : "4. Propriété intellectuelle"}</h2>
              <p>
                {isEn
                  ? "All content on this site (texts, images, graphics, logos, icons, etc.) is the exclusive property of Kelenix Tech and is protected by French and international intellectual property laws. Any reproduction, distribution or modification without prior written consent from Kelenix Tech is strictly prohibited."
                  : "Tous les contenus présents sur ce site (textes, images, graphiques, logos, icônes, etc.) sont la propriété exclusive de Kelenix Tech et sont protégés par les lois françaises et internationales sur la propriété intellectuelle. Toute reproduction, distribution ou modification sans accord écrit préalable de Kelenix Tech est strictement interdite."}
              </p>
            </div>

            <div>
              <h2>{isEn ? "5. Liability Limitation" : "5. Limitation de responsabilité"}</h2>
              <p>
                {isEn
                  ? "Kelenix Tech strives to provide accurate and up-to-date information but cannot guarantee the completeness or accuracy of content. Kelenix Tech cannot be held liable for any direct or indirect damages resulting from the use of this site."
                  : "Kelenix Tech s'efforce de fournir des informations exactes et à jour mais ne peut garantir l'exhaustivité ou l'exactitude des contenus. Kelenix Tech ne pourra être tenue responsable de tout dommage direct ou indirect résultant de l'utilisation de ce site."}
              </p>
            </div>

            <div>
              <h2>{isEn ? "6. Personal Data" : "6. Données personnelles"}</h2>
              <p>
                {isEn
                  ? "The processing of personal data collected on this site is governed by our Privacy Policy, in accordance with the GDPR and French Data Protection Act."
                  : "Le traitement des données personnelles collectées sur ce site est régi par notre Politique de Confidentialité, conformément au RGPD et à la loi Informatique et Libertés."}
              </p>
            </div>

            <div>
              <h2>{isEn ? "7. Applicable Law" : "7. Droit applicable"}</h2>
              <p>
                {isEn
                  ? "These legal notices are governed by French law. Any dispute relating to the use of this site shall be subject to the exclusive jurisdiction of French courts."
                  : "Les présentes mentions légales sont régies par le droit français. Tout litige relatif à l'utilisation de ce site sera soumis à la compétence exclusive des tribunaux français."}
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
