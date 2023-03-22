/*
README:https://github.com/VirgilClyne/GetSomeFries
*/

// refer:https://github.com/ViRb3/wgcf
// refer:https://github.com/yyuueexxiinngg/some-scripts/blob/master/cloudflare/warp2wireguard.js

const $ = new Env('☁ Cloudflare: WARP v2.0.2(1).beta');
const DataBase = {
	"DNS": {
		"Settings":{"Switch":true,"Verify":{"Mode":"Token","Content":""},"zone":{"id":"","name":"","dns_records":[{"id":"","type":"A","name":"","content":"","ttl":1,"proxied":false}]}},
		"Configs":{"Request":{"url":"https://api.cloudflare.com/client/v4","headers":{"content-type":"application/json"}}}
	},
	"WARP": {
		"Settings":{"Switch":true,"setupMode":null,"deviceType":"iOS","Verify":{"License":null,"Mode":"Token","Content":null,"RegistrationId":null}},
		"Configs":{"Request":{"url":"https://api.cloudflareclient.com","headers":{"authorization":null,"content-type":"application/json","user-agent":"1.1.1.1/2109031904.1 CFNetwork/1327.0.4 Darwin/21.2.0","cf-client-version":"i-6.7-2109031904.1"}},"Environment":{"iOS":{"Type":"i","Version":"v0i2109031904","headers":{"user-agent":"1.1.1.1/2109031904.1 CFNetwork/1327.0.4 Darwin/21.2.0","cf-client-version":"i-6.7-2109031904.1"}},"macOS":{"Type":"m","Version":"v0i2109031904","headers":{"user-agent":"1.1.1.1/2109031904.1 CFNetwork/1327.0.4 Darwin/21.2.0","cf-client-version":"m-2021.12.1.0-0"}},"Android":{"Type":"a","Version":"v0a1922","headers":{"user-agent":"okhttp/3.12.1","cf-client-version":"a-6.3-1922"}},"Windows":{"Type":"w","Version":"","headers":{"user-agent":"","cf-client-version":""}},"Linux":{"Type":"l","Version":"","headers":{"user-agent":"","cf-client-version":""}}}}
	},
	"VPN": {
		"Settings":{"Switch":true,"PrivateKey":"","PublicKey":""},
		"Configs":{"interface":{"addresses":{"v4":"","v6":""}},"peers":[{"public_key":"","endpoint":{"host":"","v4":"","v6":""}}]}
	}
};

/***************** Processing *****************/
(async () => {
	const { Settings, Caches, Configs } = await setENV("Cloudflare", "WARP", DataBase);
	const WireGuard = await setENV("WireGuard", "VPN", DataBase);
	$.log(`开始运行,模式:${setupMode}`, '');
	let result = {};
	switch (Settings.setupMode) {
		case "RegisterNewAccount":
			$.log("注册新账户/Register New Account");
			result = await RegisterNewAccount(Configs.Environment, Settings.Verify, WireGuard);
			break;
		case "RegisterNewAccountwithPublicKey":
			$.log("注册新账户(用自定义密钥对)并生成WireGuard配置文件/Register New Account(with custom Keypair)and output WireGuard Config");
			result = await RegisterNewAccountwithPublicKey(Configs.Environment, Settings.Verify, WireGuard)
			break;
		case "RegisterNewDevice":
			$.log("注册新设备(注册ID)/Register New Device(Registration Id/id)");
			result = await RegisterNewDevice(Configs.Environment, Settings.Verify, WireGuard);
			break;
		case "RebindingLicense":
			$.log("重绑定许可证(许可证 & 注册ID)(仅适用于个人版)/Rebinding License(license & Registration Id/id)(Only for Personal)");
			result = await RebindingLicense(Configs.Environment, Settings.Verify);
			break;
		case "ChangeKeypair":
			$.log("更换公钥(用自定义密钥对)(公钥 & 注册ID & 令牌)/Change Public Key(with custom Keypair)(Public Key & Registration Id/id & Token)");
			result = await ChangeKeypair(Configs.Environment, Settings.Verify, WireGuard);
			break;
		case "AccountDetail":
			$.log("查询账户信息(创建日期/剩余流量/邀请人数等)/Check Account Detail");
			result = await AccountDetail(Configs.Environment, Settings.Verify);
			break;
		case "DeviceDetail":
			$.log("查询设备配置(设备名称/设备类型/创建日期/活动状态等)/Check Device Detail");
			result = await DeviceDetail(Configs.Environment, Settings.Verify);
			break;
		case "AutoAffWARP":
			$.log("自动邀请新用户刷Warp+流量/Auto Aff New User for WARP+");
			//result = await autoAFF(License, AffID);
			$.log('没写', '');
			break;
		default:
			$.log(`未选择运行模式或不符合模式:${Settings.setupMode}运行要求，退出`, `setupMode = ${Settings.setupMode}`, `License = ${Settings?.Verify?.License}`, `RegistrationId = ${Settings?.Verify?.RegistrationId}`, '');
			break;
	};
	$.log(`${$.name}完成, 模式:${Settings.setupMode}执行完成, 当前账户信息:`, `帐户类型:${result?.account?.account_type}`, `帐户ID:${result?.account?.id}`, '账户ID:等同于匿名账号', `许可证:${result?.account?.license ?? Settings?.Verify?.License}`, '许可证:可付费购买的订阅，流量，邀请奖励均绑定于许可证，仅个人版有许可证，一个许可证可以绑定5个设备(注册ID)', `注册ID:${result?.id ?? Settings?.Verify?.RegistrationId}`, '注册ID:相当于WARP的客户端或设备ID，配置信息均关联到此注册ID', `令牌:${result?.token ?? Settings?.Verify?.Content}`, '令牌:相当于密码，更新读取对应账号所需，如果要更新注册ID的配置或者更改关联的许可证，需要此令牌验证收发数据', '', `完整输出结果: ${JSON.stringify(result)}`, '');
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
	Configs.Request.headers["user-agent"] = Configs.Environment[Settings.deviceType].headers["user-agent"];
	Configs.Request.headers["cf-client-version"] = Configs.Environment[Settings.deviceType].headers["cf-client-version"];
	$.log(`🎉 ${$.name}, Set Environment Variables`, `Settings: ${typeof Settings}`, `Settings内容: ${JSON.stringify(Settings)}`, "");
	return { Settings, Caches, Configs }
};

/***************** Setup Mode *****************/
// Setup Mode 1
// Register New Account
async function RegisterNewAccount(Environment, Verify, WireGuard) {
	if (!Verify.RegistrationId && !WireGuard.Settings.PublicKey) {
		$.log('无设备ID(RegistrationId), 无自定义公钥(publicKey)', '');
		var result = await regAccount(Environment.Version, Verify.RegistrationId, WireGuard.Settings.PublicKey, Environment.Locale, Environment.deviceModel, Environment.Type, Environment.warp_enabled);
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
	if (!Verify.RegistrationId && WireGuard.Settings.PrivateKey && WireGuard.Settings.PublicKey) {
		$.log('无设备ID(RegistrationId)', '有自定义私钥(PrivateKey)', '有自定义公钥(PublicKey)', '');
		var result = await regAccount(Environment.Version, Verify.RegistrationId, WireGuard.Settings.PublicKey, Environment.Locale, Environment.deviceModel, Environment.Type, Environment.warp_enabled);
		//$.log(`🎉 ${$.name}, ${RegisterNewAccountwithPublicKey.name}执行完成, 当前账户信息:`, `帐户类型:${result.account.account_type}`, `帐户ID:${result.account.id}`, '账户ID:等同于匿名账号', `许可证:${result.account.license}`, '许可证:可付费购买的订阅，流量，邀请奖励均绑定于许可证，一个许可证可以绑定5个设备(注册ID)', `注册ID:${result.id}`, '注册ID:相当于WARP的客户端或设备ID，配置信息均关联到此注册ID', `令牌:${result.token}`, '令牌:相当于密码，更新读取对应账号所需，如果要更新注册ID的配置或者更改关联的许可证，需要此令牌验证收发数据', '');
		if (WireGuard.Settings.PrivateKey && WireGuard.Settings.PublicKey) {
			$.log('有自定义私钥(PrivateKey)', '有自定义公钥(PublicKey)', '');
			Verify.Content = result.token;
			await setupVerify(Verify.Mode, Verify.Content);
			const result = await getDevice(Environment.Version, result.id);
			WireGuard.Settings.PublicKey = result?.key;
			WireGuard.Configs = result?.config;
			$.setjson(WireGuard.Configs, `@WireGuard.VPN.Configs`);
			const SurgeConf = `
		[Proxy]
		WARP = wireguard, section-name = Cloudflare

		[Group]
		你的策略组 = 节点1, 节点2, 节点3, WARP

		[WireGuard Cloudflare]
		private-key = ${WireGuard.Settings.PrivateKey}
		self-ip = ${result?.config?.interface?.addresses?.v4}
		dns-server = 1.1.1.1
		mtu = 1280
		peer = (public-key = ${result?.config?.peers?.[0]?.public_key}, allowed-ips = 0.0.0.0/0, endpoint = ${result?.config?.peers?.[0]?.endpoint?.v4})
		`;
			$.log('Surge可用配置', SurgeConf)
			const wireGuardConf = `
		[Interface]
		PrivateKey = ${WireGuard.Settings.PrivateKey}
		PublicKey = ${result?.key}
		Address = ${result?.config?.interface?.addresses?.v4}
		Address = ${result?.config?.interface?.addresses?.v6}
		DNS = 1.1.1.1
	
		[Peer]
		PublicKey = ${result?.config?.peers?.[0]?.public_key}
		Endpoint = ${result?.config?.peers?.[0]?.endpoint?.v4}
		Endpoint = ${result?.config?.peers?.[0]?.endpoint?.v6}
		Endpoint = ${result?.config?.peers?.[0]?.endpoint?.host}
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
		var result = await regDevice(Environment.Version, Verify.RegistrationId, WireGuard.Settings.PublicKey, Environment.Locale, Environment.deviceModel, Environment.Type, Environment.warp_enabled);
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
	if (Verify.RegistrationId && Verify.Content && WireGuard.Settings.PublicKey) {
		$.log('有设备ID(RegistrationId), 有验证内容(Content), 有自定义公钥(publicKey)', '');
		var result = await setKeypair(Environment.Version, Verify.RegistrationId, WireGuard.Settings.PublicKey);
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
async function Cloudflare(opt, Request = DataBase.WARP.Configs.Request, Environment = DataBase.WARP.Configs.Environment, Settings = DataBase.WARP.Settings, WireGuard = {"Settings":{"Switch":true,"PrivateKey":"","PublicKey":""}} ) {
	/*
	let Request = {
		// Endpoints
		"url": "https://api.cloudflareclient.com",
		"headers": {
			"Host": "api.cloudflareclient.com",
			"Content-Type": "application/json",
			"User-Agent": "1.1.1.1/2109031904.1 CFNetwork/1327.0.4 Darwin/21.2.0",
			"CF-Client-Version": "i-6.7-2109031904.1"
		}
	}
	*/
	let _Request = JSON.parse(JSON.stringify(Request));
	const referrer = Settings.Verify.RegistrationId;
	const install_id = genString(11);
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
		case "regAccount":
			// Register New Account
			$.log('注册账户');
			_Request.method = "post";
			_Request.url += `/${Environment[Settings.deviceType].Version}/reg`;
			_Request.body = {
				"install_id": install_id, // not empty on actual client
				"fcm_token": `${install_id}:APA91b${genString(134)}`, // not empty on actual client
				"referrer": /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(referrer) ? referrer : "",
				"key": WireGuard.Settings.publicKey,
				"locale": "en_US",
				//warp_enabled: warp_enabled,
				//model: deviceModel,
				"tos": new Date().toISOString(),
				"type": Environment[Settings.deviceType].Type
			};
			return await fatchCFjson(_Request);
		case "regDevice":
			// Register New Device
			$.log('注册设备');
			_Request.method = "post";
			_Request.url += `/${Environment[Settings.deviceType].Version}/reg/${Settings.Verify.RegistrationId}`;
			_Request.body = {
				"install_id": install_id, // not empty on actual client
				"fcm_token": `${install_id}:APA91b${genString(134)}`, // not empty on actual client
				"referrer": /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(referrer) ? referrer : "",
				"key": WireGuard.Settings.PublicKey,
				"locale": "en_US",
				//warp_enabled: warp_enabled,
				//model: deviceModel,
				"tos": new Date().toISOString(),
				"type": Environment[Settings.deviceType].Type
			};
			return await fatchCFjson(_Request);
		case "getDevice":
			// Get the Device Detail
			$.log('获取当前设备配置');
			_Request.url += `/${Environment[Settings.deviceType].Version}/reg/${Settings.Verify.RegistrationId}`;
			return await getCFjson(_Request);
		case "getAccount":
			// Get the Account Detail
			$.log('获取账户信息');
			_Request.url += `/${Environment[Settings.deviceType].Version}/reg/${Settings.Verify.RegistrationId}/account`;
			return await getCFjson(_Request);
		case "getDevices":
			// Get Account Devices Details
			$.log('获取设备信息');
			_Request.url += `/${Environment[Settings.deviceType].Version}/reg/${Settings.Verify.RegistrationId}/account/devices`;
			return await getCFjson(_Request);
		case "setAccountLicense":
			// Set Account License
			$.log('设置账户许可证');
			_Request.method = "put";
			_Request.url += `/${Environment[Settings.deviceType].Version}/reg/${Settings.Verify.RegistrationId}/account`;
			_Request.body = {
				"license": Settings.Verify.License
			};
			return await fatchCFjson(_Request);
		case "setKeypair":
			// Set Keypair
			$.log('设置密钥对');
			_Request.method = "put";
			_Request.url += `/zones/${Zone.id}/dns_records/${Record.id}`;
			_Request.body = {
				"key": WireGuard.Settings.PublicKey
			};
			return await fatchCFjson(_Request);
		case "setDeviceActive":
			// Set Device Active
			$.log('设置设备激活状态');
			_Request.method = "patch";
			_Request.url += `/${Environment[Settings.deviceType].Version}/reg/${Settings.Verify.RegistrationId}/account/devices`;
			_Request.body = {
				"active": active = true
			};
			return await fatchCFjson(_Request);
		case "setDeviceName":
			// Set Device Name
			$.log('设置设备名称');
			_Request.method = "patch";
			_Request.url += `/${Environment[Settings.deviceType].Version}/reg/${Settings.Verify.RegistrationId}/account/devices`;
			_Request.body = {
				"name": Name
			};
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

	// Function 1
	// Generate Random String
	// https://gist.github.com/6174/6062387#gistcomment-2651745
	function genString(length) {
		$.log('生成随机字符串');
		return [...Array(length)]
			.map(i => (~~(Math.random() * 36)).toString(36))
			.join("");
	};
};

/***************** Env *****************/
// prettier-ignore
// https://github.com/chavyleung/scripts/blob/master/Env.min.js
function Env(t,s){class e{constructor(t){this.env=t}send(t,s="GET"){t="string"==typeof t?{url:t}:t;let e=this.get;return"POST"===s&&(e=this.post),new Promise((s,i)=>{e.call(this,t,(t,e,r)=>{t?i(t):s(e)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,s){this.name=t,this.http=new e(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.encoding="utf-8",this.startTime=(new Date).getTime(),Object.assign(this,s),this.log("",`\ud83d\udd14${this.name}, \u5f00\u59cb!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $environment&&$environment["surge-version"]}isLoon(){return"undefined"!=typeof $loon}isShadowrocket(){return"undefined"!=typeof $rocket}isStash(){return"undefined"!=typeof $environment&&$environment["stash-version"]}toObj(t,s=null){try{return JSON.parse(t)}catch{return s}}toStr(t,s=null){try{return JSON.stringify(t)}catch{return s}}getjson(t,s){let e=s;const i=this.getdata(t);if(i)try{e=JSON.parse(this.getdata(t))}catch{}return e}setjson(t,s){try{return this.setdata(JSON.stringify(t),s)}catch{return!1}}getScript(t){return new Promise(s=>{this.get({url:t},(t,e,i)=>s(i))})}runScript(t,s){return new Promise(e=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=s&&s.timeout?s.timeout:r;const[o,h]=i.split("@"),a={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"},timeout:r};this.post(a,(t,s,i)=>e(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),s=this.path.resolve(process.cwd(),this.dataFile),e=this.fs.existsSync(t),i=!e&&this.fs.existsSync(s);if(!e&&!i)return{};{const i=e?t:s;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),s=this.path.resolve(process.cwd(),this.dataFile),e=this.fs.existsSync(t),i=!e&&this.fs.existsSync(s),r=JSON.stringify(this.data);e?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(s,r):this.fs.writeFileSync(t,r)}}lodash_get(t,s,e){const i=s.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return e;return r}lodash_set(t,s,e){return Object(t)!==t?t:(Array.isArray(s)||(s=s.toString().match(/[^.[\]]+/g)||[]),s.slice(0,-1).reduce((t,e,i)=>Object(t[e])===t[e]?t[e]:t[e]=Math.abs(s[i+1])>>0==+s[i+1]?[]:{},t)[s[s.length-1]]=e,t)}getdata(t){let s=this.getval(t);if(/^@/.test(t)){const[,e,i]=/^@(.*?)\.(.*?)$/.exec(t),r=e?this.getval(e):"";if(r)try{const t=JSON.parse(r);s=t?this.lodash_get(t,i,""):s}catch(t){s=""}}return s}setdata(t,s){let e=!1;if(/^@/.test(s)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(s),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const s=JSON.parse(h);this.lodash_set(s,r,t),e=this.setval(JSON.stringify(s),i)}catch(s){const o={};this.lodash_set(o,r,t),e=this.setval(JSON.stringify(o),i)}}else e=this.setval(t,s);return e}getval(t){return this.isSurge()||this.isShadowrocket()||this.isLoon()||this.isStash()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,s){return this.isSurge()||this.isShadowrocket()||this.isLoon()||this.isStash()?$persistentStore.write(t,s):this.isQuanX()?$prefs.setValueForKey(t,s):this.isNode()?(this.data=this.loaddata(),this.data[s]=t,this.writedata(),!0):this.data&&this.data[s]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,s=(()=>{})){if(t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isShadowrocket()||this.isLoon()||this.isStash())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,e,i)=>{!t&&e&&(e.body=i,e.statusCode=e.status?e.status:e.statusCode,e.status=e.statusCode),s(t,e,i)});else if(this.isQuanX())this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:e,statusCode:i,headers:r,body:o}=t;s(null,{status:e,statusCode:i,headers:r,body:o},o)},t=>s(t&&t.error||"UndefinedError"));else if(this.isNode()){let e=require("iconv-lite");this.initGotEnv(t),this.got(t).on("redirect",(t,s)=>{try{if(t.headers["set-cookie"]){const e=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();e&&this.ckjar.setCookieSync(e,null),s.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:i,statusCode:r,headers:o,rawBody:h}=t,a=e.decode(h,this.encoding);s(null,{status:i,statusCode:r,headers:o,rawBody:h,body:a},a)},t=>{const{message:i,response:r}=t;s(i,r,r&&e.decode(r.rawBody,this.encoding))})}}post(t,s=(()=>{})){const e=t.method?t.method.toLocaleLowerCase():"post";if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isShadowrocket()||this.isLoon()||this.isStash())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient[e](t,(t,e,i)=>{!t&&e&&(e.body=i,e.statusCode=e.status?e.status:e.statusCode,e.status=e.statusCode),s(t,e,i)});else if(this.isQuanX())t.method=e,this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:e,statusCode:i,headers:r,body:o}=t;s(null,{status:e,statusCode:i,headers:r,body:o},o)},t=>s(t&&t.error||"UndefinedError"));else if(this.isNode()){let i=require("iconv-lite");this.initGotEnv(t);const{url:r,...o}=t;this.got[e](r,o).then(t=>{const{statusCode:e,statusCode:r,headers:o,rawBody:h}=t,a=i.decode(h,this.encoding);s(null,{status:e,statusCode:r,headers:o,rawBody:h,body:a},a)},t=>{const{message:e,response:r}=t;s(e,r,r&&i.decode(r.rawBody,this.encoding))})}}time(t,s=null){const e=s?new Date(s):new Date;let i={"M+":e.getMonth()+1,"d+":e.getDate(),"H+":e.getHours(),"m+":e.getMinutes(),"s+":e.getSeconds(),"q+":Math.floor((e.getMonth()+3)/3),S:e.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(e.getFullYear()+"").substr(4-RegExp.$1.length)));for(let s in i)new RegExp("("+s+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?i[s]:("00"+i[s]).substr((""+i[s]).length)));return t}queryStr(t){let s="";for(const e in t){let i=t[e];null!=i&&""!==i&&("object"==typeof i&&(i=JSON.stringify(i)),s+=`${e}=${i}&`)}return s=s.substring(0,s.length-1),s}msg(s=t,e="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()||this.isShadowrocket()||this.isStash()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let s=t.openUrl||t.url||t["open-url"],e=t.mediaUrl||t["media-url"];return{openUrl:s,mediaUrl:e}}if(this.isQuanX()){let s=t["open-url"]||t.url||t.openUrl,e=t["media-url"]||t.mediaUrl,i=t["update-pasteboard"]||t.updatePasteboard;return{"open-url":s,"media-url":e,"update-pasteboard":i}}if(this.isSurge()||this.isShadowrocket()||this.isStash()){let s=t.url||t.openUrl||t["open-url"];return{url:s}}}};if(this.isMute||(this.isSurge()||this.isShadowrocket()||this.isLoon()||this.isStash()?$notification.post(s,e,i,o(r)):this.isQuanX()&&$notify(s,e,i,o(r))),!this.isMuteLog){let t=["","==============\ud83d\udce3\u7cfb\u7edf\u901a\u77e5\ud83d\udce3=============="];t.push(s),e&&t.push(e),i&&t.push(i),console.log(t.join("\n")),this.logs=this.logs.concat(t)}}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,s){const e=!(this.isSurge()||this.isShadowrocket()||this.isQuanX()||this.isLoon()||this.isStash());e?this.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t.stack):this.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t)}wait(t){return new Promise(s=>setTimeout(s,t))}done(t={}){const s=(new Date).getTime(),e=(s-this.startTime)/1e3;this.log("",`\ud83d\udd14${this.name}, \u7ed3\u675f! \ud83d\udd5b ${e} \u79d2`),this.log(),this.isSurge()||this.isShadowrocket()||this.isQuanX()||this.isLoon()||this.isStash()?$done(t):this.isNode()&&process.exit(1)}}(t,s)}
