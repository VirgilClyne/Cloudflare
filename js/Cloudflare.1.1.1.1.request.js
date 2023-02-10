/*
README:https://github.com/VirgilClyne/Cloudflare
*/

const $ = new Env("1️⃣ 1.1.1.1 by Cloudflare v2.3.0-request");
const DataBase = {
	"1dot1dot1dot1": {
		"Settings": {"Switch":true,"setupMode":"ChangeKeypair","Verify":{"RegistrationId":null,"Mode":"Token","Content":null}},
		"Configs": {"Request":{"url":"https://api.cloudflareclient.com","headers":{"authorization":null,"content-Type":"application/json","user-Agent":"1.1.1.1/2109031904.1 CFNetwork/1327.0.4 Darwin/21.2.0","cf-client-version":"i-6.7-2109031904.1"}}}
	},
	"VPN": {
		"Settings":{"Switch":true,"PrivateKey":"","PublicKey":""},
		"Configs":{"interface":{"addresses":{"v4":"","v6":""}},"peers":[{"public_key":"","endpoint":{"host":"","v4":"","v6":""}}]}
	},
	"DNS": {
		"Settings":{"Switch":true,"Verify":{"Mode":"Token","Content":""},"zone":{"id":"","name":"","dns_records":[{"id":"","type":"A","name":"","content":"","ttl":1,"proxied":false}]}},
		"Configs":{"Request":{"url":"https://api.cloudflare.com/client/v4","headers":{"content-type":"application/json"}}}
	},
	"WARP": {
		"Settings":{"Switch":true,"setupMode":null,"deviceType":"iOS","Verify":{"License":null,"Mode":"Token","Content":null,"RegistrationId":null}},
		"Configs":{"Request":{"url":"https://api.cloudflareclient.com","headers":{"authorization":null,"content-type":"application/json","user-agent":"1.1.1.1/2109031904.1 CFNetwork/1327.0.4 Darwin/21.2.0","cf-client-version":"i-6.7-2109031904.1"}},"Environment":{"iOS":{"Type":"i","Version":"v0i2109031904","headers":{"user-agent":"1.1.1.1/2109031904.1 CFNetwork/1327.0.4 Darwin/21.2.0","cf-client-version":"i-6.7-2109031904.1"}},"macOS":{"Type":"m","Version":"v0i2109031904","headers":{"user-agent":"1.1.1.1/2109031904.1 CFNetwork/1327.0.4 Darwin/21.2.0","cf-client-version":"m-2021.12.1.0-0"}},"Android":{"Type":"a","Version":"v0a1922","headers":{"user-agent":"okhttp/3.12.1","cf-client-version":"a-6.3-1922"}},"Windows":{"Type":"w","Version":"","headers":{"user-agent":"","cf-client-version":""}},"Linux":{"Type":"l","Version":"","headers":{"user-agent":"","cf-client-version":""}}}}
	}
};

// headers转小写
for (const [key, value] of Object.entries($request.headers)) {
	delete $request.headers[key]
	$request.headers[key.toLowerCase()] = value
};

/***************** Processing *****************/
(async () => {
	const { Settings, Caches } = await setENV("Cloudflare", "1dot1dot1dot1", DataBase);
	const WireGuard = await getENV("WireGuard", "VPN", DataBase);
	const Type = RegExp(`/reg/${Settings.Verify.RegistrationId}$`, "i").test($request.url) ? "RegistrationId"
		: /\/reg\//i.test($request.url) ? "Registration"
			: undefined
	$.log(`🚧 ${$.name}, Set Environment Variables`, `Type: ${Type}`, "");
	await setCaches("Cloudflare", "1dot1dot1dot1", $request.url, $request.headers);
	if (typeof $request.body !== "undefined") { // 有请求体
		let body = JSON.parse($request.body);
		switch (Type) {
			case "Registration": // 是注册链接
				break;
			case "RegistrationId": // 是指定注册链接
				if ($request.method === "PUT") { // 是PUT方法
					body.key = WireGuard.Settings.PublicKey;
					$.msg($.name, "重置密钥", `发送请求数据，请求中的客户端公钥已替换为:\n${WireGuard.Settings.PublicKey}\n等待回复数据`);
					//$.log($.name, "重置密钥", "发送请求数据，请求中的客户端公钥已替换为:", WireGuard.Settings.PublicKey, "等待回复数据", "");
				}
				break;
		};
		$request.body = JSON.stringify(body);
	}
})()
	.catch((e) => $.logErr(e))
	.finally(() => {
		if ($.isQuanX()) $.done({ body: $request.body })
		else $.done($request)
	})

/***************** Function *****************/
/**
 * Get Environment Variables
 * @link https://github.com/VirgilClyne/VirgilClyne/blob/main/function/getENV/getENV.min.js
 * @author VirgilClyne
 * @param {String} t - Persistent Store Key
 * @param {String} e - Platform Name
 * @param {Object} n - Default Database
 * @return {Promise<*>}
 */
async function getENV(t,e,n){let i=$.getjson(t,n),s={};if("undefined"!=typeof $argument&&Boolean($argument)){let t=Object.fromEntries($argument.split("&").map((t=>t.split("="))));for(let e in t)f(s,e,t[e])}let g={...n?.Default?.Settings,...n?.[e]?.Settings,...i?.[e]?.Settings,...s},o={...n?.Default?.Configs,...n?.[e]?.Configs,...i?.[e]?.Configs},a=i?.[e]?.Caches||void 0;return"string"==typeof a&&(a=JSON.parse(a)),{Settings:g,Caches:a,Configs:o};function f(t,e,n){e.split(".").reduce(((t,i,s)=>t[i]=e.split(".").length===++s?n:t[i]||{}),t)}}

/**
 * Set Environment Variables
 * @author VirgilClyne
 * @param {String} name - Persistent Store Key
 * @param {String} platform - Platform Name
 * @param {Object} database - Default DataBase
 * @return {Promise<*>}
 */
async function setENV(name, platform, database) {
	$.log(`⚠ ${$.name}, Set Environment Variables`, "");
	let { Settings, Caches = {}, Configs } = await getENV(name, platform, database);
	/***************** Prase *****************/
	Settings.Switch = JSON.parse(Settings.Switch) // BoxJs字符串转Boolean
	switch (Settings.Verify.Mode) {
		case "Token":
			Configs.Request.headers["authorization"] = `Bearer ${Settings.Verify.Content}`;
			break;
		case "ServiceKey":
			Configs.Request.headers["x-auth-user-service-key"] = Settings.Verify.Content;
			break;
		case "Key":
			Settings.Verify.Content = Array.from(Settings.Verify.Content.split("\n"))
			//$.log(JSON.stringify(Settings.Verify.Content))
			Configs.Request.headers["x-auth-key"] = Settings.Verify.Content[0];
			Configs.Request.headers["x-auth-email"] = Settings.Verify.Content[1];
			break;
		default:
			$.log("无可用授权方式", `Mode=${Settings.Verify.Mode}`, `Content=${Settings.Verify.Content}`);
			break;
	};
	$.log(`🎉 ${$.name}, Set Environment Variables`, `Settings: ${typeof Settings}`, `Settings内容: ${JSON.stringify(Settings)}`, "");
	return { Settings, Caches, Configs }
};

/**
 * Set Caches
 * @author VirgilClyne
 * @param {String} name - Persistent Store Key
 * @param {String} platform - Platform Name
 * @param {String} url - Request URL
 * @param {Object} headers - Request Headers
 * @return {Promise<*>}
 */
async function setCaches(name, platform, url, headers) {
	// 转存必要值
	const newCaches = {
		"url": url,
		"headers": headers
	};
	// 写入Caches
	$.setjson(newCaches, `@${name}.${platform}.Caches`);
};

/***************** Env *****************/
// prettier-ignore
// https://github.com/chavyleung/scripts/blob/master/Env.min.js
function Env(t,e){class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.encoding="utf-8",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`\ud83d\udd14${this.name}, \u5f00\u59cb!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $environment&&$environment["surge-version"]}isLoon(){return"undefined"!=typeof $loon}isShadowrocket(){return"undefined"!=typeof $rocket}isStash(){return"undefined"!=typeof $environment&&$environment["stash-version"]}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),a={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(a,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()||this.isStash()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()||this.isStash()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){if(t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()||this.isStash())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status?s.status:s.statusCode,s.status=s.statusCode),e(t,s,i)});else if(this.isQuanX())this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t&&t.error||"UndefinedError"));else if(this.isNode()){let s=require("iconv-lite");this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();s&&this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:i,statusCode:r,headers:o,rawBody:h}=t,a=s.decode(h,this.encoding);e(null,{status:i,statusCode:r,headers:o,rawBody:h,body:a},a)},t=>{const{message:i,response:r}=t;e(i,r,r&&s.decode(r.rawBody,this.encoding))})}}post(t,e=(()=>{})){const s=t.method?t.method.toLocaleLowerCase():"post";if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon()||this.isStash())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient[s](t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status?s.status:s.statusCode,s.status=s.statusCode),e(t,s,i)});else if(this.isQuanX())t.method=s,this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t&&t.error||"UndefinedError"));else if(this.isNode()){let i=require("iconv-lite");this.initGotEnv(t);const{url:r,...o}=t;this.got[s](r,o).then(t=>{const{statusCode:s,statusCode:r,headers:o,rawBody:h}=t,a=i.decode(h,this.encoding);e(null,{status:s,statusCode:r,headers:o,rawBody:h,body:a},a)},t=>{const{message:s,response:r}=t;e(s,r,r&&i.decode(r.rawBody,this.encoding))})}}time(t,e=null){const s=e?new Date(e):new Date;let i={"M+":s.getMonth()+1,"d+":s.getDate(),"H+":s.getHours(),"m+":s.getMinutes(),"s+":s.getSeconds(),"q+":Math.floor((s.getMonth()+3)/3),S:s.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(s.getFullYear()+"").substr(4-RegExp.$1.length)));for(let e in i)new RegExp("("+e+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?i[e]:("00"+i[e]).substr((""+i[e]).length)));return t}queryStr(t){let e="";for(const s in t){let i=t[s];null!=i&&""!==i&&("object"==typeof i&&(i=JSON.stringify(i)),e+=`${s}=${i}&`)}return e=e.substring(0,e.length-1),e}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()||this.isStash()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl,i=t["update-pasteboard"]||t.updatePasteboard;return{"open-url":e,"media-url":s,"update-pasteboard":i}}if(this.isSurge()||this.isStash()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};if(this.isMute||(this.isSurge()||this.isLoon()||this.isStash()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r))),!this.isMuteLog){let t=["","==============\ud83d\udce3\u7cfb\u7edf\u901a\u77e5\ud83d\udce3=============="];t.push(e),s&&t.push(s),i&&t.push(i),console.log(t.join("\n")),this.logs=this.logs.concat(t)}}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!(this.isSurge()||this.isQuanX()||this.isLoon()||this.isStash());s?this.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t.stack):this.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`\ud83d\udd14${this.name}, \u7ed3\u675f! \ud83d\udd5b ${s} \u79d2`),this.log(),this.isSurge()||this.isQuanX()||this.isLoon()||this.isStash()?$done(t):this.isNode()&&process.exit(1)}}(t,e)}
