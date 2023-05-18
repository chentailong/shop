var app = getApp(), api = getApp().api, goodsRefund = require("../../components/goods/goods_refund.js");

Page({
    data: {
        isPageShow: !1,
        pageType: "STORE",
        switch_tab_1: "active",
        switch_tab_2: "",
        goods: {},
        refund_data_1: {},
        refund_data_2: {}
    },
    onLoad: function(options) {
        wx.showShareMenu({
            withShareTicket: true,
            menus: ['shareAppMessage', 'shareTimeline']
        })
        getApp().page.onLoad(this, options);
        var that = this;
        wx.showLoading({
            title: "加载中"
        }), getApp().request({
            url: getApp().api.order.refund_preview,
            data: {
                order_detail_id: options.id
            },
            success: function(res) {
                wx.hideLoading(), 0 === res.code && that.setData({
                    goods: res.data,
                    isPageShow: !0
                }), 1 === res.code && getApp().core.showModal({
                    title: "提示",
                    content: res.msg,
                    image: "/images/icon-warning.png",
                    success: function(e) {
                        e.confirm && getApp().core.navigateBack();
                    }
                });
            }
        });
    },
    onReady: function() {
        getApp().page.onReady(this);
    },
    onShow: function() {
        getApp().page.onShow(this), goodsRefund.init(this);
    }
});