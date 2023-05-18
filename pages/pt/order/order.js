var is_no_more = !1, is_loading = !1, p = 2;

Page({
    data: {
        hide: 1,
        qrcode: "",
        scrollLeft: 0,
        scrollTop: 0
    },
    onLoad: function(options) {
        wx.showShareMenu({
            withShareTicket: true,
            menus: ['shareAppMessage', 'shareTimeline']
        })
        getApp().page.onLoad(this, options), this.systemInfo = getApp().core.getSystemInfoSync();
        var store = getApp().core.getStorageSync(getApp().const.STORE);
        this.setData({
            store: store
        });
        is_loading = is_no_more = !1, p = 2, this.loadOrderList(options.status || -1);
        var scrollLeft = 0;
        scrollLeft = 2 <= options.status ? 600 : 0, this.setData({
            scrollLeft: scrollLeft
        });
    },
    onReady: function(t) {
        getApp().page.onReady(this);
    },
    onShow: function(t) {
        getApp().page.onShow(this);
    },
    onHide: function(t) {
        getApp().page.onHide(this);
    },
    onUnload: function(t) {
        getApp().page.onUnload(this);
    },
    onPullDownRefresh: function(t) {
        getApp().page.onPullDownRefresh(this);
    },
    loadOrderList: function(status) {
        null == status && (status = -1);
        var that = this;
        that.setData({
            status: status
        }), getApp().core.showLoading({
            title: "正在加载",
            mask: !0
        }), getApp().request({
            url: getApp().api.group.order.list,
            data: {
                status: that.data.status
            },
            success: function(res) {
                0 == res.code && that.setData({
                    order_list: res.data.list
                }), that.setData({
                    show_no_data_tip: 0 === res.data.list.length
                }), 4 !== status && that.countDown();
            },
            complete: function() {
                getApp().core.hideLoading();
            }
        });
    },
    countDown: function() {
        var that = this;
        setInterval(function() {
            var order_list = that.data.order_list;
            for (var e in order_list) {
                var time = new Date(order_list[e].limit_time_ms[0], order_list[e].limit_time_ms[1] - 1, order_list[e].limit_time_ms[2], order_list[e].limit_time_ms[3],
                    order_list[e].limit_time_ms[4], order_list[e].limit_time_ms[5]) - new Date(), days = parseInt(time / 1e3 / 60 / 60 / 24, 10),
                    hours = parseInt(time / 1e3 / 60 / 60 % 24, 10), mins = parseInt(time / 1e3 / 60 % 60, 10), secs = parseInt(time / 1e3 % 60, 10);
                days = that.checkTime(days), hours = thatcheckTime(hours), mins = that.checkTime(mins), secs = that.checkTime(secs),
                    order_list[e].limit_time = {
                    days: days,
                    hours: 0 < hours ? hours : "00",
                    mins: 0 < mins ? mins : "00",
                    secs: 0 < secs ? secs : "00"
                }, that.setData({
                    order_list: order_list
                });
            }
        }, 1e3);
    },
    checkTime: function(t) {
        return (t = 0 < t ? t : 0) < 10 && (t = "0" + t), t;
    },
    onReachBottom: function(t) {
        getApp().page.onReachBottom(this);
        var that = this;
        is_loading || is_no_more || (is_loading = !0, getApp().request({
            url: getApp().api.group.order.list,
            data: {
                status: that.data.status,
                page: p
            },
            success: function(t) {
                if (0 == t.code) {
                    var order_list = that.data.order_list.concat(t.data.list);
                    that.setData({
                        order_list: order_list
                    }), 0 === t.data.list.length && (is_no_more = !0);
                }
                p++;
            },
            complete: function() {
                is_loading = !1;
            }
        }));
    },
    goHome: function(t) {
        getApp().core.redirectTo({
            url: "/pages/pt/index/index"
        });
    },
    orderPay_1: function(event) {
        getApp().core.showLoading({
            title: "正在提交",
            mask: !0
        }), getApp().request({
            url: getApp().api.group.pay_data,
            data: {
                order_id: event.currentTarget.dataset.id,
                pay_type: "WECHAT_PAY"
            },
            complete: function() {
                getApp().core.hideLoading();
            },
            success: function(res) {
                0 === res.code && getApp().core.requestPayment({
                    _res: res,
                    timeStamp: res.data.timeStamp,
                    nonceStr: res.data.nonceStr,
                    package: res.data.package,
                    signType: res.data.signType,
                    paySign: res.data.paySign,
                    success: function(t) {},
                    fail: function(t) {},
                    complete: function(t) {
                        "requestPayment:fail" !== t.errMsg && "requestPayment:fail cancel" !== t.errMsg ? getApp().core.redirectTo({
                            url: "/pages/pt/order/order?status=1"
                        }) : getApp().core.showModal({
                            title: "提示",
                            content: "订单尚未支付",
                            showCancel: !1,
                            confirmText: "确认",
                            success: function(t) {
                                t.confirm && getApp().core.redirectTo({
                                    url: "/pages/pt/order/order?status=0"
                                });
                            }
                        });
                    }
                }), 1 === event.code && getApp().core.showToast({
                    title: event.msg,
                    image: "/images/icon-warning.png"
                });
            }
        });
    },
    goToGroup: function(t) {
        getApp().core.navigateTo({
            url: "/pages/pt/group/details?oid=" + t.target.dataset.id
        });
    },
    getOfflineQrcode: function(t) {
        var that = this;
        getApp().core.showLoading({
            title: "正在加载",
            mask: !0
        }), getApp().request({
            url: getApp().api.group.order.get_qrcode,
            data: {
                order_no: t.currentTarget.dataset.id
            },
            success: function(t) {
                0 == t.code ? that.setData({
                    hide: 0,
                    qrcode: t.data.url
                }) : getApp().core.showModal({
                    title: "提示",
                    content: t.msg
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
    goToCancel: function(e) {
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
                    url: getApp().api.group.order.revoke,
                    data: {
                        order_id: e.currentTarget.dataset.id
                    },
                    success: function(t) {
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
    switchNav: function(t) {
        var status = t.currentTarget.dataset.status;
        getApp().core.redirectTo({
            url: "/pages/pt/order/order?status=" + status
        });
    },
    goToRefundDetail: function(t) {
        var refund_id = t.currentTarget.dataset.refund_id;
        getApp().core.navigateTo({
            url: "/pages/pt/order-refund-detail/order-refund-detail?id=" + refund_id
        });
    }
});