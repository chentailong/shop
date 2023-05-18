Page({
    data: {},
    onLoad: function(e) {
        wx.showShareMenu({
            withShareTicket: true,
            menus: ['shareAppMessage', 'shareTimeline']
        })
        getApp().page.onLoad(this, e);
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
        var that = this, id = "";
        if ("undefined" == typeof my) id = that.options.scene; else if (null !== getApp().query) {
            var query = getApp().query;
            getApp().query = null, id = query.order_id;
        }
        getApp().core.showLoading({
            title: "正在加载",
            mask: !0
        }), getApp().request({
            url: getApp().api.group.order.clerk_order_details,
            data: {
                id: id
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
    clerkOrder: function(event) {
        var that = this;
        getApp().core.showModal({
            title: "提示",
            content: "是否确认核销？",
            success: function(res) {
                res.confirm ? (getApp().core.showLoading({
                    title: "正在加载"
                }), getApp().request({
                    url: getApp().api.group.order.clerk,
                    data: {
                        order_id: that.data.order_info.order_id
                    },
                    success: function(res) {
                        0 === res.code ? getApp().core.redirectTo({
                            url: "/pages/user/user"
                        }) : getApp().core.showModal({
                            title: "警告！",
                            showCancel: !1,
                            content: res.msg,
                            confirmText: "确认",
                            success: function(e) {
                                e.confirm && getApp().core.redirectTo({
                                    url: "/pages/index/index"
                                });
                            }
                        });
                    },
                    complete: function() {
                        getApp().core.hideLoading();
                    }
                })) : res.cancel;
            }
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
    }
});