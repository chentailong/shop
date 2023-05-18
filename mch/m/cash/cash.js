var app = getApp(), api = getApp().api;

Page({
    data: {
        price: 0,
        cash_max_day: -1,
        selected: 0
    },
    onLoad: function(options) {
        wx.showShareMenu({
            withShareTicket: true,
            menus: ['shareAppMessage', 'shareTimeline']
        })
        getApp().page.onLoad(this, options);
    },
    onReady: function() {
        getApp().page.onReady(this);
    },
    onShow: function() {
        getApp().page.onShow(this);
        var that = this;
        getApp().core.showLoading({
            title: "正在提交",
            mask: !0
        }), getApp().request({
            url: getApp().api.mch.user.cash_preview,
            success: function(res) {
                if (0 == res.code) {
                    var money = {};
                    money.price = res.data.money, money.type_list = res.data.type_list, that.setData(money);
                }
            },
            complete: function(e) {
                getApp().core.hideLoading();
            }
        });
    },
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    showCashMaxDetail: function() {
        getApp().core.showModal({
            title: "提示",
            content: "今日剩余提现金额=平台每日可提现金额-今日所有用户提现金额"
        });
    },
    select: function(e) {
        var index = e.currentTarget.dataset.index;
        index != this.data.check && this.setData({
            name: "",
            mobile: "",
            bank_name: ""
        }), this.setData({
            selected: index
        });
    },
    formSubmit: function(event) {
        var that = this, cash = parseFloat(parseFloat(event.detail.value.cash).toFixed(2)), price = that.data.price;
        if (cash) if (price < cash) getApp().core.showToast({
            title: "提现金额不能超过" + price + "元",
            image: "/images/icon-warning.png"
        }); else if (cash < 1) getApp().core.showToast({
            title: "提现金额不能低于1元",
            image: "/images/icon-warning.png"
        }); else {
            var selected = that.data.selected;
            if (0 === selected || 1 === selected || 2 === selected || 3 === selected || 4 === selected) {
                if ("my" === that.data.__platform && 0 === selected && (selected = 2), 1 === selected || 2 === selected || 3 === selected) {
                    if (!(nickname === event.detail.value.name) || null == nickname) return void getApp().core.showToast({
                        title: "姓名不能为空",
                        image: "/images/icon-warning.png"
                    });
                    if (!(account === event.detail.value.mobile) || null == account) return void getApp().core.showToast({
                        title: "账号不能为空",
                        image: "/images/icon-warning.png"
                    });
                }
                if (3 === selected) {
                    if (!(bank_name === event.detail.value.bank_name) || null == bank_name) return void getApp().core.showToast({
                        title: "开户行不能为空",
                        image: "/images/icon-warning.png"
                    });
                } else var bank_name = "";
                if (4 === selected || 0 === selected) {
                    bank_name = "";
                    var account = "", nickname = "";
                }
                getApp().core.showLoading({
                    title: "正在提交",
                    mask: !0
                }), getApp().request({
                    url: getApp().api.mch.user.cash,
                    method: "POST",
                    data: {
                        cash_val: cash,
                        nickname: nickname,
                        account: account,
                        bank_name: bank_name,
                        type: selected,
                        scene: "CASH",
                        form_id: event.detail.formId
                    },
                    success: function(t) {
                        getApp().core.hideLoading(), getApp().core.showModal({
                            title: "提示",
                            content: t.msg,
                            showCancel: !1,
                            success: function(e) {
                                e.confirm && 0 === t.code && getApp().core.redirectTo({
                                    url: "/mch/m/cash-log/cash-log"
                                });
                            }
                        });
                    }
                });
            } else getApp().core.showToast({
                title: "请选择提现方式",
                image: "/images/icon-warning.png"
            });
        } else getApp().core.showToast({
            title: "请输入提现金额",
            image: "/images/icon-warning.png"
        });
    }
});