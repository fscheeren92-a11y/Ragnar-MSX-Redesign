# Backup e Rollback – Ragnar MSX Redesign

## Backup (antes de instalar)
```bash
cd /var/www/ragnar-app-msx
mkdir -p backup-pre-redesign
cp -a msx/start.json msx/plugin.html msx/app.js msx/app-r127.js backup-pre-redesign/
```

## Rollback
```bash
cd /var/www/ragnar-app-msx
cp -a backup-pre-redesign/* msx/
# ou use o backup gerado pelo install.sh
```

## Notas
- Não altere nada no repositório privado Panic Cactus.
- Teste primeiro em ambiente de homologação.
- Falha conhecida: reprodução de filmes (investigar no player/backend).
