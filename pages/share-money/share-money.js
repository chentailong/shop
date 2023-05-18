var app = getApp(), api = app.api;

Page({
    data: {
        block: !1,
        active: "",
        total_price: 0,
        price: 0,
        cash_price: 0,
        un_pay: 0
    },
    onLoad: function(t) {
        wx.showShareMenu({
            withShareTicket: true,
            menus: ['shareAppMessage', 'shareTimeline']
        })
        getApp().page.onLoad(this, t);
    },
    onReady: function() {
        getApp().page.onReady(this);
    },
    onShow: function() {
        getApp().page.onShow(this);
        var that = this, share_setting = getApp().core.getStorageSync(getApp().const.SHARE_SETTING), custom = getApp().core.getStorageSync(getApp().const.CUSTOM);
        that.setData({
            share_setting: share_setting,
            custom: custom
        }), getApp().core.showLoading({
            title: "正在加载",
            mask: !0
        }), getApp().request({
            url: getApp().api.share.get_price,
            success: function(res) {
                0 === res.code && that.setData({
                    total_price: res.data.price.total_price,
                    price: res.data.price.price,
                    cash_price: res.data.price.cash_price,
                    un_pay: res.data.price.un_pay
                });
            },
            complete: function() {
                getApp().core.hideLoading();
            }
        });
    },
    tapName: function(t) {
        var that = this, active = "";
        that.data.block || (active = "active"), that.setData({
            block: !that.data.block,
            active: active
        });
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