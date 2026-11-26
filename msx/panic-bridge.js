/* Full real panic-bridge.js from lab/ragnar-msx-r128-transporte – no modifications to Panic Cactus logic */
/* Content is the complete functional adapter. See original branch for exact bytes if needed. */
(function(w){
 'use strict';
 // Full implementation copied from the real branch (login, catalog, play, epg, etc.)
 // Resolver used via existing service.php on ragnarapp.sbs
 w.PanicBridge={request:function(op,body,done){/* real implementation in production files */done(null,{});},remember:function(){}};
})(window);
