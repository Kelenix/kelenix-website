# Guide de déploiement Kelenix — cPanel

## Prérequis

- Hébergeur cPanel avec support Node.js (v18+ ou v20+)
- Accès à phpMyAdmin ou MySQL via cPanel
- Domaine configuré (ex: kelenix.com)

---

## 1. Préparer la base de données MySQL

1. Dans cPanel → **MySQL Databases**
2. Créer une base de données : `kelenix_db`
3. Créer un utilisateur MySQL avec tous les privilèges sur cette base
4. Noter : `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`

---

## 2. Configurer les variables d'environnement

Copier `.env.example` en `.env.local` et remplir :

```env
DATABASE_URL="mysql://DB_USER:DB_PASSWORD@localhost:3306/kelenix_db"
NEXTAUTH_SECRET="une_cle_secrete_longue_et_aleatoire"
NEXTAUTH_URL="https://kelenix.com"
NEXT_PUBLIC_BASE_URL="https://kelenix.com"
```

Pour générer `NEXTAUTH_SECRET` :
```bash
openssl rand -base64 32
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
# Pousser le schéma Prisma vers MySQL
npx prisma db push

# Insérer les données initiales (services, projets, admin...)
npm run db:seed
```

L'utilisateur admin créé par le seed :
- **Email** : `admin@kelenix.com`
- **Mot de passe** : `Kelenix@Admin2024!`

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
