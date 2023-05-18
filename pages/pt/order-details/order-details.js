Page({
    options: "",
    data: {
        hide: 1,
        qrcode: ""
    },
    onLoad: function(options) {
        wx.showShareMenu({
            withShareTicket: true,
            menus: ['shareAppMessage', 'shareTimeline']
        })
        getApp().page.onLoad(this, options), this.options = options;
    },
    onReady: function(e) {
        getApp().page.onReady(this);
    },
    onShow: function(e) {
        getApp().page.onShow(this);
        this.loadOrderDetails();
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
    },
    onShareAppMessage: function(e) {
        getApp().page.onShareAppMessage(this);
        var that = this, url = "/pages/pt/group/details?oid=" + that.data.order_info.order_id;
        return {
            title: that.data.order_info.goods_list[0].name,
            path: url,
            imageUrl: that.data.order_info.goods_list[0].goods_pic,
            success: function(e) {}
        };
    },
    loadOrderDetails: function() {
        var that = this;
        getApp().core.showLoading({
            title: "正在加载",
            mask: !0
        }), getApp().request({
            url: getApp().api.group.order.detail,
            data: {
                order_id: that.options.id
            },
            success: function(res) {
                0 === res.code ? (3 !== res.data.status && that.countDownRun(res.data.limit_time_ms), that.setData({
                    order_info: res.data,
                    limit_time: res.data.limit_time
                })) : getApp().core.showModal({
                    title: "提示",
                    content: res.msg,
                    showCancel: !1,
                    success: function(e) {
                        e.confirm && getApp().core.redirectTo({
                            url: "/pages/pt/order/order"
                        });
                    }
                });
            },
            complete: function() {
                getApp().core.hideLoading();
            }
        });
    },
    copyText: function(e) {
        var text = e.currentTarget.dataset.text;
        getApp().core.setClipboardData({
            data: text,
            success: function() {
                getApp().core.showToast({
                    title: "已复制"
                });
            }
        });
    },
    countDownRun: function(n) {
        var that = this;
        setInterval(function() {
            var time = new Date(n[0], n[1] - 1, n[2], n[3], n[4], n[5]) - new Date(), hours = parseInt(time / 1e3 / 60 / 60 % 24, 10),
                mins = parseInt(time / 1e3 / 60 % 60, 10), secs = parseInt(time / 1e3 % 60, 10);
            hours = that.checkTime(hours), mins = that.checkTime(mins), secs = that.checkTime(secs), that.setData({
                limit_time: {
                    hours: 0 < hours ? hours : 0,
                    mins: 0 < mins ? mins : 0,
                    secs: 0 < secs ? secs : 0
                }
            });
        }, 1e3);
    },
    checkTime: function(e) {
        return e < 10 && (e = "0" + e), e;
    },
    toConfirm: function(event) {
        var that = this;
        getApp().core.showLoading({
            title: "正在加载",
            mask: !0
        }), getApp().request({
            url: getApp().api.group.order.confirm,
            data: {
                order_id: that.data.order_info.order_id
            },
            success: function(res) {
                0 === res.code ? getApp().core.showModal({
                    title: "提示",
                    content: res.msg,
                    showCancel: !1,
                    success: function(e) {
                        e.confirm && getApp().core.redirectTo({
                            url: "/pages/pt/order-details/order-details?id=" + that.data.order_info.order_id
                        });
                    }
                }) : getApp().core.showModal({
                    title: "提示",
                    content: res.msg,
                    showCancel: !1,
                    success: function(e) {
                        e.confirm && getApp().core.redirectTo({
                            url: "/pages/pt/order-details/order-details?id=" + that.data.order_info.order_id
                        });
                    }
                });
            },
            complete: function() {
                getApp().core.hideLoading();
            }
        });
    },
    goToGroup: function(e) {
        getApp().core.redirectTo({
            url: "/pages/pt/group/details?oid=" + this.data.order_info.order_id,
            success: function(e) {},
            fail: function(e) {},
            complete: function(e) {}
        });
    },
    location: function() {
        var shop = this.data.order_info.shop;
        getApp().core.openLocation({
            latitude: parseFloat(shop.latitude),
            longitude: parseFloat(shop.longitude),
            address: shop.address,
            name: shop.name
        });
    },
    getOfflineQrcode: function(event) {
        var that = this;
        getApp().core.showLoading({
            title: "正在加载",
            mask: !0
        }), getApp().request({
            url: getApp().api.group.order.get_qrcode,
            data: {
                order_no: event.currentTarget.dataset.id
            },
            success: function(res) {
                0 == res.code ? that.setData({
                    hide: 0,
                    qrcode: res.data.url
                }) : getApp().core.showModal({
                    title: "提示",
                    content: e.msg
                });
            },
            complete: function() {
                getApp().core.hideLoading();
            }
        });
    },
    hide: function(e) {
        this.setData({
            hide: 1
        });
    },
    orderRevoke: function() {
        var that = this;
        getApp().core.showModal({
            title: "提示",
            content: "是否取消该订单？",
            cancelText: "否",
            confirmtext: "是",
            success: function(res) {
                res.confirm && (getApp().core.showLoading({
                    title: "操作中"
                }), getApp().request({
                    url: getApp().api.group.order.revoke,
                    data: {
                        order_id: that.data.order_info.order_id
                    },
                    success: function(e) {
                        getApp().core.hideLoading(), getApp().core.showModal({
                            title: "提示",
                            content: e.msg,
                            showCancel: !1,
                            success: function(e) {
                                e.confirm && that.loadOrderDetails();
                            }
                        });
                    }
                }));
            }
        });
    }
});