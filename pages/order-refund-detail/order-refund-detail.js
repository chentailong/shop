var app = getApp(), api = getApp().api, goodsSend = require("../../components/goods/goods_send.js");

Page({
    data: {
        isPageShow: !1,
        pageType: "STORE",
        order_refund: null,
        express_index: null
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
        }), getApp().request({
            url: getApp().api.order.refund_detail,
            data: {
                order_refund_id: options.id
            },
            success: function(res) {
                0 === res.code && that.setData({
                    order_refund: res.data,
                    isPageShow: !0
                });
            },
            complete: function() {
                getApp().core.hideLoading();
            }
        });
    },
    onReady: function() {},
    onShow: function() {
        getApp().page.onShow(this), goodsSend.init(this);
    },
    onHide: function() {},
    onUnload: function() {}
});