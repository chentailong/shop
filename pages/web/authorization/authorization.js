Page({
    data: {
        user: {},
        is_bind: "",
        app: {}
    },
    onLoad: function(options) {
        getApp().page.onLoad(this, options), this.checkBind();
        var user_info = getApp().core.getStorageSync(getApp().const.USER_INFO);
        this.setData({
            user: user_info
        });
    },
    checkBind: function() {
        var that = this;
        getApp().core.showLoading({
            title: "加载中"
        }), getApp().request({
            url: getApp().api.user.check_bind,
            success: function(res) {
                getApp().core.hideLoading(), 0 === res.code && that.setData({
                    is_bind: res.data.is_bind,
                    app: res.data.app
                });
            }
        });
    },
    getUserInfo: function(user) {
        console.log(user)
        getApp().core.showLoading({
            title: "加载中"
        });
        var that = this;
        getApp().core.login({
            success: function(res) {
                var code = res.code;
                getApp().request({
                    url: getApp().api.passport.login,
                    method: "POST",
                    data: {
                        code: code,
                        user_info: user.detail.rawData,
                        encrypted_data: user.detail.encryptedData,
                        iv: user.detail.iv,
                        signature: user.detail.signature
                    },
                    success: function(e) {
                        getApp().core.hideLoading(), 0 === e.code ? (getApp().core.showToast({
                            title: "登录成功,请稍等...",
                            icon: "none"
                        }), that.bind()) : getApp().core.showToast({
                            title: "服务器出错，请再次点击绑定",
                            icon: "none"
                        });
                    }
                });
            }
        });
    },
    bind: function() {
        getApp().request({
            url: getApp().api.user.authorization_bind,
            data: {},
            success: function(res) {
                if (0 === res.code) {
                    var bind_url = encodeURIComponent(res.data.bind_url);
                    getApp().core.redirectTo({
                        url: "/pages/web/web?url=" + bind_url
                    });
                } else getApp().core.showToast({
                    title: res.msg,
                    icon: "none"
                });
            }
        });
    },
    onReady: function(e) {
        getApp().page.onReady(this);
    },
    onShow: function(e) {
        getApp().page.onShow(this);
    },
    onHide: function(e) {
        getApp().page.onHide(this);
    },
    onUnload: function(e) {
        getApp().page.onUnload(this);
    },
    onPullDownRefresh: function(e) {
        getApp().page.onPullDownRefresh(this);
    },
    onReachBottom: function(e) {
        getApp().page.onReachBottom(this);
    }
});