/*
README:https://github.com/VirgilClyne/GetSomeFries
*/

// refer:https://github.com/ViRb3/wgcf
// refer:https://github.com/yyuueexxiinngg/some-scripts/blob/master/cloudflare/warp2wireguard.js

const $ = new Env('Cloudflare WARP v2.0.0-beta3');
const DataBase = {
	"Settings": {
		"Switch": true,
		"deviceType": "iOS",
		"Verify": {
			"License": null,
			"Mode": "Token",
			"Content": null,
			"RegistrationId": null
		}
	},
	"Configs": {
		"Request": {
			"url": "https://api.cloudflareclient.com",
			"headers": {
				"Host": "api.cloudflareclient.com",
				"Authorization": null,
				"Content-Type": "application/json",
				"User-Agent": "1.1.1.1/2109031904.1 CFNetwork/1327.0.4 Darwin/21.2.0",
				//"User-Agent": "1.1.1.1/1909221500.1 CFNetwork/978.0.7 Darwin/18.7.0",
				//"User-Agent": "okhttp/3.12.1",
				//"User-Agent": "WARP",
				"CF-Client-Version": "i-6.7-2109031904.1"
				//"CF-Client-Version": "m-2021.12.1.0-0",
				//"CF-Client-Version": "a-6.3-1922",
				//"Debug": false
			}
		},
		"Environment": {
			"iOS": {
				"Type": "i",
				"Version": "v0i2109031904",
				"headers": {
					"User-Agent": "1.1.1.1/2109031904.1 CFNetwork/1327.0.4 Darwin/21.2.0",
					"CF-Client-Version": "i-6.7-2109031904.1"
				}
			},
			"macOS": {
				"Type": "m",
				"Version": "v0i2109031904",
				"headers": {
					"User-Agent": "1.1.1.1/2109031904.1 CFNetwork/1327.0.4 Darwin/21.2.0",
					"CF-Client-Version": "m-2021.12.1.0-0"
				}
			},
			"Android": {
				"Type": "a",
				"Version": "v0a1922",
				"headers": {
					"User-Agent": "okhttp/3.12.1",
					"CF-Client-Version": "a-6.3-1922"
				}
			},
			"Windows": {
				"Type": "w",
				"Version": "",
				"headers": {
					"User-Agent": "",
					"CF-Client-Version": ""
				}
			},
			"Linux": {
				"Type": "l",
				"Version": "",
				"headers": {
					"User-Agent": "",
					"CF-Client-Version": ""
				}
			},
		}
	}
};

/***************** Processing *****************/
(async () => {
	const { Settings, Caches, Configs } = await setENV("Cloudflare", "WARP", DataBase);
	await WARP($.Cloudflare.WARP.setupMode, $.Cloudflare.WARP.Environment, $.Cloudflare.WARP.Verify, $.WireGuard)
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
			$.log("无可用授权方式", `Mode=${Settings.Verify.Mode}`, `Content=${Settings.Verify.Content}`);
			break;
	};
	Settings.Environment.Type = Configs.Environment[Settings.deviceType].Type;
	Settings.Environment.Version = Configs.Environment[Settings.deviceType].Version;
	Configs.Request.headers["User-Agent"] = Configs.Environment[Settings.deviceType].headers["User-Agent"];
	Configs.Request.headers["CF-Client-Version"] = Configs.Environment[Settings.deviceType].headers["CF-Client-Version"];
	$.log(`🎉 ${$.name}, Set Environment Variables`, `Settings: ${typeof Settings}`, `Settings内容: ${JSON.stringify(Settings)}`, "");
	return { Settings, Caches, Configs }
};

//Step 3
async function WARP(setupMode, Environment, Verify, WireGuard) {
	try {
		$.log(`开始运行,模式:${setupMode}`, '');
		var result = (setupMode == "RegisterNewAccount") ? await RegisterNewAccount(Environment, Verify, WireGuard)
			: (setupMode == "RegisterNewAccountwithPublicKey") ? await RegisterNewAccountwithPublicKey(Environment, Verify, WireGuard)
				: (setupMode == "RegisterNewDevice") ? await RegisterNewDevice(Environment, Verify, WireGuard)
					: (setupMode == "RebindingLicense") ? await RebindingLicense(Environment, Verify)
						: (setupMode == "ChangeKeypair") ? await ChangeKeypair(Environment, Verify, WireGuard)
							: (setupMode == "AccountDetail") ? await AccountDetail(Environment, Verify)
								: (setupMode == "DeviceDetail") ? await DeviceDetail(Environment, Verify)
									: (setupMode == "AutoAffWARP") ? $.log('没写', '') //await autoAFF(License, AffID)
										: $.log(`未选择运行模式或不符合模式:${setupMode}运行要求，退出`, `setupMode = ${setupMode}`, `License = ${Verify.License}`, `RegistrationId = ${Verify.RegistrationId}`, '');
	} catch (e) {
		$.logErr(e);
	} finally {
		return $.log(`${WARP.name}完成, 模式:${setupMode}执行完成, 当前账户信息:`, `帐户类型:${result?.account?.account_type}`, `帐户ID:${result?.account?.id}`, '账户ID:等同于匿名账号', `许可证:${result?.account?.license ?? Verify?.License}`, '许可证:可付费购买的订阅，流量，邀请奖励均绑定于许可证，仅个人版有许可证，一个许可证可以绑定5个设备(注册ID)', `注册ID:${result?.id ?? Verify?.RegistrationId}`, '注册ID:相当于WARP的客户端或设备ID，配置信息均关联到此注册ID', `令牌:${result?.token ?? Verify?.Content}`, '令牌:相当于密码，更新读取对应账号所需，如果要更新注册ID的配置或者更改关联的许可证，需要此令牌验证收发数据', '', `完整输出结果: ${JSON.stringify(result)}`, '');
		//return $.log(`${WARP.name}完成, 模式:${setupMode}`, `result = ${JSON.stringify(result)}`, '');
		//return $.log(`${WARP.name}完成`, `名称:${dns_records.name}`, `type:${dns_records.type}`, `content:${dns_records.content}`, '');
	}
};

/***************** Setup Mode *****************/
// Setup Mode 1
// Register New Account
async function RegisterNewAccount(Environment, Verify, WireGuard) {
	if (!Verify.RegistrationId && !WireGuard.PublicKey) {
		$.log('无设备ID(RegistrationId), 无自定义公钥(publicKey)', '');
		var result = await regAccount(Environment.Version, Verify.RegistrationId, WireGuard.PublicKey, Environment.Locale, Environment.deviceModel, Environment.Type, Environment.warp_enabled);
		//$.log(`🎉 ${$.name}, ${RegisterNewAccount.name}执行完成, 当前账户信息:`, `帐户类型:${result.account.account_type}`, `帐户ID:${result.account.id}`, '账户ID:等同于匿名账号', `许可证:${result.account.license}`, '许可证:可付费购买的订阅，流量，邀请奖励均绑定于许可证，一个许可证可以绑定5个设备(注册ID)', `注册ID:${result.id}`, '注册ID:相当于WARP的客户端或设备ID，配置信息均关联到此注册ID', `令牌:${result.token}`, '令牌:相当于密码，更新读取对应账号所需，如果要更新注册ID的配置或者更改关联的许可证，需要此令牌验证收发数据', '');
		return result;
	} else {
		$.log(`不符合运行要求，退出，此模式要求为:`, '无设备ID(RegistrationId), 无自定义公钥(publicKey)', '');
		$.done();
	}
}

// Setup Mode 2
// Register New Account with Public Key
async function RegisterNewAccountwithPublicKey(Environment, Verify, WireGuard) {
	if (!Verify.RegistrationId && WireGuard.PrivateKey && WireGuard.PublicKey) {
		$.log('无设备ID(RegistrationId)', '有自定义私钥(PrivateKey)', '有自定义公钥(PublicKey)', '');
		var result = await regAccount(Environment.Version, Verify.RegistrationId, WireGuard.PublicKey, Environment.Locale, Environment.deviceModel, Environment.Type, Environment.warp_enabled);
		//$.log(`🎉 ${$.name}, ${RegisterNewAccountwithPublicKey.name}执行完成, 当前账户信息:`, `帐户类型:${result.account.account_type}`, `帐户ID:${result.account.id}`, '账户ID:等同于匿名账号', `许可证:${result.account.license}`, '许可证:可付费购买的订阅，流量，邀请奖励均绑定于许可证，一个许可证可以绑定5个设备(注册ID)', `注册ID:${result.id}`, '注册ID:相当于WARP的客户端或设备ID，配置信息均关联到此注册ID', `令牌:${result.token}`, '令牌:相当于密码，更新读取对应账号所需，如果要更新注册ID的配置或者更改关联的许可证，需要此令牌验证收发数据', '');
		if (WireGuard.PrivateKey && WireGuard.PublicKey) {
			$.log('有自定义私钥(PrivateKey)', '有自定义公钥(PublicKey)', '');
			Verify.Content = result.token;
			await setupVerify(Verify.Mode, Verify.Content);
			$.WireGuard = await getDevice(Environment.Version, result.id);
			const SurgeConf = `
		[Proxy]
		WARP = wireguard, section-name = Cloudflare

		[Group]
		你的策略组 = 节点1, 节点2, 节点3, WARP

		[WireGuard Cloudflare]
		private-key = ${WireGuard.PrivateKey}
		self-ip = ${$.WireGuard?.config?.interface?.addresses?.v4}
		dns-server = 1.1.1.1
		mtu = 1280
		peer = (public-key = ${$.WireGuard?.config?.peers?.[0]?.public_key}, allowed-ips = 0.0.0.0/0, endpoint = ${$.WireGuard?.config?.peers?.[0]?.endpoint?.v4})
		`;
			$.log('Surge可用配置', SurgeConf)
			const wireGuardConf = `
		[Interface]
		PrivateKey = ${WireGuard.PrivateKey}
		PublicKey = ${$.WireGuard?.key}
		Address = ${$.WireGuard?.config?.interface?.addresses?.v4}
		Address = ${$.WireGuard?.config?.interface?.addresses?.v6}
		DNS = 1.1.1.1
	
		[Peer]
		PublicKey = ${$.WireGuard?.config?.peers?.[0]?.public_key}
		Endpoint = ${$.WireGuard?.config?.peers?.[0]?.endpoint?.v4}
		Endpoint = ${$.WireGuard?.config?.peers?.[0]?.endpoint?.v6}
		Endpoint = ${$.WireGuard?.config?.peers?.[0]?.endpoint?.host}
		AllowedIPs = 0.0.0.0/0
		`;
			$.log('WireGuard可用配置', wireGuardConf)
		}
		return result;
	} else {
		$.log(`不符合运行要求，退出，此模式要求为:`, '无设备ID(RegistrationId)', '有自定义私钥(PrivateKey)', '有自定义公钥(PublicKey)', '');
		$.done();
	}
}

// Setup Mode 3
// Register New Device
async function RegisterNewDevice(Environment, Verify, WireGuard) {
	if (Verify.RegistrationId) {
		$.log('有设备ID(RegistrationId)', '');
		var result = await regDevice(Environment.Version, Verify.RegistrationId, WireGuard.PublicKey, Environment.Locale, Environment.deviceModel, Environment.Type, Environment.warp_enabled);
		//$.log(`🎉 ${$.name}, ${RegisterNewDevice.name}执行完成, 当前账户信息:`, `帐户ID:${result.account.id}`, '账户ID:等同于匿名账号', `许可证:${result.account.license}`, '许可证:可付费购买的订阅，流量，邀请奖励均绑定于许可证，一个许可证可以绑定5个设备(注册ID)', `注册ID:${result.id}`, '注册ID:相当于WARP的客户端或设备ID，配置信息均关联到此注册ID', `令牌:${result.token}`, '令牌:相当于密码，更新读取对应账号所需，如果要更新注册ID的配置或者更改关联的许可证，需要此令牌验证收发数据', '');
		return result;
	} else {
		$.log(`不符合运行要求，退出，此模式要求为:`, '有设备ID(RegistrationId)', '');
		$.done();
	}
}

// Setup Mode 4
// Rebinding License
async function RebindingLicense(Environment, Verify) {
	if (Verify.RegistrationId && Verify.Content && Verify.License) {
		$.log('有设备ID(RegistrationId), 有验证内容(Content), 有许可证(License)', '');
		var result = await setAccountLicense(Environment.Version, Verify.RegistrationId, Verify.License);
		//$.log(`🎉 ${$.name}, ${RebindingLicense.name}执行完成, 当前配置文件信息为:`, `帐户ID:${result?.account?.id}`, '账户ID:等同于匿名账号', `许可证:${result?.account?.license}`, '许可证:可付费购买的订阅，流量，邀请奖励均绑定于许可证，一个许可证可以绑定5个设备(注册ID)', `注册ID:${result?.id}`, '注册ID:相当于WARP的客户端或设备ID，配置信息均关联到此注册ID', '');
		return result;
	} else {
		$.log(`不符合运行要求，退出，此模式要求为:`, '有设备ID(RegistrationId), 有验证内容(Content), 有许可证(License)', '');
		$.done();
	}
}

// Setup Mode 5
// Rebinding License
async function ChangeKeypair(Environment, Verify, WireGuard) {
	if (Verify.RegistrationId && Verify.Content && WireGuard.PublicKey) {
		$.log('有设备ID(RegistrationId), 有验证内容(Content), 有自定义公钥(publicKey)', '');
		var result = await setKeypair(Environment.Version, Verify.RegistrationId, WireGuard.PublicKey);
		$.log(`🎉 ${$.name}, ${ChangeKeypair.name}执行完成, 当前配置文件信息为:`);
		$.log(`此配置文件公钥:${result?.key}`, '');
		return result;
	} else {
		$.log(`不符合运行要求，退出，此模式要求为:`, '有设备ID(RegistrationId), 有验证内容(Content), 有自定义公钥(publicKey)', '');
		$.done();
	}
}

// Setup Mode 6
// Account Detail
async function AccountDetail(Environment, Verify) {
	if (Verify.RegistrationId && Verify.Content) {
		$.log('有设备ID(RegistrationId), 有验证内容(Content)', '');
		var result = await getAccount(Environment.Version, Verify.RegistrationId);
		$.log(`🎉 ${$.name}, ${AccountDetail.name}执行完成, 当前配置文件对应的账户信息为:`);
		$.log(`WARP+:${result?.warp_plus}`, 'WARP+:是否已启用WARP+', `Premium流量:${result?.premium_data}`, 'Premium流量:付费订阅WARP+的流量或者来自邀请等奖励的高级流量', `邀请人数:${result?.referral_count}`, '邀请人数:邀请新用户计数', `账户类型:${result?.account_type}`, '账户类型:付费或免费账户', '');
		return result;
	} else {
		$.log(`不符合运行要求，退出，此模式要求为:`, '有设备ID(RegistrationId), 有验证内容(Content)', '');
		$.done();
	}
}

// Setup Mode 7
// Account Detail
async function DeviceDetail(Environment, Verify) {
	if (Verify.RegistrationId && Verify.Content) {
		$.log('有设备ID(RegistrationId), 有验证内容(Content)', '');
		var result = await getDevices(Environment.Version, Verify.RegistrationId);
		$.log(`🎉 ${$.name}, ${DeviceDetail.name}执行完成, 当前配置文件对应的账户下的全部设备信息为:`);
		if (Array.isArray(result) && result.length != 0) {
			result.forEach((result, i) => {
				$.log(`设备${i}`, `激活状态:${result?.active}`, '激活状态:此配置(设备)是否已停用', `激活时间:${result?.activated}`, '激活时间:此设备上次激活的日期和时间', `注册ID:${result?.id}`, '注册ID:相当于WARP的客户端或设备ID，配置信息均关联到此注册ID', `设备角色:${result?.role}`, '设备角色:parent母设备(创建此账户或许可证的设备)，child子设备(加入此账户或许可证的设备)', `设备型号:${result?.model}`, '设备型号:顾名思义', `创建时间:${result?.created}`, '创建时间:创建此设备及对应配置文件的日期及时间', `设备类型:${result?.type}`, '设备类型:设备的平台或操作系统', `设备名称:${result?.name}`, '设备名称:顾名思义', '');
			})
		} else {
			$.log(`设备${0}`, `激活状态:${result?.active}`, '激活状态:此配置(设备)是否已停用', `激活时间:${result?.activated}`, '激活时间:此设备上次激活的日期和时间', `注册ID:${result?.id}`, '注册ID:相当于WARP的客户端或设备ID，配置信息均关联到此注册ID', `设备角色:${result?.role}`, '设备角色:parent母设备(创建此账户或许可证的设备)，child子设备(加入此账户或许可证的设备)', `设备型号:${result?.model}`, '设备型号:顾名思义', `创建时间:${result?.created}`, '创建时间:创建此设备及对应配置文件的日期及时间', `设备类型:${result?.type}`, '设备类型:设备的平台或操作系统', `设备名称:${result?.name}`, '设备名称:顾名思义', '');
		};
		return result;
	} else {
		$.log(`不符合运行要求，退出，此模式要求为:`, '有设备ID(RegistrationId), 有验证内容(Content)', '');
		$.done();
	}
}

/***************** Function *****************/

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
						if (Array.isArray(_data.messages)) _data.messages.forEach(message => {
							if (message.code !== 10000) $.msg($.name, `code: ${message.code}`, `message: ${message.message}`);
						})
						switch (_data.success) {
							case true:
								resolve(_data?.result?.[0] ?? _data?.result); // _data.result, _data.meta
								break;
							case false:
								if (Array.isArray(_data.errors)) _data.errors.forEach(error => { $.msg($.name, `code: ${error.code}`, `message: ${error.message}`); })
								break;
							case undefined:
								throw new Error(response);
						};
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
						if (Array.isArray(_data.messages)) _data.messages.forEach(message => {
							if (message.code !== 10000) $.msg($.name, `code: ${message.code}`, `message: ${message.message}`);
						})
						switch (_data.success) {
							case true:
								resolve(_data?.result?.[0] ?? _data?.result); // _data.result, _data.meta
								break;
							case false:
								if (Array.isArray(_data.errors)) _data.errors.forEach(error => { $.msg($.name, `code: ${error.code}`, `message: ${error.message}`); })
								break;
							case undefined:
								throw new Error(response);
						};
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

// Function 1
// Register New Account
async function regAccount(Version, referrer, publicKey, Locale = "en_US", deviceModel = "", Type = "", warp_enabled = true) {
	$.log('注册账户');
	const install_id = genString(11);
	var body = {
		install_id: install_id, // not empty on actual client
		fcm_token: `${install_id}:APA91b${genString(134)}`, // not empty on actual client
		referrer: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(referrer) ? referrer : "",
		key: publicKey,
		locale: Locale,
		//warp_enabled: warp_enabled,
		//model: deviceModel,
		tos: new Date().toISOString(),
		type: Type
	};
	const url = { method: 'post', url: `${$.VAL.url}/${Version}/reg`, headers: $.VAL.headers, body }
	return await fatchCFjson(url);
}

// Function 2
// Register New Device
async function regDevice(Version, RegistrationId, publicKey, Locale = "en_US", deviceModel = "", Type = "", warp_enabled = true) {
	$.log('注册设备');
	const install_id = genString(11);
	var body = {
		install_id: install_id, // not empty on actual client
		fcm_token: `${install_id}:APA91b${genString(134)}`, // not empty on actual client
		referrer: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(RegistrationId) ? RegistrationId : "",
		key: publicKey,
		locale: Locale,
		//warp_enabled: warp_enabled,
		//model: deviceModel,
		tos: new Date().toISOString(),
		type: Type
	};
	const url = { method: 'post', url: `${$.VAL.url}/${Version}/reg/${RegistrationId}`, headers: $.VAL.headers, body }
	return await fatchCFjson(url);
}

// Function 2
// Get the Device Detail
async function getDevice(Version, RegistrationId) {
	$.log('获取当前设备配置');
	const url = { url: `${$.VAL.url}/${Version}/reg/${RegistrationId}`, headers: $.VAL.headers };
	return await getCFjson(url);
}

// Function 3
// Get the Account Detail
async function getAccount(Version, RegistrationId) {
	$.log('获取账户信息');
	const url = { url: `${$.VAL.url}/${Version}/reg/${RegistrationId}/account`, headers: $.VAL.headers };
	return await getCFjson(url);
}

// Function 4
// Get Account Devices Details
async function getDevices(Version, RegistrationId) {
	$.log('获取设备信息');
	const url = { url: `${$.VAL.url}/${Version}/reg/${RegistrationId}/account/devices`, headers: $.VAL.headers };
	return await getCFjson(url);
}

// Function 5
// Set Account License
async function setAccountLicense(Version, RegistrationId, License) {
	$.log('设置账户许可证');
	var body = { "license": License };
	const url = { method: 'put',  url: `${$.VAL.url}/${Version}/reg/${RegistrationId}/account`, headers: $.VAL.headers, body };
	return await fatchCFjson(url);
}

// Function 6
// Set Keypair
async function setKeypair(Version, RegistrationId, publicKey) {
	$.log('设置账户许可证');
	var body = { "key": publicKey };
	const url = { method: 'put',  url: `${$.VAL.url}/${Version}/reg/${RegistrationId}/account`, headers: $.VAL.headers, body };
	return await fatchCFjson(url);
}

// Function 7
// Set Device Active
async function setDeviceActive(Version, RegistrationId, active = true) {
	$.log('设置设备激活状态');
	var body = { "active": active };
	const url = { method: 'patch',  url: `${$.VAL.url}/${Version}/reg/${RegistrationId}/account/devices`, headers: $.VAL.headers, body };
	return await fatchCFjson(url);
}

// Function 8
// Set Device Name
async function setDeviceName(Version, RegistrationId, Name) {
	$.log('设置设备名称');
	var body = { "name": Name };
	const url = { method: 'patch',  url: `${$.VAL.url}/${Version}/reg/${RegistrationId}/account/devices`, headers: $.VAL.headers, body };
	return await fatchCFjson(url);
}

// Function 9
// Generate Random String
// https://gist.github.com/6174/6062387#gistcomment-2651745
function genString(length) {
	$.log('生成随机字符串');
	return [...Array(length)]
	  .map(i => (~~(Math.random() * 36)).toString(36))
	  .join("");
  }

/***************** Env *****************/
// prettier-ignore
// https://github.com/chavyleung/scripts/blob/master/Env.min.js
function Env(t,e){class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.encoding="utf-8",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`🔔${this.name}, 开始!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}isShadowrocket(){return"undefined"!=typeof $rocket}isStash(){return"undefined"!=typeof $environment&&$environment["stash-version"]}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,n]=i.split("@"),a={url:`http://${n}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(a,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),n=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(n);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){if(t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status?s.status:s.statusCode,s.status=s.statusCode),e(t,s,i)});else if(this.isQuanX())this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t&&t.error||"UndefinedError"));else if(this.isNode()){let s=require("iconv-lite");this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();s&&this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:i,statusCode:r,headers:o,rawBody:n}=t,a=s.decode(n,this.encoding);e(null,{status:i,statusCode:r,headers:o,rawBody:n,body:a},a)},t=>{const{message:i,response:r}=t;e(i,r,r&&s.decode(r.rawBody,this.encoding))})}}post(t,e=(()=>{})){const s=t.method?t.method.toLocaleLowerCase():"post";if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient[s](t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status?s.status:s.statusCode,s.status=s.statusCode),e(t,s,i)});else if(this.isQuanX())t.method=s,this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t&&t.error||"UndefinedError"));else if(this.isNode()){let i=require("iconv-lite");this.initGotEnv(t);const{url:r,...o}=t;this.got[s](r,o).then(t=>{const{statusCode:s,statusCode:r,headers:o,rawBody:n}=t,a=i.decode(n,this.encoding);e(null,{status:s,statusCode:r,headers:o,rawBody:n,body:a},a)},t=>{const{message:s,response:r}=t;e(s,r,r&&i.decode(r.rawBody,this.encoding))})}}time(t,e=null){const s=e?new Date(e):new Date;let i={"M+":s.getMonth()+1,"d+":s.getDate(),"H+":s.getHours(),"m+":s.getMinutes(),"s+":s.getSeconds(),"q+":Math.floor((s.getMonth()+3)/3),S:s.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(s.getFullYear()+"").substr(4-RegExp.$1.length)));for(let e in i)new RegExp("("+e+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?i[e]:("00"+i[e]).substr((""+i[e]).length)));return t}queryStr(t){let e="";for(const s in t){let i=t[s];null!=i&&""!==i&&("object"==typeof i&&(i=JSON.stringify(i)),e+=`${s}=${i}&`)}return e=e.substring(0,e.length-1),e}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl,i=t["update-pasteboard"]||t.updatePasteboard;return{"open-url":e,"media-url":s,"update-pasteboard":i}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};if(this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r))),!this.isMuteLog){let t=["","==============📣系统通知📣=============="];t.push(e),s&&t.push(s),i&&t.push(i),console.log(t.join("\n")),this.logs=this.logs.concat(t)}}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`❗️${this.name}, 错误!`,t.stack):this.log("",`❗️${this.name}, 错误!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`🔔${this.name}, 结束! 🕛 ${s} 秒`),this.log(),this.isSurge()||this.isQuanX()||this.isLoon()?$done(t):this.isNode()&&process.exit(1)}}(t,e)}
