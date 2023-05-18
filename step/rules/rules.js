Page({
    data: {
        rule: ""
    },
    onLoad: function(options) {
        wx.showShareMenu({
            withShareTicket: true,
            menus: ['shareAppMessage', 'shareTimeline']
        })
        getApp().page.onLoad(this, options);
        var that = this, rules = void 0;
        "activity_rule" === options.rules ? rules = 2 : "rules" === options.rules && (rules = 1), getApp().core.showLoading({
            title: "数据加载中...",
            mask: !0
        }), getApp().request({
            url: getApp().api.step.setting,
            success: function(res) {
                getApp().core.hideLoading(), that.setData({
                    rule: res.data.rule,
                    activity_rule: res.data.activity_rule,
                    rules: rules
                });
            }
        });
    }
});