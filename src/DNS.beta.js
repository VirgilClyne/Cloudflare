/* refer:https://github.com/phil-r/node-cloudflare-ddns */
import _ from './ENV/Lodash.mjs'
import $Storage from './ENV/$Storage.mjs'
import ENV from "./ENV/ENV.mjs";
import Cloudflares from "./function/Cloudflare.mjs";

import Database from "./database/index.mjs";
import setENV from "./function/setENV.mjs";

const $ = new ENV("☁ Cloudflare: 🇩 DNS v2.5.0(2).beta");
const Cloudflare = new Cloudflares($);

/***************** Processing *****************/
(async () => {
	const { Settings, Caches, Configs } = setENV($, "Cloudflare", "DNS", Database);
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
	.finally(() => $.done())

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
};

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
};

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
};

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
	};
	$.log(`🚧 get External IP`, `request: ${JSON.stringify(request)}`);
	return await $.fetch(request).then(response => {
		let body = JSON.parse(response.body)
		$.log(`🚧 get External IP`, `body: ${JSON.stringify(body)}`);
		switch (body?.success ?? body?.result) {
			case true:
				return body.IP ?? body.ip;
			case false:
				if (Array.isArray(body.errors)) body.errors.forEach(error => { $.msg($.name, `code: ${error.code}`, `message: ${error.message}`); })
				if (Array.isArray(body.messages)) $.msg($.name, `code: ${body.code}`, `message: ${body.message}`);
				break;
			default:
				return body?.result?.[0] ?? body?.result;
		};
	}, error => $.logErr(`❗️ get External IP`, ` error = ${error || e}`, ""));
};
