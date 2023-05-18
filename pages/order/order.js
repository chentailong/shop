var app = getApp(), api = getApp().api, is_no_more = !1, is_loading = !1, p = 2;
var template = 'tWSb-jhRnH-H_zeYqMYRBQmayA2skt545pDX5FPMsSM' //退货模板ID
var refund_template = 'YP4fG1CGdJsusUTfq3MYlVxfTVBvSgOYZr5wYjNIuOo' //退款模板id

Page({
    data: {
        status: -1,
        order_list: [],
        show_no_data_tip: !1,
        hide: 1,
        qrcode: ""
    },
    onLoad: function(options) {
        wx.showShareMenu({
            withShareTicket: true,
            menus: ['shareAppMessage', 'shareTimeline']
        })
        getApp().page.onLoad(this, options);
        var that = this;
        is_loading = is_no_more = !1, p = 2, that.setData({
            options: options
        }), that.loadOrderList(options.status || -1), getCurrentPages().length < 2 && that.setData({
            show_index: !0
        });
    },
    loadOrderList: function(status) {
        null == status && (status = -1);
        var that = this;
        that.setData({
            status: status
        }), getApp().core.showLoading({
            title: "正在加载",
            mask: !0
        });
        var data = {
            status: that.data.status
        };
        that.data.options;
        void 0 !== that.data.options.order_id && (data.order_id = that.data.options.order_id), getApp().request({
            url: getApp().api.order.list,
            data: data,
            success: function(res) {
                console.log(res)
                0 === res.code && (that.setData({
                    order_list: res.data.list,
                    pay_type_list: res.data.pay_type_list
                }), getApp().core.getStorageSync(getApp().const.ITEM) && getApp().core.removeStorageSync(getApp().const.ITEM));
                that.setData({
                    show_no_data_tip: 0 === that.data.order_list.length
                });
            },
            complete: function() {
                getApp().core.hideLoading();
            }
        });
    },
    onReachBottom: function() {
        var that = this;
        is_loading || is_no_more || (is_loading = !0, getApp().request({
            url: getApp().api.order.list,
            data: {
                status: that.data.status,
                page: p
            },
            success: function(res) {
                if (0 === res.code) {
                    var order_list = that.data.order_list.concat(res.data.list);
                    that.setData({
                        order_list: order_list,
                        pay_type_list: res.data.pay_type_list
                    }), 0 === res.data.list.length && (is_no_more = !0);
                }
                p++;
            },
            complete: function() {
                is_loading = !1;
            }
        }));
    },
    orderPay_1: function(e) {
        var that = this, pay_type_list = that.data.pay_type_list;
        1 === pay_type_list.length ? (getApp().core.showLoading({
            title: "正在提交",
            mask: !0
        }), 0 === pay_type_list[0].payment && that.WechatPay(e), 3 === pay_type_list[0].payment && that.BalancePay(e)) : getApp().core.showModal({
            title: "提示",
            content: "选择支付方式",
            cancelText: "余额支付",
            confirmText: "线上支付",
            success: function(t) {
                getApp().core.showLoading({
                    title: "正在提交",
                    mask: !0
                }), t.confirm ? that.WechatPay(e) : t.cancel && that.BalancePay(e);
            }
        });
    },
    WechatPay: function(t) {
        getApp().request({
            url: getApp().api.order.pay_data,
            data: {
                order_id: t.currentTarget.dataset.id,
                pay_type: "WECHAT_PAY"
            },
            complete: function() {
                getApp().core.hideLoading();
            },
            success: function(t) {
                0 == t.code && getApp().core.requestPayment({
                    _res: t,
                    timeStamp: t.data.timeStamp,
                    nonceStr: t.data.nonceStr,
                    package: t.data.package,
                    signType: t.data.signType,
                    paySign: t.data.paySign,
                    success: function(t) {},
                    fail: function(t) {},
                    complete: function(t) {
                        "requestPayment:fail" !== t.errMsg && "requestPayment:fail cancel" !== t.errMsg ? getApp().core.redirectTo({
                            url: "/pages/order/order?status=1"
                        }) : getApp().core.showModal({
                            title: "提示",
                            content: "订单尚未支付",
                            showCancel: !1,
                            confirmText: "确认",
                            success: function(t) {
                                t.confirm && getApp().core.redirectTo({
                                    url: "/pages/order/order?status=0"
                                });
                            }
                        });
                    }
                }), 1 == t.code && getApp().core.showToast({
                    title: t.msg,
                    image: "/images/icon-warning.png"
                });
            }
        });
    },
    BalancePay: function(t) {
        getApp().request({
            url: getApp().api.order.pay_data,
            data: {
                order_id: t.currentTarget.dataset.id,
                pay_type: "BALANCE_PAY"
            },
            complete: function() {
                getApp().core.hideLoading();
            },
            success: function(t) {
                0 == t.code && getApp().core.redirectTo({
                    url: "/pages/order/order?status=1"
                }), 1 == t.code && getApp().core.showModal({
                    title: "提示",
                    content: t.msg,
                    showCancel: !1
                });
            }
        });
    },
    orderRevoke: function(e) {
        var that = this;
        getApp().core.showModal({
            title: "提示",
            content: "是否取消该订单？",
            cancelText: "否",
            confirmText: "是",
            success: function(t) {
                if (t.cancel) return !0;
                t.confirm && (getApp().core.showLoading({
                    title: "操作中"
                }), getApp().request({
                    url: getApp().api.order.revoke,
                    data: {
                        order_id: e.currentTarget.dataset.id
                    },
                    success: function(t) {
                        wx.requestSubscribeMessage({
                            tmplIds: [template,refund_template],
                            success(res) {
                                console.log(res)
                                console.log('成功')
                            },
                            fail(err) {
                                console.log(err)
                            }
                        });
                        getApp().core.hideLoading(), getApp().core.showModal({
                            title: "提示",
                            content: t.msg,
                            showCancel: !1,
                            success: function(t) {
                                t.confirm && that.loadOrderList(that.data.status);
                            }
                        });
                    }
                }));
            }
        });
    },
    orderConfirm: function(e) {
        var that = this;
        getApp().core.showModal({
            title: "提示",
            content: "是否确认已收到货？",
            cancelText: "否",
            confirmText: "是",
            success: function(t) {
                if (t.cancel) return !0;
                t.confirm && (getApp().core.showLoading({
                    title: "操作中"
                }), getApp().request({
                    url: getApp().api.order.confirm,
                    data: {
                        order_id: e.currentTarget.dataset.id
                    },
                    success: function(t) {
                        getApp().core.hideLoading(), getApp().core.showToast({
                            title: t.msg
                        }), 0 == t.code && that.loadOrderList(3);
                    }
                }));
            }
        });
    },
    orderQrcode: function(t) {
        var that = this, order_list = that.data.order_list, index = t.target.dataset.index;
        getApp().core.showLoading({
            title: "正在加载",
            mask: !0
        }), that.data.order_list[index].offline_qrcode ? (that.setData({
            hide: 0,
            qrcode: that.data.order_list[index].offline_qrcode
        }), getApp().core.hideLoading()) : getApp().request({
            url: getApp().api.order.get_qrcode,
            data: {
                order_no: order_list[index].order_no
            },
            success: function(res) {
                0 === res.code ? that.setData({
                    hide: 0,
                    qrcode: res.data.url
                }) : getApp().core.showModal({
                    title: "提示",
                    content: res.msg
                });
            },
            complete: function() {
                getApp().core.hideLoading();
            }
        });
    },
    hide: function(t) {
        this.setData({
            hide: 1
        });
    },
    onShow: function() {
        getApp().page.onShow(this);
    }
});