Page({
    data: {
        rule: ""
    },
    onLoad: function(e) {
        getApp().page.onLoad(this, e);
        var that = this, rules = void 0;
        "activity_rule" == e.rules ? rules = 2 : "rules" == e.rules && (rules = 1), getApp().core.showLoading({
            title: "数据加载中...",
            mask: !0
        }), getApp().request({
            url: getApp().api.step.setting,
            success: function(e) {
                getApp().core.hideLoading(), that.setData({
                    rule: e.data.rule,
                    activity_rule: e.data.activity_rule,
                    rules: rules
                });
            }
        });
    }
});