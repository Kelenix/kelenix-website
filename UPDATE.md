# Guide de mise à jour — Kelenix

## Workflow complet

### 1. Faire les modifications en local (Windows)

Modifie le code dans `c:\PROJECT PERSO\kelenix-website\` avec ton éditeur.

---

### 2. Uploader les fichiers sur le serveur

Ouvre PowerShell sur ton PC et envoie les fichiers modifiés :

```powershell
# Uploader tout le dossier src/
scp -r "c:\PROJECT PERSO\kelenix-website\src" root@69.62.116.243:/var/www/kelenix-website/

# Si tu as modifié next.config.js
scp "c:\PROJECT PERSO\kelenix-website\next.config.js" root@69.62.116.243:/var/www/kelenix-website/

# Si tu as modifié package.json (ajout de packages)
scp "c:\PROJECT PERSO\kelenix-website\package.json" root@69.62.116.243:/var/www/kelenix-website/
scp "c:\PROJECT PERSO\kelenix-website\package-lock.json" root@69.62.116.243:/var/www/kelenix-website/
```

---

### 3. Rebuilder sur le serveur

Connecte-toi en SSH :

```bash
ssh root@69.62.116.243
```

Puis :

```bash
cd /var/www/kelenix-website

# Si tu as ajouté de nouveaux packages
npm install --legacy-peer-deps

# Rebuilder le projet
npm run build

# Redémarrer l'application
pm2 restart kelenix
```

---

## Script de déploiement automatique (recommandé)

Un script est disponible sur le serveur : `/var/www/deploy.sh`

Pour l'utiliser après avoir uploadé les fichiers :

```bash
bash /var/www/deploy.sh
```

Ce script fait automatiquement : build + restart PM2.

---

## Via Git (meilleure solution long terme)

### Sur ton PC — pousser les modifications :

```bash
git add .
git commit -m "description de la modification"
git push
```

### Sur le serveur — récupérer et déployer :

```bash
cd /var/www/kelenix-website
git pull
npm run build
pm2 restart kelenix
```

Ou simplement :

```bash
bash /var/www/deploy.sh
```

---

## Commandes utiles sur le serveur

```bash
# Voir l'état de l'application
pm2 list

# Voir les logs en temps réel
pm2 logs kelenix

# Redémarrer sans rebuild
pm2 restart kelenix

# Voir l'état de Nginx
systemctl status nginx

# Recharger Nginx
systemctl reload nginx
```

---

## Informations du serveur

| Info | Valeur |
|------|--------|
| IP VPS | `69.62.116.243` |
| Domaine | `https://kelenix.com` |
| Admin | `https://kelenix.com/admin` |
| Dossier projet | `/var/www/kelenix-website` |
| Script deploy | `/var/www/deploy.sh` |
