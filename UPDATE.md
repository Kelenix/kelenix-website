# Mettre à jour le site

## Étape 1 — Sur ton PC

```bash
git add .
git commit -m "description"
git push
```

## Étape 2 — Sur le serveur SSH

```bash
ssh root@69.62.116.243
```

## Étape 3 — Sur le serveur :

```bash
cd /var/www/kelenix-website
git pull
npx prisma db push
npm run build
pm2 restart kelenix
```
