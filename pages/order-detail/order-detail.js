var app = getApp(), api = getApp().api;

Page({
    data: {
        isPageShow: !1,
        order: null,
        getGoodsTotalPrice: function() {
            return this.data.order.total_price;
        }
    },
    onLoad: function(options) {
        wx.showShareMenu({
            withShareTicket: true,
            menus: ['shareAppMessage', 'shareTimeline']
        })
        getApp().page.onLoad(this, options);
        var that = this;
        getApp().core.showLoading({
            title: "正在加载"
        });
        var Pages = getCurrentPages(), route = Pages[Pages.length - 2];
        getApp().request({
            url: getApp().api.order.detail,
            data: {
                order_id: options.id,
                route: route.route
            },
            success: function(res) {
                console.log(res)
                0 === res.code && that.setData({
                    order: res.data,
                    isPageShow: !0
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
    location: function() {
        var shop = this.data.order.shop;
        getApp().core.openLocation({
            latitude: parseFloat(shop.latitude),
            longitude: parseFloat(shop.longitude),
            address: shop.address,
            name: shop.name
        });
    },
    orderRevoke: function(t) {
        var that = this;
        getApp().core.showModal({
            title: "提示",
            content: "是否退款该订单？",
            cancelText: "否",
            confirmText: "是",
            success: function(res) {
                if (res.cancel) return !0;
                res.confirm && (getApp().core.showLoading({
                    title: "操作中"
                }), getApp().request({
                    url: getApp().api.order.revoke,
                    data: {
                        order_id: t.currentTarget.dataset.id
                    },
                    success: function(e) {
                        getApp().core.hideLoading(), getApp().core.showModal({
                            title: "提示",
                            content: e.msg,
                            showCancel: !1,
                            success: function(e) {
                                e.confirm && that.onLoad({
                                    id: that.data.order.order_id
                                });
                            }
                        });
                    }
                }));
            }
        });
    }
});