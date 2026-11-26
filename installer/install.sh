#!/bin/bash
# Instalador da candidata Ragnar MSX Redesign
# Uso na VPS: bash install.sh
set -e

DEST="/var/www/ragnar-app-msx"
BACKUP="$DEST/backup-redesign-$(date +%Y%m%d-%H%M%S)"

echo "=== Backup do estado atual ==="
mkdir -p "$BACKUP"
cp -a "$DEST/msx/start.json" "$DEST/msx/plugin.html" "$DEST/msx/app.js" "$BACKUP/" 2>/dev/null || true

echo "=== Copiando candidata ==="
# Ajuste o caminho de origem conforme onde você baixou o repositório
SRC="$(dirname "$0")/../msx"
cp -f "$SRC/start.json" "$DEST/msx/"
cp -f "$SRC/plugin.html" "$DEST/msx/"
cp -f "$SRC/app.js" "$DEST/msx/"

echo "=== Pronto ==="
echo "Backup em: $BACKUP"
echo "Reinicie o PHP-FPM / Nginx se necessário e teste no MSX."
