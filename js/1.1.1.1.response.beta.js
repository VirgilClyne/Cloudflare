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
	static version = '1.7.4'
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
		// 初始化参数
		switch (request.constructor) {
			case Object:
				request = { ...request, ...option };
				break;
			case String:
				request = { "url": request, ...option };
				break;
		}		// 自动判断请求方法
		if (!request.method) {
			request.method = "GET";
			if (request.body ?? request.bodyBytes) request.method = "POST";
		}		// 移除请求头中的部分参数, 让其自动生成
		delete request.headers?.Host;
		delete request.headers?.[":authority"];
		delete request.headers?.['Content-Length'];
		delete request.headers?.['content-length'];
		// 定义请求方法（小写）
		const method = request.method.toLocaleLowerCase();
		// 判断平台
		switch (this.platform()) {
			case 'Loon':
			case 'Surge':
			case 'Stash':
			case 'Egern':
			case 'Shadowrocket':
			default:
				// 转换请求参数
				if (request.policy) {
					if (this.isLoon()) request.node = request.policy;
					if (this.isStash()) Lodash.set(request, "headers.X-Stash-Selected-Proxy", encodeURI(request.policy));
				}				if (typeof request.redirection === "boolean") request["auto-redirect"] = request.redirection;
				// 转换请求体
				if (request.bodyBytes && !request.body) {
					request.body = request.bodyBytes;
					delete request.bodyBytes;
				}				// 发送请求
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
				// 转换请求参数
				if (request.policy) Lodash.set(request, "opts.policy", request.policy);
				if (typeof request["auto-redirect"] === "boolean") Lodash.set(request, "opts.redirection", request["auto-redirect"]);
				// 转换请求体
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
				delete object["auto-redirect"];
				delete object["auto-cookie"];
				delete object["binary-mode"];
				delete object.charset;
				delete object.host;
				delete object.insecure;
				delete object.method; // 1.4.x 不可写
				delete object.opt; // $task.fetch() 参数, 不可写
				delete object.path; // 可写, 但会与 url 冲突
				delete object.policy;
				delete object["policy-descriptor"];
				delete object.scheme;
				delete object.sessionIndex;
				delete object.statusCode;
				delete object.timeout;
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

class URI {
	static name = "URI";
	static version = "1.2.7";
	static about() { return console.log(`\n🟧 ${this.name} v${this.version}\n`) };
	static #json = { scheme: "", host: "", path: "", query: {} };

	static parse(url) {
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

	static stringify(json = this.#json) {
		let url = "";
		if (json?.scheme && json?.host) url += json.scheme + "://" + json.host;
		if (json?.path) url += (json?.host) ? "/" + json.path : json.path;
		if (json?.query) url += "?" + Object.entries(json.query).map(param => param.join("=")).join("&");
		return url
	};
}

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

const $ = new ENV("☁ Cloudflare: 1️⃣ 1.1.1.1 v3.1.0(5).response.beta");

/***************** Processing *****************/
// 解构URL
const URL = URI.parse($request.url);
$.log(`⚠ URL: ${JSON.stringify(URL)}`, "");
// 获取连接参数
const METHOD = $request.method; URL.host; URL.path; const PATHs = URL.paths;
$.log(`⚠ METHOD: ${METHOD}`, "");
// 解析格式
const FORMAT = ($response.headers?.["Content-Type"] ?? $response.headers?.["content-type"])?.split(";")?.[0];
$.log(`⚠ FORMAT: ${FORMAT}`, "");
(async () => {
	const { Settings, Caches, Configs } = setENV("Cloudflare", "1dot1dot1dot1", Database$1);
	$.log(`⚠ Settings.Switch: ${Settings?.Switch}`, "");
	switch (Settings.Switch) {
		case true:
		default:
			const WireGuard = getStorage("WireGuard", "VPN", Database$1);
			const TOKEN = ($request?.headers?.Authorization ?? $request?.headers?.authorization)?.match(/Bearer (\S*)/)?.[1];
			/*
			const KIND = RegExp(`/reg/${Settings.Verify.RegistrationId}$`, "i").test($request.url) ? "RegistrationId"
				: /reg/i.test($request.url) ? "Registration"
					: undefined
			*/
			const KIND = `/${PATHs[1]}/${PATHs[2]}` === `/reg/${Settings.Verify.RegistrationId}` ? "RegistrationId"
				: `/${PATHs[1]}` === `/reg` ? "Registration"
					: undefined;
			$.log(`🚧 KIND: ${KIND}`, "");
			// 创建空数据
			let body = {};
			// 格式判断
			switch (FORMAT) {
				case undefined: // 视为无body
					break;
				case "application/x-www-form-urlencoded":
				case "text/plain":
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
				case "text/html":
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
					body = JSON.parse($response.body);
					if (Array.isArray(body.messages)) body.messages.forEach(element => $.msg($.name, `code: ${element.code}`, `message: ${element.message}`));
					switch (body.success) {
						case true:
							const result = body?.result?.[0] ?? body?.result; // body.result, body.meta
							if (result) {
								result.config.reserved = setReserved(result?.config?.client_id);
								await setConfigs("WireGuard", "VPN", result.config);
								const message = await setMessage(result, WireGuard);
								switch (KIND) {
									case "Registration": // 是链接
										if ($request.method === "GET" || $request.method === "PUT") { // 是GET或PUT方法
											$.msg($.name, `检测到${result?.account?.account_type}配置文件`, `点击此通知在“邮件”中打开，查看完整配置。\n设备注册ID:\n${result?.id}\n设备令牌Token:\n${TOKEN}\n客户端公钥:\n${result?.key}\n节点公钥:\n${result?.config?.peers?.[0]?.public_key}`, message);
											$.log($.name, `检测到${result?.account?.account_type}配置文件`, `原始配置文件:\n注意！文本内容未转义！字符串中可能包含额外字符！\n${JSON.stringify(result)}`, '');
										}
										break;
									case "RegistrationId": // 是指定链接
										if ($request.method === "PUT") { // 是PUT方法
											$.msg($.name, "重置密钥", `点击此通知在“邮件”中打开，查看完整配置。\n收到回复数据，当前客户端公钥为:\n${result?.key}\n用户设置公钥为:\n${WireGuard?.Settings?.PublicKey}\n如两者一致，则替换成功`, message);
											//$.log($.name, "重置密钥", "收到回复数据，当前替换客户端公钥为:", result.key, "用户设置公钥为:", WireGuard.Settings.PublicKey, "如两者一致，则替换成功", "");
											$.log($.name, `检测到${result?.account?.account_type}配置文件`, `原始配置文件:\n注意！文本内容未转义！字符串中可能包含额外字符！\n${JSON.stringify(result)}`, '');
										}
										break;
								}							}
						case false:
							if (Array.isArray(body.errors)) body.errors.forEach(error => { $.msg($.name, `code: ${error.code}`, `message: ${error.message}`); });
							break;
						case undefined:
							throw new Error($response);
					}					//$response.body = JSON.stringify(body);
					break;
				case "application/protobuf":
				case "application/x-protobuf":
				case "application/vnd.google.protobuf":
				case "application/grpc":
				case "application/grpc+proto":
				case "application/octet-stream":
					break;
			}			break;
		case false:
			break;
	}})()
	.catch((e) => $.logErr(e))
	.finally(() => $.done($response));

/***************** Function *****************/
/**
 * Set Reserved
 * @author VirgilClyne
 * @param {String} client_id - client_id
 * @return {Array} reserved
 */
function setReserved(client_id = "AAAA") {
	$.log(`☑️ Set Reserved`, `client_id: ${client_id}`, "");
	//let base64 = Base64.parse(client_id).toString();
	let base64 = atob(client_id.toString(16)).toString();
	let reserved = stringToDec(base64);
	$.log(`✅ Set Reserved`, `reserved: ${reserved}`, "");
	return reserved;
	// 字符串转十进制
	function stringToDec(string) {
		return string.split('').map(char => char.charCodeAt().toString(10));
	}}
/**
 * Set Message
 * @author VirgilClyne
 * @param {String} result - result
 * @param {String} WireGuard - WireGuard
 * @return {Promise<*>}
 */
async function setMessage(result, WireGuard) {
	$.log(`☑️ Set Message`, "");
	const verify = `当前客户端公钥为:\n${result.key}\n用户设置公钥为:\n${WireGuard?.Settings?.PublicKey ?? "未设置，请到BoxJs面板中进行设置"}\n如两者一致，下列配置有效`;
	let body = `有效性验证:\n${verify}\n\n\n⚠️注意留存本文件\n\n\n`;
	switch ($.platform()) {
		case "Surge":
			const surge = `[Proxy]\nWARP = wireguard, section-name=Cloudflare, test-url=http://cp.cloudflare.com/generate_204\n\n[WireGuard Cloudflare]\nprivate-key = ${WireGuard?.Settings?.PrivateKey}\nself-ip = ${result?.config?.interface?.addresses?.v4}\nself-ip-v6 = ${result?.config?.interface?.addresses?.v6}\ndns-server = 1.1.1.1, 2606:4700:4700::1111\nmtu = 1280\npeer = (public-key = bmXOC+F1FxEMF9dyiK2H5/1SUtzH0JuVo51h2wPfgyo=, allowed-ips = "0.0.0.0/0, ::/0", endpoint = engage.nanocat.cloud:2408, keepalive = 45, client-id = ${result?.config?.reserved?.[0]}/${result?.config?.reserved?.[1]}/${result?.config?.reserved?.[2]})`;
			body += `Surge用配置:\n${surge}`;
			break;
		case "Loon":
			const loon = `[Proxy]\nWARP = wireguard, interface-ip=${result?.config?.interface?.addresses?.v4}, interface-ipv6=${result?.config?.interface?.addresses?.v6}, private-key="${WireGuard?.Settings?.PrivateKey}", mtu=1280, dns=1.1.1.1, dnsv6=2606:4700:4700::1111, keepalive=45, peers=[{public-key="bmXOC+F1FxEMF9dyiK2H5/1SUtzH0JuVo51h2wPfgyo=", allowed-ips="0.0.0.0/0, ::/0", endpoint=engage.nanocat.cloud:2408, reserved=[${result?.config?.reserved}]}]`;
			body += `Loon用配置:\n${loon}`;
			break;
		case "Shadowrocket":
			const shadowrocket = `[Proxy]\nWARP = wireguard, section-name=Cloudflare, test-url=http://cp.cloudflare.com/generate_204\n\n[WireGuard Cloudflare]\nprivate-key = ${WireGuard?.Settings?.PrivateKey}\nself-ip = ${result?.config?.interface?.addresses?.v4}\nself-ip-v6 = ${result?.config?.interface?.addresses?.v6}\ndns-server = 1.1.1.1, 2606:4700:4700::1111\nmtu = 1280\npeer = (public-key = bmXOC+F1FxEMF9dyiK2H5/1SUtzH0JuVo51h2wPfgyo=, allowed-ips = "0.0.0.0/0, ::/0", endpoint = engage.nanocat.cloud:2408, keepalive = 45, client-id = ${result?.config?.reserved?.[0]}/${result?.config?.reserved?.[1]}/${result?.config?.reserved?.[2]})`;
			const urlScheme = `wg://engage.nanocat.cloud:2408?publicKey=bmXOC+F1FxEMF9dyiK2H5/1SUtzH0JuVo51h2wPfgyo=&privateKey=${WireGuard?.Settings?.PrivateKey}&ip=${result?.config?.interface?.addresses?.v4}&dns=1.1.1.1&mtu=1280&keepalive=45&udp=1&reserved=${result?.config?.reserved?.[0]}/${result?.config?.reserved?.[1]}/${result?.config?.reserved?.[2]}#☁️%20Cloudflare%20for%20${result?.account?.account_type}`;
			body += `Shadowrocket用配置:\n${shadowrocket}\n\n\nShadowrocket点击一键添加:\nshadowrocket://add/${urlScheme}`;
			break;
		case "Stash":
			const stash = `name: Cloudflare\ntype: wireguard\nserver: engage.nanocat.cloud # domain is supported\nport: 2408\nip: ${result?.config?.interface?.addresses?.v4}\nipv6: ${result?.config?.interface?.addresses?.v6} # optional\nprivate-key: ${WireGuard?.Settings?.PrivateKey}\npublic-key: bmXOC+F1FxEMF9dyiK2H5/1SUtzH0JuVo51h2wPfgyo= # peer public key\n# preshared-key: # optional\ndns: [1.1.1.1, 2606:4700:4700::1111] # optional\nmtu: 1280 # optional\nreserved: [${result?.config?.reserved}] # optional\nkeepalive: 45 # optional\n# underlying-proxy: # optional\n#   type: trojan\n#   server: your-underlying-proxy\n#   port: 443\n#   password: your-password`;
			body += `Stash用配置:\n${stash}`;
			break;
		case "Node.js":
			//body += `Surge用配置:\n${surge}\n\n\nStash用配置:\n${stash}\n\n\nLoon用配置:\n${loon}\n\n\nShadowrocket用配置:\n${shadowrocket}\n\n\n点击一键添加:\nshadowrocket://add/${urlScheme}`;
			break;
		case "Quantumult X":
			body += `Quantumult X不支持 Wireguard 协议，仅显示提取后完整配置`;
			break;
	}	const config = JSON.stringify(result);
	body += `\n\n\n完整配置内容:\n${config}`;

	const subject = encodeURIComponent(`☁️ Cloudflare for ${result?.account?.account_type}配置文件`);
	const message = `mailto:engage@nanocat.me?subject=${subject}&body=${encodeURIComponent(body)}`;

	$.log(`✅ Set Message`, `message: ${message}`, "");
	return message;
}
/**
 * Set Configs
 * @author VirgilClyne
 * @param {String} name - Persistent Store Key
 * @param {String} platform - Platform Name
 * @param {Object} headers - Configs
 * @return {Promise<*>}
 */
async function setConfigs(name, platform, Configs) {
	$.log(`☑️ Set Configs`, "");
	// 写入Caches
	$Storage.setItem(`@${name}.${platform}.Configs.interface.addresses.v4`, Configs?.interface?.addresses?.v4);
	$Storage.setItem(`@${name}.${platform}.Configs.interface.addresses.v6`, Configs?.interface?.addresses?.v6);
	$Storage.setItem(`@${name}.${platform}.Configs.Reserved`, Configs?.reserved);
	$Storage.setItem(`@${name}.${platform}.Configs.peers[0].public_key`, Configs?.peers?.[0]?.public_key);
	$Storage.setItem(`@${name}.${platform}.Configs.peers[0].endpoint.host`, Configs?.peers?.[0]?.endpoint?.host);
	$Storage.setItem(`@${name}.${platform}.Configs.peers[0].endpoint.v4`, Configs?.peers?.[0]?.endpoint?.v4);
	$Storage.setItem(`@${name}.${platform}.Configs.peers[0].endpoint.v6`, Configs?.peers?.[0]?.endpoint?.v6);
	return $.log(`✅ Set Configs`, "");
}
