Page({
    data: {},
    onLoad: function(options) {
        wx.showShareMenu({
            withShareTicket: true,
            menus: ['shareAppMessage', 'shareTimeline']
        })
        getApp().page.onLoad(this, options);
        var that = this;
        getApp().request({
            url: getApp().api.pond.setting,
            success: function(res) {
                0 == res.code && that.setData({
                    rule: res.data.rule
                });
            }
        });
    }
});