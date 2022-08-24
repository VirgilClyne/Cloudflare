/*
README:https://github.com/VirgilClyne/GetSomeFries
*/

// refer:https://github.com/phil-r/node-cloudflare-ddns

const $ = new Env("Cloudflare DNS v2.0.0-beta22");
const DataBase = {
	"DNS": {
		"Settings": {
			"Switch": true,
			"Verify": {
				"Mode": "Token",
				// Requests
				// https://api.cloudflare.com/#getting-started-requests
				"Content": ""
				// API Tokens
				// API Tokens provide a new way to authenticate with the Cloudflare API.
				//"Content":"8M7wS6hCpXVc-DoRnPPY_UCWPgy8aea4Wy6kCe5T"
				// API Keys
				// All requests must include both X-AUTH-KEY and X-AUTH-EMAIL headers to authenticate.
				// Requests that use X-AUTH-USER-SERVICE-KEY can use that instead of the Auth-Key and Auth-Email headers.
				/*
				//Set your account email address and API key. The API key can be found on the My Profile -> API Tokens page in the Cloudflare dashboard.
				"Content":["1234567893feefc5f0q5000bfo0c38d90bbeb",
				//Your contact email address
				"example@example.com" ]
				//User Service Key, A special Cloudflare API key good for a restricted set of endpoints. Always begins with "v1.0-", may vary in length.
				"Content": "v1.0-e24fd090c02efcfecb4de8f4ff246fd5c75b48946fdf0ce26c59f91d0d90797b-cfa33fe60e8e34073c149323454383fc9005d25c9b4c502c2f063457ef65322eade065975001a0b4b4c591c5e1bd36a6e8f7e2d4fa8a9ec01c64c041e99530c2-07b9efe0acd78c82c8d9c690aacb8656d81c369246d7f996a205fe3c18e9254a"
				*/
			},
			// Zone
			// https://api.cloudflare.com/#zone-properties
			"zone": {
				// Zone Details
				// https://api.cloudflare.com/#zone-zone-details
				"id": "",
				// List Zones
				// https://api.cloudflare.com/#zone-list-zones
				"name": "", //The domain/website name you want to run updates for (e.g. example.com)
				// DNS Records for a Zone
				// https://api.cloudflare.com/#dns-records-for-a-zone-properties
				"dns_records": [
					{
						// DNS Record Details
						// https://api.cloudflare.com/#dns-records-for-a-zone-dns-record-details
						"id": "",
						// List DNS Records
						// https://api.cloudflare.com/#dns-records-for-a-zone-list-dns-records
						// type
						// DNS record type
						"type": "A",
						// name
						// DNS record name
						"name": "",
						// content
						// DNS record content
						"content": "",
						// ttl
						// Time to live, in seconds, of the DNS record. Must be between 60 and 86400, or 1 for "automatic"
						"ttl": 1,
						// priority
						// Required for MX, SRV and URI records; unused by other record types.
						//"priority":10,
						// proxied
						// Whether the record is receiving the performance and security benefits of Cloudflare
						"proxied": false //Whether the record is receiving the performance and security benefits of Cloudflare
					}
				]
			}
		},
		"Configs": {
			"Request": {
				// Endpoints
				// https://api.cloudflare.com/#getting-started-endpoints
				"url": "https://api.cloudflare.com/client/v4",
				"headers": {
					"Host": "api.cloudflare.com",
					"Content-Type": "application/json",
				}
			}
		}
	}
};

/***************** Processing *****************/
(async () => {
	const { Settings, Configs } = await setENV("Cloudflare", "DNS", DataBase);
	// Step 1
	let status = await Verify(Configs.Request, Settings.Verify);
	//let status = true;
	if (status === true) {
		$.log("验证成功");
		// Step 2
		Settings.zone = await checkZoneInfo(Configs.Request, Settings.zone);
		// Step 3 4 5
		await Promise.allSettled(Settings.zone.dns_records.map(async dns_record => {
			$.log(`开始更新${dns_record.type}类型记录`);
			//Step 3
			let oldRecord = await checkRecordInfo(Configs.Request, Settings.zone, dns_record);
			//Step 4
			let newRecord = await checkRecordContent(dns_record);
			//Step 5
			let Record = await setupRecord(Configs.Request, Settings.zone, oldRecord, newRecord);
			$.log(`${Record.name}上的${Record.type}记录${Record.content}更新完成`, "");
		}));
	} else throw new Error("验证失败")
})()
	.catch((e) => $.logErr(e))
	.finally(() => $.done())

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
			Configs.Request.headers["Authorization"] = `Bearer ${Settings.Verify.Content}`;
			break;
		case "ServiceKey":
			Configs.Request.headers["X-Auth-User-Service-Key"] = Settings.Verify.Content;
			break;
		case "Key":
			Settings.Verify.Content = Array.from(Settings.Verify.Content.split("\n"))
			//$.log(JSON.stringify(Settings.Verify.Content))
			Configs.Request.headers["X-Auth-Key"] = Settings.Verify.Content[0];
			Configs.Request.headers["X-Auth-Email"] = Settings.Verify.Content[1];
			break;
		default:
			$.log("无可用授权方式", `Mode=${Settings.Verify.Mode}`, `Content=${Settings.Verify.Content}`, "");
			break;
	}
	Settings.zone.dns_records = Array.from(Settings.zone.dns_records.split("\n"))
	//$.log(JSON.stringify(Settings.zone.dns_records))
	Settings.zone.dns_records.forEach((item, i) => {
		Settings.zone.dns_records[i] = Object.fromEntries(item.split("&").map((item) => item.split("=")));
		Settings.zone.dns_records[i].proxied = JSON.parse(Settings.zone.dns_records[i].proxied);
	})
	//$.log(JSON.stringify(Settings.zone.dns_records));
	$.log(`🎉 ${$.name}, Set Environment Variables`, `Settings: ${typeof Settings}`, `Settings内容: ${JSON.stringify(Settings)}`, "");
	return { Settings, Caches, Configs }
};

//Step 1
//Verify API Token/Key
async function Verify(Request, Verify) {
	$.log("验证授权");
	let result = {};
	switch (Verify.Mode) {
		case "Token":
			result = await Cloudflare("verifyToken", Request);
			break;
		case "ServiceKey":
		case "Key":
			result = await Cloudflare("getUser", Request);
			break;
		default:
			$.log("无可用授权方式", `Mode=${Verify.Mode}`, `Content=${Verify.Content}`, "");
			break;
	}
	if (result?.status === "active") return true;
	else if (result?.suspended === false) return true;
	else return false;
};

//Step 2
async function checkZoneInfo(Request, Zone) {
	$.log("查询区域信息");
	let newZone = {};
	if (Zone?.id && Zone?.name) {
		$.log(`有区域ID${Zone.id}和区域名称${Zone.name}, 继续`, "");
		newZone = Zone;
	} else if (Zone?.id) {
		$.log(`有区域ID${Zone.id}, 继续`, "");
		newZone = await Cloudflare("getZone", Request, Zone);
	} else if (Zone?.name) {
		$.log(`有区域名称${Zone.name}, 继续`, "");
		newZone = await Cloudflare("listZones", Request, Zone);
	} else {
		$.logErr("未提供记录ID和名称, 终止", "");
		$.done();
	}
	$.log(`区域查询结果:`, `ID:${newZone.id}`, `名称:${newZone.name}`, `状态:${newZone.status}`, `仅DNS服务:${newZone.paused}`, `类型:${newZone.type}`, `开发者模式:${newZone.development_mode}`, `名称服务器:${newZone.name_servers}`, `原始名称服务器:${newZone.original_name_servers}`, "");
	const result = { ...Zone, ...newZone };
	return result;
};

//Step 3
async function checkRecordContent(Record) {
	if (Record.type) {
		$.log(`有类型${Record.type}, 继续`, "");
		if (!Record.content) {
			$.log("无内容, 继续", "");
			switch (Record.type) {
				case "A":
					Record.content = await getPublicIP(4);
					break;
				case "AAAA":
					Record.content = await getPublicIP(6);
					break;
				case undefined:
					$.log("无类型, 跳过", "");
					break;
				default:
					$.log(`类型${Record.type}, 跳过`, "");
					break;
			}
		} else $.log(`有内容${Record.content}, 跳过`, "");
	} else {
		$.log(`无类型${Record.type}, 跳过`, "");
	}
	$.log(`${Record.type}类型内容: ${Record.content}`, "");
	return Record;
};

//Step 4
async function checkRecordInfo(Request, Zone, Record) {
	$.log("查询记录信息");
	let oldRecord = {};
	if (Record.id) {
		$.log(`有记录ID${Record.id}, 继续`, "");
		oldRecord = await Cloudflare("getDNSRecord", Request, Zone, Record);
	} else if (Record.name) {
		$.log(`有记录名称${Record.name}, 继续`, "");
		oldRecord = await Cloudflare("listDNSRecords", Request, Zone, Record);
	} else {
		$.log("未提供记录ID和名称, 终止", "");
		$.done();
	}
	$.log(`记录查询结果:`, `ID:${oldRecord.id}`, `名称:${oldRecord.name}`, `类型:${oldRecord.type}`, `内容:${oldRecord.content}`, `代理状态:${oldRecord.proxied}`, `TTL:${oldRecord.ttl}`, "");
	return oldRecord
}

//Step 5
async function setupRecord(Request, Zone, oldRecord, newRecord) {
	$.log("开始更新内容");
	let Record = {};
	if (!oldRecord.content) {
		$.log("无记录");
		Record = await Cloudflare("createDNSRecord", Request, Zone, newRecord);
	} else if (oldRecord.content !== newRecord.content) {
		$.log("有记录且IP地址不同");
		Record = await Cloudflare("updateDNSRecord", Request, Zone, { ...oldRecord, ...newRecord });
	} else if (oldRecord.content === newRecord.content) {
		$.log("有记录且IP地址相同");
		Record = oldRecord;
	}
	$.log(`记录更新结果:`, `ID:${Record.id}`, `名称:${Record.name}`, `类型:${Record.type}`, `内容:${Record.content}`, `可代理:${Record.proxiable}`, `代理状态:${Record.proxied}`, `TTL:${Record.ttl}`, `已锁定:${Record.locked}`, "");
	return Record
}

/***************** Cloudflare API v4 *****************/
async function Cloudflare(opt, Request, Zone = {}, Record = { "type": "", name: "", content: "", "ttl": 1, "priority": 10, "proxied": true }) {
	/*
	let Request = {
		// Endpoints
		// https://api.cloudflare.com/#getting-started-endpoints
		"url": "https://api.cloudflare.com/client/v4",
		"headers": {
			"Host": "api.cloudflare.com",
			"Content-Type": "application/json",
		}
	}
	*/
	let _Request = JSON.parse(JSON.stringify(Request));
	switch (opt) {
		case "trace":
			_Request.url = "https://1.1.1.1/cdn-cgi/trace"
			//_Request.url = "https://[2606:4700:4700::1111]/cdn-cgi/trace"
			return await getCloudflareJSON(_Request);
			async function getCloudflareJSON(request) {
				return await $.http.get(request).then(data => {
					let arr = data.trim().split('\n').map(e => e.split('='))
					return Object.fromEntries(arr)
				})
			};
		case "verifyToken":
			// Verify Token
			// https://api.cloudflare.com/#user-api-tokens-verify-token
			$.log("验证令牌");
			_Request.url += "/user/tokens/verify";
			return await getCFjson(_Request);
		case "getUser":
			// User Details
			// https://api.cloudflare.com/#user-user-details
			$.log("获取用户信息");
			_Request.url += "/user";
			return await getCFjson(_Request);
		case "getZone":
			// Zone Details
			// https://api.cloudflare.com/#zone-zone-details
			$.log("获取区域详情");
			_Request.url += `/zones/${Zone.id}`;
			return await getCFjson(_Request);
		case "listZones":
			// List Zones
			// https://api.cloudflare.com/#zone-list-zones
			$.log("列出区域");
			_Request.url += `/zones?name=${Zone.name}`;
			return await getCFjson(_Request);
		case "createDNSRecord":
			// Create DNS Record
			// https://api.cloudflare.com/#dns-records-for-a-zone-create-dns-record
			$.log("创建新记录");
			_Request.method = "post";
			_Request.url += `/zones/${Zone.id}/dns_records`;
			_Request.body = Record;
			return await fatchCFjson(_Request);
		case "getDNSRecord":
			// DNS Record Details
			// https://api.cloudflare.com/#dns-records-for-a-zone-dns-record-details
			$.log("获取记录详情");
			_Request.url += `/zones/${Zone.id}/dns_records/${Record.id}`;
			return await getCFjson(_Request);
		case "listDNSRecords":
			// List DNS Records
			// https://api.cloudflare.com/#dns-records-for-a-zone-list-dns-records
			$.log("列出记录");
			_Request.url += `/zones/${Zone.id}/dns_records?type=${Record.type}&name=${Record.name}.${Zone.name}&order=type`;
			return await getCFjson(_Request);
		case "updateDNSRecord":
			// Update DNS Record
			// https://api.cloudflare.com/#dns-records-for-a-zone-update-dns-record
			$.log("更新记录");
			_Request.method = "put";
			_Request.url += `/zones/${Zone.id}/dns_records/${Record.id}`;
			_Request.body = Record;
			return await fatchCFjson(_Request);
		default:
			$.logErr("未设置操作类型", `opt=${opt}`, `Request=${JSON.stringify(Request)}`, "");
			return $.done();
	};
	/***************** Cloudflare API v4 *****************/
	// Function 0A
	// Get Cloudflare JSON
	function getCFjson(request) {
		return new Promise((resolve) => {
			$.get(request, (error, response, data) => {
				try {
					if (error) throw new Error(error)
					else if (data) {
						const _data = JSON.parse(data)
						if (Array.isArray(_data.messages) && _data.messages.length != 0) _data.messages.forEach(element => {
							if (element.code !== 10000) $.msg($.name, `code: ${element.code}`, `message: ${element.message}`);
						})
						if (_data.success === true) {
							if (Array.isArray(_data.result) && _data.result.length != 0) resolve(_data.result[0]);
							else resolve(_data.result);
						} else if (_data.success === false) {
							if (Array.isArray(_data.errors) && _data.errors.length != 0) _data.errors.forEach(element => { $.msg($.name, `code: ${element.code}`, `message: ${element.message}`); })
						}
					} else throw new Error(response);
				} catch (e) {
					$.logErr(`❗️${$.name}, ${getCFjson.name}执行失败`, `request = ${JSON.stringify(request)}`, ` error = ${error || e}`, `response = ${JSON.stringify(response)}`, `data = ${data}`, "")
				} finally {
					//$.log(`🚧 ${$.name}, ${getCFjson.name}调试信息`, `request = ${JSON.stringify(request)}`, `data = ${data}`, "")
					resolve()
				}
			})
		})
	};

	// Function 0B
	// Fatch Cloudflare JSON
	function fatchCFjson(request) {
		return new Promise((resolve) => {
			$.post(request, (error, response, data) => {
				try {
					if (error) throw new Error(error)
					else if (data) {
						const _data = JSON.parse(data)
						if (Array.isArray(_data.messages) && _data.messages.length != 0) _data.messages.forEach(element => { $.msg($.name, `code: ${element.code}`, `message: ${element.message}`); })
						if (_data.success === true) {
							if (Array.isArray(_data.result) && _data.result.length != 0) resolve(_data.result[0]);
							else resolve(_data.result); // _data.result, _data.meta
						} else if (_data.success === false) {
							if (Array.isArray(_data.errors) && _data.errors.length != 0) _data.errors.forEach(element => { $.msg($.name, `code: ${element.code}`, `message: ${element.message}`); })
						}
					} else throw new Error(response);
				} catch (e) {
					$.logErr(`❗️${$.name}, ${fatchCFjson.name}执行失败`, `request = ${JSON.stringify(request)}`, ` error = ${error || e}`, `response = ${JSON.stringify(response)}`, `data = ${data}`, "")
				} finally {
					//$.log(`🚧 ${$.name}, ${fatchCFjson.name}调试信息`, `request = ${JSON.stringify(request)}`, `data = ${data}`, "")
					resolve()
				}
			})
		})
	};
};

// Function 1A
// Get Public IP / External IP address
// https://www.my-ip.io/api
async function getPublicIP(type) {
	$.log("获取公共IP");
	let _Request = { url: `https://api${type}.my-ip.io/ip.json` };
	$.log(`🚧 _Request=${JSON.stringify(_Request)}`);
	let _data = await $.http.get(_Request).then(response => JSON.parse(response.body));
	$.log(`🚧 _data=${JSON.stringify(_data)}`);
	switch (_data.success) {
		case true:
			return _data.ip;
		case false:
			if (Array.isArray(_data.errors) && _data.errors.length != 0) _data.errors.forEach(element => { $.msg($.name, `code: ${element.code}`, `message: ${element.message}`); })
			break;
		default:
			if (Array.isArray(_data.result) && _data.result.length != 0) return _data.result[0];
			else return _data.result;
	};
};

/***************** Env *****************/
// prettier-ignore
// https://github.com/chavyleung/scripts/blob/master/Env.min.js
function Env(t,e){class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.encoding="utf-8",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`🔔${this.name}, 开始!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}isShadowrocket(){return"undefined"!=typeof $rocket}isStash(){return"undefined"!=typeof $environment&&$environment["stash-version"]}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,n]=i.split("@"),a={url:`http://${n}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(a,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),n=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(n);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){if(t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status?s.status:s.statusCode,s.status=s.statusCode),e(t,s,i)});else if(this.isQuanX())this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t&&t.error||"UndefinedError"));else if(this.isNode()){let s=require("iconv-lite");this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();s&&this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:i,statusCode:r,headers:o,rawBody:n}=t,a=s.decode(n,this.encoding);e(null,{status:i,statusCode:r,headers:o,rawBody:n,body:a},a)},t=>{const{message:i,response:r}=t;e(i,r,r&&s.decode(r.rawBody,this.encoding))})}}post(t,e=(()=>{})){const s=t.method?t.method.toLocaleLowerCase():"post";if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient[s](t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status?s.status:s.statusCode,s.status=s.statusCode),e(t,s,i)});else if(this.isQuanX())t.method=s,this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t&&t.error||"UndefinedError"));else if(this.isNode()){let i=require("iconv-lite");this.initGotEnv(t);const{url:r,...o}=t;this.got[s](r,o).then(t=>{const{statusCode:s,statusCode:r,headers:o,rawBody:n}=t,a=i.decode(n,this.encoding);e(null,{status:s,statusCode:r,headers:o,rawBody:n,body:a},a)},t=>{const{message:s,response:r}=t;e(s,r,r&&i.decode(r.rawBody,this.encoding))})}}time(t,e=null){const s=e?new Date(e):new Date;let i={"M+":s.getMonth()+1,"d+":s.getDate(),"H+":s.getHours(),"m+":s.getMinutes(),"s+":s.getSeconds(),"q+":Math.floor((s.getMonth()+3)/3),S:s.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(s.getFullYear()+"").substr(4-RegExp.$1.length)));for(let e in i)new RegExp("("+e+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?i[e]:("00"+i[e]).substr((""+i[e]).length)));return t}queryStr(t){let e="";for(const s in t){let i=t[s];null!=i&&""!==i&&("object"==typeof i&&(i=JSON.stringify(i)),e+=`${s}=${i}&`)}return e=e.substring(0,e.length-1),e}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl,i=t["update-pasteboard"]||t.updatePasteboard;return{"open-url":e,"media-url":s,"update-pasteboard":i}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};if(this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r))),!this.isMuteLog){let t=["","==============📣系统通知📣=============="];t.push(e),s&&t.push(s),i&&t.push(i),console.log(t.join("\n")),this.logs=this.logs.concat(t)}}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`❗️${this.name}, 错误!`,t.stack):this.log("",`❗️${this.name}, 错误!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`🔔${this.name}, 结束! 🕛 ${s} 秒`),this.log(),this.isSurge()||this.isQuanX()||this.isLoon()?$done(t):this.isNode()&&process.exit(1)}}(t,e)}
