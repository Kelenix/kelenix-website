# Mettre à jour le site

## Étape 1 — Sur ton PC

```bash
git add .
git commit -m "description"
git push
```

## Étape 2 — Sur le serveur SSH

```bash
cd /var/www/kelenix-website
git pull
npm run build
pm2 restart kelenix
```
