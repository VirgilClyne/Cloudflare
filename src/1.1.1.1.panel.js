import _ from './ENV/Lodash.mjs'
import $Storage from './ENV/$Storage.mjs'
import ENV from "./ENV/ENV.mjs";
import Cloudflares from "./function/Cloudflare.mjs";

import Database from "./database/index.mjs";
import setENV from "./function/setENV.mjs";

const $ = new ENV("☁ Cloudflare: 1️⃣ 1.1.1.1 v2.1.0(2).panel");
const Cloudflare = new Cloudflares($);

/***************** Processing *****************/
(async () => {
	const { Settings, Caches, Configs } = setENV($, "Cloudflare", "Panel", Database);
	$.log(`⚠ Settings.Switch: ${Settings?.Switch}`, "");
	switch (Settings.Switch) {
		case true:
		default:
			const Language = (Settings?.Language == "auto") ? $environment?.language : Settings?.Language ?? "zh-Hans"
			// 构造请求信息
			let request = {};
			switch ($.platform()) {
				case "Loon":
					request.policy = $environment?.params?.node;
					break;
				case "Quantumult X":
					request.policy = $environment?.params;
					break;
				default:
					break;
			};
			// 获取WARP信息
			const [Trace4, Trace6] = await Promise.allSettled([Cloudflare.trace4(request), Cloudflare.trace6(request)])
			.then(results => results.map(result => {
				switch (result.status) {
					case "fulfilled":
						return formatTrace(result.value, Language);
					case "rejected":
						return { "ip": "获取失败", "loc": "获取失败", "colo": "获取失败", "warp": "获取失败" };
				};
			}));
			// 构造面板信息
			let Panel = {};
			const connectInfo = `${Configs.i18n[Language]?.IPv4 ?? "IPv4"}: ${Trace4?.ip ?? Configs.i18n[Language]?.Fail ?? "获取失败"}\n`
			+ `${Configs.i18n[Language]?.IPv6 ?? "IPv6"}: ${Trace6?.ip ?? Configs.i18n[Language]?.Fail ?? "获取失败"}\n`
			+ `${Configs.i18n[Language]?.COLO ?? "托管中心"}: ${Trace4?.loc ?? Trace6?.loc} | ${Trace4?.colo ?? Trace6?.colo | Configs.i18n[Language]?.Fail ?? "获取失败"}\n`
			+ `${Configs.i18n[Language]?.WARP_Level ?? "隐私保护"}: ${Trace4?.warp?.toUpperCase() ?? Trace6?.warp?.toUpperCase() ?? Configs.i18n[Language]?.Fail ?? "获取失败"}`;
			// 填充面板信息
			switch ($.platform()) {
				case "Shadowrocket":
					break;
				case "Loon":
				case "Quantumult X":
					Panel.title = Settings?.Title ?? "☁ 𝙒𝘼𝙍𝙋 𝙄𝙣𝙛𝙤"
					Panel.message = connectInfo;
					break;
				case "Surge":
				default:
					Panel.title = Settings?.Title ?? "☁ 𝙒𝘼𝙍𝙋 𝙄𝙣𝙛𝙤"
					Panel.icon = Settings?.Icon ?? "lock.icloud.fill";
					Panel["icon-color"] = Settings?.IconColor ?? "#f48220";
					Panel.content = connectInfo;
					break;
				case "Stash":
					Panel.title = Settings?.Title ?? "𝙒𝘼𝙍𝙋 𝙄𝙣𝙛𝙤"
					Panel.icon = Settings?.Icon ?? "https://raw.githubusercontent.com/shindgewongxj/WHATSINStash/main/icon/warp.png";
					Panel["icon-color"] = Settings?.IconColor ?? "#f48220";
					Panel.backgroundColor = Settings?.BackgroundColor ?? "#f6821f";
					Panel.content = connectInfo;
					break;
			};
			// 获取账户信息
			const Caches = $Storage.getItem("@Cloudflare.1dot1dot1dot1.Caches", {});
			if (Caches?.url && Caches?.headers) {
				// 构造请求信息
				let request = {
					"url": Caches?.url,
					"headers": Caches?.headers
				};
				// 获取账户信息
				const Account = await Cloudflare.fetch(request).then(result => formatAccount(result?.account ?? {}, Language));
				const accountInfo = `\n`
				+ `${Configs.i18n[Language]?.Account_Type ?? "账户类型"}: ${Account?.data?.type ?? Configs.i18n[Language]?.Fail ?? "获取失败"}\n`
				+ `${Configs.i18n[Language]?.Data_Info ?? "流量信息"}: ${Account?.data?.text ?? Configs.i18n[Language]?.Fail ?? "获取失败"}`;
				// 填充面板信息
				switch ($.platform()) {
					case "Shadowrocket":
						break;
					case "Loon":
					case "Quantumult X":
						Panel.message += accountInfo;
						break;
					case "Surge":
					default:
					case "Stash":
						Panel.content += accountInfo;
						break;
				};
			};
			// 输出面板信息
			$.done(Panel);
			break;
		case false:
			$.log(`⚠ ${$.name}, 功能关闭`, "");
			break;
	};
})()
	.catch((e) => $.logErr(e))
	.finally(() => $.done())

/***************** Function *****************/
function formatTrace(trace, language = $environment?.language ?? "zh-Hans", i18n = Database.Panel.Configs.i18n) {
	switch (trace?.warp) {
		case "off":
			trace.warp += ` | ${i18n[language]?.WARP_Level_Off ?? "关闭"}`;
			break;
		case "on":
			trace.warp += ` | ${i18n[language]?.WARP_Level_On ?? "开启"}`;
			break;
		case "plus":
			trace.warp += ` | ${i18n[language]?.WARP_Level_Plus ?? "增强"}`;
			break;
		case undefined:
			break;
		default:
			trace.warp += ` | ${i18n[language]?.Unknown ?? "未知"}`;
			break;
	};
	return trace;
};

function formatAccount(account, language = $environment?.language ?? "zh-Hans", i18n = Database.Panel.Configs.i18n) {
	switch (account.account_type) {
		case "unlimited":
			account.data = {
				"type": `${account?.account_type?.toUpperCase()} | ${i18n[language]?.Account_Type_unlimited ?? "无限版"}`,
				"limited": false,
			}
			break;
		case "limited":
			account.data = {
				"type": `${account?.account_type?.toUpperCase()} | ${i18n[language]?.Account_Type_limited ?? "有限版"}`,
				"limited": true,
				"used": account.premium_data - account.quota,
				"flow": account.quota,
				"total": account.premium_data
			}
			break;
		case "team":
			account.data = {
				"type": `${account?.account_type?.toUpperCase()} | ${i18n[language]?.Account_Type_team ?? "团队版"}`,
				"limited": false,
			}
			break;
		case "plus":
			account.data = {
				"type": `${account?.account_type?.toUpperCase()} | ${i18n[language]?.Account_Type_plus ?? "WARP+"}`,
				"limited": false,
			}
			break;
		case "free":
			account.data = {
				"type": `${account?.account_type?.toUpperCase()} | ${i18n[language]?.Account_Type_free ?? "免费版"}`,
				"limited": true,
				"used": account.premium_data - account.quota,
				"flow": account.quota,
				"total": account.premium_data
			}
			break;
		default:
			account.data = {
				"type": `${account?.account_type} | ${i18n[language]?.Unknown ?? "未知"}`,
				"limited": undefined
			}
			break;
	};

	switch (account.data.limited) {
		case true:
			// 拼接文本
			account.data.text = `${i18n[language]?.Data_Info_Used ?? "已用"} | ${i18n[language]?.Data_Info_Residual ?? "剩余"} | ${i18n[language]?.Data_Info_Total ?? "总计"}`
				+ `\n${bytesToSize(account?.data?.used)} | ${bytesToSize(account?.data?.flow)} | ${bytesToSize(account?.data?.total)}`;
			break;
		case false:
			account.data.text = `♾️ | ${i18n[language]?.Data_Info_Unlimited ?? "无限"}`
			break;
		default:
			account.data.text = `UNKNOWN | ${i18n[language]?.Unknown ?? "未知"}`
			break;
	}
	return account;
};

function bytesToSize(bytes = 0, Precision = 4) {
	if (bytes === 0) return '0 B';
	const k = 1024;
	const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
	const i = Math.floor(Math.log(bytes) / Math.log(k));
	return (bytes / Math.pow(k, i)).toPrecision(Precision) + ' ' + sizes[i];
};
