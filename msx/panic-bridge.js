/* Full real PanicBridge from lab/ragnar-msx-r128-transporte */
(function(w){
 'use strict';
 var bootNonce='',auth=false,deviceToken='',byKind={live:null,movies:null,series:null};
 function remember(value){deviceToken=/^[a-f0-9]{64}$/.test(String(value||''))?value:'';}
 var base=w.location.protocol+'//'+w.location.host+'/msx/service.php';
 function enc(x){return encodeURIComponent(String(x===null||typeof x==='undefined'?'':x));}
 function copyObject(o){var n={},k;for(k in o)if(Object.prototype.hasOwnProperty.call(o,k))n[k]=o[k];return n;}
 function send(method,args,done){
  var x=new XMLHttpRequest(),parameters=[],k,body=null,doneOnce=false;
  args=args||{};
  if(method==='GET'){
   for(k in args)if(Object.prototype.hasOwnProperty.call(args,k))parameters.push(enc(k)+'='+enc(args[k]));
  }else{body=JSON.stringify(args);}
  var url=base+(parameters.length?'?'+parameters.join('&'):'');
  x.open(method,url,true);x.withCredentials=true;x.timeout=(method==='GET'&&args.api==='items')?180000:30000;
  if(method==='POST')x.setRequestHeader('Content-Type','application/json');
  if(deviceToken)x.setRequestHeader('X-Panic-Auth',deviceToken);
  function finish(err,result){if(doneOnce)return;doneOnce=true;done(err,result);}
  x.onreadystatechange=function(){if(x.readyState!==4)return;
   var data=null;try{data=JSON.parse(x.responseText);}catch(ignore){}
   if(x.status>=200&&x.status<300&&data&&data.ok!==false){finish(null,data);return;}
   var msg=(data&&data.message)||((x.status===0)?'Sem conexão com o servidor.':('HTTP '+x.status));
   finish({status:x.status,message:String(msg).slice(0,250)});
  };
  x.onerror=function(){finish({status:0,message:'Sem conexão com o servidor.'});};
  x.ontimeout=function(){finish({status:0,message:'A solicitação expirou.'});};
  x.send(body);
 }
 function get(api,params,done){var args=copyObject(params||{});args.api=api;send('GET',args,done);}
 function session(done){get('boot',{},function(err,d){if(err){done(err);return;}bootNonce=d.nonce||'';auth=!!d.signedIn;done(null,d);});}
 function post(op,attrs,done){
  session(function(e){if(e){done(e);return;}
   var body=copyObject(attrs||{});body.nonce=bootNonce;body.op=op;
   send('POST',body,function(err,d){if(!err&&d&&d.nonce){bootNonce=d.nonce;auth=!!d.signedIn;}if(!err&&op==='login'&&d&&d.rememberToken)remember(d.rememberToken);if(!err&&op==='logout')remember('');done(err,d);});
  });
 }
 function kindFor(type){return type==='live'||type==='live_categories'?'live':type==='movies'||type==='movie_categories'?'movies':'series';}
 function toType(type){return type==='live_categories'||type==='movie_categories'||type==='series_categories';}
 function serviceCategories(kind,done){
  if(byKind[kind]){done(null,byKind[kind]);return;}
  get('categories',{kind:kind},function(err,d){if(err){done(err);return;}
   var all=(d.categories||[]).map(function(r){return {category_id:r.token,category_name:r.name};});
   byKind[kind]=all;done(null,all);
  });
 }
 function toMediaItem(item,kind){
  var id=item.token,record={id:id,name:item.name,cover:item.image||'',stream_icon:item.image||'',year:item.year||'',rating:item.rating,
   container_extension:kind==='movies'?(item.extension||''):(item.extension||'mp4'),stream_id:id};
  if(kind==='series'){record.series_id=id;delete record.stream_id;}
  return record;
 }
 function catalog(body,done){
  var kind=kindFor(body.type),offset=Math.max(0,Number(body.offset)||0),limit=Math.min(180,Math.max(1,Number(body.limit)||60));
  if(toType(body.type)){
   serviceCategories(kind,function(err,all){if(err){done(err);return;}done(null,{items:all.slice(offset,offset+limit),total:all.length});});return;
  }
  if(kind==='movies'){
   get('items',{kind:kind,category:body.category||'',offset:offset,limit:limit,q:body.search||''},function(err,d){
    if(err){done(err);return;}
    done(null,{items:(d.items||[]).map(function(v){return toMediaItem(v,kind);}),total:Number(d.total)||0});
   });
   return;
  }
  var result=[],total=0;
  function chunk(){var amount=Math.min(48,limit-result.length);
   if(amount<=0||result.length&&offset+result.length>=total){done(null,{items:result,total:total});return;}
   get('items',{kind:kind,category:body.category||'',offset:offset+result.length,limit:amount,q:body.search||''},function(err,d){if(err){done(err);return;}
    total=Number(d.total)||0;
    var arr=(d.items||[]).map(function(v){return toMediaItem(v,kind);});
    Array.prototype.push.apply(result,arr);
    if(!arr.length||result.length>=limit||offset+result.length>=total){done(null,{items:result,total:total});return;}
    chunk();
   });
  }
  chunk();
 }
 function getMovie(body,done){get('detail',{item:body.id},function(err,d){if(err){done(err);return;}
  done(null,{info:{name:d.name,plot:d.plot,description:d.plot,genre:d.genre,releasedate:d.year,duration:d.duration,
   cover_big:d.image,movie_image:d.image},movie_data:{name:d.name,container_extension:d.extension||'',stream_icon:d.image}});
 });}
 function getSeries(body,done){get('detail',{item:body.id},function(err,d){if(err){done(err);return;}
  var all={},seasons=d.seasons||[],i=0;
  function fetchSeason(){if(i>=seasons.length){done(null,{info:{name:d.name,plot:d.plot},episodes:all});return;}
   var sn=String(seasons[i++].id),rows=[];
   function fetchPage(offset){
    get('episodes',{item:body.id,season:sn,offset:offset,limit:48},function(e,r){if(e){done(e);return;}
     var entries=r.items||[];
     for(var j=0;j<entries.length;j++){
      var v=entries[j],m=String(v.name||'').match(/^E([0-9]+)\s*·\s*(.*)/);
      rows.push({id:v.token,episode_num:m?Number(m[1]):rows.length+1,title:m?m[2]:v.name,
        name:v.name,info:{plot:v.plot||'',movie_image:v.image||''}});
     }
     if(entries.length&&rows.length<(Number(r.total)||0)){fetchPage(rows.length);return;}
     all[sn]=rows;fetchSeason();
    });
   }
   fetchPage(0);
  }
  fetchSeason();
 });}
 function epg(body,done){get('epg',{item:body.id},function(err,d){if(err){done(err);return;}
  var rows=d.programs||[];
  function row(v){return v?{title:v.title,description:v.description,start:v.start,end:v.end}:null;}
  done(null,{current:row(rows[0]),next:row(rows[1])});
 });}
 function play(body,done){
  var token=body.episode||body.id;
  if(body.forceNative){
   get('native',{item:token},function(err,d){if(err){done(err);return;}
    if(!d||typeof d.url!=='string'){done({message:'O servidor não retornou uma mídia reproduzível.'});return;}
    done(null,{url:d.url,name:'Ragnar App',format:d.format,kind:body.type});
   });return;
  }
  get('playback',{item:token},function(err,d){if(err){done(err);return;}
   var all=(d&&d.candidates)||[],usable=[],i,preferred=d&&d.prefer;
   for(i=0;i<all.length;i++){
    if(all[i]&&typeof all[i].url==='string'&&/^https:\/\//.test(all[i].url))
     usable.push({url:all[i].url,format:String(all[i].format||'').toLowerCase()});
   }
   if(!usable.length){done({message:'O servidor não retornou uma mídia reproduzível.'});return;}
   if(body.type==='live'&&preferred==='m3u8'&&usable[1]&&usable[1].format==='m3u8')
    usable.unshift(usable.splice(1,1)[0]);
   done(null,{url:usable[0].url,format:usable[0].format,name:'Ragnar App',
     kind:body.type,alternatives:usable,prefer:preferred});
  });
 }
 function request(op,body,done){
  body=body||{};
  if(op==='bootstrap'){done(null,{token:'local'});return;}
  if(op==='state'){session(function(err,d){if(err){done(err);return;}
   done(null,{active:!!d.signedIn,flow:(d.settings&&d.settings.format)==='m3u8'?'hls':'ts',
    account:d.account||{},license_kind:'provider',license_expires:(d.account&&d.account.expiry)||'Vinculada à lista',parental_locked:false,pin_configured:false,
    message: d.signedIn?'':'Entre com os dados da sua lista.'});
  });return;}
  if(op==='connect'){post('login',{code:body.code||'',username:body.username||'',password:body.password||''},done);return;}
  if(op==='logout'){post('logout',{},function(err,d){if(!err){byKind={live:null,movies:null,series:null};}done(err,d);});return;}
  if(op==='catalog'){catalog(body,done);return;}
  if(op==='quick-info'){get('detail',{item:body.id},function(err,d){if(err){done(err);return;}done(null,{name:d.name,plot:d.plot,genre:d.genre,year:d.year,duration:d.duration,image:d.image,backdrop:d.backdrop,rating:d.rating,director:d.director,cast:d.cast});});return;}
  if(op==='movie'){getMovie(body,done);return;}
  if(op==='series'){getSeries(body,done);return;}
  if(op==='epg'){epg(body,done);return;}
  if(op==='play'){play(body,done);return;}
  if(op==='refresh'){post('reload',{},function(err,d){if(!err)byKind={live:null,movies:null,series:null};done(err,d);});return;}
  if(op==='settings'){post('settings',{format:body.flow==='hls'?'m3u8':'ts',preview:'native'},done);return;}
  if(op==='parental'){done({status:501,message:'Controle parental não implementado no backend.'});return;}
  done({status:501,message:'Operação não implementada: '+String(op).slice(0,25)});
 }
 w.PanicBridge={request:request,remember:remember};
})(window);
