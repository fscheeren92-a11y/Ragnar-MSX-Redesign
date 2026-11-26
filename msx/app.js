/* Dynamic controller skeleton for Ragnar MSX Redesign.
   Expects a backend service.php (same contract as panic-cactus-msx).
*/
(function(){'use strict';
var U=window.RagnarUI,P=window.TVXInteractionPlugin;
if(!U||!P)return;
var origin=location.protocol+'//'+location.host;U.configure(origin);
var S={view:'home',signedIn:false,items:[],featured:null,message:''};
function current(){return U.home(S);}
function Handler(){
  this.init=function(){};
  this.ready=function(){};
  this.handleRequest=function(id,data,cb){
    if(id==='init'||id==='render'||id==='home'){
      // In real use: call api('boot') then load featured + items
      cb(current());
      return;
    }
    if(id.indexOf('kind-')===0){
      S.kind=id.slice(5);
      // Load real categories/items from backend here
      cb(current());
      return;
    }
    if(id==='play-featured'||id.indexOf('item-')===0){
      cb({action:'info:Conecte o backend para reproduzir de verdade.'});
      return;
    }
    cb(current());
  };
  this.handleEvent=function(){};
}
P.init(new Handler());
})();
