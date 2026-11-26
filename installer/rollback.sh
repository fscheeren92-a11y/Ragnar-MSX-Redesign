#!/bin/bash
# Rollback automático
set -euo pipefail
if [ -z "${1:-}" ]; then
  echo "Uso: bash rollback.sh /var/backups/ragnar-msx/redesign-YYYYMMDD-HHMMSS"
  exit 1
fi
BACKUP="$1"
DEST="/var/www/ragnar-app-msx/msx"
if [ ! -d "$BACKUP/msx" ]; then
  echo "ERRO: backup inválido"
  exit 1
fi
echo "Restaurando de $BACKUP ..."
cp -a "$BACKUP/msx/." "$DEST/"
echo "Rollback concluído."
