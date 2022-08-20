# ☁️ Cloudflare
  * Cloudflare相关插件/模块
  * **Powered by [Chavy](https://github.com/chavyleung)‘s [Env.js](https://github.com/chavyleung/scripts/blob/master/Env.js) and [BoxJs](https://chavyleung.gitbook.io/boxjs/)**
  * 有问题请至[Issue页面](https://github.com/VirgilClyne/Cloudflare/issues)反馈
  * 如需及时了解更新说明，请订阅Telegram频道:[🍟 整点薯条](https://t.me/GetSomeFriesChannel)
  * Telegram讨论组:[🍟 整点薯条 - 群组](https://t.me/GetSomeFries)

---

- [☁️ Cloudflare](#️-cloudflare)
- [☁️ Cloudflare DNS](#️-cloudflare-dns)
  - [简介](#简介)
  - [功能列表](#功能列表)
  - [todo](#todo)
  - [使用方式](#使用方式)
    - [配合`BoxJs`及订阅使用](#配合boxjs及订阅使用)
    - [配合Surge模块的`argument`字段使用:](#配合surge模块的argument字段使用)
  - [图片说明](#图片说明)
  - [安装链接](#安装链接)
    - [正式版](#正式版)
    - [🧪测试版](#测试版)
- [☁️ Cloudflare WARP](#️-cloudflare-warp)
  - [简介](#简介-1)
  - [功能列表](#功能列表-1)
  - [todo](#todo-1)
  - [使用方式](#使用方式-1)
    - [配合`BoxJs`及订阅使用](#配合boxjs及订阅使用-1)
      - [注册新账户(用自定义密钥对)并生成WireGuard配置文件](#注册新账户用自定义密钥对并生成wireguard配置文件)
      - [重绑定许可证(许可证 & 注册ID)](#重绑定许可证许可证--注册id)
      - [更换密钥对(用自定义密钥对)(注册ID & 令牌)](#更换密钥对用自定义密钥对注册id--令牌)
  - [Surge配置文件示例](#surge配置文件示例)
  - [可用IP](#可用ip)
    - [Personal & WARP](#personal--warp)
    - [Teams & WARP+](#teams--warp)
  - [安装链接](#安装链接-1)
    - [正式版](#正式版-1)
    - [🧪测试版](#测试版-1)
- [鸣谢](#鸣谢)

---

# ☁️ Cloudflare DNS
## 简介
  * Cloudflare DNS记录管理及自动更新DDNS

  * 注:
    * 本插件使用[my-ip.io](https://www.my-ip.io/api)的api进行外部IP探测，请注意相关域名`api4.my-ip.io`和`api6.my-ip.io`的分流，以免获取到的是节点出口IP

## 功能列表
  * 自定义更新特定类型和内容记录
  * 自动更新未指定IP的A记录和AAAA记录
  * 通知(有，但不是完全有，有来自Cloudflare的错误和信息通知)
  * BoxJs集成
  * 持久化储存(有，但不是完全有，没有做反写功能)

## todo
  * 并行处理优化(阶段性完工，除非有更好的方法)
  * web面板(暂不开工)

## 使用方式
### 配合`BoxJs`及订阅使用
  * 安装`BoxJs`插件:
    * 安装方法及下载链接详见: [🧰BoxJs](../../wiki/🧰BoxJs)
  * 在`应用`-`整点薯条`-`Cloudflare`中填写您的Cloudflare DNS信息
    * 验证方式: 
      * API 令牌: 在[我的个人资料的'API 令牌'页面](https://dash.cloudflare.com/profile/api-tokens "API 令牌 | Cloudflare")的`API 令牌`生成，注意生成的令牌要有需管理区域的`DNS编辑`权限(推荐使用预设的`编辑区域 DNS`模版)
      * API 密钥: 在[我的个人资料的'API 令牌'页面](https://dash.cloudflare.com/profile/api-tokens "API 令牌 | Cloudflare")的`API 密钥`的`Global API Key`获取，注意此密钥默认拥有全部权限，不建议使用此方式
    * 验证内容: 即`API令牌`内容或`API 密钥`内容，注意`API 密钥`需分两行填写，第一行密钥，第二行邮箱
    * 区域ID: 在`区域`页面右下角的`API`小节的`区域 ID`，单击复制
    * 区域名称: 即域名
    * DNS记录: 格式范例如下，一行一个记录，A记录和AAAA记录如果不带内容则自动获取外部IP，如果带内容则以内容为准
      ```
      id=记录ID&type=类型&name=名称&content=内容&ttl=TTL&priority=优先级&proxied=是否代理
      id=12345ABCDE&type=MX&name=mail&content=127.0.0.1&ttl=1&priority=10&proxied=true
      type=A&name=www&proxied=false
      type=AAAA&name=ipv6&proxied=false
      ```
### 配合Surge模块的`argument`字段使用:
  * 使用[@baranwang](https://github.com/baranwang)的[Surge模块Argument代理](https://sgmodule-argument-proxy.vercel.app/)直接生成带配置的专属模块[使用说明](https://github.com/baranwang/sgmodule-argument-proxy#readme)
  * 暂不支持多记录，推荐使用BoxJs设置
  * 格式如下:
      ```
      argument=Token=令牌&zone_id=区域ID&zone_name=区域名称&dns_records_id=记录ID&dns_records_name=记录名称&dns_records_type=记录类型&dns_records_ttl=TTL&dns_records_priority=记录优先级&dns_records_proxied=是否代理
      ```
      例如:
      ```
      argument=Token=1234567ABCDEFG&zone_id=1234567ABCDEFG&zone_name=exapmle.com&dns_records_id=1234567ABCDEFG&dns_records_name=www&dns_records_proxied=false
      ```
      或
      ```
      argument=Token=1234567ABCDEFG&zone_id=1234567ABCDEFG&dns_records_name=www&dns_records_type=A&dns_records_proxied=false
      ```

## 图片说明
|  获取令牌  | 获取区域 ID | DNS记录添加 |
| :---- | :---- | :---- |
| 验证内容  | 区域ID | DNS记录  |
| 即API令牌内容或API 密钥内容 <br> 注意API 密钥需分两行填写，第一行密钥，第二行邮箱，如**示例2**  | 在区域页面右下角的API小节的区域 ID，单击复制 | **格式：** id=记录ID&type=类型&name=名称&content=内容&ttl=TTL&priority=优先级&proxied=是否代理 <br> **解读：** type为记录类型，name为解析子域名名称，proxied为是否开启代理（小云朵） <br> 如果你想要解析的域名为test.luca.xyz，解析的ip为1.2.3.4，那么name就是test，content就是1.2.3.4 <br> 如果你不知道一些参数的信息，可以只填写记录类型和记录名称以及指定的内容，如**示例2** |
|**API 令牌示例(单行)：** <br> 8M7wS6hCpXVc-DoRnPPY_UCWPgy8aea4Wy6kCe5T <br> **API 密钥示例(两行)：** <br> 1234567893feefc5f0q5000bfo0c38d90bbeb <br> example@example.com <br> **用户服务密钥示例(单行)：** <br> v1.0-e24fd090c02efcfecb4de8f4ff246fd5c75b48946fdf0ce26c59f91d0d90797b-cfa33fe60e8e34073c149323454383fc9005d25c9b4c502c2f063457ef65322eade065975001a0b4b4c591c5e1bd36a6e8f7e2d4fa8a9ec01c64c041e99530c2-07b9efe0acd78c82c8d9c690aacb8656d81c369246d7f996a205fe3c18e9254a|**示例：**  <br> 372e67954025e0ba6aaa6d586b9e0b59|**示例1：** <br> id=12345ABCDE&type=MX&name=mail&content=127.0.0.1&ttl=1&priority=10&proxied=true <br> **示例2：** <br> type=A&name=test&content=1.2.3.4&proxied=false|
|![获取令牌](./img/Cloudflare%20-%201.How.to.get.API.token.PNG?raw=true "Cloudflare - 1.How to get API token")|![获取区域 ID](./img/Cloudflare%20-%202.How.to.get.zone.id.JPG?raw=true "Cloudflare - 2.How to get zone id")|![DNS记录添加](./img/Cloudflare%20-%203.How.to.fill.in.the.form.JPG?raw=true "Cloudflare - 3.How to fill in the form")|

## 安装链接
### 正式版
  * BoxJs:
    * [Cloudflare.boxjs.json](./box/Cloudflare.boxjs.json?raw=true "☁️ Cloudflare")
    * 安装方法及下载链接详见: [🧰BoxJs](../../wiki/🧰BoxJs)
  * Loon:
    * [Cloudflare.DNS.plugin](./plugins/Cloudflare.DNS.plugin?raw=true "☁️ Cloudflare DNS")
  * Quantumult X:
    * 下载脚本[Cloudflare.DNS.js](./js/Cloudflare.DNS.js?raw=true "☁️ Cloudflare DNS")并保存至`Quantumult X`的`Scripts`文件夹下
      * 修改配置文件，在`[task_local]`段添加如下内容：
      ```
      event-network https://github.com/VirgilClyne/Cloudflare/blob/main/js/Cloudflare.DNS.js?raw=true, tag=Cloudflare DNS, img-url=https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Cloudflare.png, enabled=true
      */10 * * * * https://github.com/VirgilClyne/Cloudflare/blob/main/js/Cloudflare.DNS.js?raw=true, tag=Cloudflare DNS, img-url=https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Cloudflare.png, enabled=true
      ```
  * Surge:
    * [Cloudflare.DNS.sgmodule](./sgmodule/Cloudflare.DNS.sgmodule?raw=true "☁️ Cloudflare DNS")
### 🧪测试版
  * BoxJs:
    * [Cloudflare.beta.boxjs.json](./box/Cloudflare.beta.boxjs.json?raw=true "☁️ Cloudflare β")
  * Surge:
    * [Cloudflare.DNS.beta.sgmodule](./sgmodule/Cloudflare.DNS.beta.sgmodule?raw=true "☁️ Cloudflare DNS")

---

# ☁️ Cloudflare WARP
## 简介
  * Cloudflare WARP 注册管理及转换WireGuard配置

  * 注:
    * 自动邀请新用户刷WARP+流量”功能还没写

## 功能列表
  * BoxJs集成
  * 持久化储存(有，但不是完全有，没有做反写功能)
  * 通知(有，但不是完全有，有来自Cloudflare的错误和信息通知)
  * 注册新账户
  * 注册新账户(用自定义密钥对)并生成WireGuard配置文件
  * 注册新设备(注册ID)
  * 重绑定许可证(许可证 & 注册ID)
  * 更换密钥对(用自定义密钥对)(注册ID & 令牌)
  * 查询账户信息(创建日期/剩余流量/邀请人数等)
  * 查询设备配置(设备名称/设备类型/创建日期/活动状态等)
  * 自定义客户端设备类型

## todo
  * 自动邀请新用户刷WARP+流量(鸽了，team版无限流量，你应该也整一个)

## 使用方式
### 配合`BoxJs`及订阅使用
  * 安装`BoxJs`插件:
    * 安装方法及下载链接详见: [🧰BoxJs](../../wiki/🧰BoxJs)
  * 在`应用`-`整点薯条`-`Cloudflare`中填写您的Cloudflare WARP信息
      1. BoxJs要先填写Loon\quanX\Surge的`HTTP-API`地址,不然看不到日志输出
      * BoxJs的`HTTP-API`填写位置位于左上角`菜单键`内，或底端标签栏`应用`-`内置应用`-`偏好设置`-`应用设置`内
      * iOS版Surge的`HTTP-API`设置项位于`首页`-`更多设置`-`HTTP API & Web控制器`
      1. 打开Cloudflare WARP模块
#### 注册新账户(用自定义密钥对)并生成WireGuard配置文件
  * 操作方法(使用BoxJs)：
      1. 运行方式选择`注册新账户(用自定义密钥对)并生成WireGuard配置文件`
      2. 在WireGuard客户端中`新建隧道`-`生成密钥对`
      3. 将WireGuard生成的私钥和公钥填写到BoxJs中的`WireGuard: 私钥`和`WireGuard: 公钥`
      4. 页面最下方点`保存`
      5. 点击Cloudflare WARP页面右上角的`圆箭头按钮`运行
      6. 记录下日志中提供的信息，导入或填入WireGuard
#### 重绑定许可证(许可证 & 注册ID)
  * 使用此功能可以将任意`注册ID(设备ID/客户端ID/配置文件ID)`绑定至你指定的`许可证(账户)/License(Account)`
  * 操作方法(使用BoxJs)：
      1. 运行方式选择`重绑定许可证(许可证 & 注册ID)`
      2. 填写你要换绑的`WARP: 许可证(账户)/License(Account)`(可通过模块读取，或查看iOS`1.1.1.1`APP选项-账户-按键)
      3. 填写你要绑定到此许可证的`WARP: 注册ID(设备ID/客户端ID/配置文件ID)`(可通过模块读取，或查看iOS`1.1.1.1`APP选项-高级-诊断-客户端配置-ID)
      4. 填写此注册ID对应的token到`WARP: 验证内容/Verify Content`(可通过模块读取)
      5. 点击页面下方的`保存`
      6. 点击Cloudflare WARP页面右上角的`圆箭头按钮`运行
      7. 记录下日志中提供的信息
#### 更换密钥对(用自定义密钥对)(注册ID & 令牌)
  * 使用此功能可以将任意`注册ID(设备ID/客户端ID/配置文件ID)`的密钥更换为你指定的`密钥对`
  * 操作方法1(使用BoxJs)：
      1. 运行方式选择`更换密钥对(用自定义密钥对)(注册ID & 令牌)`
      2. 在WireGuard客户端中`新建隧道`-`生成密钥对`
      3. 将`WireGuard生成的私钥和公钥`或`你要换绑的私钥和公钥`填写到`WireGuard: 私钥`和`WireGuard: 公钥`
      4. 填写你要绑定到此密钥对的`WARP: 注册ID(设备ID/客户端ID/配置文件ID)`(可通过模块读取，或查看iOS`1.1.1.1`APP选项-高级-诊断-客户端配置-ID)
      5. 填写此注册ID对应的token到`WARP: 验证内容/Verify Content`(可通过模块读取)
      6. 点击页面下方的`保存`
      7. 点击Cloudflare WARP页面右上角的`圆箭头按钮`运行
      8. 查看执行结果(`通知`或`日志`)
      * 注：如果此`注册ID`为某个`1.1.1.1`APP的`注册ID`，则启用此`1.1.1.1`APP会自动将您`自定义的密钥对`换回`APP生成的密钥对`
      * 注2：如想正常打开`1.1.1.1`APP并使用APP的其他功能如账户信息，流量查看，邀请等功能，请使用Surge模块锁定`密钥对`始终为`自定义的密钥对`，但APP因密钥对不符，自身的VPN功能将无法使用。
  * 操作方法2(使用BoxJs+Surge模块)：
      1. 在WireGuard客户端中`新建隧道`-`生成密钥对`
      2. 将`WireGuard生成的私钥和公钥`或`你要换绑的私钥和公钥`填写到`WireGuard: 私钥`和`WireGuard: 公钥`
      3. 填写你要绑定到此密钥对的`WARP: 注册ID(设备ID/客户端ID/配置文件ID)`(可通过模块读取，或查看iOS`1.1.1.1`APP选项-高级-诊断-客户端配置-ID)
      4. 点击页面下方的`保存`
      5. 打开`1.1.1.1`APP
      6. 执行`重置加密密钥`操作(iOS客户端位于:选项-`高级`-`连接选项`-`重置加密密钥`)
      7. 查看执行结果(`通知`或`日志`) 
      * 注：保持模块开启情况下，可正常打开`1.1.1.1`APP并使用APP的其他功能如账户信息，流量查看，邀请等功能，单`1.1.1.1`APP因密钥对不符，自身的VPN功能将无法使用。


## Surge配置文件示例
  * 客户端私钥：private-key，由Wireguard客户端生成
  * 节点公钥：public-key，Cloudflare WARP的公钥始终为`bmXOC+F1FxEMF9dyiK2H5/1SUtzH0JuVo51h2wPfgyo=`
  * 可用IP：endpoint，目前Surge仅支持单节点(peer)，所以需要选择一个可用IP，详见[可用IP](#可用IP)
```
[Proxy]
WARP = wireguard, section-name = Cloudflare

[Group]
你的策略组 = 节点1, 节点2, 节点3, WARP

[WireGuard Cloudflare]
private-key = 客户端私钥
self-ip = 172.16.0.254
dns-server = 1.1.1.1
mtu = 1280
peer = (public-key = bmXOC+F1FxEMF9dyiK2H5/1SUtzH0JuVo51h2wPfgyo=, allowed-ips = 0.0.0.0/0, endpoint = 可用IP:2408)
```

## 可用IP
  * host主机名均为: `engage.cloudflareclient.com:2408`

### Personal & WARP
| 162.159.192.0 | [2606:4700:d0::a29f:c000] |
| :---: | :---: |
| 162.159.192.1:2408 | [2606:4700:d0::a29f:c001]:2408
| 162.159.192.2:2408 | [2606:4700:d0::a29f:c002]:2408
| 162.159.192.3:2408 | [2606:4700:d0::a29f:c003]:2408
| 162.159.192.4:2408 | [2606:4700:d0::a29f:c004]:2408
| 162.159.192.5:2408 | [2606:4700:d0::a29f:c005]:2408
| 162.159.192.6:2408 | [2606:4700:d0::a29f:c006]:2408
| 162.159.192.7:2408 | [2606:4700:d0::a29f:c007]:2408
| 162.159.192.8:2408 | [2606:4700:d0::a29f:c008]:2408
| 162.159.192.9:2408 | [2606:4700:d0::a29f:c009]:2408

### Teams & WARP+
| 162.159.193.0 | [2606:4700:d0::a29f:c100] |
| :---: | :---: |
| 162.159.193.1:2408 | [2606:4700:d0::a29f:c101]:2408
| 162.159.193.2:2408 | [2606:4700:d0::a29f:c102]:2408
| 162.159.193.3:2408 | [2606:4700:d0::a29f:c103]:2408
| 162.159.193.4:2408 | [2606:4700:d0::a29f:c104]:2408
| 162.159.193.5:2408 | [2606:4700:d0::a29f:c105]:2408
| 162.159.193.6:2408 | [2606:4700:d0::a29f:c106]:2408
| 162.159.193.7:2408 | [2606:4700:d0::a29f:c107]:2408
| 162.159.193.8:2408 | [2606:4700:d0::a29f:c108]:2408
| 162.159.193.9:2408 | [2606:4700:d0::a29f:c109]:2408

## 安装链接
### 正式版
  * BoxJs:
    * [Cloudflare.boxjs.json](./box/Cloudflare.boxjs.json?raw=true "☁️ Cloudflare")
    * 安装方法及下载链接详见: [🧰BoxJs](../../wiki/🧰BoxJs)
  * Surge:
    * [Cloudflare.1.1.1.1.sgmodule](./sgmodule/Cloudflare.1.1.1.1.sgmodule?raw=true "☁️ 1.1.1.1 by Cloudflare APP与WARP客户端配置管理")
    * 此模块功能:
      * 可查询1.1.1.1 APP的配置信息,其他增删改功能请用上方BoxJs订阅或APP客户端
        * 安装模块后，重新打开一次1.1.1.1的APP，即可在通知中看到配置信息，在Surge的日志中也会输出完整配置文件内容
      * 配合BoxJs或Surge Argument参数可重写并锁定密钥为`自定义密钥`
        * 安装模块后，打开`1.1.1.1`APP，执行`重置加密密钥`操作(iOS客户端位于:选项-`高级`-`连接选项`-`重置加密密钥`)，即可在通知中看到密钥重置信息

### 🧪测试版
  * BoxJs:
    * [Cloudflare.beta.boxjs.json](./box/Cloudflare.beta.boxjs.json?raw=true "☁️ Cloudflare β")
  * Surge:
    * [Cloudflare.1.1.1.1.beta.sgmodule](./sgmodule/Cloudflare.1.1.1.1.beta.sgmodule?raw=true "☁️ 1.1.1.1_by_Cloudflare APP与WARP客户端配置管理")
    * 此模块功能:
      * 可查询1.1.1.1 APP的配置信息,其他增删改功能请用上方BoxJs订阅或APP客户端
        * 安装模块后，重新打开一次1.1.1.1的APP，即可在通知中看到配置信息，在Surge的日志中也会输出完整配置文件内容
      * 配合BoxJs或Surge Argument参数可重写并锁定密钥为`自定义密钥`
        * 安装模块后，打开`1.1.1.1`APP，执行`重置加密密钥`操作(iOS客户端位于:选项-`高级`-`连接选项`-`重置加密密钥`)，即可在通知中看到密钥重置信息

---

# 鸣谢
  * 排名不分先后  
  * [@chavyleung](https://github.com/chavyleung)
  * [@NobyDa](https://github.com/NobyDa)
  * [@zZPiglet](https://github.com/zZPiglet)
  * [@yichahucha](https://github.com/yichahucha)
  * [@Peng-YM](https://github.com/Peng-YM)
  * [@app2smile](https://github.com/app2smile)
  * [@Loon0x00](https://github.com/Loon0x00)
  * [@Tartarus2014](https://github.com/Tartarus2014)
  * [@Hackl0us](https://github.com/Hackl0us)
