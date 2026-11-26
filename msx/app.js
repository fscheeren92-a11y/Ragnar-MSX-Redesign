/* Ragnar MSX Redesign Controller – full real logic via PanicBridge + redesigned UI */
(function(w){
 'use strict';
 var U=w.RagnarUI, P=w.TVXInteractionPlugin, B=w.PanicBridge;
 if(!U||!P||!B)return;
 var base=w.location.protocol+'//'+w.location.host;
 var S={signedIn:false,featured:null,items:[],base:base};

 function render(){return U.home(S);}

 function loadHome(cb){
  B.request('state',{},function(err,st){
   if(err||!st.active){S.signedIn=false;cb(render());return;}
   S.signedIn=true;
   // Load real featured + recent movies for the rail
   B.request('catalog',{type:'movies',offset:0,limit:7},function(e,d){
    if(!e&&d&&d.items&&d.items.length){
     S.items=d.items;
     S.featured={title:d.items[0].name,header:'FILME EM DESTAQUE',footer:d.items[0].plot||'',image:d.items[0].cover,badge:d.items[0].year||''};
    }
    cb(render());
   });
  });
 }

 function Handler(){
  this.init=function(){};
  this.ready=function(){};
  this.handleRequest=function(id,data,cb){
   if(id==='init'||id==='home'||id==='render'){loadHome(cb);return;}
   if(id==='play-featured'||id.indexOf('item-')===0){
    var idx=id==='play-featured'?0:parseInt(id.split('-')[1],10);
    var item=S.items[idx];
    if(!item){cb({action:'info:Nenhum item selecionado'});return;}
    B.request('play',{id:item.id,type:'movies'},function(err,r){
     if(err||!r||!r.url){cb({action:'info:'+(err&&err.message||'Não foi possível reproduzir')});return;}
     cb({action:'video:'+r.url,data:{playerLabel:item.name}});
    });
    return;
   }
   if(id==='categories:live'||id==='categories:movies'||id==='categories:series'){
    // Full catalog navigation can be expanded here with the same real API calls
    cb({action:'info:Catálogo real disponível via PanicBridge'});
    return;
   }
   cb(render());
  };
  this.handleEvent=function(){};
 }
 P.init(new Handler());
})(window);
