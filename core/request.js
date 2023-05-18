module.exports = function (options) {
    options.data || (options.data = {});
    var core = this.core,
        access_token = this.core.getStorageSync(this.const.ACCESS_TOKEN),
        form_id_list = this.core.getStorageSync(this.const.FORM_ID_LIST);
    if (options.data.hideLogin && options.data.hideLogin == 1) {
        access_token && (options.data.access_token = access_token), options.data._version = this._version,
            options.data._platform = this.platform, !this.is_login && this.page.currentPage;
    } else {
        access_token && (options.data.access_token = access_token), options.data._version = this._version, options.data._platform = this.platform,
        !this.is_login && this.page.currentPage && (this.is_login = !0, this.login({}));

    }


    var that = this;
    form_id_list && 1 <= form_id_list.length && that.is_form_id_request && (that.is_form_id_request = !1, that.request({
        url: that.api.default.form_id,
        method: "POST",
        data: {
            formIdList: JSON.stringify(form_id_list)
        },
        success: function (e) {
            that.core.removeStorageSync(that.const.FORM_ID_LIST);
        },
        complete: function () {
            that.is_form_id_request = !0;
        }
    })), core.request({
        url: options.url,
        header: options.header || {
            "content-type": "application/x-www-form-urlencoded"
        },
        data: options.data || {},
        method: options.method || "GET",
        dataType: options.dataType || "json",
        success: function (res) {
            -1 == res.data.code ? (that.core.hideLoading(), that.page.setUserInfoShow(), that.is_login = !1) : -2 == res.data.code ? core.redirectTo({
                url: "/pages/store-disabled/store-disabled"
            }) : options.success && options.success(res.data);
        },
        fail: function (err) {
            if (console.warn("--- request fail >>>"), console.warn("--- " + options.url + " ---"),
                console.warn(err), console.warn("<<< request fail ---"),
            options && options.noHandlerFail) "function" == typeof options.fail && options.fail(err.data);
            else {
                var app = getApp();
                app.is_on_launch ? (app.is_on_launch = !1, core.showModal({
                    title: "网络请求出错",
                    content: err.errMsg || "",
                    showCancel: !1,
                    success: function (e) {
                        e.confirm && options.fail && options.fail(e);
                    }
                })) : (core.showToast({
                    title: err.errMsg,
                    image: "/images/icon-warning.png"
                }), options.fail && options.fail(err));
            }
        },
        complete: function (res) {
            if (200 != res.statusCode && res.data && res.data.code && 500 == res.data.code) {
                var message = res.data.data.message;
                core.showModal({
                    title: "系统错误",
                    content: message + ";\r\n请将错误内容复制发送给我们，以便进行问题追踪。",
                    cancelText: "关闭",
                    confirmText: "复制",
                    success: function (e) {
                        e.confirm && core.setClipboardData({
                            data: JSON.stringify({
                                data: res.data.data,
                                object: options
                            })
                        });
                    }
                });
            }
            options.complete && options.complete(res);
        }
    });
};