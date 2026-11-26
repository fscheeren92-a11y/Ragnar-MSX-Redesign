#!/bin/bash
# Ragnar MSX Redesign – Instalador único
# Uso na VPS: bash install-redesign.sh
# Lê o app.js atual, aplica o redesign e faz backup + rollback automático
set -euo pipefail

DEST="/var/www/ragnar-app-msx"
MSX="$DEST/msx"
BACKUP_ROOT="/var/backups/ragnar-msx"
TS=$(date +%Y%m%d-%H%M%S)
BACKUP="$BACKUP_ROOT/redesign-$TS"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "=== Validação prévia ==="
if [ ! -f "$MSX/app.js" ] || [ ! -s "$MSX/app.js" ]; then
  echo "ERRO: app.js atual não encontrado ou vazio em $MSX"
  exit 1
fi
if [ ! -f "$MSX/plugin.html" ]; then
  echo "ERRO: plugin.html não encontrado"
  exit 1
fi

echo "=== Backup integral fora do document root ==="
mkdir -p "$BACKUP" || { echo "ERRO: falha ao criar diretório de backup"; exit 1; }
cp -a "$MSX" "$BACKUP/msx" || { echo "ERRO: falha no backup"; exit 1; }
echo "Backup criado em: $BACKUP"

echo "=== Aplicando redesign visual sobre a SOURCE atual ==="
python3 "$SCRIPT_DIR/apply_redesign.py" "$MSX/app.js" "$MSX/app.js.new" || {
  echo "ERRO: falha ao aplicar redesign"
  exit 1
}

# Validação do resultado
if [ ! -s "$MSX/app.js.new" ]; then
  echo "ERRO: app.js redesenhado ficou vazio"
  exit 1
fi
SIZE_OLD=$(stat -c%s "$MSX/app.js" 2>/dev/null || stat -f%z "$MSX/app.js")
SIZE_NEW=$(stat -c%s "$MSX/app.js.new" 2>/dev/null || stat -f%z "$MSX/app.js.new")
if [ "$SIZE_NEW" -lt $((SIZE_OLD / 2)) ]; then
  echo "ERRO: app.js redesenhado muito menor que o original (possível perda de lógica)"
  exit 1
fi

mv "$MSX/app.js.new" "$MSX/app.js"

# Garante plugin.html permanente
cat > "$MSX/plugin.html" << 'EOF'
<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="referrer" content="no-referrer">
  <title>Ragnar App MSX Redesign</title>
  <script src="https://msx.benzac.de/js/tvx-plugin.min.js"></script>
  <script src="panic-bridge.js"></script>
  <script src="app.js"></script>
</head>
<body></body>
</html>
EOF

echo "=== Redesign aplicado com sucesso ==="
echo "Backup: $BACKUP"
echo "Para rollback: bash $SCRIPT_DIR/rollback.sh $BACKUP"
