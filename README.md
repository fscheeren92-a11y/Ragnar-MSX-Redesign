# Ragnar MSX Redesign

**Link:** https://github.com/fscheeren92-a11y/Ragnar-MSX-Redesign

Redesign do layout do Panic Cactus MSX.

## O que é
Versão com layout melhorado (destaque grande + linha de posters + ícones na esquerda).

A lógica continua dinâmica (interaction plugin + chamadas ao backend igual ao original).
Nada é estático de verdade — os dados de canais, filmes e séries vêm do serviço (service.php / API) como no panic-cactus-msx.

## Arquivos principais
- `msx/app.html` → ponto de entrada do interaction plugin
- `msx/ui/native.js` → gerador do layout nativo (home com destaque + posters)
- `msx/app.js` → controlador (login, catálogo, playback — mesma ideia do original)

## Como usar
1. Hospede os arquivos em um servidor (igual ao panic-cactus-msx).
2. No Media Station X, coloque o Start Parameter apontando para o `msx/start.json` ou direto no interaction.
3. O backend (login Xtream, catalog, media) precisa estar rodando no mesmo domínio ou configurado.

Baseado em: https://github.com/fscheeren92-a11y/panic-cactus-msx
