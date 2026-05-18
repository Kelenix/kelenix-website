# Guide de déploiement Kelenix — cPanel

## Prérequis

- Hébergeur cPanel avec support Node.js (v18+ ou v20+)
- Accès à PostgreSQL (via cPanel ou serveur externe)
- Domaine configuré (ex: kelenix.com)

---

## 1. Préparer la base de données PostgreSQL

### Option A — PostgreSQL sur le même serveur (SSH requis)
```bash
sudo -u postgres psql
CREATE DATABASE kelenix_db;
CREATE USER kelenix_user WITH ENCRYPTED PASSWORD 'votre_mot_de_passe';
GRANT ALL PRIVILEGES ON DATABASE kelenix_db TO kelenix_user;
\q
```

### Option B — PostgreSQL managé (Supabase, Neon, Railway…)
Créer une base de données et récupérer l'URL de connexion au format :
```
postgresql://USER:PASSWORD@HOST:5432/kelenix_db
```

---

## 2. Configurer les variables d'environnement

Copier `.env.example` en `.env.local` et remplir :

```env
DATABASE_URL="postgresql://kelenix_user:votre_mot_de_passe@localhost:5432/kelenix_db"
NEXTAUTH_SECRET="une_cle_secrete_longue_et_aleatoire"
NEXTAUTH_URL="https://kelenix.com"
NEXT_PUBLIC_BASE_URL="https://kelenix.com"
```

Pour générer `NEXTAUTH_SECRET` :
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"
```

---

## 3. Installer Node.js sur cPanel

1. cPanel → **Software** → **Setup Node.js App**
2. Créer une nouvelle application :
   - Node.js version : **18.x** ou **20.x**
   - Application mode : **Production**
   - Application root : `/home/USER/kelenix-website`
   - Application URL : `kelenix.com`
   - Application startup file : `server.js` (ou utiliser le PM2)
3. Cliquer sur **CREATE**

---

## 4. Uploader les fichiers

### Option A — Git (recommandé)
```bash
# Dans le terminal SSH cPanel
cd ~/
git clone https://github.com/votre-repo/kelenix-website.git
cd kelenix-website
```

### Option B — FTP/File Manager
Uploader tous les fichiers du projet dans `/home/USER/kelenix-website/`

---

## 5. Installer les dépendances et compiler

```bash
cd ~/kelenix-website
npm install
npm run build
```

---

## 6. Initialiser la base de données

```bash
# Pousser le schéma Prisma vers PostgreSQL
npx prisma db push

# Insérer les données initiales (services, projets, admin...)
# Personnaliser les credentials admin via variables d'env :
SEED_ADMIN_EMAIL="votre@email.com" SEED_ADMIN_PASSWORD="VotreMotDePasse!" npm run db:seed
```

> ⚠️ Changer le mot de passe immédiatement après le premier login sur `/admin`

---

## 7. Démarrer l'application

### Via cPanel Node.js App
Cliquer sur **Run JS Script** → `npm start` ou configurer le startup file.

### Via PM2 (recommandé si SSH disponible)
```bash
npm install -g pm2
pm2 start npm --name "kelenix" -- start
pm2 save
pm2 startup
```

---

## 8. Configurer le proxy Apache → Node.js

Si cPanel utilise Apache, modifier `.htaccess` pour activer le proxy :

```apache
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ http://127.0.0.1:3000/$1 [P,L]
```

Ou utiliser la configuration **Proxy** du cPanel Node.js App (automatique avec certains hébergeurs).

---

## 9. Vérifications post-déploiement

- [ ] Site accessible sur `https://kelenix.com`
- [ ] Redirection HTTP → HTTPS fonctionnelle
- [ ] Page d'accueil FR et EN chargent correctement
- [ ] Admin accessible sur `https://kelenix.com/admin`
- [ ] Formulaire de contact fonctionne
- [ ] Formulaire de devis fonctionne
- [ ] Inscription newsletter fonctionne
- [ ] Switcher FR/EN fonctionne

---

## 10. Mise à jour du site

```bash
cd ~/kelenix-website
git pull
npm install
npm run build
pm2 restart kelenix
```

---

## Dépannage

### Erreur Prisma "table does not exist"
```bash
npx prisma db push
npm run db:seed
```

### Erreur de connexion PostgreSQL
Vérifier que PostgreSQL est démarré et que `DATABASE_URL` est correct :
```bash
psql "$DATABASE_URL" -c "SELECT 1"
```

### Port 3000 déjà utilisé
Modifier `package.json` pour utiliser un autre port :
```json
"start": "next start -p 3001"
```

### Erreur `NEXTAUTH_SECRET`
Générer une nouvelle clé et mettre à jour `.env.local`.

### Logs en temps réel
```bash
pm2 logs kelenix
```
