function setOnShowScene(e) {
    getApp().onShowData || (getApp().onShowData = {}), getApp().onShowData.scene = e;
}

Page({
    data: {
        selected: -1
    },
    onLoad: function(options) {
        wx.showShareMenu({
            withShareTicket: true,
            menus: ['shareAppMessage', 'shareTimeline']
        })
        getApp().page.onLoad(this, options);
        var that = this;
        getApp().core.showLoading({
            title: "加载中"
        }), getApp().request({
            url: getApp().api.recharge.list,
            success: function(res) {
                var data = res.data;
                data.balance && 0 !== data.balance.status || getApp().core.showModal({
                    title: "提示",
                    content: "充值功能未开启，请联系管理员！",
                    showCancel: !1,
                    success: function(e) {
                        e.confirm && getApp().core.navigateBack({
                            delta: 1
                        });
                    }
                }), that.setData(res.data);
            },
            complete: function(e) {
                getApp().core.hideLoading();
            }
        });
    },
    onReady: function() {
        getApp().page.onReady(this);
    },
    onShow: function() {
        getApp().page.onShow(this);
    },
    onHide: function() {
        getApp().page.onHide(this);
    },
    onUnload: function() {
        getApp().page.onUnload(this);
    },
    click: function(e) {
        this.setData({
            selected: e.currentTarget.dataset.index
        });
    },
    pay: function(e) {
        var that = this, num = {}, selected = that.data.selected;
        if (-1 === selected) {
            var money = that.data.money;
            if (money < .01) return void getApp().core.showModal({
                title: "提示",
                content: "充值金额不能小于0.01",
                showCancel: !1
            });
            num.pay_price = money, num.send_price = 0;
        } else {
            var data_list = that .data.list;
            num.pay_price = data_list[selected].pay_price, num.send_price = data_list[selected].send_price;
        }
        num.pay_price ? (num.pay_type = "WECHAT_PAY", getApp().core.showLoading({
            title: "提交中"
        }), getApp().request({
            url: getApp().api.recharge.submit,
            data: num,
            method: "POST",
            success: function(res) {
                if (getApp().page.bindParent({
                    parent_id: getApp().core.getStorageSync(getApp().const.PARENT_ID),
                    condition: 1
                }), 0 == res.code) return setTimeout(function() {
                    getApp().core.hideLoading();
                }, 1e3), setOnShowScene("pay"), void getApp().core.requestPayment({
                    _res: res,
                    timeStamp: res.data.timeStamp,
                    nonceStr: res.data.nonceStr,
                    package: res.data.package,
                    signType: res.data.signType,
                    paySign: res.data.paySign,
                    success: function(success) {},
                    fail: function(error) {},
                    complete: function(lete) {
                        "requestPayment:fail" !== lete.errMsg && "requestPayment:fail cancel" !== lete.errMsg ? (getApp().page.bindParent({
                            parent_id: getApp().core.getStorageSync(getApp().const.PARENT_ID),
                            condition: 2
                        }), getApp().core.showModal({
                            title: "提示",
                            content: "充值成功",
                            showCancel: !1,
                            confirmText: "确认",
                            success: function(e) {
                                e.confirm && getApp().core.navigateBack({
                                    delta: 1
                                });
                            }
                        })) : getApp().core.showModal({
                            title: "提示",
                            content: "订单尚未支付",
                            showCancel: !1,
                            confirmText: "确认"
                        });
                    }
                });
                getApp().core.showModal({
                    title: "提示",
                    content: e.msg,
                    showCancel: !1
                }), getApp().core.hideLoading();
            }
        })) : getApp().core.showModal({
            title: "提示",
            content: "请选择充值金额",
            showCancel: !1
        });
    },
    input: function(e) {
        this.setData({
            money: e.detail.value
        });
    }
});