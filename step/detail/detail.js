Page({
    data: {
        number: 0,
        _num: 1,
        page: 2,
        list: [],
        over: !1
    },
    tab: function(t) {
        var that = this, num = t.target.dataset.num;
        getApp().core.showLoading({
            title: "数据加载中...",
            mask: !0
        }), getApp().request({
            url: getApp().api.step.log,
            data: {
                status: num
            },
            success: function(t) {
                getApp().core.hideLoading();
                var list = t.data.log;
                that.setData({
                    number: t.data.user.step_currency,
                    list: list,
                    _num: num,
                    page: 2
                });
            }
        });
    },
    onReachBottom: function() {
        var that = this, over = that.data.over;
        if (!over) {
            this.data.id;
            var list = this.data.list, num = this.data._num, page = this.data.page;
            this.setData({
                loading: !0
            }), getApp().request({
                url: getApp().api.step.log,
                data: {
                    status: num,
                    page: page
                },
                success: function(res) {
                    for (var i = 0; i < res.data.log.length; i++) list.push(res.data.log[i]);
                    res.data.log.length < 6 && (over = !0), that.setData({
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
        wx.showShareMenu({
            withShareTicket: true,
            menus: ['shareAppMessage', 'shareTimeline']
        })
        getApp().page.onLoad(this, t);
        var that = this;
        getApp().core.showLoading({
            title: "数据加载中...",
            mask: !0
        }), getApp().request({
            url: getApp().api.step.log,
            data: {
                status: 1,
                page: 1
            },
            success: function(t) {
                getApp().core.hideLoading();
                var a = t.data.log;
                that.setData({
                    number: t.data.user.step_currency,
                    list: a
                });
            }
        });
    }
});