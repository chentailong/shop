var app = getApp(), api = getApp().api;

Page({
    data: {
        cash_val: ""
    },
    onLoad: function (options) {
        wx.showShareMenu({
            withShareTicket: true,
            menus: ['shareAppMessage', 'shareTimeline']
        })
        getApp().page.onLoad(this, options);
        var that = this, e = "mch_account_data", account_data = getApp().core.getStorageSync(e);
        account_data && that.setData(account_data), getApp().core.showNavigationBarLoading(), getApp().request({
            url: getApp().api.mch.user.account,
            success: function (res) {
                getApp().core.hideNavigationBarLoading(), 0 == res.code ? (that.setData(res.data), getApp().core.setStorageSync(e, res.data)) : getApp().core.showModal({
                    title: "提示",
                    content: res.msg,
                    success: function () {
                    }
                });
            },
            complete: function () {
                getApp().core.hideNavigationBarLoading();
            }
        });
    },
    onReady: function () {
        getApp().page.onReady(this);
    },
    onShow: function () {
        getApp().page.onShow(this);
    },
    onHide: function () {
        getApp().page.onHide(this);
    },
    onUnload: function () {
        getApp().page.onUnload(this);
    },
    showDesc: function () {
        getApp().core.showModal({
            title: "交易手续费说明",
            content: this.data.desc,
            showCancel: !1
        });
    },
    showCash: function () {
        getApp().core.navigateTo({
            url: "/mch/m/cash/cash"
        });
    },
    hideCash: function () {
        this.setData({
            show_cash: !1
        });
    },
    cashInput: function (t) {
        var value = t.detail.value;
        value = parseFloat(value), isNaN(value) && (value = 0), value = value.toFixed(2), this.setData({
            cash_val: value || ""
        });
    },
    cashSubmit: function (t) {
        var that = this;
        that.data.cash_val ? that.data.cash_val <= 0 ? that.showToast({
            title: "请输入提现金额。"
        }) : (getApp().core.showLoading({
            title: "正在提交",
            mask: !0
        }), getApp().request({
            url: getApp().api.mch.user.cash,
            method: "POST",
            data: {
                cash_val: that.data.cash_val
            },
            success: function (t) {
                getApp().core.showModal({
                    title: "提示",
                    content: t.msg,
                    showCancel: !1,
                    success: function () {
                        0 == t.code && getApp().core.redirectTo({
                            url: "/mch/m/account/account"
                        });
                    }
                });
            },
            complete: function (t) {
                getApp().core.hideLoading();
            }
        })) : that.showToast({
            title: "请输入提现金额。"
        });
    }
});