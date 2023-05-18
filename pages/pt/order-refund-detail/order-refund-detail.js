var goodsSend = require("../../../components/goods/goods_send.js");

Page({
    data: {
        pageType: "PINTUAN",
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
            url: getApp().api.group.order.refund_detail,
            data: {
                order_refund_id: options.id
            },
            success: function(res) {
                0 === res.code && that.setData({
                    order_refund: res.data
                });
            },
            complete: function() {
                getApp().core.hideLoading();
            }
        });
    },
    onReady: function(e) {
        getApp().page.onReady(this);
    },
    onShow: function(e) {
        getApp().page.onShow(this), goodsSend.init(this);
    },
    onHide: function(e) {
        getApp().page.onHide(this);
    },
    onUnload: function(e) {
        getApp().page.onUnload(this);
    }
});