# Kelenix — Site Web Officiel

Site web corporate de **Kelenix**, entreprise tech internationale spécialisée dans la transformation numérique, le développement logiciel sur mesure et l'intelligence artificielle.

> **Stack** : Next.js 16 · TypeScript · Tailwind CSS v4 · Prisma · MySQL · NextAuth v5 · next-intl (FR/EN)

---

## Sommaire

- [Aperçu](#aperçu)
- [Stack technique](#stack-technique)
- [Structure du projet](#structure-du-projet)
- [Installation](#installation)
- [Variables d'environnement](#variables-denvironnement)
- [Base de données](#base-de-données)
- [Développement](#développement)
- [Pages publiques](#pages-publiques)
- [Interface d'administration](#interface-dadministration)
- [API Routes](#api-routes)
- [Internationalisation](#internationalisation)
- [Identité visuelle](#identité-visuelle)
- [Build & Déploiement](#build--déploiement)
- [Sécurité](#sécurité)

---

## Aperçu

| Fonctionnalité | Détail |
|---|---|
| Pages publiques | 15 pages (accueil, services, portfolio, blog, contact…) |
| Administration | CMS complet — 11 modules de gestion |
| Langues | Français (défaut) + Anglais |
| Authentification | NextAuth v5 — session JWT |
| Base de données | MySQL via Prisma ORM |
| SEO | Metadata dynamique, sitemap, robots.txt, JSON-LD |

---

## Stack technique

| Technologie | Version | Rôle |
|---|---|---|
| **Next.js** | 16.2.6 | Framework React — App Router, Turbopack |
| **React** | 19 | UI |
| **TypeScript** | 5 | Typage statique |
| **Tailwind CSS** | 4 | Styles utilitaires (`@theme` CSS natif) |
| **Prisma** | 6 | ORM — accès base de données |
| **MySQL** | 8+ | Base de données relationnelle |
| **NextAuth** | v5 beta | Authentification admin |
| **next-intl** | 3.22 | Internationalisation FR/EN |
| **TipTap** | 2 | Éditeur WYSIWYG (blog admin) |
| **Lucide React** | 0.46 | Icônes |
| **Zod** | 3 | Validation des données |
| **Sharp** | 0.33 | Traitement d'images |

---

## Structure du projet

```
kelenix-website/
├── prisma/
│   ├── schema.prisma          # Modèles de données (12 modèles)
│   └── seed.ts                # Données initiales complètes
├── public/
│   └── logo.png               # Logo Kelenix (fond navy)
├── scripts/
│   └── remove-bg.mjs          # Utilitaire suppression fond logo
├── src/
│   ├── app/
│   │   ├── [locale]/          # Pages publiques (FR/EN)
│   │   │   ├── page.tsx                   # Accueil
│   │   │   ├── a-propos/
│   │   │   ├── services/ + [slug]/
│   │   │   ├── portfolio/ + [slug]/
│   │   │   ├── blog/ + [slug]/
│   │   │   ├── temoignages/
│   │   │   ├── contact/
│   │   │   ├── devis/
│   │   │   ├── faq/
│   │   │   ├── carrieres/
│   │   │   ├── partenaires/
│   │   │   └── (pages légales)
│   │   ├── admin/             # Interface d'administration
│   │   │   ├── page.tsx                   # Dashboard
│   │   │   ├── login/
│   │   │   ├── about/                     # Gestion page À propos
│   │   │   ├── blog/ + new/ + [id]/
│   │   │   ├── services/ + new/ + [id]/
│   │   │   ├── portfolio/ + new/ + [id]/
│   │   │   ├── testimonials/ + new/ + [id]/
│   │   │   ├── careers/ + new/ + [id]/    # Offres + candidatures
│   │   │   ├── partners/ + [id]/          # Demandes partenaires
│   │   │   ├── messages/
│   │   │   ├── newsletter/
│   │   │   └── settings/
│   │   └── api/
│   │       ├── auth/[...nextauth]/
│   │       ├── contact/
│   │       ├── devis/
│   │       ├── newsletter/subscribe/
│   │       ├── partners/
│   │       ├── careers/
│   │       └── admin/ (blog, services, portfolio, testimonials, careers, partners, about, settings)
│   ├── components/
│   │   ├── layout/ (Header, Footer, CookieBanner)
│   │   ├── home/  (Hero, Services, Portfolio, Blog, Testimonials)
│   │   ├── admin/ (AdminSidebar)
│   │   └── ui/    (WhatsAppButton, ScrollToTop)
│   ├── i18n/ (routing, navigation, request)
│   ├── messages/ (fr.json, en.json)
│   └── lib/ (prisma, auth, utils)
├── .env                       # DATABASE_URL pour Prisma CLI
├── .env.local                 # Variables Next.js (ne pas versionner)
├── .env.example               # Modèle des variables
├── DEPLOY.md                  # Guide déploiement cPanel
├── next.config.ts
├── tailwind.config.ts
└── README.md
```

---

## Installation

### Prérequis

- **Node.js** ≥ 18
- **MySQL** 8+
- **npm** ≥ 9

### Étapes

```bash
# 1. Cloner le dépôt
git clone https://github.com/djouakalionel4/kelenix-website.git
cd kelenix-website

# 2. Installer les dépendances
npm install

# 3. Configurer les variables d'environnement
cp .env.example .env.local
# Éditer .env.local avec vos valeurs

# 4. Créer le fichier .env pour Prisma
echo 'DATABASE_URL="mysql://root:@localhost:3306/kelenix_db"' > .env

# 5. Créer les tables et insérer les données initiales
npm run db:push
npm run db:seed

# 6. Lancer le serveur de développement
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000)

---

## Variables d'environnement

Copier `.env.example` en `.env.local` :

| Variable | Description | Exemple |
|---|---|---|
| `DATABASE_URL` | URL de connexion MySQL | `mysql://user:pass@localhost:3306/kelenix_db` |
| `NEXTAUTH_SECRET` | Clé secrète JWT (min. 32 chars) | `openssl rand -base64 32` |
| `NEXTAUTH_URL` | URL publique du site | `https://kelenix.com` |
| `NEXT_PUBLIC_BASE_URL` | URL de base (SEO, sitemap) | `https://kelenix.com` |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Numéro WhatsApp (sans +) | `33612345678` |
| `SMTP_HOST` | Serveur SMTP | `smtp.gmail.com` |
| `SMTP_PORT` | Port SMTP | `587` |
| `SMTP_USER` | Email SMTP | `noreply@kelenix.com` |
| `SMTP_PASS` | Mot de passe SMTP | `••••••••` |

> **Note** : Prisma lit `.env`, Next.js lit `.env.local`. Les deux doivent contenir `DATABASE_URL`.

---

## Base de données

### Modèles Prisma

| Modèle | Table | Description |
|---|---|---|
| `User` | `users` | Administrateurs |
| `Service` | `services` | Services proposés |
| `Project` | `projects` | Portfolio |
| `BlogPost` | `blog_posts` | Articles de blog |
| `Testimonial` | `testimonials` | Témoignages clients |
| `ContactMessage` | `contact_messages` | Messages formulaire contact |
| `QuoteRequest` | `quote_requests` | Demandes de devis |
| `Newsletter` | `newsletter` | Abonnés newsletter |
| `SiteSettings` | `site_settings` | Paramètres + contenu À propos |
| `JobPosting` | `job_postings` | Offres d'emploi |
| `JobApplication` | `job_applications` | Candidatures reçues |
| `PartnerRequest` | `partner_requests` | Demandes de partenariat |

### Commandes

```bash
npm run db:push       # Créer/synchroniser les tables
npm run db:seed       # Insérer les données initiales
npm run db:studio     # Interface visuelle Prisma Studio
npm run db:migrate    # Migrations production
npm run db:generate   # Régénérer le client Prisma
```

### Données du seed

- 1 admin (`admin@kelenix.com` / `Kelenix@Admin2024!`)
- 7 services, 6 projets, 5 témoignages, 5 articles de blog
- 3 offres d'emploi
- Contenu À propos (FR/EN) — histoire, mission, vision, valeurs
- Paramètres du site

---

## Développement

```bash
npm run dev      # Serveur dev Turbopack (port 3000)
npm run build    # Build production
npm run start    # Serveur production
npm run lint     # ESLint
```

---

## Pages publiques

| Route | Description |
|---|---|
| `/` | Accueil — Hero centré, services, portfolio, témoignages, blog |
| `/a-propos` | Histoire, mission, valeurs, équipe |
| `/services` | Grille des 7 services |
| `/services/[slug]` | Détail service |
| `/portfolio` | Grille filtrée |
| `/portfolio/[slug]` | Détail projet |
| `/blog` | Liste articles |
| `/blog/[slug]` | Article complet |
| `/temoignages` | Tous les témoignages |
| `/contact` | Formulaire de contact |
| `/devis` | Formulaire devis multi-étapes |
| `/faq` | Questions fréquentes |
| `/carrieres` | Offres d'emploi + candidature |
| `/partenaires` | Programme partenaires |
| Pages légales | mentions, confidentialité, CGU, cookies |

---

## Interface d'administration

Accessible sur `/admin` — authentification requise.

### Identifiants par défaut

```
Email        : admin@kelenix.com
Mot de passe : Kelenix@Admin2024!
```

> Changer le mot de passe après le premier login en production.

### Modules (11 au total)

| Module | Route | Description |
|---|---|---|
| **Dashboard** | `/admin` | Stats, activité, raccourcis |
| **À propos** | `/admin/about` | Éditeur FR/EN : histoire, mission, vision, valeurs |
| **Blog** | `/admin/blog` | CRUD articles + éditeur TipTap |
| **Services** | `/admin/services` | CRUD services |
| **Portfolio** | `/admin/portfolio` | CRUD projets |
| **Témoignages** | `/admin/testimonials` | CRUD + note étoiles |
| **Carrières** | `/admin/careers` | Offres d'emploi + candidatures reçues |
| **Partenaires** | `/admin/partners` | Demandes partenariat + statuts |
| **Messages** | `/admin/messages` | Contacts + devis |
| **Newsletter** | `/admin/newsletter` | Abonnés + export |
| **Paramètres** | `/admin/settings` | Infos entreprise, SEO, réseaux |

---

## API Routes

### Publiques

| Méthode | Route | Description |
|---|---|---|
| `POST` | `/api/contact` | Formulaire contact |
| `POST` | `/api/devis` | Demande de devis |
| `POST` | `/api/newsletter/subscribe` | Inscription newsletter |
| `POST` | `/api/partners` | Demande de partenariat |
| `POST` | `/api/careers` | Candidature emploi |

### Admin

| Méthode | Route | Description |
|---|---|---|
| `POST/PUT/DELETE` | `/api/admin/blog/[id]` | CRUD articles |
| `POST/PUT/DELETE` | `/api/admin/services/[id]` | CRUD services |
| `POST/PUT/DELETE` | `/api/admin/portfolio/[id]` | CRUD projets |
| `POST/PUT/DELETE` | `/api/admin/testimonials/[id]` | CRUD témoignages |
| `POST/PUT/DELETE` | `/api/admin/careers/[id]` | CRUD offres d'emploi |
| `PUT` | `/api/admin/careers/application/[id]` | Statut candidature |
| `PUT` | `/api/admin/partners/[id]` | Statut demande partenaire |
| `POST` | `/api/admin/about` | Sauvegarder contenu À propos |
| `GET/PUT` | `/api/admin/settings` | Paramètres globaux |

---

## Internationalisation

- **Français** (défaut) et **Anglais** via `next-intl`
- Fichiers : `src/messages/fr.json` et `src/messages/en.json`
- Namespaces : `nav`, `hero`, `services`, `portfolio`, `blog`, `testimonials`, `contact`, `quote`, `faq`, `careers`, `partners`, `footer`, `about`, `common`

```
/ → redirige vers /fr
/fr/services → français
/en/services → anglais
```

---

## Identité visuelle

### Palette

| Classe Tailwind | Hex | Usage |
|---|---|---|
| `bg-sky` / `text-sky` | `#2FA8FF` | Accents, liens, boutons |
| `bg-gold` / `text-gold` | `#FFC107` | CTA principal |
| `bg-navy` / `text-navy` | `#0B1F3A` | Fonds sombres, textes |
| `bg-neutral-light` | `#F5F7FA` | Fonds de sections |

> Les couleurs sont définies via `@theme` dans `src/app/globals.css` (Tailwind v4).

### Typographie

| Police | Classe | Usage |
|---|---|---|
| **Montserrat** | `font-heading` | Titres |
| **Open Sans** | `font-body` | Corps de texte |

---

## Build & Déploiement

```bash
npm run build && npm run start
```

Guide complet cPanel : [DEPLOY.md](./DEPLOY.md)

Variables production :
```bash
NEXTAUTH_URL=https://kelenix.com
NEXT_PUBLIC_BASE_URL=https://kelenix.com
NEXTAUTH_SECRET=<openssl rand -base64 32>
```

---

## Sécurité

- Mots de passe hashés avec `bcryptjs` (12 rounds)
- Sessions JWT via NextAuth v5
- Validation Zod sur toutes les API routes
- Headers de sécurité : `X-Frame-Options`, `HSTS`, `CSP`, `nosniff`
- Protection SQL injection via Prisma ORM

---

## Licence

Propriété de **Kelenix** — tous droits réservés.
