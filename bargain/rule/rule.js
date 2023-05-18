var app = getApp(), api = getApp().api;

Page({
    onLoad: function(res) {
        wx.showShareMenu({
            withShareTicket: true,
            menus: ['shareAppMessage', 'shareTimeline']
        })
        var that = this;
        getApp().page.onLoad(this, res), getApp().core.showLoading({
            title: "加载中"
        }), getApp().request({
            url: getApp().api.bargain.setting,
            success: function(t) {
                0 == t.code ? that.setData(t.data) : that.showLoading({
                    title: t.msg
                });
            },
            complete: function(t) {
                getApp().core.hideLoading();
            }
        });
    }
});