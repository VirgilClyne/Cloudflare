class e{constructor(){this.name="Lodash",this.version="1.0.0",console.log(`\n${this.name} v${this.version}\n`)}get(e={},t="",s=void 0){Array.isArray(t)||(t=this.toPath(t));const a=t.reduce(((e,t)=>Object(e)[t]),e);return void 0===a?s:a}set(e={},t="",s){return Array.isArray(t)||(t=this.toPath(t)),t.slice(0,-1).reduce(((e,s,a)=>Object(e[s])===e[s]?e[s]:e[s]=/^\d+$/.test(t[a+1])?[]:{}),e)[t[t.length-1]]=s,e}toPath(e){return e.replace(/\[(\d+)\]/g,".$1").split(".").filter(Boolean)}}var t={Switch:!0},s={Settings:t},a={Switch:!0,Title:"☁ 𝙒𝘼𝙍𝙋 𝙄𝙣𝙛𝙤",Icon:"lock.icloud.fill",IconColor:"#f48220",BackgroundColor:"#f6821f",Language:"auto"},o={Request:{url:"https://api.cloudflareclient.com",headers:{authorization:null,"content-Type":"application/json","user-agent":"1.1.1.1/6.22","cf-client-version":"i-6.22-2308151957.1"}},i18n:{"zh-Hans":{IPv4:"IPv4",IPv6:"IPv6",COLO:"托管中心",WARP_Level:"隐私保护",Account_Type:"账户类型",Data_Info:"流量信息",Unknown:"未知",Fail:"获取失败",WARP_Level_Off:"关闭",WARP_Level_On:"开启",WARP_Level_Plus:"增强",Account_Type_unlimited:"无限版",Account_Type_limited:"有限版",Account_Type_team:"团队版",Account_Type_plus:"WARP+",Account_Type_free:"免费版",Data_Info_Used:"已用",Data_Info_Residual:"剩余",Data_Info_Total:"总计",Data_Info_Unlimited:"无限"},"zh-Hant":{IPv4:"IPv4",IPv6:"IPv6",COLO:"託管中心",WARP_Level:"隱私保護",Account_Type:"賬戶類型",Data_Info:"流量信息",Unknown:"未知",Fail:"獲取失敗",WARP_Level_Off:"關閉",WARP_Level_On:"開啟",WARP_Level_Plus:"增強",Account_Type_unlimited:"無限版",Account_Type_limited:"有限版",Account_Type_team:"團隊版",Account_Type_plus:"WARP+",Account_Type_free:"免費版",Data_Info_Used:"已用",Data_Info_Residual:"剩餘",Data_Info_Total:"總計",Data_Info_Unlimited:"無限"},en:{IPv4:"IPv4",IPv6:"IPv6",COLO:"Colo Center",WARP_Level:"WARP Level",Account_Type:"Account Type",Data_Info:"Data Info.",Unknown:"Unknown",Fail:"Fail to Get",WARP_Level_Off:"OFF",WARP_Level_On:"ON",WARP_Level_Plus:"PLUS",Account_Type_unlimited:"Unlimited",Account_Type_limited:"Limited",Account_Type_team:"Team",Account_Type_plus:"WARP+",Account_Type_free:"Free",Data_Info_Used:"Used",Data_Info_Residual:"Remaining",Data_Info_Total:"Earned",Data_Info_Unlimited:"Unlimited"}}},i={Settings:a,Configs:o},r={Switch:!0,setupMode:"ChangeKeypair",Verify:{RegistrationId:null,Mode:"Token",Content:null}},n={Settings:r},c={Switch:!0,IPServer:"ipw.cn",Verify:{Mode:"Token",Content:""},zone:{id:"",name:"",dns_records:[{id:"",type:"A",name:"",content:"",ttl:1,proxied:!1}]}},l={Request:{url:"https://api.cloudflare.com/client/v4",headers:{"content-type":"application/json"}}},u={Settings:c,Configs:l},h={Switch:!0,setupMode:null,deviceType:"iOS",Verify:{License:null,Mode:"Token",Content:null,RegistrationId:null}},d={Request:{url:"https://api.cloudflareclient.com",headers:{authorization:null,"content-Type":"application/json","user-agent":"1.1.1.1/6.22","cf-client-version":"i-6.22-2308151957.1"}},Environment:{iOS:{Type:"i",Version:"v0i2308151957",headers:{"user-agent":"1.1.1.1/6.22","cf-client-version":"i-6.22-2308151957.1"}},macOS:{Type:"m",Version:"v0i2109031904",headers:{"user-agent":"1.1.1.1/2109031904.1 CFNetwork/1327.0.4 Darwin/21.2.0","cf-client-version":"m-2021.12.1.0-0"}},Android:{Type:"a",Version:"v0a1922",headers:{"user-agent":"okhttp/3.12.1","cf-client-version":"a-6.3-1922"}},Windows:{Type:"w",Version:"",headers:{"user-agent":"","cf-client-version":""}},Linux:{Type:"l",Version:"",headers:{"user-agent":"","cf-client-version":""}}}},p={Settings:h,Configs:d},f={Switch:!0,PrivateKey:"",PublicKey:""},g={interface:{addresses:{v4:"",v6:""}},peers:[{public_key:"",endpoint:{host:"",v4:"",v6:""}}]},y={Settings:f,Configs:g},m=Database={Default:Object.freeze({__proto__:null,Settings:t,default:s}),Panel:Object.freeze({__proto__:null,Configs:o,Settings:a,default:i}),"1dot1dot1dot1":Object.freeze({__proto__:null,Settings:r,default:n}),DNS:Object.freeze({__proto__:null,Configs:l,Settings:c,default:u}),WARP:Object.freeze({__proto__:null,Configs:d,Settings:h,default:p}),VPN:Object.freeze({__proto__:null,Configs:g,Settings:f,default:y})};const S=new class{constructor(t,s){this.name=t,this.version="1.4.0",this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.logSeparator="\n",this.encoding="utf-8",this.startTime=(new Date).getTime(),Object.assign(this,s),this.log("","🚩 开始!",`ENV v${this.version}`,""),this.lodash=new e(this.name),this.log("",this.name,"")}platform(){return"undefined"!=typeof $environment&&$environment["surge-version"]?"Surge":"undefined"!=typeof $environment&&$environment["stash-version"]?"Stash":"undefined"!=typeof module&&module.exports?"Node.js":"undefined"!=typeof $task?"Quantumult X":"undefined"!=typeof $loon?"Loon":"undefined"!=typeof $rocket?"Shadowrocket":void 0}isNode(){return"Node.js"===this.platform()}isQuanX(){return"Quantumult X"===this.platform()}isSurge(){return"Surge"===this.platform()}isLoon(){return"Loon"===this.platform()}isShadowrocket(){return"Shadowrocket"===this.platform()}isStash(){return"Stash"===this.platform()}toObj(e,t=null){try{return JSON.parse(e)}catch{return t}}toStr(e,t=null){try{return JSON.stringify(e)}catch{return t}}getjson(e,t){let s=t;if(this.getdata(e))try{s=JSON.parse(this.getdata(e))}catch{}return s}setjson(e,t){try{return this.setdata(JSON.stringify(e),t)}catch{return!1}}getScript(e){return new Promise((t=>{this.get({url:e},((e,s,a)=>t(a)))}))}runScript(e,t){return new Promise((s=>{let a=this.getdata("@chavy_boxjs_userCfgs.httpapi");a=a?a.replace(/\n/g,"").trim():a;let o=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");o=o?1*o:20,o=t&&t.timeout?t.timeout:o;const[i,r]=a.split("@"),n={url:`http://${r}/v1/scripting/evaluate`,body:{script_text:e,mock_type:"cron",timeout:o},headers:{"X-Key":i,Accept:"*/*"},timeout:o};this.post(n,((e,t,a)=>s(a)))})).catch((e=>this.logErr(e)))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const e=this.path.resolve(this.dataFile),t=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(e),a=!s&&this.fs.existsSync(t);if(!s&&!a)return{};{const a=s?e:t;try{return JSON.parse(this.fs.readFileSync(a))}catch(e){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const e=this.path.resolve(this.dataFile),t=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(e),a=!s&&this.fs.existsSync(t),o=JSON.stringify(this.data);s?this.fs.writeFileSync(e,o):a?this.fs.writeFileSync(t,o):this.fs.writeFileSync(e,o)}}getdata(e){let t=this.getval(e);if(/^@/.test(e)){const[,s,a]=/^@(.*?)\.(.*?)$/.exec(e),o=s?this.getval(s):"";if(o)try{const e=JSON.parse(o);t=e?this.lodash.get(e,a,""):t}catch(e){t=""}}return t}setdata(e,t){let s=!1;if(/^@/.test(t)){const[,a,o]=/^@(.*?)\.(.*?)$/.exec(t),i=this.getval(a),r=a?"null"===i?null:i||"{}":"{}";try{const t=JSON.parse(r);this.lodash.set(t,o,e),s=this.setval(JSON.stringify(t),a)}catch(t){const i={};this.lodash.set(i,o,e),s=this.setval(JSON.stringify(i),a)}}else s=this.setval(e,t);return s}getval(e){switch(this.platform()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":return $persistentStore.read(e);case"Quantumult X":return $prefs.valueForKey(e);case"Node.js":return this.data=this.loaddata(),this.data[e];default:return this.data&&this.data[e]||null}}setval(e,t){switch(this.platform()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":return $persistentStore.write(e,t);case"Quantumult X":return $prefs.setValueForKey(e,t);case"Node.js":return this.data=this.loaddata(),this.data[t]=e,this.writedata(),!0;default:return this.data&&this.data[t]||null}}initGotEnv(e){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,e&&(e.headers=e.headers?e.headers:{},void 0===e.headers.Cookie&&void 0===e.cookieJar&&(e.cookieJar=this.ckjar))}async fetch(e={}||"",t={}){switch(e.constructor){case Object:e={...e,...t};break;case String:e={url:e,...t}}e.method||(e.method="GET",(e.body??e.bodyBytes)&&(e.method="POST")),delete e.headers?.["Content-Length"],delete e.headers?.["content-length"];const s=e.method.toLocaleLowerCase();switch(this.platform()){case"Loon":case"Surge":case"Stash":case"Shadowrocket":default:return delete e.id,e.policy&&(this.isLoon()&&(e.node=e.policy),this.isStash()&&this.lodash.set(e,"headers.X-Stash-Selected-Proxy",encodeURI(e.policy))),ArrayBuffer.isView(e.body)&&(e["binary-mode"]=!0),await new Promise(((t,a)=>{$httpClient[s](e,((s,o,i)=>{s?a(s):(o.ok=/^2\d\d$/.test(o.status),o.statusCode=o.status,i&&(o.body=i,1==e["binary-mode"]&&(o.bodyBytes=i)),t(o))}))}));case"Quantumult X":switch(delete e.scheme,delete e.sessionIndex,delete e.charset,e.policy&&this.lodash.set(e,"opts.policy",e.policy),(e?.headers?.["Content-Type"]??e?.headers?.["content-type"])?.split(";")?.[0]){default:delete e.bodyBytes;break;case"application/protobuf":case"application/x-protobuf":case"application/vnd.google.protobuf":case"application/grpc":case"application/grpc+proto":case"application/octet-stream":delete e.body,ArrayBuffer.isView(e.bodyBytes)&&(e.bodyBytes=e.bodyBytes.buffer.slice(e.bodyBytes.byteOffset,e.bodyBytes.byteLength+e.bodyBytes.byteOffset));case void 0:}return await $task.fetch(e).then((e=>(e.ok=/^2\d\d$/.test(e.statusCode),e.status=e.statusCode,e)),(e=>Promise.reject(e.error)));case"Node.js":let t=require("iconv-lite");this.initGotEnv(e);const{url:a,...o}=e;return await this.got[s](a,o).on("redirect",((e,t)=>{try{if(e.headers["set-cookie"]){const s=e.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();s&&this.ckjar.setCookieSync(s,null),t.cookieJar=this.ckjar}}catch(e){this.logErr(e)}})).then((e=>(e.statusCode=e.status,e.body=t.decode(e.rawBody,this.encoding),e.bodyBytes=e.rawBody,e)),(e=>Promise.reject(e.message)))}}time(e,t=null){const s=t?new Date(t):new Date;let a={"M+":s.getMonth()+1,"d+":s.getDate(),"H+":s.getHours(),"m+":s.getMinutes(),"s+":s.getSeconds(),"q+":Math.floor((s.getMonth()+3)/3),S:s.getMilliseconds()};/(y+)/.test(e)&&(e=e.replace(RegExp.$1,(s.getFullYear()+"").substr(4-RegExp.$1.length)));for(let t in a)new RegExp("("+t+")").test(e)&&(e=e.replace(RegExp.$1,1==RegExp.$1.length?a[t]:("00"+a[t]).substr((""+a[t]).length)));return e}msg(e=name,t="",s="",a){const o=e=>{switch(typeof e){case void 0:return e;case"string":switch(this.platform()){case"Surge":case"Stash":default:return{url:e};case"Loon":case"Shadowrocket":return e;case"Quantumult X":return{"open-url":e};case"Node.js":return}case"object":switch(this.platform()){case"Surge":case"Stash":case"Shadowrocket":default:return{url:e.url||e.openUrl||e["open-url"]};case"Loon":return{openUrl:e.openUrl||e.url||e["open-url"],mediaUrl:e.mediaUrl||e["media-url"]};case"Quantumult X":return{"open-url":e["open-url"]||e.url||e.openUrl,"media-url":e["media-url"]||e.mediaUrl,"update-pasteboard":e["update-pasteboard"]||e.updatePasteboard};case"Node.js":return}default:return}};if(!this.isMute)switch(this.platform()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":default:$notification.post(e,t,s,o(a));break;case"Quantumult X":$notify(e,t,s,o(a));case"Node.js":}if(!this.isMuteLog){let a=["","==============📣系统通知📣=============="];a.push(e),t&&a.push(t),s&&a.push(s),console.log(a.join("\n")),this.logs=this.logs.concat(a)}}log(...e){e.length>0&&(this.logs=[...this.logs,...e]),console.log(e.join(this.logSeparator))}logErr(e){switch(this.platform()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":case"Quantumult X":default:this.log("",`❗️ ${this.name}, 错误!`,e);break;case"Node.js":this.log("",`❗️${this.name}, 错误!`,e.stack)}}wait(e){return new Promise((t=>setTimeout(t,e)))}done(e={}){const t=((new Date).getTime()-this.startTime)/1e3;switch(this.log("",`🚩 ${this.name}, 结束! 🕛 ${t} 秒`),this.log(),this.platform()){case"Surge":case"Loon":case"Stash":case"Shadowrocket":case"Quantumult X":default:$done(e);break;case"Node.js":process.exit(1)}}getENV(e,t,s){let a=this.getjson(e,s),o={};if("undefined"!=typeof $argument&&Boolean($argument)){let e=Object.fromEntries($argument.split("&").map((e=>e.split("=").map((e=>e.replace(/\"/g,""))))));for(let t in e)this.lodash.set(o,t,e[t])}const i={Settings:s?.Default?.Settings||{},Configs:s?.Default?.Configs||{},Caches:{}};Array.isArray(t)||(t=[t]);for(let e of t)i.Settings={...i.Settings,...s?.[e]?.Settings,...o,...a?.[e]?.Settings},i.Configs={...i.Configs,...s?.[e]?.Configs},a?.[e]?.Caches&&"string"==typeof a?.[e]?.Caches&&(a[e].Caches=JSON.parse(a?.[e]?.Caches)),i.Caches={...i.Caches,...a?.[e]?.Caches};return this.traverseObject(i.Settings,((e,t)=>("true"===t||"false"===t?t=JSON.parse(t):"string"==typeof t&&(t=t.includes(",")?t.split(",").map((e=>this.string2number(e))):this.string2number(t)),t))),i}traverseObject(e,t){for(var s in e){var a=e[s];e[s]="object"==typeof a&&null!==a?this.traverseObject(a,t):t(s,a)}return e}string2number(e){return e&&!isNaN(e)&&(e=parseInt(e,10)),e}}("☁ Cloudflare: 1️⃣ 1.1.1.1 v3.0.1(1).request"),_=new class{constructor(e=[]){this.name="URI v1.2.6",this.opts=e,this.json={scheme:"",host:"",path:"",query:{}}}parse(e){let t=e.match(/(?:(?<scheme>.+):\/\/(?<host>[^/]+))?\/?(?<path>[^?]+)?\??(?<query>[^?]+)?/)?.groups??null;if(t?.path?t.paths=t.path.split("/"):t.path="",t?.paths){const e=t.paths[t.paths.length-1];if(e?.includes(".")){const s=e.split(".");t.format=s[s.length-1]}}return t?.query&&(t.query=Object.fromEntries(t.query.split("&").map((e=>e.split("="))))),t}stringify(e=this.json){let t="";return e?.scheme&&e?.host&&(t+=e.scheme+"://"+e.host),e?.path&&(t+=e?.host?"/"+e.path:e.path),e?.query&&(t+="?"+Object.entries(e.query).map((e=>e.join("="))).join("&")),t}};let v;const b=_.parse($request.url);S.log(`⚠ URL: ${JSON.stringify(b)}`,"");const w=$request.method;b.host,b.path;const $=b.paths;S.log(`⚠ METHOD: ${w}`,"");const C=($request.headers?.["Content-Type"]??$request.headers?.["content-type"])?.split(";")?.[0];S.log(`⚠ FORMAT: ${C}`,""),(async()=>{const{Settings:e,Caches:t,Configs:s}=function(e,t,s,a){e.log("☑️ Set Environment Variables","");let{Settings:o,Caches:i,Configs:r}=e.getENV(t,s,a);switch(o.Verify?.Mode){case"Token":r.Request.headers.authorization=`Bearer ${o.Verify?.Content}`;break;case"ServiceKey":r.Request.headers["x-auth-user-service-key"]=o.Verify?.Content;break;case"Key":o.Verify.Content=Array.from(o.Verify?.Content.split("\n")),r.Request.headers["x-auth-key"]=o.Verify?.Content[0],r.Request.headers["x-auth-email"]=o.Verify?.Content[1];break;default:e.log("无可用授权方式",`Mode=${o.Verify?.Mode}`,`Content=${o.Verify?.Content}`);case void 0:}return o.zone?.dns_records&&(o.zone.dns_records=Array.from(o.zone.dns_records.split("\n")),o.zone.dns_records.forEach(((e,t)=>{o.zone.dns_records[t]=Object.fromEntries(e.split("&").map((e=>e.split("=")))),o.zone.dns_records[t].proxied=JSON.parse(o.zone.dns_records[t].proxied)}))),e.log("✅ Set Environment Variables","Settings: "+typeof o,`Settings内容: ${JSON.stringify(o)}`,""),{Settings:o,Caches:i,Configs:r}}(S,"Cloudflare","1dot1dot1dot1",m);switch(S.log(`⚠ Settings.Switch: ${e?.Switch}`,""),e.Switch){case!0:default:const t=S.getENV("WireGuard","VPN",m),s=`/${$[1]}/${$[2]}`==`/reg/${e.Verify.RegistrationId}`?"RegistrationId":"/reg"==`/${$[1]}`?"Registration":void 0;S.log(`🚧 KIND: ${s}`,""),S.setjson($request,"@Cloudflare.1dot1dot1dot1.Caches");let a={};switch(w){case"POST":case"PUT":case"PATCH":case"DELETE":switch(C){case void 0:case"application/x-www-form-urlencoded":case"text/plain":case"text/html":default:case"application/x-mpegURL":case"application/x-mpegurl":case"application/vnd.apple.mpegurl":case"audio/mpegurl":case"text/xml":case"text/plist":case"application/xml":case"application/plist":case"application/x-plist":case"text/vtt":case"application/vtt":break;case"text/json":case"application/json":switch(a=JSON.parse($request.body??"{}"),s){case"Registration":break;case"RegistrationId":"PUT"===$request.method&&(a.key=t.Settings.PublicKey,S.msg(S.name,"重置密钥",`发送请求数据，请求中的客户端公钥已替换为:\n${t.Settings.PublicKey}\n等待回复数据`))}$request.body=JSON.stringify(a);case"application/protobuf":case"application/x-protobuf":case"application/vnd.google.protobuf":case"application/grpc":case"application/grpc+proto":case"application/octet-stream":}case"GET":case"HEAD":case"OPTIONS":case void 0:default:$request.headers?.Host&&($request.headers.Host=b.host),$request.url=_.stringify(b);case"CONNECT":case"TRACE":}case!1:}})().catch((e=>S.logErr(e))).finally((()=>{switch(v){default:{const e=(v?.headers?.["content-type"])?.split(";")?.[0];if(S.log(`🎉 ${S.name}, finally`,"echo $response",`FORMAT: ${e}`,""),S.isQuanX())switch(v.status="HTTP/1.1 200 OK",delete v?.headers?.["Content-Length"],delete v?.headers?.["content-length"],delete v?.headers?.["Transfer-Encoding"],e){case void 0:S.done({status:v.status,headers:v.headers});break;default:S.done({status:v.status,headers:v.headers,body:v.body});break;case"application/protobuf":case"application/x-protobuf":case"application/vnd.google.protobuf":case"application/grpc":case"application/grpc+proto":case"application/octet-stream":S.done({status:v.status,headers:v.headers,bodyBytes:v.bodyBytes})}else S.done({response:v});break}case void 0:if(S.log(`🎉 ${S.name}, finally`,"$request",`FORMAT: ${C}`,""),S.isQuanX())switch(C){case void 0:S.done({url:$request.url,headers:$request.headers});break;default:S.done({url:$request.url,headers:$request.headers,body:$request.body});break;case"application/protobuf":case"application/x-protobuf":case"application/vnd.google.protobuf":case"application/grpc":case"application/grpc+proto":case"application/octet-stream":S.done({url:$request.url,headers:$request.headers,bodyBytes:$request.bodyBytes.buffer.slice($request.bodyBytes.byteOffset,$request.bodyBytes.byteLength+$request.bodyBytes.byteOffset)})}else S.done($request)}}));
