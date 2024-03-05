/* README: https://github.com/VirgilClyne/Cloudflare */
/* https://www.lodashjs.com */
class Lodash {
	static name = "Lodash";
	static version = "1.2.2";
	static about() { return console.log(`\n🟧 ${this.name} v${this.version}\n`) };

	static get(object = {}, path = "", defaultValue = undefined) {
		// translate array case to dot case, then split with .
		// a[0].b -> a.0.b -> ['a', '0', 'b']
		if (!Array.isArray(path)) path = this.toPath(path);

		const result = path.reduce((previousValue, currentValue) => {
			return Object(previousValue)[currentValue]; // null undefined get attribute will throwError, Object() can return a object 
		}, object);
		return (result === undefined) ? defaultValue : result;
	}

	static set(object = {}, path = "", value) {
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

	static unset(object = {}, path = "") {
		if (!Array.isArray(path)) path = this.toPath(path);
		let result = path.reduce((previousValue, currentValue, currentIndex) => {
			if (currentIndex === path.length - 1) {
				delete previousValue[currentValue];
				return true
			}
			return Object(previousValue)[currentValue]
		}, object);
		return result
	}

	static toPath(value) {
		return value.replace(/\[(\d+)\]/g, '.$1').split('.').filter(Boolean);
	}

	static escape(string) {
		const map = {
			'&': '&amp;',
			'<': '&lt;',
			'>': '&gt;',
			'"': '&quot;',
			"'": '&#39;',
		};
		return string.replace(/[&<>"']/g, m => map[m])
	};

	static unescape(string) {
		const map = {
			'&amp;': '&',
			'&lt;': '<',
			'&gt;': '>',
			'&quot;': '"',
			'&#39;': "'",
		};
		return string.replace(/&amp;|&lt;|&gt;|&quot;|&#39;/g, m => map[m])
	}

}

/* https://developer.mozilla.org/zh-CN/docs/Web/API/Storage/setItem */
class $Storage {
	static name = "$Storage";
	static version = "1.0.9";
	static about() { return console.log(`\n🟧 ${this.name} v${this.version}\n`) };
	static data = null
	static dataFile = 'box.dat'
	static #nameRegex = /^@(?<key>[^.]+)(?:\.(?<path>.*))?$/;

	static #platform() {
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

    static getItem(keyName = new String, defaultValue = null) {
        let keyValue = defaultValue;
        // 如果以 @
		switch (keyName.startsWith('@')) {
			case true:
				const { key, path } = keyName.match(this.#nameRegex)?.groups;
				//console.log(`1: ${key}, ${path}`);
				keyName = key;
				let value = this.getItem(keyName, {});
				//console.log(`2: ${JSON.stringify(value)}`)
				if (typeof value !== "object") value = {};
				//console.log(`3: ${JSON.stringify(value)}`)
				keyValue = Lodash.get(value, path);
				//console.log(`4: ${JSON.stringify(keyValue)}`)
				try {
					keyValue = JSON.parse(keyValue);
				} catch (e) {
					// do nothing
				}				//console.log(`5: ${JSON.stringify(keyValue)}`)
				break;
			default:
				switch (this.#platform()) {
					case 'Surge':
					case 'Loon':
					case 'Stash':
					case 'Egern':
					case 'Shadowrocket':
						keyValue = $persistentStore.read(keyName);
						break;
					case 'Quantumult X':
						keyValue = $prefs.valueForKey(keyName);
						break;
					case 'Node.js':
						this.data = this.#loaddata(this.dataFile);
						keyValue = this.data?.[keyName];
						break;
					default:
						keyValue = this.data?.[keyName] || null;
						break;
				}				try {
					keyValue = JSON.parse(keyValue);
				} catch (e) {
					// do nothing
				}				break;
		}		return keyValue ?? defaultValue;
    };

	static setItem(keyName = new String, keyValue = new String) {
		let result = false;
		//console.log(`0: ${typeof keyValue}`);
		switch (typeof keyValue) {
			case "object":
				keyValue = JSON.stringify(keyValue);
				break;
			default:
				keyValue = String(keyValue);
				break;
		}		switch (keyName.startsWith('@')) {
			case true:
				const { key, path } = keyName.match(this.#nameRegex)?.groups;
				//console.log(`1: ${key}, ${path}`);
				keyName = key;
				let value = this.getItem(keyName, {});
				//console.log(`2: ${JSON.stringify(value)}`)
				if (typeof value !== "object") value = {};
				//console.log(`3: ${JSON.stringify(value)}`)
				Lodash.set(value, path, keyValue);
				//console.log(`4: ${JSON.stringify(value)}`)
				result = this.setItem(keyName, value);
				//console.log(`5: ${result}`)
				break;
			default:
				switch (this.#platform()) {
					case 'Surge':
					case 'Loon':
					case 'Stash':
					case 'Egern':
					case 'Shadowrocket':
						result = $persistentStore.write(keyValue, keyName);
						break;
					case 'Quantumult X':
						result =$prefs.setValueForKey(keyValue, keyName);
						break;
					case 'Node.js':
						this.data = this.#loaddata(this.dataFile);
						this.data[keyName] = keyValue;
						this.#writedata(this.dataFile);
						result = true;
						break;
					default:
						result = this.data?.[keyName] || null;
						break;
				}				break;
		}		return result;
	};

    static removeItem(keyName){
		let result = false;
		switch (keyName.startsWith('@')) {
			case true:
				const { key, path } = keyName.match(this.#nameRegex)?.groups;
				keyName = key;
				let value = this.getItem(keyName);
				if (typeof value !== "object") value = {};
				keyValue = Lodash.unset(value, path);
				result = this.setItem(keyName, value);
				break;
			default:
				switch (this.#platform()) {
					case 'Surge':
					case 'Loon':
					case 'Stash':
					case 'Egern':
					case 'Shadowrocket':
						result = false;
						break;
					case 'Quantumult X':
						result = $prefs.removeValueForKey(keyName);
						break;
					case 'Node.js':
						result = false;
						break;
					default:
						result = false;
						break;
				}				break;
		}		return result;
    }

    static clear() {
		let result = false;
		switch (this.#platform()) {
			case 'Surge':
			case 'Loon':
			case 'Stash':
			case 'Egern':
			case 'Shadowrocket':
				result = false;
				break;
			case 'Quantumult X':
				result = $prefs.removeAllValues();
				break;
			case 'Node.js':
				result = false;
				break;
			default:
				result = false;
				break;
		}		return result;
    }

	static #loaddata(dataFile) {
		if (this.isNode()) {
			this.fs = this.fs ? this.fs : require('fs');
			this.path = this.path ? this.path : require('path');
			const curDirDataFilePath = this.path.resolve(dataFile);
			const rootDirDataFilePath = this.path.resolve(
				process.cwd(),
				dataFile
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

	static #writedata(dataFile = this.dataFile) {
		if (this.isNode()) {
			this.fs = this.fs ? this.fs : require('fs');
			this.path = this.path ? this.path : require('path');
			const curDirDataFilePath = this.path.resolve(dataFile);
			const rootDirDataFilePath = this.path.resolve(
				process.cwd(),
				dataFile
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
	};

}

class ENV {
	static name = "ENV"
	static version = '1.7.1'
	static about() { return console.log(`\n🟧 ${this.name} v${this.version}\n`) }

	constructor(name, opts) {
		console.log(`\n🟧 ${ENV.name} v${ENV.version}\n`);
		this.name = name;
		this.logs = [];
		this.isMute = false;
		this.isMuteLog = false;
		this.logSeparator = '\n';
		this.encoding = 'utf-8';
		this.startTime = new Date().getTime();
		Object.assign(this, opts);
		this.log(`\n🚩 开始!\n${name}\n`);
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

	async getScript(url) {
		return await this.fetch(url).then(response => response.body);
	}

	async runScript(script, runOpts) {
		let httpapi = $Storage.getItem('@chavy_boxjs_userCfgs.httpapi');
		httpapi = httpapi?.replace?.(/\n/g, '')?.trim();
		let httpapi_timeout = $Storage.getItem('@chavy_boxjs_userCfgs.httpapi_timeout');
		httpapi_timeout = (httpapi_timeout * 1) ?? 20;
		httpapi_timeout = runOpts?.timeout ?? httpapi_timeout;
		const [password, address] = httpapi.split('@');
		const request = {
			url: `http://${address}/v1/scripting/evaluate`,
			body: {
				script_text: script,
				mock_type: 'cron',
				timeout: httpapi_timeout
			},
			headers: { 'X-Key': password, 'Accept': '*/*' },
			timeout: httpapi_timeout
		};
		await this.fetch(request).then(response => response.body, error => this.logErr(error));
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
					if (this.isStash()) Lodash.set(request, "headers.X-Stash-Selected-Proxy", encodeURI(request.policy));
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
				// 添加策略组
				if (request.policy) Lodash.set(request, "opts.policy", request.policy);
				// 移除不可写字段
				delete request.charset;
				delete request.host;
				delete request.path;
				delete request.policy;
				delete request.scheme;
				delete request.sessionIndex;
				delete request.statusCode;
				// 判断请求数据类型
				if (request.body instanceof ArrayBuffer) {
					request.bodyBytes = request.body;
					delete request.body;
				} else if (ArrayBuffer.isView(request.body)) {
					request.bodyBytes = request.body.buffer.slice(request.body.byteOffset, request.body.byteLength + request.body.byteOffset);
					delete object.body;
				} else if (request.body) delete request.bodyBytes;
				// 发送请求
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
		switch (this.platform()) {
			case 'Surge':
				if (object.policy) Lodash.set(object, "headers.X-Surge-Policy", object.policy);
				$done(object);
				break;
			case 'Loon':
				if (object.policy) object.node = object.policy;
				$done(object);
				break;
			case 'Stash':
				if (object.policy) Lodash.set(object, "headers.X-Stash-Selected-Proxy", encodeURI(object.policy));
				$done(object);
				break;
			case 'Egern':
				$done(object);
				break;
			case 'Shadowrocket':
			default:
				$done(object);
				break;
			case 'Quantumult X':
				if (object.policy) Lodash.set(object, "opts.policy", object.policy);
				// 移除不可写字段
				delete object.charset;
				delete object.host;
				delete object.method; // 1.4.x 不可写
				delete object.opt; // $task.fetch() 参数, 不可写
				delete object.path; // 可写, 但会与 url 冲突
				delete object.policy;
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
}

/***************** Cloudflare API v4 *****************/
let Cloudflare$1 = class Cloudflare {
    constructor($, option) {
        this.name = "Cloudflare API v4";
        this.version = '1.1.0';
        this.option = option;
        this.baseURL = "https://api.cloudflare.com/client/v4";
        this.$ = $;
        console.log(`\n${this.name} v${this.version}\n`);
    }
    async trace(request) {
        this.$.log("⚠️ trace: 追踪路由");
        request.url = "https://cloudflare.com/cdn-cgi/trace";
        delete request.headers;
        return await this.$.fetch(request, this.option).then(response => Object.fromEntries(response.body.trim().split('\n').map(e => e.split('='))));
    }
    async trace4(request) {
        this.$.log("⚠️ trace4: 追踪IPv4路由");
        //request.url = "https://1.1.1.1/cdn-cgi/trace";
		request.url = "https://162.159.36.1/cdn-cgi/trace";
        delete request.headers;
        return await this.$.fetch(request, this.option).then(response => Object.fromEntries(response.body.trim().split('\n').map(e => e.split('='))));
    }
    async trace6(request) {
        this.$.log("⚠️ trace6: 追踪IPv6路由");
        request.url = "https://[2606:4700:4700::1111]/cdn-cgi/trace";
        delete request.headers;
        return await this.$.fetch(request, this.option).then(response => Object.fromEntries(response.body.trim().split('\n').map(e => e.split('='))));
    }
    async verifyToken(request) {
        // Verify Token
        // https://api.cloudflare.com/#user-api-tokens-verify-token
        this.$.log("⚠️ verifyToken: 验证令牌");
        request.url = this.baseURL + "/user/tokens/verify";
        return await this.fetch(request, this.option);
    }
    async getUser(request) {
        // User Details
        // https://api.cloudflare.com/#user-user-details
        this.$.log("⚠️ getUser: 获取用户信息");
        request.url = this.baseURL + "/user";
        return await this.fetch(request, this.option);
    }
    async getZone(request, Zone) {
        // Zone Details
        // https://api.cloudflare.com/#zone-zone-details
        this.$.log("⚠️ getZone: 获取区域详情");
        request.url = this.baseURL + `/zones/${Zone.id}`;
        return await this.fetch(request, this.option);
    }
    async listZones(request, Zone) {
        // List Zones
        // https://api.cloudflare.com/#zone-list-zones
        this.$.log("⚠️ listZones: 列出区域");
        request.url = this.baseURL + `/zones?name=${Zone.name}`;
        return await this.fetch(request, this.option);
    }
    async createDNSRecord(request, Zone, Record) {
        // Create DNS Record
        // https://api.cloudflare.com/#dns-records-for-a-zone-create-dns-record
        this.$.log("⚠️ createDNSRecord: 创建新DNS记录");
        request.url = this.baseURL + `/zones/${Zone.id}/dns_records`;
        request.body = Record;
        return await this.fetch(request, this.option);
    }
    async getDNSRecord(request, Zone, Record) {
        // DNS Record Details
        // https://api.cloudflare.com/#dns-records-for-a-zone-dns-record-details
        this.$.log("⚠️ getDNSRecord: 获取DNS记录详情");
        request.url = this.baseURL + `/zones/${Zone.id}/dns_records/${Record.id}`;
        return await this.fetch(request, this.option);
    }
    async listDNSRecords(request, Zone, Record) {
        // List DNS Records
        // https://api.cloudflare.com/#dns-records-for-a-zone-list-dns-records
        this.$.log("⚠️ listDNSRecords: 列出DNS记录");
        request.url = this.baseURL + `/zones/${Zone.id}/dns_records?type=${Record.type}&name=${Record.name}.${Zone.name}&order=type`;
        return await this.fetch(request, this.option);
    }
    async updateDNSRecord(request, Zone, Record) {
        // Update DNS Record
        // https://api.cloudflare.com/#dns-records-for-a-zone-update-dns-record
        this.$.log("⚠️ updateDNSRecord: 更新DNS记录");
        request.method = "PUT";
        request.url = this.baseURL + `/zones/${Zone.id}/dns_records/${Record.id}`;
        request.body = Record;
        return await this.fetch(request, this.option);
    }

    async fetch(request, option) {
        return await this.$.fetch(request, option).then(response => {
            const body = JSON.parse(response.body);
            if (Array.isArray(body.messages)) body.messages.forEach(message => {
                if (message.code !== 10000) this.$.msg(this.$.name, `code: ${message.code}`, `message: ${message.message}`);
            });
            switch (body.success) {
                case true:
                    return body?.result?.[0] ?? body?.result; // body.result, body.meta
                case false:
                    if (Array.isArray(body.errors)) body.errors.forEach(error => this$.msg(this.$.name, `code: ${error.code}`, `message: ${error.message}`));
                    break;
                case undefined:
                    return response;
            }        }, error => this.$.logErr(`❗️ Cloudflare 执行失败`, ` error = ${error || e}`, ""));
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
 * Get Storage Variables
 * @link https://github.com/NanoCat-Me/ENV/blob/main/getStorage.mjs
 * @author VirgilClyne
 * @param {String} key - Persistent Store Key
 * @param {Array} names - Platform Names
 * @param {Object} database - Default Database
 * @return {Object} { Settings, Caches, Configs }
 */
function getStorage(key, names, database) {
    //console.log(`☑️ ${this.name}, Get Environment Variables`, "");
    /***************** BoxJs *****************/
    // 包装为局部变量，用完释放内存
    // BoxJs的清空操作返回假值空字符串, 逻辑或操作符会在左侧操作数为假值时返回右侧操作数。
    let BoxJs = $Storage.getItem(key, database);
    //console.log(`🚧 ${this.name}, Get Environment Variables`, `BoxJs类型: ${typeof BoxJs}`, `BoxJs内容: ${JSON.stringify(BoxJs)}`, "");
    /***************** Argument *****************/
    let Argument = {};
    if (typeof $argument !== "undefined") {
        if (Boolean($argument)) {
            //console.log(`🎉 ${this.name}, $Argument`);
            let arg = Object.fromEntries($argument.split("&").map((item) => item.split("=").map(i => i.replace(/\"/g, ''))));
            //console.log(JSON.stringify(arg));
            for (let item in arg) Lodash.set(Argument, item, arg[item]);
            //console.log(JSON.stringify(Argument));
        }        //console.log(`✅ ${this.name}, Get Environment Variables`, `Argument类型: ${typeof Argument}`, `Argument内容: ${JSON.stringify(Argument)}`, "");
    }    /***************** Store *****************/
    const Store = { Settings: database?.Default?.Settings || {}, Configs: database?.Default?.Configs || {}, Caches: {} };
    if (!Array.isArray(names)) names = [names];
    //console.log(`🚧 ${this.name}, Get Environment Variables`, `names类型: ${typeof names}`, `names内容: ${JSON.stringify(names)}`, "");
    for (let name of names) {
        Store.Settings = { ...Store.Settings, ...database?.[name]?.Settings, ...Argument, ...BoxJs?.[name]?.Settings };
        Store.Configs = { ...Store.Configs, ...database?.[name]?.Configs };
        if (BoxJs?.[name]?.Caches && typeof BoxJs?.[name]?.Caches === "string") BoxJs[name].Caches = JSON.parse(BoxJs?.[name]?.Caches);
        Store.Caches = { ...Store.Caches, ...BoxJs?.[name]?.Caches };
    }    //console.log(`🚧 ${this.name}, Get Environment Variables`, `Store.Settings类型: ${typeof Store.Settings}`, `Store.Settings: ${JSON.stringify(Store.Settings)}`, "");
    traverseObject(Store.Settings, (key, value) => {
        //console.log(`🚧 ${this.name}, traverseObject`, `${key}: ${typeof value}`, `${key}: ${JSON.stringify(value)}`, "");
        if (value === "true" || value === "false") value = JSON.parse(value); // 字符串转Boolean
        else if (typeof value === "string") {
            if (value.includes(",")) value = value.split(",").map(item => string2number(item)); // 字符串转数组转数字
            else value = string2number(value); // 字符串转数字
        }        return value;
    });
    //console.log(`✅ ${this.name}, Get Environment Variables`, `Store: ${typeof Store.Caches}`, `Store内容: ${JSON.stringify(Store)}`, "");
    return Store;

    /***************** function *****************/
    function traverseObject(o, c) { for (var t in o) { var n = o[t]; o[t] = "object" == typeof n && null !== n ? traverseObject(n, c) : c(t, n); } return o }
    function string2number(string) { if (string && !isNaN(string)) string = parseInt(string, 10); return string }
}

/**
 * Set Environment Variables
 * @author VirgilClyne
 * @param {String} name - Persistent Store Key
 * @param {Array} platforms - Platform Names
 * @param {Object} database - Default DataBase
 * @return {Object} { Settings, Caches, Configs }
 */
function setENV(name, platforms, database) {
	console.log(`☑️ Set Environment Variables`, "");
	let { Settings, Caches, Configs } = getStorage(name, platforms, database);
	/***************** Settings *****************/
	switch (Settings.Verify?.Mode) {
		case "Token":
			Lodash.set(Configs, "Request.headers.authorization", `Bearer ${Settings.Verify?.Content}`);
			break;
		case "ServiceKey":
			Lodash.set(Configs, "Request.headers.x-auth-user-service-key", Settings.Verify?.Content);
			break;
		case "Key":
			Lodash.set(Settings, "Verify.Content", Array.from(Settings.Verify?.Content.split("\n")));
			//console.log(JSON.stringify(Settings.Verify.Content))
			Lodash.set(Configs, "Request.headers.x-auth-key", Settings.Verify?.Content[0]);
			Lodash.set(Configs, "Request.headers.x-auth-email", Settings.Verify?.Content[1]);
			break;
		default:
			console.log(`无可用授权方式\nMode=${Settings.Verify?.Mode}\nContent=${Settings.Verify?.Content}`);
			break;
		case undefined:
			break;
	}	if (Settings.zone?.dns_records) {
		Settings.zone.dns_records = Array.from(Settings.zone.dns_records.split("\n"));
		//console.log(JSON.stringify(Settings.zone.dns_records))
		Settings.zone.dns_records.forEach((item, i) => {
			Settings.zone.dns_records[i] = Object.fromEntries(item.split("&").map((item) => item.split("=")));
			Settings.zone.dns_records[i].proxied = JSON.parse(Settings.zone.dns_records[i].proxied);
		});
	}	console.log(`✅ Set Environment Variables, Settings: ${typeof Settings}, Settings内容: ${JSON.stringify(Settings)}`, "");
	/***************** Caches *****************/
	//console.log(`✅ Set Environment Variables, Caches: ${typeof Caches}, Caches内容: ${JSON.stringify(Caches)}`, "");
	/***************** Configs *****************/
	return { Settings, Caches, Configs };
}

/* refer:https://github.com/phil-r/node-cloudflare-ddns */

const $ = new ENV("☁ Cloudflare: 🇩 DNS v2.5.0(3).beta");
const Cloudflare = new Cloudflare$1($);

/***************** Processing *****************/
(async () => {
	const { Settings, Caches, Configs } = setENV("Cloudflare", "DNS", Database$1);
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
			let newRecord = await checkRecordContent(dns_record, Settings.IPServer);
			//Step 5
			let Record = await setupRecord(Configs.Request, Settings.zone, oldRecord, newRecord);
			$.log(`${Record.name}上的${Record.type}记录${Record.content}更新完成`, "");
		}));
	} else throw new Error("验证失败")
})()
	.catch((e) => $.logErr(e))
	.finally(() => $.done());

/***************** Function *****************/
//Step 1
//Verify API Token/Key
async function Verify(Request, Verify) {
	$.log("验证授权");
	let result = {};
	switch (Verify.Mode) {
		case "Token":
			result = await Cloudflare.verifyToken(Request);
			break;
		case "ServiceKey":
		case "Key":
			result = await Cloudflare.getUser(Request);
			break;
		default:
			$.log("无可用授权方式", `Mode=${Verify.Mode}`, `Content=${Verify.Content}`, "");
			break;
	}
	if (result?.status === "active") return true;
	else if (result?.suspended === false) return true;
	else return false;
}
//Step 2
async function checkZoneInfo(Request, Zone) {
	$.log("查询区域信息");
	let newZone = {};
	if (Zone?.id && Zone?.name) {
		$.log(`有区域ID${Zone.id}和区域名称${Zone.name}, 继续`);
		newZone = Zone;
	} else if (Zone?.id) {
		$.log(`有区域ID${Zone.id}, 继续`);
		newZone = await Cloudflare.getZone(Request, Zone);
	} else if (Zone?.name) {
		$.log(`有区域名称${Zone.name}, 继续`);
		newZone = await Cloudflare.listZones(Request, Zone);
	} else {
		$.logErr("未提供记录ID和名称, 终止");
		$.done();
	}
	$.log(`区域查询结果:`, `ID:${newZone.id}`, `名称:${newZone.name}`, `状态:${newZone.status}`, `仅DNS服务:${newZone.paused}`, `类型:${newZone.type}`, `开发者模式:${newZone.development_mode}`, `名称服务器:${newZone.name_servers}`, `原始名称服务器:${newZone.original_name_servers}`, "");
	const result = { ...Zone, ...newZone };
	return result;
}
//Step 3
async function checkRecordContent(Record, IPServer) {
	if (Record.type) {
		$.log(`有类型${Record.type}, 继续`);
		if (!Record.content) {
			$.log("无内容, 继续");
			switch (Record.type) {
				case "A":
					Record.content = await getExternalIP(4, IPServer);
					break;
				case "AAAA":
					Record.content = await getExternalIP(6, IPServer);
					break;
				case undefined:
					$.log("无类型, 跳过");
					break;
				default:
					$.log(`类型${Record.type}, 跳过`);
					break;
			}
		} else $.log(`有内容${Record.content}, 跳过`);
	} else {
		$.log(`无类型${Record.type}, 跳过`);
	}
	$.log(`${Record.type}类型内容: ${Record.content}`, "");
	return Record;
}
//Step 4
async function checkRecordInfo(Request, Zone, Record) {
	$.log("查询记录信息");
	let oldRecord = {};
	if (Record.id) {
		$.log(`有记录ID${Record.id}, 继续`);
		oldRecord = await Cloudflare.getDNSRecord(Request, Zone, Record);
	} else if (Record.name) {
		$.log(`有记录名称${Record.name}, 继续`);
		oldRecord = await Cloudflare.listDNSRecords(Request, Zone, Record);
	} else {
		$.log("未提供记录ID和名称, 终止");
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
		Record = await Cloudflare.createDNSRecord(Request, Zone, newRecord);
	} else if (oldRecord.content !== newRecord.content) {
		$.log("有记录且IP地址不同");
		Record = await Cloudflare.updateDNSRecord(Request, Zone, { ...oldRecord, ...newRecord });
	} else if (oldRecord.content === newRecord.content) {
		$.log("有记录且IP地址相同");
		Record = oldRecord;
	}
	$.log(`记录更新结果:`, `ID:${Record.id}`, `名称:${Record.name}`, `类型:${Record.type}`, `内容:${Record.content}`, `可代理:${Record.proxiable}`, `代理状态:${Record.proxied}`, `TTL:${Record.ttl}`, `已锁定:${Record.locked}`, "");
	return Record
}

// Function 1A
// Get Public IP / External IP address
// https://www.my-ip.io/api
async function getExternalIP(type, server) {
	$.log(`☑️ get External IP, type: ${type}, server: ${server}`);
	const request = {};
	switch (server) {
		case "ipw.cn":
			request.url = `https://${type}.ipw.cn/api/ip/myip?json`;
			break;
		case "my-ip.io":
			request.url = `https://api${type}.my-ip.io/ip.json`;
			break;
	}	$.log(`🚧 get External IP`, `request: ${JSON.stringify(request)}`);
	return await $.fetch(request).then(response => {
		let body = JSON.parse(response.body);
		$.log(`🚧 get External IP`, `body: ${JSON.stringify(body)}`);
		switch (body?.success ?? body?.result) {
			case true:
				return body.IP ?? body.ip;
			case false:
				if (Array.isArray(body.errors)) body.errors.forEach(error => { $.msg($.name, `code: ${error.code}`, `message: ${error.message}`); });
				if (Array.isArray(body.messages)) $.msg($.name, `code: ${body.code}`, `message: ${body.message}`);
				break;
			default:
				return body?.result?.[0] ?? body?.result;
		}	}, error => $.logErr(`❗️ get External IP`, ` error = ${error || e}`, ""));
}
