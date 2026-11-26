/* Dynamic UI generator for Ragnar MSX Redesign.
   Layout: sidebar icons + featured teaser + horizontal poster row.
   Data comes from the interaction controller (app.js) + backend.
*/
(function(root){'use strict';
var U={}, origin='', VER='1.0.0';
U.configure=function(o){origin=o;};
U.action=function(id){return 'execute:request:interaction:'+id;};
U.page=function(items,focus){
  var i;for(i=0;i<items.length;i++)if(items[i].id===focus)items[i].focus=true;
  items.unshift({id:'backdrop',type:'space',layout:'0,0,16,8',color:'#010819'});
  return {name:'Ragnar Redesign',version:VER,flag:'ragnar_portal',type:'pages',compress:true,cache:false,pages:[{items:items}]};
};
U.home=function(s){
  var a=[];
  // Sidebar icons
  a.push({id:'icon-home',type:'space',layout:'0,0,1,1',icon:'home',iconSize:'medium',color:'transparent',action:U.action('home')});
  a.push({id:'icon-live',type:'space',layout:'0,1,1,1',icon:'live-tv',iconSize:'medium',color:'transparent',action:U.action('kind-live')});
  a.push({id:'icon-movies',type:'space',layout:'0,2,1,1',icon:'movie',iconSize:'medium',color:'transparent',action:U.action('kind-movies')});
  a.push({id:'icon-series',type:'space',layout:'0,3,1,1',icon:'video-library',iconSize:'medium',color:'transparent',action:U.action('kind-series')});
  a.push({id:'icon-search',type:'space',layout:'0,4,1,1',icon:'search',iconSize:'medium',color:'transparent'});
  a.push({id:'icon-settings',type:'space',layout:'0,5,1,1',icon:'settings',iconSize:'medium',color:'transparent',action:U.action('settings')});

  // Featured (example — replace with real data from s.featured if available)
  var feat=s.featured||{title:'Magical Explorer (2026)',header:'SÉRIE EM DESTAQUE',footer:'Um jogador apaixonado por conteúdo erótico...',image:origin+'/assets/featured.jpg'};
  a.push({
    id:'featured',type:'teaser',layout:'1,0,15,5',
    title:feat.title,
    titleHeader:feat.header,
    titleFooter:feat.footer,
    image:feat.image,
    imageFiller:'height-right',
    badge:'2026',
    tag:'Animação',
    tagColor:'msx-yellow'
  });

  a.push({id:'btn-play',type:'button',layout:'1,5,3,1',label:'VER EPISÓDIOS',color:'msx-yellow',action:U.action('play-featured')});
  a.push({id:'btn-list',type:'button',layout:'4,5,3,1',label:'+ MINHA LISTA',color:'msx-glass',action:U.action('favorite')});

  // Dynamic poster row (from s.items if present, else placeholders)
  var items=s.items||[{name:'+Velozes'},{name:'A Espreita'},{name:'A Múmia'},{name:'2012'},{name:'Blade'},{name:'Déjà Vu'}];
  for(var j=0;j<Math.min(items.length,7);j++){
    var it=items[j];
    a.push({
      id:'poster-'+j,type:'default',layout:(1+j*2)+',6,2,2',
      image:it.image||null,
      imageFiller:'cover',
      titleFooter:it.name||'',
      round:true,
      action:U.action('item-'+j)
    });
  }

  return U.page(a,'btn-play');
};
// Catalog, detail, login etc. can be expanded the same way as original native.js
U.catalog=function(s){return U.home(s);}; // temporary fallback
U.login=function(s){return U.home(s);};
root.RagnarUI=U;
if(typeof module!=='undefined')module.exports=U;
}(typeof window!=='undefined'?window:globalThis));
