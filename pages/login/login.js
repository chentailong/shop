Page({
    data: {},
    onLoad: function(e) {
        getApp().page.onLoad(this, e);
    },
    getUserInfo: function(userInfo) {
        var that = this;
        "getUserInfo:ok" === userInfo.detail.errMsg && getApp().core.login({
            success: function(e) {
                var t = e.code;
                that.unionLogin({
                    code: t,
                    user_info: userInfo.detail.rawData,
                    encrypted_data: userInfo.detail.encryptedData,
                    iv: userInfo.detail.iv,
                    signature: userInfo.detail.signature
                });
            },
            fail: function(e) {}
        });
    },
    myLogin: function() {
        console.log("21")
        var that = this;
        "my" === getApp().platform && my.getAuthCode({
            scopes: "auth_user",
            success: function(e) {
                that.unionLogin({
                    code: e.authCode
                });
            }
        });
    },
    unionLogin: function(data) {
        getApp().core.showLoading({
            title: "正在登录",
            mask: !0
        }), getApp().request({
            url: getApp().api.passport.login,
            method: "POST",
            data: data,
            success: function(e) {
                if (0 === e.code) {
                    getApp().setUser(e.data), getApp().core.setStorageSync(getApp().const.ACCESS_TOKEN, e.data.access_token), 
                    getApp().trigger.run(getApp().trigger.events.login);
                    var t = getApp().core.getStorageSync(getApp().const.LOGIN_PRE_PAGE);
                    t && t.route ? getApp().core.redirectTo({
                        url: "/" + t.route + "?" + getApp().helper.objectToUrlParams(t.options)
                    }) : getApp().core.redirectTo({
                        url: "/pages/index/index"
                    });
                } else getApp().core.showModal({
                    title: "提示",
                    content: e.msg,
                    showCancel: !1
                });
            },
            complete: function() {
                getApp().core.hideLoading();
            }
        });
    }
});