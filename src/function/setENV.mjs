/**
 * Set Environment Variables
 * @author VirgilClyne
 * @param {String} name - Persistent Store Key
 * @param {Array} platforms - Platform Names
 * @param {Object} database - Default DataBase
 * @return {Object} { Settings, Caches, Configs }
 */
export default function setENV($, name, platforms, database) {
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
			Settings.Verify.Content = Array.from(Settings.Verify?.Content.split("\n"))
			//$.log(JSON.stringify(Settings.Verify.Content))
			Configs.Request.headers["x-auth-key"] = Settings.Verify?.Content[0];
			Configs.Request.headers["x-auth-email"] = Settings.Verify?.Content[1];
			break;
		default:
			$.log("无可用授权方式", `Mode=${Settings.Verify?.Mode}`, `Content=${Settings.Verify?.Content}`);
			break;
		case undefined:
			break;
	};
	if (Settings.zone?.dns_records) {
		Settings.zone.dns_records = Array.from(Settings.zone.dns_records.split("\n"));
		//$.log(JSON.stringify(Settings.zone.dns_records))
		Settings.zone.dns_records.forEach((item, i) => {
			Settings.zone.dns_records[i] = Object.fromEntries(item.split("&").map((item) => item.split("=")));
			Settings.zone.dns_records[i].proxied = JSON.parse(Settings.zone.dns_records[i].proxied);
		})
	};
	$.log(`✅ Set Environment Variables`, `Settings: ${typeof Settings}`, `Settings内容: ${JSON.stringify(Settings)}`, "");
	/***************** Caches *****************/
	//$.log(`✅ Set Environment Variables`, `Caches: ${typeof Caches}`, `Caches内容: ${JSON.stringify(Caches)}`, "");
	/***************** Configs *****************/
	return { Settings, Caches, Configs };
};
