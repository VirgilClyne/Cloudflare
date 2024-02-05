/***************** Cloudflare API v4 *****************/
export default class Cloudflare {
    constructor($, option) {
        this.name = "Cloudflare API v4";
        this.version = '1.1.0'
        this.option = option;
        this.baseURL = "https://api.cloudflare.com/client/v4"
        this.$ = $;
        console.log(`\n${this.name} v${this.version}\n`)
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
            const body = JSON.parse(response.body)
            if (Array.isArray(body.messages)) body.messages.forEach(message => {
                if (message.code !== 10000) this.$.msg(this.$.name, `code: ${message.code}`, `message: ${message.message}`);
            })
            switch (body.success) {
                case true:
                    return body?.result?.[0] ?? body?.result; // body.result, body.meta
                case false:
                    if (Array.isArray(body.errors)) body.errors.forEach(error => this$.msg(this.$.name, `code: ${error.code}`, `message: ${error.message}`))
                    break;
                case undefined:
                    return response;
            };
        }, error => this.$.logErr(`❗️ Cloudflare 执行失败`, ` error = ${error || e}`, ""));
    };
}
