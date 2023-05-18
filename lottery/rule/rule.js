Page({
    data: {},
    onLoad: function(t) {
        wx.showShareMenu({
            withShareTicket: true,
            menus: ['shareAppMessage', 'shareTimeline']
        })
        getApp().page.onLoad(this, t);
        var that = this;
        getApp().request({
            url: getApp().api.lottery.setting,
            success: function(t) {
                0 == t.code && that.setData({
                    rule: t.data.rule
                });
            }
        });
    }
});