import _ from './ENV/Lodash.mjs'
import $Storage from './ENV/$Storage.mjs'
import ENV from "./ENV/ENV.mjs";
import URI from "./URI/URI.mjs";
import getStorage from './ENV/getStorage.mjs'

import Base64 from '../node_modules/crypto-js/enc-base64.js';

import Database from "./database/index.mjs";
import setENV from "./function/setENV.mjs";

const $ = new ENV("☁ Cloudflare: 1️⃣ 1.1.1.1 v3.0.1(4).response");

/***************** Processing *****************/
// 解构URL
const URL = URI.parse($request.url);
$.log(`⚠ URL: ${JSON.stringify(URL)}`, "");
// 获取连接参数
const METHOD = $request.method, HOST = URL.host, PATH = URL.path, PATHs = URL.paths;
$.log(`⚠ METHOD: ${METHOD}`, "");
// 解析格式
const FORMAT = ($response.headers?.["Content-Type"] ?? $response.headers?.["content-type"])?.split(";")?.[0];
$.log(`⚠ FORMAT: ${FORMAT}`, "");
(async () => {
	const { Settings, Caches, Configs } = setENV("Cloudflare", "1dot1dot1dot1", Database);
	$.log(`⚠ Settings.Switch: ${Settings?.Switch}`, "");
	switch (Settings.Switch) {
		case true:
		default:
			const WireGuard = getStorage("WireGuard", "VPN", Database);
			const TOKEN = ($request?.headers?.Authorization ?? $request?.headers?.authorization)?.match(/Bearer (\S*)/)?.[1];
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
				case "text/html":
				default:
					break;
				case "application/x-mpegURL":
				case "application/x-mpegurl":
				case "application/vnd.apple.mpegurl":
				case "audio/mpegurl":
					break;
				case "text/xml":
				case "text/plist":
				case "application/xml":
				case "application/plist":
				case "application/x-plist":
					break;
				case "text/vtt":
				case "application/vtt":
					break;
				case "text/json":
				case "application/json":
					body = JSON.parse($response.body);
					if (Array.isArray(body.messages)) body.messages.forEach(element => $.msg($.name, `code: ${element.code}`, `message: ${element.message}`));
					switch (body.success) {
						case true:
							const result = body?.result?.[0] ?? body?.result; // body.result, body.meta
							if (result) {
								result.config.reserved = await setReserved(result?.config?.client_id);
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
								};
							}
						case false:
							if (Array.isArray(body.errors)) body.errors.forEach(error => { $.msg($.name, `code: ${error.code}`, `message: ${error.message}`); })
							break;
						case undefined:
							throw new Error($response);
					};
					//$response.body = JSON.stringify(body);
					break;
				case "application/protobuf":
				case "application/x-protobuf":
				case "application/vnd.google.protobuf":
				case "application/grpc":
				case "application/grpc+proto":
				case "application/octet-stream":
					break;
			};
			break;
		case false:
			break;
	};
})()
	.catch((e) => $.logErr(e))
	.finally(() => $.done($response))

/***************** Function *****************/
/**
 * Set Reserved
 * @author VirgilClyne
 * @param {String} client_id - client_id
 * @return {Promise<*>}
 */
async function setReserved(client_id = "AAAA") {
	$.log(`⚠ Set Reserved`, "");
	let base64 = Base64.parse(client_id).toString();
	let reserved = grouphex(base64, 2);
	$.log(`🎉 Set Reserved`, `reserved: ${reserved}`, "");
	return reserved;
	function grouphex(string, step) {
		let r = [];
		for (var i = 0, len = string.length; i < len / step; i++) r.push(parseInt("0x" + string.slice(step * i, step * (i + 1)), 16));
		return r;
	};
};

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
			break;
		case "Quantumult X":
			body += `Quantumult X不支持 Wireguard 协议，仅显示提取后完整配置`
			break;
	};
	const config = JSON.stringify(result);
	body += `\n\n\n完整配置内容:\n${config}`;

	const subject = encodeURIComponent(`☁️ Cloudflare for ${result?.account?.account_type}配置文件`);
	const message = `mailto:engage@nanocat.me?subject=${subject}&body=${encodeURIComponent(body)}`;

	$.log(`✅ Set Message`, `message: ${message}`, "");
	return message;
};

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
};
