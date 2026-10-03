# Mettre à jour le site

## Déploiement automatique (CI/CD)

Le site se déploie **tout seul** à chaque `push` sur la branche `master`,
via GitHub Actions (`.github/workflows/deploy.yml`).

```bash
git add .
git commit -m "description"
git push
```

C'est tout. GitHub se connecte en SSH au VPS et exécute :
`git reset --hard origin/master` → `npm ci` → `prisma generate` →
`prisma db push` → `npm run build` → `pm2 reload`.

Suivi des déploiements : onglet **Actions** du dépôt GitHub.

> ⚠️ Un changement de schéma Prisma **destructeur** (suppression de colonne/table)
> fait échouer le déploiement volontairement, pour éviter toute perte de données.
> Dans ce cas, applique-le manuellement sur le serveur.

## Configuration requise (une seule fois)

Secrets à définir dans GitHub → Settings → Secrets and variables → Actions :

- `VPS_HOST` = `69.62.116.243`
- `VPS_USER` = `root`
- `VPS_SSH_KEY` = clé privée SSH autorisée sur le serveur
- `VPS_PORT` = `22` (optionnel)

## Déploiement manuel (secours)

Si besoin de déployer à la main :

```bash
ssh root@69.62.116.243
cd /var/www/kelenix-website && git pull && npm ci && npx prisma db push && npm run build && (pm2 reload kelenix || pm2 start npm --name kelenix -- start) && pm2 save
```
