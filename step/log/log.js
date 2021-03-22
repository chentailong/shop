var util = require("../../utils/helper.js"), utils = getApp().helper;

Page({
    data: {
        currency: 0,
        bout_ratio: 0,
        total_bout: 0,
        bout: 0,
        page: 2,
        list: [ {
            name: ""
        }, {
            step_num: 0
        }, {
            user_currency: 0
        }, {
            user_num: 0
        }, {
            status: 0
        } ]
    },
    onReachBottom: function() {
        var that = this, over = that.data.over;
        if (!over) {
            var list = this.data.list, page = this.data.page;
            this.setData({
                loading: !0
            }), getApp().request({
                url: getApp().api.step.activity_log,
                data: {
                    page: page
                },
                success: function(t) {
                    for (var i = 0; i < t.data.list.length; i++) list.push(t.data.list[i]);
                    t.data.list.length < 10 && (over = !0), that.setData({
                        list: list,
                        page: page + 1,
                        loading: !1,
                        over: over
                    });
                }
            });
        }
    },
    onLoad: function(t) {
        getApp().page.onLoad(this, t);
        var that = this, time = util.formatTime(new Date()), date = time[0] + time[1] + time[2] + time[3] + time[5] + time[6] + time[8] + time[9];
        getApp().core.showLoading({
            title: "数据加载中...",
            mask: !0
        }), getApp().request({
            url: getApp().api.step.activity_log,
            success: function(t) {
                getApp().core.hideLoading();
                var info = t.data.info, currency = 0;
                0 < info.currency && (currency = info.currency);
                for (var list = t.data.list, o = 0; o < list.length; o++) null != list[o].open_date &&
                (list[o].date = list[o].open_date.replace("-", "").replace("-", ""));
                that.setData({
                    currency: currency,
                    bout_ratio: info.bout_ratio,
                    total_bout: info.total_bout,
                    bout: info.bout,
                    time: date,
                    list: list
                });
            }
        });
    }
});