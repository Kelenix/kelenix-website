import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { ChevronRight } from "lucide-react";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === "en";
  return {
    title: isEn ? "Cookie Policy" : "Politique Cookies",
    description: isEn ? "Kelenix cookie policy" : "Politique de gestion des cookies de Kelenix",
    robots: { index: false, follow: false },
  };
}

export default async function CookiesPage({ params }: Props) {
  const { locale } = await params;
  const isEn = locale === "en";

  const cookieTypes = [
    {
      nameFr: "Cookies essentiels",
      nameEn: "Essential cookies",
      descFr: "Indispensables au fonctionnement du site. Ils permettent la navigation, la sécurité et l'accès aux fonctionnalités de base. Ils ne peuvent pas être désactivés.",
      descEn: "Essential for the site to function. They enable navigation, security and access to basic features. They cannot be disabled.",
      duration: "Session / 1 an",
      examples: "session_id, csrf_token",
    },
    {
      nameFr: "Cookies analytiques",
      nameEn: "Analytical cookies",
      descFr: "Nous permettent de comprendre comment les visiteurs interagissent avec notre site en collectant des informations de façon anonyme.",
      descEn: "Allow us to understand how visitors interact with our site by collecting information anonymously.",
      duration: "13 mois / 13 months",
      examples: "_ga, _gid (Google Analytics)",
    },
    {
      nameFr: "Cookies marketing",
      nameEn: "Marketing cookies",
      descFr: "Utilisés pour vous présenter des publicités pertinentes et mesurer l'efficacité de nos campagnes publicitaires.",
      descEn: "Used to show you relevant advertisements and measure the effectiveness of our advertising campaigns.",
      duration: "90 jours / 90 days",
      examples: "fbp, _gcl_au",
    },
    {
      nameFr: "Cookies de préférences",
      nameEn: "Preference cookies",
      descFr: "Mémorisent vos préférences de navigation (langue, région, cookies acceptés) pour améliorer votre expérience.",
      descEn: "Remember your navigation preferences (language, region, accepted cookies) to improve your experience.",
      duration: "1 an / 1 year",
      examples: "locale, cookie_consent",
    },
  ];

  return (
    <main>
      <nav className="bg-white border-b border-gray-100 py-3">
        <div className="container mx-auto px-4 xl:px-8 max-w-7xl">
          <ol className="flex items-center gap-2 text-sm text-gray-500">
            <li><Link href="/" className="hover:text-sky transition-colors">{isEn ? "Home" : "Accueil"}</Link></li>
            <ChevronRight size={14} className="text-gray-300" />
            <li className="text-navy font-medium">{isEn ? "Cookie Policy" : "Politique Cookies"}</li>
          </ol>
        </div>
      </nav>

      <section className="bg-gradient-to-br from-navy to-sky/20 py-16">
        <div className="container mx-auto px-4 xl:px-8 max-w-7xl text-center">
          <h1 className="font-heading text-4xl sm:text-5xl font-extrabold text-white mb-4">
            {isEn ? "Cookie Policy" : "Politique Cookies"}
          </h1>
          <p className="text-gray-300">{isEn ? "Last updated: January 1, 2025" : "Dernière mise à jour : 01/01/2025"}</p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 xl:px-8 max-w-4xl">
          <div className="prose-kelenix space-y-10">
            <div>
              <h2>{isEn ? "1. What is a cookie?" : "1. Qu'est-ce qu'un cookie ?"}</h2>
              <p>
                {isEn
                  ? "A cookie is a small text file deposited on your device (computer, smartphone, tablet) when you visit a website. Cookies are widely used to make websites work, improve efficiency, and provide information to the site owners."
                  : "Un cookie est un petit fichier texte déposé sur votre appareil (ordinateur, smartphone, tablette) lors de votre visite sur un site web. Les cookies sont largement utilisés pour faire fonctionner les sites web, améliorer leur efficacité et fournir des informations aux propriétaires du site."}
              </p>
            </div>

            <div>
              <h2>{isEn ? "2. Cookies we use" : "2. Cookies que nous utilisons"}</h2>
              <p>
                {isEn
                  ? "The Kelenix site uses the following types of cookies:"
                  : "Le site Kelenix utilise les types de cookies suivants :"}
              </p>
            </div>
          </div>

          <div className="mt-8 space-y-4">
            {cookieTypes.map((ct) => (
              <div key={ct.nameFr} className="bg-neutral-light rounded-2xl p-6 border border-gray-100">
                <h3 className="font-heading font-bold text-navy text-lg mb-2">
                  {isEn ? ct.nameEn : ct.nameFr}
                </h3>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">{isEn ? ct.descEn : ct.descFr}</p>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-gray-400 font-semibold uppercase tracking-wide">
                      {isEn ? "Duration" : "Durée"}
                    </span>
                    <p className="text-navy font-semibold mt-0.5">{ct.duration}</p>
                  </div>
                  <div>
                    <span className="text-gray-400 font-semibold uppercase tracking-wide">
                      {isEn ? "Examples" : "Exemples"}
                    </span>
                    <p className="text-navy font-mono mt-0.5">{ct.examples}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="prose-kelenix space-y-10 mt-10">
            <div>
              <h2>{isEn ? "3. Managing your consent" : "3. Gestion de votre consentement"}</h2>
              <p>
                {isEn
                  ? "When you first visit our site, a banner allows you to accept, refuse or customize the use of cookies. You can change your preferences at any time by clicking on 'Cookie settings' in the footer."
                  : "Lors de votre première visite sur notre site, un bandeau vous permet d'accepter, de refuser ou de personnaliser l'utilisation des cookies. Vous pouvez modifier vos préférences à tout moment en cliquant sur « Paramètres cookies » dans le pied de page."}
              </p>
            </div>

            <div>
              <h2>{isEn ? "4. Disabling cookies in your browser" : "4. Désactivation dans votre navigateur"}</h2>
              <p>
                {isEn
                  ? "You can also configure your browser to block cookies. However, disabling certain cookies may affect the proper functioning of the site. Refer to your browser's documentation to manage cookie settings."
                  : "Vous pouvez également configurer votre navigateur pour bloquer les cookies. Cependant, la désactivation de certains cookies peut affecter le bon fonctionnement du site. Référez-vous à la documentation de votre navigateur pour gérer les paramètres de cookies."}
              </p>
            </div>

            <div>
              <h2>{isEn ? "5. Impact of refusing cookies" : "5. Impact du refus des cookies"}</h2>
              <p>
                {isEn
                  ? "Refusing non-essential cookies will not affect your access to the site's main features, but may limit certain functionalities such as content personalization."
                  : "Le refus des cookies non essentiels n'affectera pas votre accès aux fonctionnalités principales du site, mais peut limiter certaines fonctionnalités telles que la personnalisation du contenu."}
              </p>
            </div>

            <div>
              <h2>{isEn ? "6. Contact" : "6. Contact"}</h2>
              <p>
                {isEn
                  ? "For any questions regarding our use of cookies, contact us at: privacy@kelenix.com"
                  : "Pour toute question concernant notre utilisation des cookies, contactez-nous à : privacy@kelenix.com"}
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
