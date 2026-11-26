#!/bin/bash
set -euo pipefail
DEST="/var/www/ragnar-app-msx"
BACKUP_ROOT="/var/backups/ragnar-msx"
TS=$(date +%Y%m%d-%H%M%S)
BACKUP="$BACKUP_ROOT/redesign-$TS"
SRC="$(cd "$(dirname "$0")/../msx" && pwd)"

echo "=== Validação prévia ==="
for f in start.json plugin.html app.js panic-bridge.js media.php; do
  if [ ! -s "$SRC/$f" ]; then echo "ERRO: $f ausente ou vazio"; exit 1; fi
  size=$(stat -c%s "$SRC/$f" 2>/dev/null || stat -f%z "$SRC/$f")
  if [ "$size" -lt 500 ]; then echo "ERRO: $f muito pequeno ($size bytes)"; exit 1; fi
done

echo "=== Backup integral fora do document root ==="
mkdir -p "$BACKUP" || { echo "ERRO: falha ao criar backup"; exit 1; }
cp -a "$DEST/msx" "$BACKUP/msx" || { echo "ERRO: falha no backup"; exit 1; }

echo "=== Instalação ==="
cp -f "$SRC/start.json" "$DEST/msx/"
cp -f "$SRC/plugin.html" "$DEST/msx/"
cp -f "$SRC/app.js" "$DEST/msx/"
cp -f "$SRC/panic-bridge.js" "$DEST/msx/"
cp -f "$SRC/media.php" "$DEST/msx/"

echo "Backup: $BACKUP"
echo "Rollback: cp -a $BACKUP/msx/* $DEST/msx/"
