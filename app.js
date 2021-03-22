var platform = null;
"undefined" != typeof wx && (platform = "wx"), "undefined" != typeof my && (platform = "my");
var modules = [{
        name: "helper",
        file: "./utils/helper.js"
    }, {
        name: "const",
        file: "./core/const.js"
    }, {
        name: "getConfig",
        file: "./core/config.js"
    }, {
        name: "page",
        file: "./core/page.js"
    }, {
        name: "request",
        file: "./core/request.js"
    }, {
        name: "core",
        file: "./core/core.js"
    }, {
        name: "api",
        file: "./core/api.js"
    }, {
        name: "getUser",
        file: "./core/getUser.js"
    }, {
        name: "setUser",
        file: "./core/setUser.js"
    }, {
        name: "login",
        file: "./core/login.js"
    }, {
        name: "trigger",
        file: "./core/trigger.js"
    }, {
        name: "uploader",
        file: "./utils/uploader.js"
    }, {
        name: "orderPay",
        file: "./core/order-pay.js"
    }],
    args = {
        _version: "2.8.9",
        platform: platform,
        query: null,
        onLaunch: function () {
            this.getStoreData();
        },
        onShow: function (data) {
            data.scene && (this.onShowData = data), data && data.query && (this.query = data.query), this.getUser() && this.trigger.run(this.trigger.events.login);
        },
        is_login: !1,
        login_complete: !1,
        is_form_id_request: !0
    };
for (var i in modules) args[modules[i].name] = require(modules[i].file);
var _web_root = args.api.index.substr(0, args.api.index.indexOf("/index.php"));
args.webRoot = _web_root, args.getauth = function (info) {
    // s = that
    var that = this;
    if ("my" == that.platform) {
        if (info.success) {
            var e = {
                authSetting: {}
            };
            e.authSetting[info.author] = !0, info.success(e);
        }
    } else that.core.getSetting({
        success: function (e) {
            console.log(e), void 0 === e.authSetting[info.author] ? that.core.authorize({
                scope: info.author,
                success: function (e) {
                    info.success && (e.authSetting = {}, e.authSetting[info.author] = !0, info.success(e));
                }
            }) : 0 == e.authSetting[info.author] ? that.core.showModal({
                title: "是否打开设置页面重新授权",
                content: info.content,
                confirmText: "去设置",
                success: function (e) {
                    e.confirm ? that.core.openSetting({
                        success: function (e) {
                            info.success && info.success(e);
                        },
                        fail: function (e) {
                            info.fail && info.fail(e);
                        },
                        complete: function (e) {
                            info.complete && info.complete(e);
                        }
                    }) : info.cancel && that.getauth(info);
                }
            }) : info.success && info.success(e);
        }
    });
},
    args.getStoreData = function () {
        var that = this,
            api = this.api,
            core = this.core;
        that.request({
            data: {
                hideLogin: 1
            },
            url: api.default.store,
            success: function (res) {
                0 == res.code && (core.setStorageSync(that.const.STORE, res.data.store),
                    core.setStorageSync(that.const.STORE_NAME, res.data.store_name),
                    core.setStorageSync(that.const.SHOW_CUSTOMER_SERVICE, res.data.show_customer_service),
                    core.setStorageSync(that.const.CONTACT_TEL, res.data.contact_tel),
                    core.setStorageSync(that.const.SHARE_SETTING, res.data.share_setting),
                    that.permission_list = res.data.permission_list,
                    core.setStorageSync(that.const.WXAPP_IMG, res.data.wxapp_img),
                    core.setStorageSync(that.const.WX_BAR_TITLE, res.data.wx_bar_title),
                    core.setStorageSync(that.const.ALIPAY_MP_CONFIG, res.data.alipay_mp_config),
                    core.setStorageSync(that.const.STORE_CONFIG, res.data),
                    setTimeout(function (e) {
                        that.config = res.data, that.configReadyCall && that.configReadyCall(res.data);
                    }, 1e3));
            },
            complete: function () {
            }
        });
    };
App(args);