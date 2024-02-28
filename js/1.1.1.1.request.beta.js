/* README: https://github.com/VirgilClyne/Cloudflare */
class Lodash {
	constructor() {
		this.name = "Lodash";
		this.version = '1.0.0';
		console.log(`\n${this.name} v${this.version}\n`);
	}

	get(object = {}, path = "", defaultValue = undefined) {
		// translate array case to dot case, then split with .
		// a[0].b -> a.0.b -> ['a', '0', 'b']
		if (!Array.isArray(path)) path = this.toPath(path);

		const result = path.reduce((previousValue, currentValue) => {
			return Object(previousValue)[currentValue]; // null undefined get attribute will throwError, Object() can return a object 
		}, object);
		return (result === undefined) ? defaultValue : result;
	}

	set(object = {}, path = "", value) {
		if (!Array.isArray(path)) path = this.toPath(path);
		path
			.slice(0, -1)
			.reduce(
				(previousValue, currentValue, currentIndex) =>
					(Object(previousValue[currentValue]) === previousValue[currentValue])
						? previousValue[currentValue]
						: previousValue[currentValue] = (/^\d+$/.test(path[currentIndex + 1]) ? [] : {}),
				object
			)[path[path.length - 1]] = value;
		return object
	}

	toPath(value) {
		return value.replace(/\[(\d+)\]/g, '.$1').split('.').filter(Boolean);
	}

}

class ENV {
	constructor(name, opts) {
		this.name = name;
		this.version = '1.5.7';
		this.data = null;
		this.dataFile = 'box.dat';
		this.logs = [];
		this.isMute = false;
		this.logSeparator = '\n';
		this.encoding = 'utf-8';
		this.startTime = new Date().getTime();
		Object.assign(this, opts);
		this.log('', '🚩 开始!', `ENV v${this.version}`, '');
		this.lodash = new Lodash(this.name);
		this.log('', this.name, '');
	}

	platform() {
		if ('undefined' !== typeof $environment && $environment['surge-version'])
			return 'Surge'
		if ('undefined' !== typeof $environment && $environment['stash-version'])
			return 'Stash'
		if ('undefined' !== typeof module && !!module.exports) return 'Node.js'
		if ('undefined' !== typeof $task) return 'Quantumult X'
		if ('undefined' !== typeof $loon) return 'Loon'
		if ('undefined' !== typeof $rocket) return 'Shadowrocket'
		if ('undefined' !== typeof Egern) return 'Egern'
	}

	isNode() {
		return 'Node.js' === this.platform()
	}

	isQuanX() {
		return 'Quantumult X' === this.platform()
	}

	isSurge() {
		return 'Surge' === this.platform()
	}

	isLoon() {
		return 'Loon' === this.platform()
	}

	isShadowrocket() {
		return 'Shadowrocket' === this.platform()
	}

	isStash() {
		return 'Stash' === this.platform()
	}

	isEgern() {
		return 'Egern' === this.platform()
	}

	toObj(str, defaultValue = null) {
		try {
			return JSON.parse(str)
		} catch {
			return defaultValue
		}
	}

	toStr(obj, defaultValue = null) {
		try {
			return JSON.stringify(obj)
		} catch {
			return defaultValue
		}
	}

	getjson(key, defaultValue) {
		let json = defaultValue;
		const val = this.getdata(key);
		if (val) {
			try {
				json = JSON.parse(this.getdata(key));
			} catch { }
		}
		return json
	}

	setjson(val, key) {
		try {
			return this.setdata(JSON.stringify(val), key)
		} catch {
			return false
		}
	}

	getScript(url) {
		return new Promise((resolve) => {
			this.get({ url }, (error, response, body) => resolve(body));
		})
	}

	runScript(script, runOpts) {
		return new Promise((resolve) => {
			let httpapi = this.getdata('@chavy_boxjs_userCfgs.httpapi');
			httpapi = httpapi ? httpapi.replace(/\n/g, '').trim() : httpapi;
			let httpapi_timeout = this.getdata(
				'@chavy_boxjs_userCfgs.httpapi_timeout'
			);
			httpapi_timeout = httpapi_timeout ? httpapi_timeout * 1 : 20;
			httpapi_timeout =
				runOpts && runOpts.timeout ? runOpts.timeout : httpapi_timeout;
			const [key, addr] = httpapi.split('@');
			const opts = {
				url: `http://${addr}/v1/scripting/evaluate`,
				body: {
					script_text: script,
					mock_type: 'cron',
					timeout: httpapi_timeout
				},
				headers: { 'X-Key': key, 'Accept': '*/*' },
				timeout: httpapi_timeout
			};
			this.post(opts, (error, response, body) => resolve(body));
		}).catch((e) => this.logErr(e))
	}

	loaddata() {
		if (this.isNode()) {
			this.fs = this.fs ? this.fs : require('fs');
			this.path = this.path ? this.path : require('path');
			const curDirDataFilePath = this.path.resolve(this.dataFile);
			const rootDirDataFilePath = this.path.resolve(
				process.cwd(),
				this.dataFile
			);
			const isCurDirDataFile = this.fs.existsSync(curDirDataFilePath);
			const isRootDirDataFile =
				!isCurDirDataFile && this.fs.existsSync(rootDirDataFilePath);
			if (isCurDirDataFile || isRootDirDataFile) {
				const datPath = isCurDirDataFile
					? curDirDataFilePath
					: rootDirDataFilePath;
				try {
					return JSON.parse(this.fs.readFileSync(datPath))
				} catch (e) {
					return {}
				}
			} else return {}
		} else return {}
	}

	writedata() {
		if (this.isNode()) {
			this.fs = this.fs ? this.fs : require('fs');
			this.path = this.path ? this.path : require('path');
			const curDirDataFilePath = this.path.resolve(this.dataFile);
			const rootDirDataFilePath = this.path.resolve(
				process.cwd(),
				this.dataFile
			);
			const isCurDirDataFile = this.fs.existsSync(curDirDataFilePath);
			const isRootDirDataFile =
				!isCurDirDataFile && this.fs.existsSync(rootDirDataFilePath);
			const jsondata = JSON.stringify(this.data);
			if (isCurDirDataFile) {
				this.fs.writeFileSync(curDirDataFilePath, jsondata);
			} else if (isRootDirDataFile) {
				this.fs.writeFileSync(rootDirDataFilePath, jsondata);
			} else {
				this.fs.writeFileSync(curDirDataFilePath, jsondata);
			}
		}
	}
	getdata(key) {
		let val = this.getval(key);
		// 如果以 @
		if (/^@/.test(key)) {
			const [, objkey, paths] = /^@(.*?)\.(.*?)$/.exec(key);
			const objval = objkey ? this.getval(objkey) : '';
			if (objval) {
				try {
					const objedval = JSON.parse(objval);
					val = objedval ? this.lodash.get(objedval, paths, '') : val;
				} catch (e) {
					val = '';
				}
			}
		}
		return val
	}

	setdata(val, key) {
		let issuc = false;
		if (/^@/.test(key)) {
			const [, objkey, paths] = /^@(.*?)\.(.*?)$/.exec(key);
			const objdat = this.getval(objkey);
			const objval = objkey
				? objdat === 'null'
					? null
					: objdat || '{}'
				: '{}';
			try {
				const objedval = JSON.parse(objval);
				this.lodash.set(objedval, paths, val);
				issuc = this.setval(JSON.stringify(objedval), objkey);
			} catch (e) {
				const objedval = {};
				this.lodash.set(objedval, paths, val);
				issuc = this.setval(JSON.stringify(objedval), objkey);
			}
		} else {
			issuc = this.setval(val, key);
		}
		return issuc
	}

	getval(key) {
		switch (this.platform()) {
			case 'Surge':
			case 'Loon':
			case 'Stash':
			case 'Egern':
			case 'Shadowrocket':
				return $persistentStore.read(key)
			case 'Quantumult X':
				return $prefs.valueForKey(key)
			case 'Node.js':
				this.data = this.loaddata();
				return this.data[key]
			default:
				return (this.data && this.data[key]) || null
		}
	}

	setval(val, key) {
		switch (this.platform()) {
			case 'Surge':
			case 'Loon':
			case 'Stash':
			case 'Egern':
			case 'Shadowrocket':
				return $persistentStore.write(val, key)
			case 'Quantumult X':
				return $prefs.setValueForKey(val, key)
			case 'Node.js':
				this.data = this.loaddata();
				this.data[key] = val;
				this.writedata();
				return true
			default:
				return (this.data && this.data[key]) || null
		}
	}

	initGotEnv(opts) {
		this.got = this.got ? this.got : require('got');
		this.cktough = this.cktough ? this.cktough : require('tough-cookie');
		this.ckjar = this.ckjar ? this.ckjar : new this.cktough.CookieJar();
		if (opts) {
			opts.headers = opts.headers ? opts.headers : {};
			if (undefined === opts.headers.Cookie && undefined === opts.cookieJar) {
				opts.cookieJar = this.ckjar;
			}
		}
	}

	async fetch(request = {} || "", option = {}) {
		switch (request.constructor) {
			case Object:
				request = { ...request, ...option };
				break;
			case String:
				request = { "url": request, ...option };
				break;
		}		if (!request.method) {
			request.method = "GET";
			if (request.body ?? request.bodyBytes) request.method = "POST";
		}		delete request.headers?.['Content-Length'];
		delete request.headers?.['content-length'];
		const method = request.method.toLocaleLowerCase();
		switch (this.platform()) {
			case 'Loon':
			case 'Surge':
			case 'Stash':
			case 'Egern':
			case 'Shadowrocket':
			default:
				// 移除不可写字段
				delete request.id;
				// 添加策略组
				if (request.policy) {
					if (this.isLoon()) request.node = request.policy;
					if (this.isStash()) this.lodash.set(request, "headers.X-Stash-Selected-Proxy", encodeURI(request.policy));
				}				// 判断请求数据类型
				if (ArrayBuffer.isView(request.body)) request["binary-mode"] = true;
				// 发送请求
				return await new Promise((resolve, reject) => {
					$httpClient[method](request, (error, response, body) => {
						if (error) reject(error);
						else {
							response.ok = /^2\d\d$/.test(response.status);
							response.statusCode = response.status;
							if (body) {
								response.body = body;
								if (request["binary-mode"] == true) response.bodyBytes = body;
							}							resolve(response);
						}
					});
				});
			case 'Quantumult X':
				// 移除不可写字段
				delete request.charset;
				delete request.path;
				delete request.scheme;
				delete request.sessionIndex;
				delete request.statusCode;
				// 添加策略组
				if (request.policy) this.lodash.set(request, "opts.policy", request.policy);
				// 判断请求数据类型
				switch ((request?.headers?.["Content-Type"] ?? request?.headers?.["content-type"])?.split(";")?.[0]) {
					default:
						// 返回普通数据
						delete request.bodyBytes;
						break;
					case "application/protobuf":
					case "application/x-protobuf":
					case "application/vnd.google.protobuf":
					case "application/grpc":
					case "application/grpc+proto":
					case "application/octet-stream":
						// 返回二进制数据
						delete request.body;
						if (ArrayBuffer.isView(request.bodyBytes)) request.bodyBytes = request.bodyBytes.buffer.slice(request.bodyBytes.byteOffset, request.bodyBytes.byteLength + request.bodyBytes.byteOffset);
						break;
					case undefined: // 视为构造请求或无body
						// 返回普通数据
						break;
				}				// 发送请求
				return await $task.fetch(request).then(
					response => {
						response.ok = /^2\d\d$/.test(response.statusCode);
						response.status = response.statusCode;
						return response;
					},
					reason => Promise.reject(reason.error));
			case 'Node.js':
				let iconv = require('iconv-lite');
				this.initGotEnv(request);
				const { url, ...option } = request;
				return await this.got[method](url, option)
					.on('redirect', (response, nextOpts) => {
						try {
							if (response.headers['set-cookie']) {
								const ck = response.headers['set-cookie']
									.map(this.cktough.Cookie.parse)
									.toString();
								if (ck) {
									this.ckjar.setCookieSync(ck, null);
								}
								nextOpts.cookieJar = this.ckjar;
							}
						} catch (e) {
							this.logErr(e);
						}
						// this.ckjar.setCookieSync(response.headers['set-cookie'].map(Cookie.parse).toString())
					})
					.then(
						response => {
							response.statusCode = response.status;
							response.body = iconv.decode(response.rawBody, this.encoding);
							response.bodyBytes = response.rawBody;
							return response;
						},
						error => Promise.reject(error.message));
		}	};

	/**
	 *
	 * 示例:$.time('yyyy-MM-dd qq HH:mm:ss.S')
	 *    :$.time('yyyyMMddHHmmssS')
	 *    y:年 M:月 d:日 q:季 H:时 m:分 s:秒 S:毫秒
	 *    其中y可选0-4位占位符、S可选0-1位占位符，其余可选0-2位占位符
	 * @param {string} format 格式化参数
	 * @param {number} ts 可选: 根据指定时间戳返回格式化日期
	 *
	 */
	time(format, ts = null) {
		const date = ts ? new Date(ts) : new Date();
		let o = {
			'M+': date.getMonth() + 1,
			'd+': date.getDate(),
			'H+': date.getHours(),
			'm+': date.getMinutes(),
			's+': date.getSeconds(),
			'q+': Math.floor((date.getMonth() + 3) / 3),
			'S': date.getMilliseconds()
		};
		if (/(y+)/.test(format))
			format = format.replace(
				RegExp.$1,
				(date.getFullYear() + '').substr(4 - RegExp.$1.length)
			);
		for (let k in o)
			if (new RegExp('(' + k + ')').test(format))
				format = format.replace(
					RegExp.$1,
					RegExp.$1.length == 1
						? o[k]
						: ('00' + o[k]).substr(('' + o[k]).length)
				);
		return format
	}

	/**
	 * 系统通知
	 *
	 * > 通知参数: 同时支持 QuanX 和 Loon 两种格式, EnvJs根据运行环境自动转换, Surge 环境不支持多媒体通知
	 *
	 * 示例:
	 * $.msg(title, subt, desc, 'twitter://')
	 * $.msg(title, subt, desc, { 'open-url': 'twitter://', 'media-url': 'https://github.githubassets.com/images/modules/open_graph/github-mark.png' })
	 * $.msg(title, subt, desc, { 'open-url': 'https://bing.com', 'media-url': 'https://github.githubassets.com/images/modules/open_graph/github-mark.png' })
	 *
	 * @param {*} title 标题
	 * @param {*} subt 副标题
	 * @param {*} desc 通知详情
	 * @param {*} opts 通知参数
	 *
	 */
	msg(title = name, subt = '', desc = '', opts) {
		const toEnvOpts = (rawopts) => {
			switch (typeof rawopts) {
				case undefined:
					return rawopts
				case 'string':
					switch (this.platform()) {
						case 'Surge':
						case 'Stash':
						case 'Egern':
						default:
							return { url: rawopts }
						case 'Loon':
						case 'Shadowrocket':
							return rawopts
						case 'Quantumult X':
							return { 'open-url': rawopts }
						case 'Node.js':
							return undefined
					}
				case 'object':
					switch (this.platform()) {
						case 'Surge':
						case 'Stash':
						case 'Egern':
						case 'Shadowrocket':
						default: {
							let openUrl =
								rawopts.url || rawopts.openUrl || rawopts['open-url'];
							return { url: openUrl }
						}
						case 'Loon': {
							let openUrl =
								rawopts.openUrl || rawopts.url || rawopts['open-url'];
							let mediaUrl = rawopts.mediaUrl || rawopts['media-url'];
							return { openUrl, mediaUrl }
						}
						case 'Quantumult X': {
							let openUrl =
								rawopts['open-url'] || rawopts.url || rawopts.openUrl;
							let mediaUrl = rawopts['media-url'] || rawopts.mediaUrl;
							let updatePasteboard =
								rawopts['update-pasteboard'] || rawopts.updatePasteboard;
							return {
								'open-url': openUrl,
								'media-url': mediaUrl,
								'update-pasteboard': updatePasteboard
							}
						}
						case 'Node.js':
							return undefined
					}
				default:
					return undefined
			}
		};
		if (!this.isMute) {
			switch (this.platform()) {
				case 'Surge':
				case 'Loon':
				case 'Stash':
				case 'Egern':
				case 'Shadowrocket':
				default:
					$notification.post(title, subt, desc, toEnvOpts(opts));
					break
				case 'Quantumult X':
					$notify(title, subt, desc, toEnvOpts(opts));
					break
				case 'Node.js':
					break
			}
		}
		if (!this.isMuteLog) {
			let logs = ['', '==============📣系统通知📣=============='];
			logs.push(title);
			subt ? logs.push(subt) : '';
			desc ? logs.push(desc) : '';
			console.log(logs.join('\n'));
			this.logs = this.logs.concat(logs);
		}
	}

	log(...logs) {
		if (logs.length > 0) {
			this.logs = [...this.logs, ...logs];
		}
		console.log(logs.join(this.logSeparator));
	}

	logErr(error) {
		switch (this.platform()) {
			case 'Surge':
			case 'Loon':
			case 'Stash':
			case 'Egern':
			case 'Shadowrocket':
			case 'Quantumult X':
			default:
				this.log('', `❗️ ${this.name}, 错误!`, error);
				break
			case 'Node.js':
				this.log('', `❗️${this.name}, 错误!`, error.stack);
				break
		}
	}

	wait(time) {
		return new Promise((resolve) => setTimeout(resolve, time))
	}

	done(object = {}) {
		const endTime = new Date().getTime();
		const costTime = (endTime - this.startTime) / 1000;
		this.log("", `🚩 ${this.name}, 结束! 🕛 ${costTime} 秒`, "");
		if (object.headers?.["Content-Encoding"]) object.headers["Content-Encoding"] = "identity";
		if (object.headers?.["content-encoding"]) object.headers["content-encoding"] = "identity";
		delete object.headers?.["Content-Length"];
		delete object.headers?.["content-length"];
		switch (this.platform()) {
			case 'Surge':
			case 'Loon':
			case 'Stash':
			case 'Egern':
			case 'Shadowrocket':
			default:
				$done(object);
				break;
			case 'Quantumult X':
				// 移除不可写字段
				delete object.charset;
				delete object.path;
				delete object.scheme;
				delete object.sessionIndex;
				delete object.statusCode;
				if (object.body instanceof ArrayBuffer) {
					object.bodyBytes = object.body;
					delete object.body;
				} else if (ArrayBuffer.isView(object.body)) {
					object.bodyBytes = object.body.buffer.slice(object.body.byteOffset, object.body.byteLength + object.body.byteOffset);
					delete object.body;
				} else if (object.body) delete object.bodyBytes;
				$done(object);
				break;
			case 'Node.js':
				process.exit(1);
				break;
		}
	}

	/**
	 * Get Environment Variables
	 * @link https://github.com/VirgilClyne/GetSomeFries/blob/main/function/getENV/getENV.js
	 * @author VirgilClyne
	 * @param {String} key - Persistent Store Key
	 * @param {Array} names - Platform Names
	 * @param {Object} database - Default Database
	 * @return {Object} { Settings, Caches, Configs }
	 */
	getENV(key, names, database) {
		//this.log(`☑️ ${this.name}, Get Environment Variables`, "");
		/***************** BoxJs *****************/
		// 包装为局部变量，用完释放内存
		// BoxJs的清空操作返回假值空字符串, 逻辑或操作符会在左侧操作数为假值时返回右侧操作数。
		let BoxJs = this.getjson(key, database);
		//this.log(`🚧 ${this.name}, Get Environment Variables`, `BoxJs类型: ${typeof BoxJs}`, `BoxJs内容: ${JSON.stringify(BoxJs)}`, "");
		/***************** Argument *****************/
		let Argument = {};
		if (typeof $argument !== "undefined") {
			if (Boolean($argument)) {
				//this.log(`🎉 ${this.name}, $Argument`);
				let arg = Object.fromEntries($argument.split("&").map((item) => item.split("=").map(i => i.replace(/\"/g, ''))));
				//this.log(JSON.stringify(arg));
				for (let item in arg) this.lodash.set(Argument, item, arg[item]);
				//this.log(JSON.stringify(Argument));
			}			//this.log(`✅ ${this.name}, Get Environment Variables`, `Argument类型: ${typeof Argument}`, `Argument内容: ${JSON.stringify(Argument)}`, "");
		}		/***************** Store *****************/
		const Store = { Settings: database?.Default?.Settings || {}, Configs: database?.Default?.Configs || {}, Caches: {} };
		if (!Array.isArray(names)) names = [names];
		//this.log(`🚧 ${this.name}, Get Environment Variables`, `names类型: ${typeof names}`, `names内容: ${JSON.stringify(names)}`, "");
		for (let name of names) {
			Store.Settings = { ...Store.Settings, ...database?.[name]?.Settings, ...Argument, ...BoxJs?.[name]?.Settings };
			Store.Configs = { ...Store.Configs, ...database?.[name]?.Configs };
			if (BoxJs?.[name]?.Caches && typeof BoxJs?.[name]?.Caches === "string") BoxJs[name].Caches = JSON.parse(BoxJs?.[name]?.Caches);
			Store.Caches = { ...Store.Caches, ...BoxJs?.[name]?.Caches };
		}		//this.log(`🚧 ${this.name}, Get Environment Variables`, `Store.Settings类型: ${typeof Store.Settings}`, `Store.Settings: ${JSON.stringify(Store.Settings)}`, "");
		this.traverseObject(Store.Settings, (key, value) => {
			//this.log(`🚧 ${this.name}, traverseObject`, `${key}: ${typeof value}`, `${key}: ${JSON.stringify(value)}`, "");
			if (value === "true" || value === "false") value = JSON.parse(value); // 字符串转Boolean
			else if (typeof value === "string") {
				if (value.includes(",")) value = value.split(",").map(item => this.string2number(item)); // 字符串转数组转数字
				else value = this.string2number(value); // 字符串转数字
			}			return value;
		});
		//this.log(`✅ ${this.name}, Get Environment Variables`, `Store: ${typeof Store.Caches}`, `Store内容: ${JSON.stringify(Store)}`, "");
		return Store;
	};

	/***************** function *****************/
	traverseObject(o, c) { for (var t in o) { var n = o[t]; o[t] = "object" == typeof n && null !== n ? this.traverseObject(n, c) : c(t, n); } return o }
	string2number(string) { if (string && !isNaN(string)) string = parseInt(string, 10); return string }
}

let URI$1 = class URI {
	constructor(opts = []) {
		this.name = "URI v1.2.6";
		this.opts = opts;
		this.json = { scheme: "", host: "", path: "", query: {} };
	};

	parse(url) {
		const URLRegex = /(?:(?<scheme>.+):\/\/(?<host>[^/]+))?\/?(?<path>[^?]+)?\??(?<query>[^?]+)?/;
		let json = url.match(URLRegex)?.groups ?? null;
		if (json?.path) json.paths = json.path.split("/"); else json.path = "";
		//if (json?.paths?.at(-1)?.includes(".")) json.format = json.paths.at(-1).split(".").at(-1);
		if (json?.paths) {
			const fileName = json.paths[json.paths.length - 1];
			if (fileName?.includes(".")) {
				const list = fileName.split(".");
				json.format = list[list.length - 1];
			}
		}
		if (json?.query) json.query = Object.fromEntries(json.query.split("&").map((param) => param.split("=")));
		return json
	};

	stringify(json = this.json) {
		let url = "";
		if (json?.scheme && json?.host) url += json.scheme + "://" + json.host;
		if (json?.path) url += (json?.host) ? "/" + json.path : json.path;
		if (json?.query) url += "?" + Object.entries(json.query).map(param => param.join("=")).join("&");
		return url
	};
};

var Settings$5 = {
	Switch: true
};
var Default = {
	Settings: Settings$5
};

var Default$1 = /*#__PURE__*/Object.freeze({
	__proto__: null,
	Settings: Settings$5,
	default: Default
});

var Settings$4 = {
	Switch: true,
	Title: "☁ 𝙒𝘼𝙍𝙋 𝙄𝙣𝙛𝙤",
	Icon: "lock.icloud.fill",
	IconColor: "#f48220",
	BackgroundColor: "#f6821f",
	Language: "auto"
};
var Configs$3 = {
	Request: {
		url: "https://api.cloudflareclient.com",
		headers: {
			authorization: null,
			"content-Type": "application/json",
			"user-agent": "1.1.1.1/6.22",
			"cf-client-version": "i-6.22-2308151957.1"
		}
	},
	i18n: {
		"zh-Hans": {
			IPv4: "IPv4",
			IPv6: "IPv6",
			COLO: "托管中心",
			WARP_Level: "隐私保护",
			Account_Type: "账户类型",
			Data_Info: "流量信息",
			Unknown: "未知",
			Fail: "获取失败",
			WARP_Level_Off: "关闭",
			WARP_Level_On: "开启",
			WARP_Level_Plus: "增强",
			Account_Type_unlimited: "无限版",
			Account_Type_limited: "有限版",
			Account_Type_team: "团队版",
			Account_Type_plus: "WARP+",
			Account_Type_free: "免费版",
			Data_Info_Used: "已用",
			Data_Info_Residual: "剩余",
			Data_Info_Total: "总计",
			Data_Info_Unlimited: "无限"
		},
		"zh-Hant": {
			IPv4: "IPv4",
			IPv6: "IPv6",
			COLO: "託管中心",
			WARP_Level: "隱私保護",
			Account_Type: "賬戶類型",
			Data_Info: "流量信息",
			Unknown: "未知",
			Fail: "獲取失敗",
			WARP_Level_Off: "關閉",
			WARP_Level_On: "開啟",
			WARP_Level_Plus: "增強",
			Account_Type_unlimited: "無限版",
			Account_Type_limited: "有限版",
			Account_Type_team: "團隊版",
			Account_Type_plus: "WARP+",
			Account_Type_free: "免費版",
			Data_Info_Used: "已用",
			Data_Info_Residual: "剩餘",
			Data_Info_Total: "總計",
			Data_Info_Unlimited: "無限"
		},
		en: {
			IPv4: "IPv4",
			IPv6: "IPv6",
			COLO: "Colo Center",
			WARP_Level: "WARP Level",
			Account_Type: "Account Type",
			Data_Info: "Data Info.",
			Unknown: "Unknown",
			Fail: "Fail to Get",
			WARP_Level_Off: "OFF",
			WARP_Level_On: "ON",
			WARP_Level_Plus: "PLUS",
			Account_Type_unlimited: "Unlimited",
			Account_Type_limited: "Limited",
			Account_Type_team: "Team",
			Account_Type_plus: "WARP+",
			Account_Type_free: "Free",
			Data_Info_Used: "Used",
			Data_Info_Residual: "Remaining",
			Data_Info_Total: "Earned",
			Data_Info_Unlimited: "Unlimited"
		}
	}
};
var Panel = {
	Settings: Settings$4,
	Configs: Configs$3
};

var Panel$1 = /*#__PURE__*/Object.freeze({
	__proto__: null,
	Configs: Configs$3,
	Settings: Settings$4,
	default: Panel
});

var Settings$3 = {
	Switch: true,
	setupMode: "ChangeKeypair",
	Verify: {
		RegistrationId: null,
		Mode: "Token",
		Content: null
	}
};
var _1_1_1_1 = {
	Settings: Settings$3
};

var OneDotOneDotOneDotOne = /*#__PURE__*/Object.freeze({
	__proto__: null,
	Settings: Settings$3,
	default: _1_1_1_1
});

var Settings$2 = {
	Switch: true,
	IPServer: "ipw.cn",
	Verify: {
		Mode: "Token",
		Content: ""
	},
	zone: {
		id: "",
		name: "",
		dns_records: [
			{
				id: "",
				type: "A",
				name: "",
				content: "",
				ttl: 1,
				proxied: false
			}
		]
	}
};
var Configs$2 = {
	Request: {
		url: "https://api.cloudflare.com/client/v4",
		headers: {
			"content-type": "application/json"
		}
	}
};
var DNS = {
	Settings: Settings$2,
	Configs: Configs$2
};

var DNS$1 = /*#__PURE__*/Object.freeze({
	__proto__: null,
	Configs: Configs$2,
	Settings: Settings$2,
	default: DNS
});

var Settings$1 = {
	Switch: true,
	setupMode: null,
	deviceType: "iOS",
	Verify: {
		License: null,
		Mode: "Token",
		Content: null,
		RegistrationId: null
	}
};
var Configs$1 = {
	Request: {
		url: "https://api.cloudflareclient.com",
		headers: {
			authorization: null,
			"content-Type": "application/json",
			"user-agent": "1.1.1.1/6.22",
			"cf-client-version": "i-6.22-2308151957.1"
		}
	},
	Environment: {
		iOS: {
			Type: "i",
			Version: "v0i2308151957",
			headers: {
				"user-agent": "1.1.1.1/6.22",
				"cf-client-version": "i-6.22-2308151957.1"
			}
		},
		macOS: {
			Type: "m",
			Version: "v0i2109031904",
			headers: {
				"user-agent": "1.1.1.1/2109031904.1 CFNetwork/1327.0.4 Darwin/21.2.0",
				"cf-client-version": "m-2021.12.1.0-0"
			}
		},
		Android: {
			Type: "a",
			Version: "v0a1922",
			headers: {
				"user-agent": "okhttp/3.12.1",
				"cf-client-version": "a-6.3-1922"
			}
		},
		Windows: {
			Type: "w",
			Version: "",
			headers: {
				"user-agent": "",
				"cf-client-version": ""
			}
		},
		Linux: {
			Type: "l",
			Version: "",
			headers: {
				"user-agent": "",
				"cf-client-version": ""
			}
		}
	}
};
var WARP = {
	Settings: Settings$1,
	Configs: Configs$1
};

var WARP$1 = /*#__PURE__*/Object.freeze({
	__proto__: null,
	Configs: Configs$1,
	Settings: Settings$1,
	default: WARP
});

var Settings = {
	Switch: true,
	PrivateKey: "",
	PublicKey: ""
};
var Configs = {
	"interface": {
		addresses: {
			v4: "",
			v6: ""
		}
	},
	peers: [
		{
			public_key: "",
			endpoint: {
				host: "",
				v4: "",
				v6: ""
			}
		}
	]
};
var VPN = {
	Settings: Settings,
	Configs: Configs
};

var VPN$1 = /*#__PURE__*/Object.freeze({
	__proto__: null,
	Configs: Configs,
	Settings: Settings,
	default: VPN
});

var Database$1 = Database = {
	"Default": Default$1,
	"Panel": Panel$1,
	"1dot1dot1dot1": OneDotOneDotOneDotOne,
	"DNS": DNS$1,
	"WARP": WARP$1,
	"VPN": VPN$1
};

/**
 * Set Environment Variables
 * @author VirgilClyne
 * @param {String} name - Persistent Store Key
 * @param {Array} platforms - Platform Names
 * @param {Object} database - Default DataBase
 * @return {Object} { Settings, Caches, Configs }
 */
function setENV($, name, platforms, database) {
	$.log(`☑️ Set Environment Variables`, "");
	let { Settings, Caches, Configs } = $.getENV(name, platforms, database);
	/***************** Settings *****************/
	switch (Settings.Verify?.Mode) {
		case "Token":
			Configs.Request.headers["authorization"] = `Bearer ${Settings.Verify?.Content}`;
			break;
		case "ServiceKey":
			Configs.Request.headers["x-auth-user-service-key"] = Settings.Verify?.Content;
			break;
		case "Key":
			Settings.Verify.Content = Array.from(Settings.Verify?.Content.split("\n"));
			//$.log(JSON.stringify(Settings.Verify.Content))
			Configs.Request.headers["x-auth-key"] = Settings.Verify?.Content[0];
			Configs.Request.headers["x-auth-email"] = Settings.Verify?.Content[1];
			break;
		default:
			$.log("无可用授权方式", `Mode=${Settings.Verify?.Mode}`, `Content=${Settings.Verify?.Content}`);
			break;
		case undefined:
			break;
	}	if (Settings.zone?.dns_records) {
		Settings.zone.dns_records = Array.from(Settings.zone.dns_records.split("\n"));
		//$.log(JSON.stringify(Settings.zone.dns_records))
		Settings.zone.dns_records.forEach((item, i) => {
			Settings.zone.dns_records[i] = Object.fromEntries(item.split("&").map((item) => item.split("=")));
			Settings.zone.dns_records[i].proxied = JSON.parse(Settings.zone.dns_records[i].proxied);
		});
	}	$.log(`✅ Set Environment Variables`, `Settings: ${typeof Settings}`, `Settings内容: ${JSON.stringify(Settings)}`, "");
	/***************** Caches *****************/
	//$.log(`✅ Set Environment Variables`, `Caches: ${typeof Caches}`, `Caches内容: ${JSON.stringify(Caches)}`, "");
	/***************** Configs *****************/
	return { Settings, Caches, Configs };
}

const $ = new ENV("☁ Cloudflare: 1️⃣ 1.1.1.1 v3.0.1(1).request.beta");
const URI = new URI$1();

// 构造回复数据
let $response = undefined;

/***************** Processing *****************/
// 解构URL
const URL = URI.parse($request.url);
$.log(`⚠ URL: ${JSON.stringify(URL)}`, "");
// 获取连接参数
const METHOD = $request.method; URL.host; URL.path; const PATHs = URL.paths;
$.log(`⚠ METHOD: ${METHOD}`, "");
// 解析格式
const FORMAT = ($request.headers?.["Content-Type"] ?? $request.headers?.["content-type"])?.split(";")?.[0];
$.log(`⚠ FORMAT: ${FORMAT}`, "");
(async () => {
	const { Settings, Caches, Configs } = setENV($, "Cloudflare", "1dot1dot1dot1", Database$1);
	$.log(`⚠ Settings.Switch: ${Settings?.Switch}`, "");
	switch (Settings.Switch) {
		case true:
		default:
			const WireGuard = $.getENV("WireGuard", "VPN", Database$1);
			/*
			const KIND = RegExp(`/reg/${Settings.Verify.RegistrationId}$`, "i").test($request.url) ? "RegistrationId"
				: /reg/i.test($request.url) ? "Registration"
					: undefined
			*/
			const KIND = `/${PATHs[1]}/${PATHs[2]}` === `/reg/${Settings.Verify.RegistrationId}` ? "RegistrationId"
				: `/${PATHs[1]}` === `/reg` ? "Registration"
					: undefined;
			$.log(`🚧 KIND: ${KIND}`, "");
			$.setjson($request, `@${"Cloudflare"}.${"1dot1dot1dot1"}.Caches`);
			// 创建空数据
			let body = {};
			// 方法判断
			switch (METHOD) {
				case "POST":
				case "PUT":
				case "PATCH":
				case "DELETE":
					// 格式判断
					switch (FORMAT) {
						case undefined: // 视为无body
							break;
						case "application/x-www-form-urlencoded":
						case "text/plain":
						case "text/html":
						default:
							//$.log(`🚧 body: ${JSON.stringify(body)}`, "");
							break;
						case "application/x-mpegURL":
						case "application/x-mpegurl":
						case "application/vnd.apple.mpegurl":
						case "audio/mpegurl":
							//body = M3U8.parse($response.body);
							//$.log(`🚧 body: ${JSON.stringify(body)}`, "");
							//$response.body = M3U8.stringify(body);
							break;
						case "text/xml":
						case "text/plist":
						case "application/xml":
						case "application/plist":
						case "application/x-plist":
							//body = XML.parse($response.body);
							//$.log(`🚧 body: ${JSON.stringify(body)}`, "");
							//$response.body = XML.stringify(body);
							break;
						case "text/vtt":
						case "application/vtt":
							//body = VTT.parse($response.body);
							//$.log(`🚧 body: ${JSON.stringify(body)}`, "");
							//$response.body = VTT.stringify(body);
							break;
						case "text/json":
						case "application/json":
							body = JSON.parse($request.body ?? "{}");
							switch (KIND) {
								case "Registration": // 是注册链接
									break;
								case "RegistrationId": // 是指定注册链接
									if ($request.method === "PUT") { // 是PUT方法
										body.key = WireGuard.Settings.PublicKey;
										$.msg($.name, "重置密钥", `发送请求数据，请求中的客户端公钥已替换为:\n${WireGuard.Settings.PublicKey}\n等待回复数据`);
										//$.log($.name, "重置密钥", "发送请求数据，请求中的客户端公钥已替换为:", WireGuard.Settings.PublicKey, "等待回复数据", "");
									}
									break;
							}							$request.body = JSON.stringify(body);
							break;
						case "application/protobuf":
						case "application/x-protobuf":
						case "application/vnd.google.protobuf":
						case "application/grpc":
						case "application/grpc+proto":
						case "application/octet-stream":
							break;
					}					//break; // 不中断，继续处理URL
				case "GET":
				case "HEAD":
				case "OPTIONS":
				case undefined: // QX牛逼，script-echo-response不返回method
				default:
					if ($request.headers?.Host) $request.headers.Host = URL.host;
					$request.url = URI.stringify(URL);
					$.log(`🚧 ${$.name}, 调试信息`, `$request.url: ${$request.url}`, "");
					break;
				case "CONNECT":
				case "TRACE":
					break;
			}			break;
		case false:
			break;
	}})()
	.catch((e) => $.logErr(e))
	.finally(() => {
		switch ($response) {
			default: // 有构造回复数据，返回构造的回复数据
				if ($.isQuanX()) {
					if (!$response.status) $response.status = "HTTP/1.1 200 OK";
					delete $response.headers?.["Transfer-Encoding"];
					$.done($response);
				} else $.done({ response: $response });
				break;
			case undefined: // 无构造回复数据，发送修改的请求数据
				$.done($request);
				break;
		}	});
