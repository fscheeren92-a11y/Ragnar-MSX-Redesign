#!/bin/bash
# Instalador seguro – valida antes de tocar em produção
# Backup fora do document root
set -euo pipefail

DEST="/var/www/ragnar-app-msx"
BACKUP_ROOT="/var/backups/ragnar-msx"
TS=$(date +%Y%m%d-%H%M%S)
BACKUP="$BACKUP_ROOT/redesign-$TS"
SRC="$(cd "$(dirname "$0")/../msx" && pwd)"

echo "=== Validação prévia ==="
required=("$SRC/start.json" "$SRC/plugin.html" "$SRC/app.js" "$SRC/panic-bridge.js" "$SRC/media.php" "$SRC/ui/native.js")
for f in "${required[@]}"; do
  if [ ! -s "$f" ]; then
    echo "ERRO: arquivo ausente ou vazio: $f"
    exit 1
  fi
  size=$(stat -c%s "$f" 2>/dev/null || stat -f%z "$f")
  if [ "$size" -lt 200 ]; then
    echo "ERRO: arquivo muito pequeno (possível placeholder): $f ($size bytes)"
    exit 1
  fi
done

echo "=== Backup integral fora do document root ==="
mkdir -p "$BACKUP"
cp -a "$DEST/msx" "$BACKUP/msx" 2>/dev/null || true
cp -a "$DEST/integration" "$BACKUP/integration" 2>/dev/null || true

echo "=== Instalação ==="
cp -f "$SRC/start.json" "$DEST/msx/"
cp -f "$SRC/plugin.html" "$DEST/msx/"
cp -f "$SRC/app.js" "$DEST/msx/"
cp -f "$SRC/panic-bridge.js" "$DEST/msx/"
cp -f "$SRC/media.php" "$DEST/msx/"
mkdir -p "$DEST/msx/ui"
cp -f "$SRC/ui/native.js" "$DEST/msx/ui/"

echo "=== Concluído ==="
echo "Backup: $BACKUP"
echo "Rollback: cp -a $BACKUP/msx/* $DEST/msx/"
