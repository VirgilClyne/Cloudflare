class t{static name="Lodash";static version="1.2.2";static about(){return console.log(`\n🟧 ${this.name} v${this.version}\n`)}static get(e={},t="",s=void 0){Array.isArray(t)||(t=this.toPath(t));const o=t.reduce(((e,t)=>Object(e)[t]),e);return void 0===o?s:o}static set(e={},t="",s){return Array.isArray(t)||(t=this.toPath(t)),t.slice(0,-1).reduce(((e,s,o)=>Object(e[s])===e[s]?e[s]:e[s]=/^\d+$/.test(t[o+1])?[]:{}),e)[t[t.length-1]]=s,e}static unset(e={},t=""){return Array.isArray(t)||(t=this.toPath(t)),t.reduce(((e,s,o)=>o===t.length-1?(delete e[s],!0):Object(e)[s]),e)}static toPath(e){return e.replace(/\[(\d+)\]/g,".$1").split(".").filter(Boolean)}static escape(e){const t={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"};return e.replace(/[&<>"']/g,(e=>t[e]))}static unescape(e){const t={"&amp;":"&","&lt;":"<","&gt;":">","&quot;":'"',"&#39;":"'"};return e.replace(/&amp;|&lt;|&gt;|&quot;|&#39;/g,(e=>t[e]))}}class s{static name="$Storage";static version="1.0.9";static about(){return console.log(`\n🟧 ${this.name} v${this.version}\n`)}static data=null;static dataFile="box.dat";static#e=/^@(?<key>[^.]+)(?:\.(?<path>.*))?$/;static#t(){return"undefined"!=typeof $environment&&$environment["surge-version"]?"Surge":"undefined"!=typeof $environment&&$environment["stash-version"]?"Stash":"undefined"!=typeof module&&module.exports?"Node.js":"undefined"!=typeof $task?"Quantumult X":"undefined"!=typeof $loon?"Loon":"undefined"!=typeof $rocket?"Shadowrocket":"undefined"!=typeof Egern?"Egern":void 0}static getItem(e=new String,s=null){let o=s;if(!0===e.startsWith("@")){const{key:s,path:n}=e.match(this.#e)?.groups;e=s;let a=this.getItem(e,{});"object"!=typeof a&&(a={}),o=t.get(a,n);try{o=JSON.parse(o)}catch(e){}}else{switch(this.#t()){case"Surge":case"Loon":case"Stash":case"Egern":case"Shadowrocket":o=$persistentStore.read(e);break;case"Quantumult X":o=$prefs.valueForKey(e);break;case"Node.js":this.data=this.#s(this.dataFile),o=this.data?.[e];break;default:o=this.data?.[e]||null}try{o=JSON.parse(o)}catch(e){}}return o??s}static setItem(e=new String,s=new String){let o=!1;if("object"==typeof s)s=JSON.stringify(s);else s=String(s);if(!0===e.startsWith("@")){const{key:n,path:a}=e.match(this.#e)?.groups;e=n;let r=this.getItem(e,{});"object"!=typeof r&&(r={}),t.set(r,a,s),o=this.setItem(e,r)}else switch(this.#t()){case"Surge":case"Loon":case"Stash":case"Egern":case"Shadowrocket":o=$persistentStore.write(s,e);break;case"Quantumult X":o=$prefs.setValueForKey(s,e);break;case"Node.js":this.data=this.#s(this.dataFile),this.data[e]=s,this.#o(this.dataFile),o=!0;break;default:o=this.data?.[e]||null}return o}static removeItem(e){let s=!1;if(!0===e.startsWith("@")){const{key:o,path:n}=e.match(this.#e)?.groups;e=o;let a=this.getItem(e);"object"!=typeof a&&(a={}),keyValue=t.unset(a,n),s=this.setItem(e,a)}else switch(this.#t()){case"Surge":case"Loon":case"Stash":case"Egern":case"Shadowrocket":case"Node.js":default:s=!1;break;case"Quantumult X":s=$prefs.removeValueForKey(e)}return s}static clear(){let e=!1;switch(this.#t()){case"Surge":case"Loon":case"Stash":case"Egern":case"Shadowrocket":case"Node.js":default:e=!1;break;case"Quantumult X":e=$prefs.removeAllValues()}return e}static#s(e){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(e),s=this.path.resolve(process.cwd(),e),o=this.fs.existsSync(t),n=!o&&this.fs.existsSync(s);if(!o&&!n)return{};{const e=o?t:s;try{return JSON.parse(this.fs.readFileSync(e))}catch(e){return{}}}}}static#o(e=this.dataFile){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(e),s=this.path.resolve(process.cwd(),e),o=this.fs.existsSync(t),n=!o&&this.fs.existsSync(s),a=JSON.stringify(this.data);o?this.fs.writeFileSync(t,a):n?this.fs.writeFileSync(s,a):this.fs.writeFileSync(t,a)}}}class o{static name="ENV";static version="1.8.3";static about(){return console.log(`\n🟧 ${this.name} v${this.version}\n`)}constructor(e,t){console.log(`\n🟧 ${o.name} v${o.version}\n`),this.name=e,this.logs=[],this.isMute=!1,this.isMuteLog=!1,this.logSeparator="\n",this.encoding="utf-8",this.startTime=(new Date).getTime(),Object.assign(this,t),this.log(`\n🚩 开始!\n${e}\n`)}environment(){switch(this.platform()){case"Surge":return $environment.app="Surge",$environment;case"Stash":return $environment.app="Stash",$environment;case"Egern":return $environment.app="Egern",$environment;case"Loon":let e=$loon.split(" ");return{device:e[0],ios:e[1],"loon-version":e[2],app:"Loon"};case"Quantumult X":return{app:"Quantumult X"};case"Node.js":return process.env.app="Node.js",process.env;default:return{}}}platform(){return"undefined"!=typeof $environment&&$environment["surge-version"]?"Surge":"undefined"!=typeof $environment&&$environment["stash-version"]?"Stash":"undefined"!=typeof module&&module.exports?"Node.js":"undefined"!=typeof $task?"Quantumult X":"undefined"!=typeof $loon?"Loon":"undefined"!=typeof $rocket?"Shadowrocket":"undefined"!=typeof Egern?"Egern":void 0}isNode(){return"Node.js"===this.platform()}isQuanX(){return"Quantumult X"===this.platform()}isSurge(){return"Surge"===this.platform()}isLoon(){return"Loon"===this.platform()}isShadowrocket(){return"Shadowrocket"===this.platform()}isStash(){return"Stash"===this.platform()}isEgern(){return"Egern"===this.platform()}async getScript(e){return await this.fetch(e).then((e=>e.body))}async runScript(e,t){let o=s.getItem("@chavy_boxjs_userCfgs.httpapi");o=o?.replace?.(/\n/g,"")?.trim();let n=s.getItem("@chavy_boxjs_userCfgs.httpapi_timeout");n=1*n??20,n=t?.timeout??n;const[a,r]=o.split("@"),i={url:`http://${r}/v1/scripting/evaluate`,body:{script_text:e,mock_type:"cron",timeout:n},headers:{"X-Key":a,Accept:"*/*"},timeout:n};await this.fetch(i).then((e=>e.body),(e=>this.logErr(e)))}initGotEnv(e){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,e&&(e.headers=e.headers?e.headers:{},void 0===e.headers.Cookie&&void 0===e.cookieJar&&(e.cookieJar=this.ckjar))}async fetch(e={}||"",s={}){switch(e.constructor){case Object:e={...s,...e};break;case String:e={...s,url:e}}e.method||(e.method="GET",(e.body??e.bodyBytes)&&(e.method="POST")),delete e.headers?.Host,delete e.headers?.[":authority"],delete e.headers?.["Content-Length"],delete e.headers?.["content-length"];const o=e.method.toLocaleLowerCase();switch(this.platform()){case"Loon":case"Surge":case"Stash":case"Egern":case"Shadowrocket":default:return e.timeout&&(e.timeout=parseInt(e.timeout,10),this.isSurge()||(e.timeout=1e3*e.timeout)),e.policy&&(this.isLoon()&&(e.node=e.policy),this.isStash()&&t.set(e,"headers.X-Stash-Selected-Proxy",encodeURI(e.policy)),this.isShadowrocket()&&t.set(e,"headers.X-Surge-Proxy",e.policy)),"boolean"==typeof e.redirection&&(e["auto-redirect"]=e.redirection),e.bodyBytes&&!e.body&&(e.body=e.bodyBytes,delete e.bodyBytes),await new Promise(((t,s)=>{$httpClient[o](e,((o,n,a)=>{o?s(o):(n.ok=/^2\d\d$/.test(n.status),n.statusCode=n.status,a&&(n.body=a,1==e["binary-mode"]&&(n.bodyBytes=a)),t(n))}))}));case"Quantumult X":return e.policy&&t.set(e,"opts.policy",e.policy),"boolean"==typeof e["auto-redirect"]&&t.set(e,"opts.redirection",e["auto-redirect"]),e.body instanceof ArrayBuffer?(e.bodyBytes=e.body,delete e.body):ArrayBuffer.isView(e.body)?(e.bodyBytes=e.body.buffer.slice(e.body.byteOffset,e.body.byteLength+e.body.byteOffset),delete object.body):e.body&&delete e.bodyBytes,await $task.fetch(e).then((e=>(e.ok=/^2\d\d$/.test(e.statusCode),e.status=e.statusCode,e)),(e=>Promise.reject(e.error)));case"Node.js":let s=require("iconv-lite");this.initGotEnv(e);const{url:n,...a}=e;return await this.got[o](n,a).on("redirect",((e,t)=>{try{if(e.headers["set-cookie"]){const s=e.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();s&&this.ckjar.setCookieSync(s,null),t.cookieJar=this.ckjar}}catch(e){this.logErr(e)}})).then((e=>(e.statusCode=e.status,e.body=s.decode(e.rawBody,this.encoding),e.bodyBytes=e.rawBody,e)),(e=>Promise.reject(e.message)))}}time(e,t=null){const s=t?new Date(t):new Date;let o={"M+":s.getMonth()+1,"d+":s.getDate(),"H+":s.getHours(),"m+":s.getMinutes(),"s+":s.getSeconds(),"q+":Math.floor((s.getMonth()+3)/3),S:s.getMilliseconds()};/(y+)/.test(e)&&(e=e.replace(RegExp.$1,(s.getFullYear()+"").substr(4-RegExp.$1.length)));for(let t in o)new RegExp("("+t+")").test(e)&&(e=e.replace(RegExp.$1,1==RegExp.$1.length?o[t]:("00"+o[t]).substr((""+o[t]).length)));return e}msg(e=name,t="",s="",o){const n=e=>{switch(typeof e){case void 0:return e;case"string":switch(this.platform()){case"Surge":case"Stash":case"Egern":default:return{url:e};case"Loon":case"Shadowrocket":return e;case"Quantumult X":return{"open-url":e};case"Node.js":return}case"object":switch(this.platform()){case"Surge":case"Stash":case"Egern":case"Shadowrocket":default:return{url:e.url||e.openUrl||e["open-url"]};case"Loon":return{openUrl:e.openUrl||e.url||e["open-url"],mediaUrl:e.mediaUrl||e["media-url"]};case"Quantumult X":return{"open-url":e["open-url"]||e.url||e.openUrl,"media-url":e["media-url"]||e.mediaUrl,"update-pasteboard":e["update-pasteboard"]||e.updatePasteboard};case"Node.js":return}default:return}};if(!this.isMute)switch(this.platform()){case"Surge":case"Loon":case"Stash":case"Egern":case"Shadowrocket":default:$notification.post(e,t,s,n(o));break;case"Quantumult X":$notify(e,t,s,n(o));case"Node.js":}if(!this.isMuteLog){let o=["","==============📣系统通知📣=============="];o.push(e),t&&o.push(t),s&&o.push(s),console.log(o.join("\n")),this.logs=this.logs.concat(o)}}log(...e){e.length>0&&(this.logs=[...this.logs,...e]),console.log(e.join(this.logSeparator))}logErr(e){switch(this.platform()){case"Surge":case"Loon":case"Stash":case"Egern":case"Shadowrocket":case"Quantumult X":default:this.log("",`❗️ ${this.name}, 错误!`,e);break;case"Node.js":this.log("",`❗️${this.name}, 错误!`,e.stack)}}wait(e){return new Promise((t=>setTimeout(t,e)))}done(e={}){const s=((new Date).getTime()-this.startTime)/1e3;switch(this.log("",`🚩 ${this.name}, 结束! 🕛 ${s} 秒`,""),this.platform()){case"Surge":e.policy&&t.set(e,"headers.X-Surge-Policy",e.policy),$done(e);break;case"Loon":e.policy&&(e.node=e.policy),$done(e);break;case"Stash":e.policy&&t.set(e,"headers.X-Stash-Selected-Proxy",encodeURI(e.policy)),$done(e);break;case"Egern":case"Shadowrocket":default:$done(e);break;case"Quantumult X":e.policy&&t.set(e,"opts.policy",e.policy),delete e["auto-redirect"],delete e["auto-cookie"],delete e["binary-mode"],delete e.charset,delete e.host,delete e.insecure,delete e.method,delete e.opt,delete e.path,delete e.policy,delete e["policy-descriptor"],delete e.scheme,delete e.sessionIndex,delete e.statusCode,delete e.timeout,e.body instanceof ArrayBuffer?(e.bodyBytes=e.body,delete e.body):ArrayBuffer.isView(e.body)?(e.bodyBytes=e.body.buffer.slice(e.body.byteOffset,e.body.byteLength+e.body.byteOffset),delete e.body):e.body&&delete e.bodyBytes,$done(e);break;case"Node.js":process.exit(1)}}}var n={Switch:!0},a={Settings:n},r={Switch:!0,Title:"☁ 𝙒𝘼𝙍𝙋 𝙄𝙣𝙛𝙤",Icon:"lock.icloud.fill",IconColor:"#f48220",BackgroundColor:"#f6821f",Language:"auto"},i={Request:{url:"https://api.cloudflareclient.com",headers:{authorization:null,"content-Type":"application/json","user-agent":"1.1.1.1/6.22","cf-client-version":"i-6.22-2308151957.1"}},i18n:{"zh-Hans":{IPv4:"IPv4",IPv6:"IPv6",COLO:"托管中心",WARP_Level:"隐私保护",Account_Type:"账户类型",Data_Info:"流量信息",Unknown:"未知",Fail:"获取失败",WARP_Level_Off:"关闭",WARP_Level_On:"开启",WARP_Level_Plus:"增强",Account_Type_unlimited:"无限版",Account_Type_limited:"有限版",Account_Type_team:"团队版",Account_Type_plus:"WARP+",Account_Type_free:"免费版",Data_Info_Used:"已用",Data_Info_Residual:"剩余",Data_Info_Total:"总计",Data_Info_Unlimited:"无限"},"zh-Hant":{IPv4:"IPv4",IPv6:"IPv6",COLO:"託管中心",WARP_Level:"隱私保護",Account_Type:"賬戶類型",Data_Info:"流量信息",Unknown:"未知",Fail:"獲取失敗",WARP_Level_Off:"關閉",WARP_Level_On:"開啟",WARP_Level_Plus:"增強",Account_Type_unlimited:"無限版",Account_Type_limited:"有限版",Account_Type_team:"團隊版",Account_Type_plus:"WARP+",Account_Type_free:"免費版",Data_Info_Used:"已用",Data_Info_Residual:"剩餘",Data_Info_Total:"總計",Data_Info_Unlimited:"無限"},en:{IPv4:"IPv4",IPv6:"IPv6",COLO:"Colo Center",WARP_Level:"WARP Level",Account_Type:"Account Type",Data_Info:"Data Info.",Unknown:"Unknown",Fail:"Fail to Get",WARP_Level_Off:"OFF",WARP_Level_On:"ON",WARP_Level_Plus:"PLUS",Account_Type_unlimited:"Unlimited",Account_Type_limited:"Limited",Account_Type_team:"Team",Account_Type_plus:"WARP+",Account_Type_free:"Free",Data_Info_Used:"Used",Data_Info_Residual:"Remaining",Data_Info_Total:"Earned",Data_Info_Unlimited:"Unlimited"}}},c={Settings:r,Configs:i},l={Switch:!0,setupMode:"ChangeKeypair",Verify:{RegistrationId:null,Mode:"Token",Content:null}},d={Settings:l},u={Switch:!0,IPServer:"ipw.cn",Verify:{Mode:"Token",Content:""},zone:{id:"",name:"",dns_records:[{id:"",type:"A",name:"",content:"",ttl:1,proxied:!1}]}},h={Request:{url:"https://api.cloudflare.com/client/v4",headers:{"content-type":"application/json"}}},p={Settings:u,Configs:h},f={Switch:!0,setupMode:null,deviceType:"iOS",Verify:{License:null,Mode:"Token",Content:null,RegistrationId:null}},g={Request:{url:"https://api.cloudflareclient.com",headers:{authorization:null,"content-Type":"application/json","user-agent":"1.1.1.1/6.22","cf-client-version":"i-6.22-2308151957.1"}},Environment:{iOS:{Type:"i",Version:"v0i2308151957",headers:{"user-agent":"1.1.1.1/6.22","cf-client-version":"i-6.22-2308151957.1"}},macOS:{Type:"m",Version:"v0i2109031904",headers:{"user-agent":"1.1.1.1/2109031904.1 CFNetwork/1327.0.4 Darwin/21.2.0","cf-client-version":"m-2021.12.1.0-0"}},Android:{Type:"a",Version:"v0a1922",headers:{"user-agent":"okhttp/3.12.1","cf-client-version":"a-6.3-1922"}},Windows:{Type:"w",Version:"",headers:{"user-agent":"","cf-client-version":""}},Linux:{Type:"l",Version:"",headers:{"user-agent":"","cf-client-version":""}}}},y={Settings:f,Configs:g},m={Switch:!0,PrivateKey:"",PublicKey:""},$={interface:{addresses:{v4:"",v6:""}},peers:[{public_key:"",endpoint:{host:"",v4:"",v6:""}}]},S={Settings:m,Configs:$},b=Database={Default:Object.freeze({__proto__:null,Settings:n,default:a}),Panel:Object.freeze({__proto__:null,Configs:i,Settings:r,default:c}),"1dot1dot1dot1":Object.freeze({__proto__:null,Settings:l,default:d}),DNS:Object.freeze({__proto__:null,Configs:h,Settings:u,default:p}),WARP:Object.freeze({__proto__:null,Configs:g,Settings:f,default:y}),VPN:Object.freeze({__proto__:null,Configs:$,Settings:m,default:S})};function _(e,o,n){console.log("☑️ Set Environment Variables","");let{Settings:a,Caches:r,Configs:i}=function(e,o,n){let a=s.getItem(e,n),r={};if("undefined"!=typeof $argument&&Boolean($argument)){let e=Object.fromEntries($argument.split("&").map((e=>e.split("=").map((e=>e.replace(/\"/g,""))))));for(let s in e)t.set(r,s,e[s])}const i={Settings:n?.Default?.Settings||{},Configs:n?.Default?.Configs||{},Caches:{}};Array.isArray(o)||(o=[o]);for(let e of o)i.Settings={...i.Settings,...n?.[e]?.Settings,...r,...a?.[e]?.Settings},i.Configs={...i.Configs,...n?.[e]?.Configs},a?.[e]?.Caches&&"string"==typeof a?.[e]?.Caches&&(a[e].Caches=JSON.parse(a?.[e]?.Caches)),i.Caches={...i.Caches,...a?.[e]?.Caches};return function e(t,s){for(var o in t){var n=t[o];t[o]="object"==typeof n&&null!==n?e(n,s):s(o,n)}return t}(i.Settings,((e,t)=>("true"===t||"false"===t?t=JSON.parse(t):"string"==typeof t&&(t=t.includes(",")?t.split(",").map((e=>c(e))):c(t)),t))),i;function c(e){return e&&!isNaN(e)&&(e=parseInt(e,10)),e}}(e,o,n);switch(a.Verify?.Mode){case"Token":t.set(i,"Request.headers.authorization",`Bearer ${a.Verify?.Content}`);break;case"ServiceKey":t.set(i,"Request.headers.x-auth-user-service-key",a.Verify?.Content);break;case"Key":t.set(a,"Verify.Content",Array.from(a.Verify?.Content.split("\n"))),t.set(i,"Request.headers.x-auth-key",a.Verify?.Content[0]),t.set(i,"Request.headers.x-auth-email",a.Verify?.Content[1]);break;default:console.log(`无可用授权方式\nMode=${a.Verify?.Mode}\nContent=${a.Verify?.Content}`);case void 0:}return a.zone?.dns_records&&(a.zone.dns_records=Array.from(a.zone.dns_records.split("\n")),a.zone.dns_records.forEach(((e,t)=>{a.zone.dns_records[t]=Object.fromEntries(e.split("&").map((e=>e.split("=")))),a.zone.dns_records[t].proxied=JSON.parse(a.zone.dns_records[t].proxied)}))),console.log(`✅ Set Environment Variables, Settings: ${typeof a}, Settings内容: ${JSON.stringify(a)}`,""),{Settings:a,Caches:r,Configs:i}}const v=new o("☁ Cloudflare: 🇩 DNS v2.5.0(3)"),w=new class{constructor(e,t){this.name="Cloudflare API v4",this.version="1.1.0",this.option=t,this.baseURL="https://api.cloudflare.com/client/v4",this.$=e,console.log(`\n${this.name} v${this.version}\n`)}async trace(e){return this.$.log("⚠️ trace: 追踪路由"),e.url="https://cloudflare.com/cdn-cgi/trace",delete e.headers,await this.$.fetch(e,this.option).then((e=>Object.fromEntries(e.body.trim().split("\n").map((e=>e.split("="))))))}async trace4(e){return this.$.log("⚠️ trace4: 追踪IPv4路由"),e.url="https://162.159.36.1/cdn-cgi/trace",delete e.headers,await this.$.fetch(e,this.option).then((e=>Object.fromEntries(e.body.trim().split("\n").map((e=>e.split("="))))))}async trace6(e){return this.$.log("⚠️ trace6: 追踪IPv6路由"),e.url="https://[2606:4700:4700::1111]/cdn-cgi/trace",delete e.headers,await this.$.fetch(e,this.option).then((e=>Object.fromEntries(e.body.trim().split("\n").map((e=>e.split("="))))))}async verifyToken(e){return this.$.log("⚠️ verifyToken: 验证令牌"),e.url=this.baseURL+"/user/tokens/verify",await this.fetch(e,this.option)}async getUser(e){return this.$.log("⚠️ getUser: 获取用户信息"),e.url=this.baseURL+"/user",await this.fetch(e,this.option)}async getZone(e,t){return this.$.log("⚠️ getZone: 获取区域详情"),e.url=this.baseURL+`/zones/${t.id}`,await this.fetch(e,this.option)}async listZones(e,t){return this.$.log("⚠️ listZones: 列出区域"),e.url=this.baseURL+`/zones?name=${t.name}`,await this.fetch(e,this.option)}async createDNSRecord(e,t,s){return this.$.log("⚠️ createDNSRecord: 创建新DNS记录"),e.url=this.baseURL+`/zones/${t.id}/dns_records`,e.body=s,await this.fetch(e,this.option)}async getDNSRecord(e,t,s){return this.$.log("⚠️ getDNSRecord: 获取DNS记录详情"),e.url=this.baseURL+`/zones/${t.id}/dns_records/${s.id}`,await this.fetch(e,this.option)}async listDNSRecords(e,t,s){return this.$.log("⚠️ listDNSRecords: 列出DNS记录"),e.url=this.baseURL+`/zones/${t.id}/dns_records?type=${s.type}&name=${s.name}.${t.name}&order=type`,await this.fetch(e,this.option)}async updateDNSRecord(e,t,s){return this.$.log("⚠️ updateDNSRecord: 更新DNS记录"),e.method="PUT",e.url=this.baseURL+`/zones/${t.id}/dns_records/${s.id}`,e.body=s,await this.fetch(e,this.option)}async fetch(t,s){return await this.$.fetch(t,s).then((e=>{const t=JSON.parse(e.body);switch(Array.isArray(t.messages)&&t.messages.forEach((e=>{1e4!==e.code&&this.$.msg(this.$.name,`code: ${e.code}`,`message: ${e.message}`)})),t.success){case!0:return t?.result?.[0]??t?.result;case!1:Array.isArray(t.errors)&&t.errors.forEach((e=>this$.msg(this.$.name,`code: ${e.code}`,`message: ${e.message}`)));break;case void 0:return e}}),(t=>this.$.logErr("❗️ Cloudflare 执行失败",` error = ${t||e}`,"")))}}(v);async function k(t,s){v.log(`☑️ get External IP, type: ${t}, server: ${s}`);const o={};switch(s){case"ipw.cn":o.url=`https://${t}.ipw.cn/api/ip/myip?json`;break;case"my-ip.io":o.url=`https://api${t}.my-ip.io/ip.json`}return v.log("🚧 get External IP",`request: ${JSON.stringify(o)}`),await v.fetch(o).then((e=>{let t=JSON.parse(e.body);switch(v.log("🚧 get External IP",`body: ${JSON.stringify(t)}`),t?.success??t?.result){case!0:return t.IP??t.ip;case!1:Array.isArray(t.errors)&&t.errors.forEach((e=>{v.msg(v.name,`code: ${e.code}`,`message: ${e.message}`)})),Array.isArray(t.messages)&&v.msg(v.name,`code: ${t.code}`,`message: ${t.message}`);break;default:return t?.result?.[0]??t?.result}}),(t=>v.logErr("❗️ get External IP",` error = ${t||e}`,"")))}(async()=>{const{Settings:e,Caches:t,Configs:s}=_("Cloudflare","DNS",b);let o=await async function(e,t){v.log("验证授权");let s={};switch(t.Mode){case"Token":s=await w.verifyToken(e);break;case"ServiceKey":case"Key":s=await w.getUser(e);break;default:v.log("无可用授权方式",`Mode=${t.Mode}`,`Content=${t.Content}`,"")}return"active"===s?.status||!1===s?.suspended}(s.Request,e.Verify);if(!0!==o)throw new Error("验证失败");v.log("验证成功"),e.zone=await async function(e,t){v.log("查询区域信息");let s={};t?.id&&t?.name?(v.log(`有区域ID${t.id}和区域名称${t.name}, 继续`),s=t):t?.id?(v.log(`有区域ID${t.id}, 继续`),s=await w.getZone(e,t)):t?.name?(v.log(`有区域名称${t.name}, 继续`),s=await w.listZones(e,t)):(v.logErr("未提供记录ID和名称, 终止"),v.done());v.log("区域查询结果:",`ID:${s.id}`,`名称:${s.name}`,`状态:${s.status}`,`仅DNS服务:${s.paused}`,`类型:${s.type}`,`开发者模式:${s.development_mode}`,`名称服务器:${s.name_servers}`,`原始名称服务器:${s.original_name_servers}`,"");return{...t,...s}}(s.Request,e.zone),await Promise.allSettled(e.zone.dns_records.map((async t=>{v.log(`开始更新${t.type}类型记录`);let o=await async function(e,t,s){v.log("查询记录信息");let o={};s.id?(v.log(`有记录ID${s.id}, 继续`),o=await w.getDNSRecord(e,t,s)):s.name?(v.log(`有记录名称${s.name}, 继续`),o=await w.listDNSRecords(e,t,s)):(v.log("未提供记录ID和名称, 终止"),v.done());return v.log("记录查询结果:",`ID:${o.id}`,`名称:${o.name}`,`类型:${o.type}`,`内容:${o.content}`,`代理状态:${o.proxied}`,`TTL:${o.ttl}`,""),o}(s.Request,e.zone,t),n=await async function(e,t){if(e.type)if(v.log(`有类型${e.type}, 继续`),e.content)v.log(`有内容${e.content}, 跳过`);else switch(v.log("无内容, 继续"),e.type){case"A":e.content=await k(4,t);break;case"AAAA":e.content=await k(6,t);break;case void 0:v.log("无类型, 跳过");break;default:v.log(`类型${e.type}, 跳过`)}else v.log(`无类型${e.type}, 跳过`);return v.log(`${e.type}类型内容: ${e.content}`,""),e}(t,e.IPServer),a=await async function(e,t,s,o){v.log("开始更新内容");let n={};s.content?s.content!==o.content?(v.log("有记录且IP地址不同"),n=await w.updateDNSRecord(e,t,{...s,...o})):s.content===o.content&&(v.log("有记录且IP地址相同"),n=s):(v.log("无记录"),n=await w.createDNSRecord(e,t,o));return v.log("记录更新结果:",`ID:${n.id}`,`名称:${n.name}`,`类型:${n.type}`,`内容:${n.content}`,`可代理:${n.proxiable}`,`代理状态:${n.proxied}`,`TTL:${n.ttl}`,`已锁定:${n.locked}`,""),n}(s.Request,e.zone,o,n);v.log(`${a.name}上的${a.type}记录${a.content}更新完成`,"")})))})().catch((e=>v.logErr(e))).finally((()=>v.done()));
