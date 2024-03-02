import _ from './ENV/Lodash.mjs'
import $Storage from './ENV/$Storage.mjs'
import ENV from "./ENV/ENV.mjs";
import URI from "./URI/URI.mjs";

import Database from "./database/index.mjs";
import setENV from "./function/setENV.mjs";

const $ = new ENV("☁ Cloudflare: 1️⃣ 1.1.1.1 v3.0.1(2).request.beta");

// 构造回复数据
let $response = undefined;

/***************** Processing *****************/
// 解构URL
const URL = URI.parse($request.url);
$.log(`⚠ URL: ${JSON.stringify(URL)}`, "");
// 获取连接参数
const METHOD = $request.method, HOST = URL.host, PATH = URL.path, PATHs = URL.paths;
$.log(`⚠ METHOD: ${METHOD}`, "");
// 解析格式
const FORMAT = ($request.headers?.["Content-Type"] ?? $request.headers?.["content-type"])?.split(";")?.[0];
$.log(`⚠ FORMAT: ${FORMAT}`, "");
(async () => {
	const { Settings, Caches, Configs } = setENV($, "Cloudflare", "1dot1dot1dot1", Database);
	$.log(`⚠ Settings.Switch: ${Settings?.Switch}`, "");
	switch (Settings.Switch) {
		case true:
		default:
			const WireGuard = $.getENV("WireGuard", "VPN", Database);
			/*
			const KIND = RegExp(`/reg/${Settings.Verify.RegistrationId}$`, "i").test($request.url) ? "RegistrationId"
				: /reg/i.test($request.url) ? "Registration"
					: undefined
			*/
			const KIND = `/${PATHs[1]}/${PATHs[2]}` === `/reg/${Settings.Verify.RegistrationId}` ? "RegistrationId"
				: `/${PATHs[1]}` === `/reg` ? "Registration"
					: undefined;
			$.log(`🚧 KIND: ${KIND}`, "");
			$Storage.setItem(`@Cloudflare.1dot1dot1dot1.Caches`, $request);
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
							};
							$request.body = JSON.stringify(body);
							break;
						case "application/protobuf":
						case "application/x-protobuf":
						case "application/vnd.google.protobuf":
						case "application/grpc":
						case "application/grpc+proto":
						case "application/octet-stream":
							break;
					};
					//break; // 不中断，继续处理URL
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
			};
			break;
		case false:
			break;
	};
})()
	.catch((e) => $.logErr(e))
	.finally(() => {
		switch ($response) {
			default: // 有构造回复数据，返回构造的回复数据
				//$.log(`🚧 ${$.name}, finally`, `echo $response: ${JSON.stringify($response, null, 2)}`, "");
				if ($response.headers?.["Content-Encoding"]) $response.headers["Content-Encoding"] = "identity";
				if ($response.headers?.["content-encoding"]) $response.headers["content-encoding"] = "identity";
				if ($.isQuanX()) {
					if (!$response.status) $response.status = "HTTP/1.1 200 OK";
					delete $response.headers?.["Content-Length"];
					delete $response.headers?.["content-length"];
					delete $response.headers?.["Transfer-Encoding"];
					$.done($response);
				} else $.done({ response: $response });
				break;
			case undefined: // 无构造回复数据，发送修改的请求数据
				//$.log(`🚧 ${$.name}, finally`, `$request: ${JSON.stringify($request, null, 2)}`, "");
				$.done($request);
				break;
		};
	})
