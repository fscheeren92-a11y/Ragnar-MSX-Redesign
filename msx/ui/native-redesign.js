/* Versão redesenhada do gerador de UI nativa MSX.
   Baseada em panic-cactus-msx/msx/ui/native.js
   Foco: home com destaque grande + linha de posters.
*/
(function(root){'use strict';
var U={}, origin='', VER='redesign-1.0';
U.configure=function(o){origin=o;};
U.page=function(items,focus){
  var i;for(i=0;i<items.length;i++)if(items[i].id===focus)items[i].focus=true;
  items.unshift({id:'backdrop',type:'space',layout:'0,0,16,8',color:'#010819'});
  return {name:'Ragnar Redesign',version:VER,type:'pages',pages:[{items:items}]};
};
U.home=function(s){
  var a=[];
  // Sidebar icons (left)
  a.push({id:'icon-home',type:'space',layout:'0,0,1,1',icon:'home',iconSize:'medium',color:'transparent'});
  a.push({id:'icon-tv',type:'space',layout:'0,1,1,1',icon:'live-tv',iconSize:'medium',color:'transparent'});
  a.push({id:'icon-movie',type:'space',layout:'0,2,1,1',icon:'movie',iconSize:'medium',color:'transparent'});
  a.push({id:'icon-search',type:'space',layout:'0,3,1,1',icon:'search',iconSize:'medium',color:'transparent'});
  a.push({id:'icon-settings',type:'space',layout:'0,4,1,1',icon:'settings',iconSize:'medium',color:'transparent'});

  // Featured teaser
  a.push({
    id:'featured',type:'teaser',layout:'1,0,15,5',
    title:'Magical Explorer (2026)',
    titleHeader:'SÉRIE EM DESTAQUE',
    titleFooter:'Um jogador apaixonado por conteúdo erótico decide se tornar o galã mais poderoso...',
    image:origin+'/assets/featured.jpg',
    imageFiller:'height-right',
    badge:'2026',
    tag:'Animação',
    tagColor:'msx-yellow'
  });

  a.push({id:'btn-play',type:'button',layout:'1,5,3,1',label:'VER EPISÓDIOS',color:'msx-yellow'});
  a.push({id:'btn-list',type:'button',layout:'4,5,3,1',label:'+ MINHA LISTA',color:'msx-glass'});

  // Poster row (example)
  var posters=['+Velozes','A Espreita','A Múmia','2012','Blade','Déjà Vu'];
  for(var j=0;j<posters.length;j++){
    a.push({
      id:'poster-'+j,type:'default',layout:(1+j*2)+',6,2,2',
      image:origin+'/assets/poster'+j+'.jpg',
      imageFiller:'cover',
      titleFooter:posters[j],
      round:true
    });
  }

  return U.page(a,'btn-play');
};
root.RagnarUI=U;
}(typeof window!=='undefined'?window:globalThis));
