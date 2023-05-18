function setOnShowScene(t) {
    getApp().onShowData || (getApp().onShowData = {}), getApp().onShowData.scene = t;
}

Page({
    data: {
        list: ""
    },
    onLoad: function(options) {
        wx.showShareMenu({
            withShareTicket: true,
            menus: ['shareAppMessage', 'shareTimeline']
        })
        getApp().page.onLoad(this, options);
        var that = this;
        that.setData({
            my: "undefined" != typeof my
        }), getApp().core.showLoading({
            title: "加载中"
        }), getApp().request({
            url: getApp().api.user.member,
            method: "POST",
            success: function(res) {
                console.log(res)
                getApp().core.hideLoading(), 0 === res.code && (that.setData(res.data), that.setData({
                    current_key: 0
                }), res.data.list && that.setData({
                    buy_price: res.data.list[0].price
                }));
            }
        });
    },
    showDialogBtn: function() {
        this.setData({
            showModal: !0
        });
    },
    preventTouchMove: function() {},
    hideModal: function() {
        this.setData({
            showModal: !1
        });
    },
    onCancel: function() {
        this.hideModal();
    },
    pay: function(t) {
        var key = t.currentTarget.dataset.key, level_id = this.data.list[key].id, pay_type = t.currentTarget.dataset.payment;
        this.hideModal(), getApp().request({
            url: getApp().api.user.submit_member,
            data: {
                level_id: level_id,
                pay_type: pay_type
            },
            method: "POST",
            success: function(t) {
                if (0 === t.code) {
                    if (setTimeout(function() {
                        getApp().core.hideLoading();
                    }, 1e3), "WECHAT_PAY" === pay_type) return setOnShowScene("pay"), void getApp().core.requestPayment({
                        _res: t,
                        timeStamp: t.data.timeStamp,
                        nonceStr: t.data.nonceStr,
                        package: t.data.package,
                        signType: t.data.signType,
                        paySign: t.data.paySign,
                        complete: function(t) {
                            "requestPayment:fail" !== t.errMsg && "requestPayment:fail cancel" !== t.errMsg ? "requestPayment:ok" === t.errMsg && getApp().core.showModal({
                                title: "提示",
                                content: "充值成功",
                                showCancel: !1,
                                confirmText: "确认",
                                success: function(t) {
                                    getApp().core.navigateBack({
                                        delta: 1
                                    });
                                }
                            }) : getApp().core.showModal({
                                title: "提示",
                                content: "订单尚未支付",
                                showCancel: !1,
                                confirmText: "确认"
                            });
                        }
                    });
                    "BALANCE_PAY" === pay_type && getApp().core.showModal({
                        title: "提示",
                        content: "充值成功",
                        showCancel: !1,
                        confirmText: "确认",
                        success: function(t) {
                            getApp().core.navigateBack({
                                delta: 1
                            });
                        }
                    });
                } else getApp().core.showModal({
                    title: "提示",
                    content: t.msg,
                    showCancel: !1
                }), getApp().core.hideLoading();
            }
        });
    },
    changeTabs: function(t) {
        if ("undefined" == typeof my) var current_id = t.detail.currentItemId; else current_id = this.data.list[t.detail.current].id;
        for (var current_key = t.detail.current, price = parseFloat(this.data.list[0].price), list = this.data.list, o = 0; o < current_key; o++) price += parseFloat(list[o + 1].price);
        this.setData({
            current_id: current_id,
            current_key: current_key,
            buy_price: parseFloat(price)
        });
    },
    det: function(t) {
        var index = t.currentTarget.dataset.index, idxs = t.currentTarget.dataset.idxs;
        if (index !== this.data.ids) {
            var content = t.currentTarget.dataset.content;
            this.setData({
                ids: index,
                cons: !0,
                idx: idxs,
                content: content
            });
        } else this.setData({
            ids: -1,
            cons: !1,
            idx: idxs
        });
    }
});