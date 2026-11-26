/* Redesign visual Ragnar MSX – premium dark blue + gold
   Featured teaser + compact poster cards + sidebar icons
   Used by app.js with real data from PanicBridge
*/
(function(root){
 'use strict';
 var U={};
 U.page=function(items,focus){
  var i;for(i=0;i<items.length;i++)if(items[i].id===focus)items[i].focus=true;
  return {name:'Ragnar App',version:'1.3.0-redesign',flag:'ragnar-page',type:'pages',compress:true,cache:false,
   background:'#071B29',pages:[{items:items}]};
 };
 U.home=function(s){
  var a=[],base=s.base||'';
  // Sidebar icons
  a.push({id:'nav-home',type:'space',layout:'0,0,1,1',icon:'home',iconSize:'medium',color:'transparent',action:'content:request:interaction:home'});
  a.push({id:'nav-live',type:'space',layout:'0,1,1,1',icon:'live-tv',iconSize:'medium',color:'transparent',action:'content:request:interaction:categories:live'});
  a.push({id:'nav-movies',type:'space',layout:'0,2,1,1',icon:'movie',iconSize:'medium',color:'transparent',action:'content:request:interaction:categories:movies'});
  a.push({id:'nav-series',type:'space',layout:'0,3,1,1',icon:'video-library',iconSize:'medium',color:'transparent',action:'content:request:interaction:categories:series'});
  a.push({id:'nav-search',type:'space',layout:'0,4,1,1',icon:'search',iconSize:'medium',color:'transparent',action:'content:request:interaction:search:movies'});
  a.push({id:'nav-fav',type:'space',layout:'0,5,1,1',icon:'favorite',iconSize:'medium',color:'transparent',action:'content:request:interaction:saved:favorites'});
  a.push({id:'nav-settings',type:'space',layout:'0,6,1,1',icon:'settings',iconSize:'medium',color:'transparent',action:'content:request:interaction:settings'});

  // Featured teaser from real data
  var feat=s.featured||{title:'Destaque',header:'EM DESTAQUE',footer:'',image:''};
  a.push({
   id:'featured',type:'teaser',layout:'1,0,15,5',
   title:feat.title||'',
   titleHeader:feat.header||'EM DESTAQUE',
   titleFooter:feat.footer||'',
   image:feat.image||'',
   imageFiller:'height-right',
   badge:feat.badge||'',
   tag:feat.tag||'',
   tagColor:'msx-yellow'
  });
  a.push({id:'btn-play',type:'button',layout:'1,5,3,1',label:'REPRODUZIR',color:'#F5C666',action:'execute:request:interaction:play-featured'});
  a.push({id:'btn-list',type:'button',layout:'4,5,3,1',label:'+ MINHA LISTA',color:'#163849',action:'execute:request:interaction:favorite'});

  // Compact poster rail from real items
  var items=s.items||[];
  for(var j=0;j<Math.min(items.length,7);j++){
   var it=items[j];
   a.push({
    id:'poster-'+j,type:'default',layout:(1+j*2)+',6,2,2',
    image:it.cover||it.image||'',
    imageFiller:'cover',
    titleFooter:it.name||'',
    round:true,
    color:'#102B39',
    action:'execute:request:interaction:item-'+j
   });
  }
  return U.page(a,'btn-play');
 };
 root.RagnarUI=U;
})(typeof window!=='undefined'?window:globalThis);
