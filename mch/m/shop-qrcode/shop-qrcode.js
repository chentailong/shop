var app = getApp(), api = getApp().api;

Page({
    data: {
        qrcode_pic: ""
    },
    onLoad: function(options) {
        wx.showShareMenu({
            withShareTicket: true,
            menus: ['shareAppMessage', 'shareTimeline']
        })
        getApp().page.onLoad(this, options);
        var that = this;
        getApp().request({
            url: getApp().api.mch.user.shop_qrcode,
            success: function(res) {
                0 === res.code ? that.setData({
                    header_bg: res.data.header_bg,
                    shop_logo: res.data.shop_logo,
                    shop_name: res.data.shop_name,
                    qrcode_pic: res.data.qrcode_pic
                }) : getApp().core.showModal({
                    title: "提示",
                    content: res.msg,
                    success: function() {}
                });
            }
        });
    },
    onReady: function() {
        getApp().page.onReady(this);
    },
    onShow: function() {
        getApp().page.onShow(this);
    },
    onHide: function() {
        getApp().page.onHide(this);
    },
    onUnload: function() {
        getApp().page.onUnload(this);
    },
    onPullDownRefresh: function() {},
    onReachBottom: function() {}
});