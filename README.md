# Ragnar MSX Redesign – Candidata Visual

**Repositório:** https://github.com/fscheeren92-a11y/Ragnar-MSX-Redesign

Candidata de redesign visual para o Ragnar App MSX.

## Base real
- Branches de referência no repositório privado `panic-cactus-msx`:
  - `release/ragnar-msx-r1.2.7`
  - `fix/ragnar-r127-vod-metadata`
  - `lab/ragnar-msx-r128-transporte`
- Produção: https://ragnarapp.sbs
- Resolver: https://painel.ragnarapp.sbs/api/resolve.php
- Source instalada: VPS 51.79.39.164 → `/var/www/ragnar-app-msx`

**NÃO usa a branch `main` (Panic Cactus).**

## O que esta candidata faz
- Padroniza `start.json`, `plugin.html` e estrutura do `app.js`
- Aplica o layout redesenhado (sidebar de ícones + destaque grande + linha de posters)
- Preserva a lógica dinâmica existente (login, catálogo, canais, séries, favoritos, busca, player)
- Inclui instalador, backup e rollback

## Arquivos principais
- `msx/start.json`
- `msx/plugin.html`
- `msx/app.js` (esqueleto pronto para receber a lógica real)
- `installer/install.sh`
- `docs/BACKUP_ROLLBACK.md`

## Instalação (na VPS)
```bash
cd /var/www/ragnar-app-msx
# Backup primeiro (ver docs/BACKUP_ROLLBACK.md)
bash /caminho/do/installer/install.sh
```

## Observações
- Canais e séries já reproduzem.
- Há falha conhecida na reprodução de filmes (investigar no backend/player).
- Esta é uma candidata visual. Testar em homologação antes de produção.
