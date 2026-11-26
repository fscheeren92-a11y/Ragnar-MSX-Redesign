# Ragnar MSX Redesign

Versão redesenhada do layout baseada no projeto **panic-cactus-msx**.

## Objetivo
Manter a lógica (login, catálogo Xtream, interaction plugin) e melhorar o visual da home e do catálogo:

- Sidebar com ícones
- Destaque grande (teaser) no topo
- Linha horizontal de posters (filmes/séries)
- Mais espaçamento e hierarquia visual

## Como usar
Este repositório é uma base de redesign. Para integrar no panic-cactus-msx:

1. Substitua / adapte `msx/ui/native.js` com a função `U.home` e `U.catalog` novas.
2. Ajuste cores, imagens e textos conforme o design desejado.

Arquivos principais:
- `msx/ui/native.js` → gerador do layout nativo MSX (versão redesenhada)
- `msx/home-static.json` → exemplo estático do layout de destaque + biblioteca

Base original: https://github.com/fscheeren92-a11y/panic-cactus-msx
