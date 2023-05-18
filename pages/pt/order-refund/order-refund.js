var goodsRefund = require("../../../components/goods/goods_refund.js");

Page({
    data: {
        pageType: "PINTUAN",
        switch_tab_1: "active",
        switch_tab_2: "",
        goods: {
            goods_pic: "https://goss1.vcg.com/creative/vcg/800/version23/VCG21f302700c4.jpg"
        },
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
        getApp().request({
            url: getApp().api.group.order.refund_preview,
            data: {
                order_id: options.id
            },
            success: function(res) {
                0 === res.code && that.setData({
                    goods: res.data
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
    onReady: function(e) {
        getApp().page.onReady(this);
    },
    onShow: function(e) {
        getApp().page.onShow(this), goodsRefund.init(this);
    }
});