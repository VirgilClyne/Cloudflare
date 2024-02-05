class e{constructor(){this.name="Lodash",this.version="1.0.0",console.log(`\n${this.name} v${this.version}\n`)}get(e={},t="",s=void 0){Array.isArray(t)||(t=this.toPath(t));const n=t.reduce(((e,t)=>Object(e)[t]),e);return void 0===n?s:n}set(e={},t="",s){return Array.isArray(t)||(t=this.toPath(t)),t.slice(0,-1).reduce(((e,s,n)=>Object(e[s])===e[s]?e[s]:e[s]=/^\d+$/.test(t[n+1])?[]:{}),e)[t[t.length-1]]=s,e}toPath(e){return e.replace(/\[(\d+)\]/g,".$1").split(".").filter(Boolean)}}var t="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{};function s(e){return e&&e.__esModule&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e}var n={exports:{}};var r,o,i={exports:{}};function a(){return r||(r=1,i.exports=(e=e||function(e,s){var n;if("undefined"!=typeof window&&window.crypto&&(n=window.crypto),"undefined"!=typeof self&&self.crypto&&(n=self.crypto),"undefined"!=typeof globalThis&&globalThis.crypto&&(n=globalThis.crypto),!n&&"undefined"!=typeof window&&window.msCrypto&&(n=window.msCrypto),!n&&void 0!==t&&t.crypto&&(n=t.crypto),!n)try{n=require("crypto")}catch(e){}var r=function(){if(n){if("function"==typeof n.getRandomValues)try{return n.getRandomValues(new Uint32Array(1))[0]}catch(e){}if("function"==typeof n.randomBytes)try{return n.randomBytes(4).readInt32LE()}catch(e){}}throw new Error("Native crypto module could not be used to get secure random number.")},o=Object.create||function(){function e(){}return function(t){var s;return e.prototype=t,s=new e,e.prototype=null,s}}(),i={},a=i.lib={},c=a.Base={extend:function(e){var t=o(this);return e&&t.mixIn(e),t.hasOwnProperty("init")&&this.init!==t.init||(t.init=function(){t.$super.init.apply(this,arguments)}),t.init.prototype=t,t.$super=this,t},create:function(){var e=this.extend();return e.init.apply(e,arguments),e},init:function(){},mixIn:function(e){for(var t in e)e.hasOwnProperty(t)&&(this[t]=e[t]);e.hasOwnProperty("toString")&&(this.toString=e.toString)},clone:function(){return this.init.prototype.extend(this)}},l=a.WordArray=c.extend({init:function(e,t){e=this.words=e||[],this.sigBytes=t!=s?t:4*e.length},toString:function(e){return(e||d).stringify(this)},concat:function(e){var t=this.words,s=e.words,n=this.sigBytes,r=e.sigBytes;if(this.clamp(),n%4)for(var o=0;o<r;o++){var i=s[o>>>2]>>>24-o%4*8&255;t[n+o>>>2]|=i<<24-(n+o)%4*8}else for(var a=0;a<r;a+=4)t[n+a>>>2]=s[a>>>2];return this.sigBytes+=r,this},clamp:function(){var t=this.words,s=this.sigBytes;t[s>>>2]&=4294967295<<32-s%4*8,t.length=e.ceil(s/4)},clone:function(){var e=c.clone.call(this);return e.words=this.words.slice(0),e},random:function(e){for(var t=[],s=0;s<e;s+=4)t.push(r());return new l.init(t,e)}}),u=i.enc={},d=u.Hex={stringify:function(e){for(var t=e.words,s=e.sigBytes,n=[],r=0;r<s;r++){var o=t[r>>>2]>>>24-r%4*8&255;n.push((o>>>4).toString(16)),n.push((15&o).toString(16))}return n.join("")},parse:function(e){for(var t=e.length,s=[],n=0;n<t;n+=2)s[n>>>3]|=parseInt(e.substr(n,2),16)<<24-n%8*4;return new l.init(s,t/2)}},p=u.Latin1={stringify:function(e){for(var t=e.words,s=e.sigBytes,n=[],r=0;r<s;r++){var o=t[r>>>2]>>>24-r%4*8&255;n.push(String.fromCharCode(o))}return n.join("")},parse:function(e){for(var t=e.length,s=[],n=0;n<t;n++)s[n>>>2]|=(255&e.charCodeAt(n))<<24-n%4*8;return new l.init(s,t)}},h=u.Utf8={stringify:function(e){try{return decodeURIComponent(escape(p.stringify(e)))}catch(e){throw new Error("Malformed UTF-8 data")}},parse:function(e){return p.parse(unescape(encodeURIComponent(e)))}},f=a.BufferedBlockAlgorithm=c.extend({reset:function(){this._data=new l.init,this._nDataBytes=0},_append:function(e){"string"==typeof e&&(e=h.parse(e)),this._data.concat(e),this._nDataBytes+=e.sigBytes},_process:function(t){var s,n=this._data,r=n.words,o=n.sigBytes,i=this.blockSize,a=o/(4*i),c=(a=t?e.ceil(a):e.max((0|a)-this._minBufferSize,0))*i,u=e.min(4*c,o);if(c){for(var d=0;d<c;d+=i)this._doProcessBlock(r,d);s=r.splice(0,c),n.sigBytes-=u}return new l.init(s,u)},clone:function(){var e=c.clone.call(this);return e._data=this._data.clone(),e},_minBufferSize:0});a.Hasher=f.extend({cfg:c.extend(),init:function(e){this.cfg=this.cfg.extend(e),this.reset()},reset:function(){f.reset.call(this),this._doReset()},update:function(e){return this._append(e),this._process(),this},finalize:function(e){return e&&this._append(e),this._doFinalize()},blockSize:16,_createHelper:function(e){return function(t,s){return new e.init(s).finalize(t)}},_createHmacHelper:function(e){return function(t,s){return new g.HMAC.init(e,s).finalize(t)}}});var g=i.algo={};return i}(Math),e)),i.exports;var e}var c=s(n.exports=(o=a(),function(){var e=o,t=e.lib.WordArray;function s(e,s,n){for(var r=[],o=0,i=0;i<s;i++)if(i%4){var a=n[e.charCodeAt(i-1)]<<i%4*2|n[e.charCodeAt(i)]>>>6-i%4*2;r[o>>>2]|=a<<24-o%4*8,o++}return t.create(r,o)}e.enc.Base64={stringify:function(e){var t=e.words,s=e.sigBytes,n=this._map;e.clamp();for(var r=[],o=0;o<s;o+=3)for(var i=(t[o>>>2]>>>24-o%4*8&255)<<16|(t[o+1>>>2]>>>24-(o+1)%4*8&255)<<8|t[o+2>>>2]>>>24-(o+2)%4*8&255,a=0;a<4&&o+.75*a<s;a++)r.push(n.charAt(i>>>6*(3-a)&63));var c=n.charAt(64);if(c)for(;r.length%4;)r.push(c);return r.join("")},parse:function(e){var t=e.length,n=this._map,r=this._reverseMap;if(!r){r=this._reverseMap=[];for(var o=0;o<n.length;o++)r[n.charCodeAt(o)]=o}var i=n.charAt(64);if(i){var a=e.indexOf(i);-1!==a&&(t=a)}return s(e,t,r)},_map:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="}}(),o.enc.Base64)),l={Switch:!0},u={Settings:l},d={Switch:!0,Title:"☁ 𝙒𝘼𝙍𝙋 𝙄𝙣𝙛𝙤",Icon:"lock.icloud.fill",IconColor:"#f48220",BackgroundColor:"#f6821f",Language:"auto"},p={Request:{url:"https://api.cloudflareclient.com",headers:{authorization:null,"content-Type":"application/json","user-agent":"1.1.1.1/6.22","cf-client-version":"i-6.22-2308151957.1"}},i18n:{"zh-Hans":{IPv4:"IPv4",IPv6:"IPv6",COLO:"托管中心",WARP_Level:"隐私保护",Account_Type:"账户类型",Data_Info:"流量信息",Unknown:"未知",Fail:"获取失败",WARP_Level_Off:"关闭",WARP_Level_On:"开启",WARP_Level_Plus:"增强",Account_Type_unlimited:"无限版",Account_Type_limited:"有限版",Account_Type_team:"团队版",Account_Type_plus:"WARP+",Account_Type_free:"免费版",Data_Info_Used:"已用",Data_Info_Residual:"剩余",Data_Info_Total:"总计",Data_Info_Unlimited:"无限"},"zh-Hant":{IPv4:"IPv4",IPv6:"IPv6",COLO:"託管中心",WARP_Level:"隱私保護",Account_Type:"賬戶類型",Data_Info:"流量信息",Unknown:"未知",Fail:"獲取失敗",WARP_Level_Off:"關閉",WARP_Level_On:"開啟",WARP_Level_Plus:"增強",Account_Type_unlimited:"無限版",Account_Type_limited:"有限版",Account_Type_team:"團隊版",Account_Type_plus:"WARP+",Account_Type_free:"免費版",Data_Info_Used:"已用",Data_Info_Residual:"剩餘",Data_Info_Total:"總計",Data_Info_Unlimited:"無限"},en:{IPv4:"IPv4",IPv6:"IPv6",COLO:"Colo Center",WARP_Level:"WARP Level",Account_Type:"Account Type",Data_Info:"Data Info.",Unknown:"Unknown",Fail:"Fail to Get",WARP_Level_Off:"OFF",WARP_Level_On:"ON",WARP_Level_Plus:"PLUS",Account_Type_unlimited:"Unlimited",Account_Type_limited:"Limited",Account_Type_team:"Team",Account_Type_plus:"WARP+",Account_Type_free:"Free",Data_Info_Used:"Used",Data_Info_Residual:"Remaining",Data_Info_Total:"Earned",Data_Info_Unlimited:"Unlimited"}}},h={Settings:d,Configs:p},f={Switch:!0,setupMode:"ChangeKeypair",Verify:{RegistrationId:null,Mode:"Token",Content:null}},g={Settings:f},y={Switch:!0,IPServer:"ipw.cn",Verify:{Mode:"Token",Content:""},zone:{id:"",name:"",dns_records:[{id:"",type:"A",name:"",content:"",ttl:1,proxied:!1}]}},m={Request:{url:"https://api.cloudflare.com/client/v4",headers:{"content-type":"application/json"}}},v={Settings:y,Configs:m},S={Switch:!0,setupMode:null,deviceType:"iOS",Verify:{License:null,Mode:"Token",Content:null,RegistrationId:null}},$={Request:{url:"https://api.cloudflareclient.com",headers:{authorization:null,"content-Type":"application/json","user-agent":"1.1.1.1/6.22","cf-client-version":"i-6.22-2308151957.1"}},Environment:{iOS:{Type:"i",Version:"v0i2308151957",headers:{"user-agent":"1.1.1.1/6.22","cf-client-version":"i-6.22-2308151957.1"}},macOS:{Type:"m",Version:"v0i2109031904",headers:{"user-agent":"1.1.1.1/2109031904.1 CFNetwork/1327.0.4 Darwin/21.2.0","cf-client-version":"m-2021.12.1.0-0"}},Android:{Type:"a",Version:"v0a1922",headers:{"user-agent":"okhttp/3.12.1","cf-client-version":"a-6.3-1922"}},Windows:{Type:"w",Version:"",headers:{"user-agent":"","cf-client-version":""}},Linux:{Type:"l",Version:"",headers:{"user-agent":"","cf-client-version":""}}}},_={Settings:S,Configs:$},w={Switch:!0,PrivateKey:"",PublicKey:""},b={interface:{addresses:{v4:"",v6:""}},peers:[{public_key:"",endpoint:{host:"",v4:"",v6:""}}]},k={Settings:w,Configs:b},C=Database={Default:Object.freeze({__proto__:null,Settings:l,default:u}),Panel:Object.freeze({__proto__:null,Configs:p,Settings:d,default:h}),"1dot1dot1dot1":Object.freeze({__proto__:null,Settings:f,default:g}),DNS:Object.freeze({__proto__:null,Configs:m,Settings:y,default:v}),WARP:Object.freeze({__proto__:null,Configs:$,Settings:S,default:_}),VPN:Object.freeze({__proto__:null,Configs:b,Settings:w,default:k})};const P=new class{constructor(t,s){this.name=t,this.version="1.4.0",this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.logSeparator="\n",this.encoding="utf-8",this.startTime=(new Date).getTime(),Object.assign(this,s),this.log("","🚩 开始!",`ENV v${this.version}`,""),this.lodash=new e(this.name),this.log("",this.name,"")}platform(){return"undefined"!=typeof $environment&&$environment["surge-version"]?"Surge":"undefined"!=typeof $environment&&$environment["stash-version"]?"Stash":"undefined"!=typeof module&&module.exports?"Node.js":"undefined"!=typeof $task?"Quantumult X":"undefined"!=typeof $loon?"Loon":"undefined"!=typeof $rocket?"Shadowrocket":void 0}isNode(){return"Node.js"===this.platform()}isQuanX(){return"Quantumult X"===this.platform()}isSurge(){return"Surge"===this.platform()}isLoon(){return"Loon"===this.platform()}isShadowrocket(){return"Shadowrocket"===this.platform()}isStash(){return"Stash"===this.platform()}toObj(e,t=null){try{return JSON.parse(e)}catch{return t}}toStr(e,t=null){try{return JSON.stringify(e)}catch{return t}}getjson(e,t){let s=t;if(this.getdata(e))try{s=JSON.parse(this.getdata(e))}catch{}return s}setjson(e,t){try{return this.setdata(JSON.stringify(e),t)}catch{return!1}}getScript(e){return new Promise((t=>{this.get({url:e},((e,s,n)=>t(n)))}))}runScript(e,t){return new Promise((s=>{let n=this.getdata("@chavy_boxjs_userCfgs.httpapi");n=n?n.replace(/\n/g,"").trim():n;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=t&&t.timeout?t.timeout:r;const[o,i]=n.split("@"),a={url:`http://${i}/v1/scripting/evaluate`,body:{script_text:e,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"},timeout:r};this.post(a,((e,t,n)=>s(n)))})).catch((e=>this.logErr(e)))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const e=this.path.resolve(this.dataFile),t=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(e),n=!s&&this.fs.existsSync(t);if(!s&&!n)return{};{const n=s?e:t;try{return JSON.parse(this.fs.readFileSync(n))}catch(e){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const e=this.path.resolve(this.dataFile),t=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(e),n=!s&&this.fs.existsSync(t),r=JSON.stringify(this.data);s?this.fs.writeFileSync(e,r):n?this.fs.writeFileSync(t,r):this.fs.writeFileSync(e,r)}}getdata(e){let t=this.getval(e);if(/^@/.test(e)){const[,s,n]=/^@(.*?)\.(.*?)$/.exec(e),r=s?this.getval(s):"";if(r)try{const e=JSON.parse(r);t=e?this.lodash.get(e,n,""):t}catch(e){t=""}}return t}setdata(e,t){let s=!1;if(/^@/.test(t)){const[,n,r]=/^@(.*?)\.(.*?)$/.exec(t),o=this.getval(n),i=n?"null"===o?null:o||"{}":"{}";try{const t=JSON.parse(i);this.lodash.set(t,r,e),s=this.setval(JSON.stringify(t),n)}catch(t){const o={};this.lodash.set(o,r,e),s=this.setval(JSON.stringify(o),n)}}else s=this.setval(e,t);return s}getval(e){switch(this.platform()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":return $persistentStore.read(e);case"Quantumult X":return $prefs.valueForKey(e);case"Node.js":return this.data=this.loaddata(),this.data[e];default:return this.data&&this.data[e]||null}}setval(e,t){switch(this.platform()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":return $persistentStore.write(e,t);case"Quantumult X":return $prefs.setValueForKey(e,t);case"Node.js":return this.data=this.loaddata(),this.data[t]=e,this.writedata(),!0;default:return this.data&&this.data[t]||null}}initGotEnv(e){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,e&&(e.headers=e.headers?e.headers:{},void 0===e.headers.Cookie&&void 0===e.cookieJar&&(e.cookieJar=this.ckjar))}async fetch(e={}||"",t={}){switch(e.constructor){case Object:e={...e,...t};break;case String:e={url:e,...t}}e.method||(e.method="GET",(e.body??e.bodyBytes)&&(e.method="POST")),delete e.headers?.["Content-Length"],delete e.headers?.["content-length"];const s=e.method.toLocaleLowerCase();switch(this.platform()){case"Loon":case"Surge":case"Stash":case"Shadowrocket":default:return delete e.id,e.policy&&(this.isLoon()&&(e.node=e.policy),this.isStash()&&this.lodash.set(e,"headers.X-Stash-Selected-Proxy",encodeURI(e.policy))),ArrayBuffer.isView(e.body)&&(e["binary-mode"]=!0),await new Promise(((t,n)=>{$httpClient[s](e,((s,r,o)=>{s?n(s):(r.ok=/^2\d\d$/.test(r.status),r.statusCode=r.status,o&&(r.body=o,1==e["binary-mode"]&&(r.bodyBytes=o)),t(r))}))}));case"Quantumult X":switch(delete e.scheme,delete e.sessionIndex,delete e.charset,e.policy&&this.lodash.set(e,"opts.policy",e.policy),(e?.headers?.["Content-Type"]??e?.headers?.["content-type"])?.split(";")?.[0]){default:delete e.bodyBytes;break;case"application/protobuf":case"application/x-protobuf":case"application/vnd.google.protobuf":case"application/grpc":case"application/grpc+proto":case"application/octet-stream":delete e.body,ArrayBuffer.isView(e.bodyBytes)&&(e.bodyBytes=e.bodyBytes.buffer.slice(e.bodyBytes.byteOffset,e.bodyBytes.byteLength+e.bodyBytes.byteOffset));case void 0:}return await $task.fetch(e).then((e=>(e.ok=/^2\d\d$/.test(e.statusCode),e.status=e.statusCode,e)),(e=>Promise.reject(e.error)));case"Node.js":let t=require("iconv-lite");this.initGotEnv(e);const{url:n,...r}=e;return await this.got[s](n,r).on("redirect",((e,t)=>{try{if(e.headers["set-cookie"]){const s=e.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();s&&this.ckjar.setCookieSync(s,null),t.cookieJar=this.ckjar}}catch(e){this.logErr(e)}})).then((e=>(e.statusCode=e.status,e.body=t.decode(e.rawBody,this.encoding),e.bodyBytes=e.rawBody,e)),(e=>Promise.reject(e.message)))}}time(e,t=null){const s=t?new Date(t):new Date;let n={"M+":s.getMonth()+1,"d+":s.getDate(),"H+":s.getHours(),"m+":s.getMinutes(),"s+":s.getSeconds(),"q+":Math.floor((s.getMonth()+3)/3),S:s.getMilliseconds()};/(y+)/.test(e)&&(e=e.replace(RegExp.$1,(s.getFullYear()+"").substr(4-RegExp.$1.length)));for(let t in n)new RegExp("("+t+")").test(e)&&(e=e.replace(RegExp.$1,1==RegExp.$1.length?n[t]:("00"+n[t]).substr((""+n[t]).length)));return e}msg(e=name,t="",s="",n){const r=e=>{switch(typeof e){case void 0:return e;case"string":switch(this.platform()){case"Surge":case"Stash":default:return{url:e};case"Loon":case"Shadowrocket":return e;case"Quantumult X":return{"open-url":e};case"Node.js":return}case"object":switch(this.platform()){case"Surge":case"Stash":case"Shadowrocket":default:return{url:e.url||e.openUrl||e["open-url"]};case"Loon":return{openUrl:e.openUrl||e.url||e["open-url"],mediaUrl:e.mediaUrl||e["media-url"]};case"Quantumult X":return{"open-url":e["open-url"]||e.url||e.openUrl,"media-url":e["media-url"]||e.mediaUrl,"update-pasteboard":e["update-pasteboard"]||e.updatePasteboard};case"Node.js":return}default:return}};if(!this.isMute)switch(this.platform()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":default:$notification.post(e,t,s,r(n));break;case"Quantumult X":$notify(e,t,s,r(n));case"Node.js":}if(!this.isMuteLog){let n=["","==============📣系统通知📣=============="];n.push(e),t&&n.push(t),s&&n.push(s),console.log(n.join("\n")),this.logs=this.logs.concat(n)}}log(...e){e.length>0&&(this.logs=[...this.logs,...e]),console.log(e.join(this.logSeparator))}logErr(e){switch(this.platform()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":case"Quantumult X":default:this.log("",`❗️ ${this.name}, 错误!`,e);break;case"Node.js":this.log("",`❗️${this.name}, 错误!`,e.stack)}}wait(e){return new Promise((t=>setTimeout(t,e)))}done(e={}){const t=((new Date).getTime()-this.startTime)/1e3;switch(this.log("",`🚩 ${this.name}, 结束! 🕛 ${t} 秒`),this.log(),this.platform()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":case"Quantumult X":default:$done(e);break;case"Node.js":process.exit(1)}}getENV(e,t,s){let n=this.getjson(e,s),r={};if("undefined"!=typeof $argument&&Boolean($argument)){let e=Object.fromEntries($argument.split("&").map((e=>e.split("=").map((e=>e.replace(/\"/g,""))))));for(let t in e)this.lodash.set(r,t,e[t])}const o={Settings:s?.Default?.Settings||{},Configs:s?.Default?.Configs||{},Caches:{}};Array.isArray(t)||(t=[t]);for(let e of t)o.Settings={...o.Settings,...s?.[e]?.Settings,...r,...n?.[e]?.Settings},o.Configs={...o.Configs,...s?.[e]?.Configs},n?.[e]?.Caches&&"string"==typeof n?.[e]?.Caches&&(n[e].Caches=JSON.parse(n?.[e]?.Caches)),o.Caches={...o.Caches,...n?.[e]?.Caches};return this.traverseObject(o.Settings,((e,t)=>("true"===t||"false"===t?t=JSON.parse(t):"string"==typeof t&&(t=t.includes(",")?t.split(",").map((e=>this.string2number(e))):this.string2number(t)),t))),o}traverseObject(e,t){for(var s in e){var n=e[s];e[s]="object"==typeof n&&null!==n?this.traverseObject(n,t):t(s,n)}return e}string2number(e){return e&&!isNaN(e)&&(e=parseInt(e,10)),e}}("☁ Cloudflare: 1️⃣ 1.1.1.1 v3.0.1(1).response"),A=(new class{constructor(e=[]){this.name="URI v1.2.6",this.opts=e,this.json={scheme:"",host:"",path:"",query:{}}}parse(e){let t=e.match(/(?:(?<scheme>.+):\/\/(?<host>[^/]+))?\/?(?<path>[^?]+)?\??(?<query>[^?]+)?/)?.groups??null;if(t?.path?t.paths=t.path.split("/"):t.path="",t?.paths){const e=t.paths[t.paths.length-1];if(e?.includes(".")){const s=e.split(".");t.format=s[s.length-1]}}return t?.query&&(t.query=Object.fromEntries(t.query.split("&").map((e=>e.split("="))))),t}stringify(e=this.json){let t="";return e?.scheme&&e?.host&&(t+=e.scheme+"://"+e.host),e?.path&&(t+=e?.host?"/"+e.path:e.path),e?.query&&(t+="?"+Object.entries(e.query).map((e=>e.join("="))).join("&")),t}}).parse($request.url);P.log(`⚠ URL: ${JSON.stringify(A)}`,"");const O=$request.method;A.host,A.path;const x=A.paths;P.log(`⚠ METHOD: ${O}`,"");const j=($response.headers?.["Content-Type"]??$response.headers?.["content-type"])?.split(";")?.[0];P.log(`⚠ FORMAT: ${j}`,""),(async()=>{const{Settings:e,Caches:t,Configs:s}=function(e,t,s,n){e.log("☑️ Set Environment Variables","");let{Settings:r,Caches:o,Configs:i}=e.getENV(t,s,n);switch(r.Verify?.Mode){case"Token":i.Request.headers.authorization=`Bearer ${r.Verify?.Content}`;break;case"ServiceKey":i.Request.headers["x-auth-user-service-key"]=r.Verify?.Content;break;case"Key":r.Verify.Content=Array.from(r.Verify?.Content.split("\n")),i.Request.headers["x-auth-key"]=r.Verify?.Content[0],i.Request.headers["x-auth-email"]=r.Verify?.Content[1];break;default:e.log("无可用授权方式",`Mode=${r.Verify?.Mode}`,`Content=${r.Verify?.Content}`);case void 0:}return r.zone?.dns_records&&(r.zone.dns_records=Array.from(r.zone.dns_records.split("\n")),r.zone.dns_records.forEach(((e,t)=>{r.zone.dns_records[t]=Object.fromEntries(e.split("&").map((e=>e.split("=")))),r.zone.dns_records[t].proxied=JSON.parse(r.zone.dns_records[t].proxied)}))),e.log("✅ Set Environment Variables","Settings: "+typeof r,`Settings内容: ${JSON.stringify(r)}`,""),{Settings:r,Caches:o,Configs:i}}(P,"Cloudflare","1dot1dot1dot1",C);switch(P.log(`⚠ Settings.Switch: ${e?.Switch}`,""),e.Switch){case!0:default:const t=P.getENV("WireGuard","VPN",C),s=($request?.headers?.Authorization??$request?.headers?.authorization)?.match(/Bearer (\S*)/)?.[1],n=`/${x[1]}/${x[2]}`==`/reg/${e.Verify.RegistrationId}`?"RegistrationId":"/reg"==`/${x[1]}`?"Registration":void 0;P.log(`🚧 KIND: ${n}`,"");let r={};switch(j){case void 0:case"application/x-www-form-urlencoded":case"text/plain":case"text/html":default:case"application/x-mpegURL":case"application/x-mpegurl":case"application/vnd.apple.mpegurl":case"audio/mpegurl":case"text/xml":case"text/plist":case"application/xml":case"application/plist":case"application/x-plist":case"text/vtt":case"application/vtt":break;case"text/json":case"application/json":switch(r=JSON.parse($response.body),Array.isArray(r.messages)&&r.messages.forEach((e=>P.msg(P.name,`code: ${e.code}`,`message: ${e.message}`))),r.success){case!0:const e=r?.result?.[0]??r?.result;if(e){e.config.reserved=await async function(e="AAAA"){P.log(`⚠ ${P.name}, Set Reserved`,"");let t=s(c.parse(e).toString(),2);return P.log(`🎉 ${P.name}, Set Reserved`,`reserved: ${t}`,""),t;function s(e,t){let s=[];for(var n=0,r=e.length;n<r/t;n++)s.push(parseInt("0x"+e.slice(t*n,t*(n+1)),16));return s}}(e?.config?.client_id),await async function(e,t,s){return P.log(`⚠ ${P.name}, Set Configs`,""),P.setjson(s?.interface?.addresses?.v4,`@${e}.${t}.Configs.interface.addresses.v4`),P.setjson(s?.interface?.addresses?.v6,`@${e}.${t}.Configs.interface.addresses.v6`),P.setjson(s?.reserved,`@${e}.${t}.Configs.Reserved`),P.setjson(s?.peers?.[0]?.public_key,`@${e}.${t}.Configs.peers[0].public_key`),P.setjson(s?.peers?.[0]?.endpoint?.host,`@${e}.${t}.Configs.peers[0].endpoint.host`),P.setjson(s?.peers?.[0]?.endpoint?.v4,`@${e}.${t}.Configs.peers[0].endpoint.v4`),P.setjson(s?.peers?.[0]?.endpoint?.v6,`@${e}.${t}.Configs.peers[0].endpoint.v6`),P.log(`🎉 ${P.name}, Set Configs`,"")}("WireGuard","VPN",e.config);const r=await async function(e,t){P.log(`⚠ ${P.name}, Set Message`,"");const s=`当前客户端公钥为:\n${e.key}\n用户设置公钥为:\n${t?.Settings?.PublicKey??"未设置，请到BoxJs面板中进行设置"}\n如两者一致，下列配置有效`;let n=`有效性验证:\n${s}\n\n\n⚠️注意留存本文件\n\n\n`;switch(P.platform()){case"Surge":n+=`Surge用配置:\n${`[Proxy]\nWARP = wireguard, section-name=Cloudflare, test-url=http://cp.cloudflare.com/generate_204\n\n[WireGuard Cloudflare]\nprivate-key = ${t?.Settings?.PrivateKey}\nself-ip = ${e?.config?.interface?.addresses?.v4}\nself-ip-v6 = ${e?.config?.interface?.addresses?.v6}\ndns-server = 1.1.1.1, 2606:4700:4700::1111\nmtu = 1280\npeer = (public-key = bmXOC+F1FxEMF9dyiK2H5/1SUtzH0JuVo51h2wPfgyo=, allowed-ips = "0.0.0.0/0, ::/0", endpoint = engage.nanocat.cloud:2408, keepalive = 45, client-id = ${e?.config?.reserved?.[0]}/${e?.config?.reserved?.[1]}/${e?.config?.reserved?.[2]})`}`;break;case"Loon":n+=`Loon用配置:\n${`[Proxy]\nWARP = wireguard, interface-ip=${e?.config?.interface?.addresses?.v4}, interface-ipv6=${e?.config?.interface?.addresses?.v6}, private-key="${t?.Settings?.PrivateKey}", mtu=1280, dns=1.1.1.1, dnsv6=2606:4700:4700::1111, keepalive=45, peers=[{public-key="bmXOC+F1FxEMF9dyiK2H5/1SUtzH0JuVo51h2wPfgyo=", allowed-ips="0.0.0.0/0, ::/0", endpoint=engage.nanocat.cloud:2408, reserved=[${e?.config?.reserved}]}]`}`;break;case"Shadowrocket":n+=`Shadowrocket用配置:\n${`[Proxy]\nWARP = wireguard, section-name=Cloudflare, test-url=http://cp.cloudflare.com/generate_204\n\n[WireGuard Cloudflare]\nprivate-key = ${t?.Settings?.PrivateKey}\nself-ip = ${e?.config?.interface?.addresses?.v4}\nself-ip-v6 = ${e?.config?.interface?.addresses?.v6}\ndns-server = 1.1.1.1, 2606:4700:4700::1111\nmtu = 1280\npeer = (public-key = bmXOC+F1FxEMF9dyiK2H5/1SUtzH0JuVo51h2wPfgyo=, allowed-ips = "0.0.0.0/0, ::/0", endpoint = engage.nanocat.cloud:2408, keepalive = 45, client-id = ${e?.config?.reserved?.[0]}/${e?.config?.reserved?.[1]}/${e?.config?.reserved?.[2]})`}\n\n\nShadowrocket点击一键添加:\nshadowrocket://add/${`wg://engage.nanocat.cloud:2408?publicKey=bmXOC+F1FxEMF9dyiK2H5/1SUtzH0JuVo51h2wPfgyo=&privateKey=${t?.Settings?.PrivateKey}&ip=${e?.config?.interface?.addresses?.v4}&dns=1.1.1.1&mtu=1280&keepalive=45&udp=1&reserved=${e?.config?.reserved?.[0]}/${e?.config?.reserved?.[1]}/${e?.config?.reserved?.[2]}#☁️%20Cloudflare%20for%20${e?.account?.account_type}`}`;break;case"Stash":n+=`Stash用配置:\n${`name: Cloudflare\ntype: wireguard\nserver: engage.nanocat.cloud # domain is supported\nport: 2408\nip: ${e?.config?.interface?.addresses?.v4}\nipv6: ${e?.config?.interface?.addresses?.v6} # optional\nprivate-key: ${t?.Settings?.PrivateKey}\npublic-key: bmXOC+F1FxEMF9dyiK2H5/1SUtzH0JuVo51h2wPfgyo= # peer public key\n# preshared-key: # optional\ndns: [1.1.1.1, 2606:4700:4700::1111] # optional\nmtu: 1280 # optional\nreserved: [${e?.config?.reserved}] # optional\nkeepalive: 45 # optional\n# underlying-proxy: # optional\n#   type: trojan\n#   server: your-underlying-proxy\n#   port: 443\n#   password: your-password`}`;break;case"Node.js":break;case"Quantumult X":n+="Quantumult X不支持 Wireguard 协议，仅显示提取后完整配置"}const r=JSON.stringify(e);n+=`\n\n\n完整配置内容:\n${r}`;const o=encodeURIComponent(`☁️ Cloudflare for ${e?.account?.account_type}配置文件`),i=`mailto:engage@nanocat.me?subject=${o}&body=${encodeURIComponent(n)}`;return P.log(`🎉 ${P.name}, Set Message`,`message: ${i}`,""),i}(e,t);switch(n){case"Registration":"GET"!==$request.method&&"PUT"!==$request.method||(P.msg(P.name,`检测到${e?.account?.account_type}配置文件`,`点击此通知在“邮件”中打开，查看完整配置。\n设备注册ID:\n${e?.id}\n设备令牌Token:\n${s}\n客户端公钥:\n${e?.key}\n节点公钥:\n${e?.config?.peers?.[0]?.public_key}`,r),P.log(P.name,`检测到${e?.account?.account_type}配置文件`,`原始配置文件:\n注意！文本内容未转义！字符串中可能包含额外字符！\n${JSON.stringify(e)}`,""));break;case"RegistrationId":"PUT"===$request.method&&(P.msg(P.name,"重置密钥",`点击此通知在“邮件”中打开，查看完整配置。\n收到回复数据，当前客户端公钥为:\n${e?.key}\n用户设置公钥为:\n${t?.Settings?.PublicKey}\n如两者一致，则替换成功`,r),P.log(P.name,`检测到${e?.account?.account_type}配置文件`,`原始配置文件:\n注意！文本内容未转义！字符串中可能包含额外字符！\n${JSON.stringify(e)}`,""))}}case!1:Array.isArray(r.errors)&&r.errors.forEach((e=>{P.msg(P.name,`code: ${e.code}`,`message: ${e.message}`)}));break;case void 0:throw new Error($response)}case"application/protobuf":case"application/x-protobuf":case"application/vnd.google.protobuf":case"application/grpc":case"application/grpc+proto":case"application/octet-stream":}case!1:}})().catch((e=>P.logErr(e))).finally((()=>{if(void 0!==$response)if(P.log(`🎉 ${P.name}, finally`,"$response",`FORMAT: ${j}`,""),$response?.headers?.["Content-Encoding"]&&($response.headers["Content-Encoding"]="identity"),$response?.headers?.["content-encoding"]&&($response.headers["content-encoding"]="identity"),P.isQuanX())switch(j){case void 0:P.done({status:$response.status,headers:$response.headers});break;default:P.done({status:$response.status,headers:$response.headers,body:$response.body});break;case"application/protobuf":case"application/x-protobuf":case"application/vnd.google.protobuf":case"application/grpc":case"application/grpc+proto":case"application/octet-stream":P.done({status:$response.status,headers:$response.headers,bodyBytes:$response.bodyBytes.buffer.slice($response.bodyBytes.byteOffset,$response.bodyBytes.byteLength+$response.bodyBytes.byteOffset)})}else P.done($response)}));
