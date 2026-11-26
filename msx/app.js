/* Ragnar MSX Redesign – Candidata Visual
   Layout: sidebar ícones + destaque grande + linha de posters.
   Integrar com a lógica real das branches Ragnar (não usar main/Panic Cactus).
   Backend: https://ragnarapp.sbs + resolver https://painel.ragnarapp.sbs/api/resolve.php
*/
(function(w){
  'use strict';
  var plugin = w.TVXInteractionPlugin;
  var base = w.location.protocol + '//' + w.location.host;

  // TODO: colar/adaptar aqui a lógica completa do app.js das branches
  // release/ragnar-msx-r1.2.7 ou lab/ragnar-msx-r128-transporte
  // Mantendo as funções de API, login, catalog, playback, favoritos, busca.

  function currentHome() {
    // Exemplo do layout redesenhado (substituir pelos dados reais do backend)
    return {
      name: 'Ragnar App',
      version: '1.3.0-redesign',
      flag: 'ragnar-page',
      type: 'pages',
      background: base + '/msx/ragnar-background.png',
      pages: [{
        items: [
          // Sidebar icons
          {id:'nav-home', type:'space', layout:'0,0,1,1', icon:'home', iconSize:'medium', color:'transparent', action:'content:request:interaction:home'},
          {id:'nav-live', type:'space', layout:'0,1,1,1', icon:'live-tv', iconSize:'medium', color:'transparent', action:'content:request:interaction:categories:live'},
          {id:'nav-movies', type:'space', layout:'0,2,1,1', icon:'movie', iconSize:'medium', color:'transparent', action:'content:request:interaction:categories:movies'},
          {id:'nav-series', type:'space', layout:'0,3,1,1', icon:'video-library', iconSize:'medium', color:'transparent', action:'content:request:interaction:categories:series'},
          {id:'nav-search', type:'space', layout:'0,4,1,1', icon:'search', iconSize:'medium', color:'transparent'},
          {id:'nav-fav', type:'space', layout:'0,5,1,1', icon:'favorite', iconSize:'medium', color:'transparent'},
          {id:'nav-settings', type:'space', layout:'0,6,1,1', icon:'settings', iconSize:'medium', color:'transparent'},

          // Featured teaser (puxar do backend)
          {
            id: 'featured',
            type: 'teaser',
            layout: '1,0,15,5',
            title: 'Magical Explorer (2026)',
            titleHeader: 'SÉRIE EM DESTAQUE',
            titleFooter: 'Substituir por dados reais do catálogo',
            image: base + '/msx/featured-placeholder.jpg',
            imageFiller: 'height-right',
            badge: '2026',
            tag: 'Animação',
            tagColor: 'msx-yellow'
          },
          {id:'btn-play', type:'button', layout:'1,5,3,1', label:'VER EPISÓDIOS', color:'msx-yellow'},
          {id:'btn-list', type:'button', layout:'4,5,3,1', label:'+ MINHA LISTA', color:'msx-glass'},

          // Poster rail (preencher dinamicamente)
          // Exemplo estático — trocar por loop dos itens reais
          {id:'poster-0', type:'default', layout:'1,6,2,2', image:base+'/msx/poster0.jpg', imageFiller:'cover', titleFooter:'Filme 1', round:true},
          {id:'poster-1', type:'default', layout:'3,6,2,2', image:base+'/msx/poster1.jpg', imageFiller:'cover', titleFooter:'Filme 2', round:true},
          {id:'poster-2', type:'default', layout:'5,6,2,2', image:base+'/msx/poster2.jpg', imageFiller:'cover', titleFooter:'Filme 3', round:true}
        ]
      }]
    };
  }

  function Handler() {
    this.init = function() {};
    this.ready = function() {};
    this.handleRequest = function(id, data, cb) {
      // Encaminhar para a lógica real (login, catalog, play, etc.)
      if (id === 'init' || id === 'home' || id === 'render') {
        cb(currentHome());
        return;
      }
      cb({action: 'info:Integrar lógica completa do Ragnar aqui'});
    };
    this.handleEvent = function() {};
  }

  if (plugin) plugin.init(new Handler());
})(window);
