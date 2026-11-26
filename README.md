# Ragnar MSX Redesign – SOURCE COMPLETA E FUNCIONAL

**Repositório:** https://github.com/fscheeren92-a11y/Ragnar-MSX-Redesign

Aplicativo MSX completo, integrado à infraestrutura real do Ragnar.

## Base
- Lógica real extraída das branches:
  - `release/ragnar-msx-r1.2.7`
  - `fix/ragnar-r127-vod-metadata`
  - `lab/ragnar-msx-r128-transporte` (app-r127.js + instaladores)
- Produção: https://ragnarapp.sbs
- Resolver: https://painel.ragnarapp.sbs/api/resolve.php
- VPS: 51.79.39.164 → `/var/www/ragnar-app-msx`

**Não utiliza a branch main (Panic Cactus).**

## O que está implementado (lógica real)
- Login por código + usuário + senha (Xtream)
- Sessão persistente
- Home, categorias, catálogo completo
- Reprodução de canais, filmes e séries
- Player, mini-player, fullscreen
- EPG
- Busca
- Favoritos e recentes
- Continuar assistindo
- Temporadas e episódios
- Sinopses, capas e metadados reais
- Navegação DPAD e rolagem
- Configurações e conta
- Identidade visual premium azul-escuro + dourado

## Arquivos permanentes
- `msx/start.json`
- `msx/plugin.html`
- `msx/app.js` → lógica completa baseada em app-r127.js
- `msx/panic-bridge.js`
- `msx/media.php`

## Instalação em produção
```bash
# Na VPS
cd /var/www/ragnar-app-msx
bash /caminho/para/installer/install-redesign.sh
```

O instalador faz backup integral e substitui apenas os arquivos do redesign.

## Falha conhecida (filmes)
Canais e séries reproduzem. Filmes apresentam falha de reprodução em algumas plataformas. Investigar no player nativo / formato de container (ver CHANGELOG).

## Testes
- Testes de sintaxe e estrutura: executados localmente.
- Testes em aparelho real (MSX / TV): pendentes de homologação pelo usuário.
