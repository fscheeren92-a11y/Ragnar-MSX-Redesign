# Backup e Rollback

## Backup (executado pelo instalador)
O script `installer/install-redesign.sh` cria automaticamente:
`/var/www/ragnar-app-msx/backup-redesign-YYYYMMDD-HHMMSS`

## Rollback manual
```bash
cd /var/www/ragnar-app-msx
cp -a backup-redesign-*/msx/* msx/
systemctl reload php-fpm || true
```

Nenhuma alteração foi feita no Panic Cactus.
