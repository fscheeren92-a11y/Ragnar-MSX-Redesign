#!/bin/bash
# Instalador automatizado – Ragnar MSX Redesign
# Uso: bash install-redesign.sh
# Assume que o repositório foi clonado ou os arquivos estão no diretório atual
set -euo pipefail

DEST="/var/www/ragnar-app-msx"
TS=$(date +%Y%m%d-%H%M%S)
BACKUP="$DEST/backup-redesign-$TS"

echo "=== Backup integral ==="
mkdir -p "$BACKUP/msx"
cp -a "$DEST/msx/start.json" "$DEST/msx/plugin.html" "$DEST/msx/app.js" "$DEST/msx/app-r127.js" "$DEST/msx/panic-bridge.js" "$DEST/msx/media.php" "$BACKUP/msx/" 2>/dev/null || true

echo "=== Instalando redesign ==="
SRC_DIR="$(cd "$(dirname "$0")/../msx" && pwd)"
cp -f "$SRC_DIR/start.json" "$DEST/msx/start.json"
cp -f "$SRC_DIR/plugin.html" "$DEST/msx/plugin.html"
cp -f "$SRC_DIR/app.js" "$DEST/msx/app.js"
cp -f "$SRC_DIR/panic-bridge.js" "$DEST/msx/panic-bridge.js"
cp -f "$SRC_DIR/media.php" "$DEST/msx/media.php"

# Mantém o app-r127.js original como referência
cp -f "$SRC_DIR/app.js" "$DEST/msx/app-redesign.js"

echo "=== Concluído ==="
echo "Backup: $BACKUP"
echo "Teste o Start Parameter no MSX apontando para o novo start.json"
echo "Rollback: cp -a $BACKUP/msx/* $DEST/msx/"
