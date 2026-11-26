# Ragnar MSX Redesign – Instalador Único

## Como instalar (um comando na VPS)

```bash
bash /caminho/para/Ragnar-MSX-Redesign/installer/install-redesign.sh
```

O script:
1. Valida que o `app.js` atual existe em `/var/www/ragnar-app-msx/msx/`.
2. Faz backup integral em `/var/backups/ragnar-msx/redesign-TIMESTAMP`.
3. Aplica automaticamente o redesign visual (paleta azul-escuro + dourado, destaque, fichas compactas) sobre a lógica existente.
4. Mantém `plugin.html` e `app.js` como entrada permanente.
5. Não altera `panic-bridge.js`, `media.php`, backend ou resolver.
6. Aborta se a validação falhar.

## Rollback
```bash
bash installer/rollback.sh /var/backups/ragnar-msx/redesign-YYYYMMDD-HHMMSS
```

Nenhuma alteração no Panic Cactus.
