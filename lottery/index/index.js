var is_loading = !1, is_no_more = !0, interval_list = !1;

Page({
    data: {
        page: 1,
        naver: "index"
    },
    onLoad: function(t) {
        wx.showShareMenu({
            withShareTicket: true,
            menus: ['shareAppMessage', 'shareTimeline']
        })
        getApp().page.onLoad(this, t);
    },
    onShow: function() {
        getApp().page.onShow(this), getApp().core.showLoading({
            title: "加载中"
        });
        var that = this;
        that.data.page = 1, getApp().request({
            url: getApp().api.lottery.index,
            success: function(res) {
                if (0 == res.code) {
                    that.setData(res.data), null != res.data.new_list && 0 < res.data.new_list.length && (is_no_more = !1);
                    var list = [];
                    res.data.new_list.forEach(function(t, e, a) {
                        list.push(t.end_time);
                    }), that.setTimeStart(list);
                }
            },
            complete: function(t) {
                getApp().core.hideLoading();
            }
        }), getApp().request({
            url: getApp().api.lottery.setting,
            success: function(res) {
                if (0 == res.code) {
                    var title = res.data.title;
                    title && getApp().core.setNavigationBarTitle({
                        title: title
                    });
                }
            }
        });
    },
    onHide: function() {
        getApp().page.onHide(this), clearInterval(interval_list);
    },
    onUnload: function() {
        getApp().page.onUnload(this), clearInterval(interval_list);
    },
    setTimeStart: function(t) {
        var that = this, time_list = [];
        clearInterval(interval_list), interval_list = setInterval(function() {
            t.forEach(function(t, e, a) {
                var i = new Date(), n = parseInt(t - i.getTime() / 1e3);
                if (0 < n) var day = Math.floor(n / 86400), hour = Math.floor(n / 3600) - 24 * day,
                    minute = Math.floor(n / 60) - 24 * day * 60 - 60 * hour, second = Math.floor(n) - 24 * day * 60 * 60 - 60 * hour * 60 - 60 * minute;
                var time = {
                    day: day,
                    hour: hour,
                    minute: minute,
                    second: second
                };
                time_list[e] = time;
            }), that.setData({
                time_list: time_list
            });
        }, 1e3);
    },
    submit: function(t) {
        var formId = t.detail.formId, lottery_id = t.currentTarget.dataset.lottery_id;
        getApp().core.navigateTo({
            url: "/lottery/detail/detail?lottery_id=" + lottery_id + "&form_id=" + formId
        });
    },
    onReachBottom: function() {
        is_no_more || this.loadData();
    },
    loadData: function() {
        if (!is_loading) {
            is_loading = !0, getApp().core.showLoading({
                title: "加载中"
            });
            var that = this, page = that.data.page + 1;
            getApp().request({
                url: getApp().api.lottery.index,
                data: {
                    page: page
                },
                success: function(res) {
                    if (0 == res.code) {
                        var new_list = that.data.new_list;
                        if (null == res.data.new_list || 0 == t.data.new_list.length) return void (is_no_more = !0);
                        new_list = new_list.concat(t.data.new_list), that.setData({
                            new_list: new_list,
                            page: page
                        });
                        var list = [];
                        new_list.forEach(function(t, e, a) {
                            list.push(t.end_time);
                        }), that.setTimeStart(list);
                    } else that.showToast({
                        title: res.msg
                    });
                },
                complete: function(t) {
                    getApp().core.hideLoading(), is_loading = !1;
                }
            });
        }
    },
    onShareAppMessage: function() {
        getApp().page.onShareAppMessage(this);
        return {
            path: "lottery/index/index?user_id=" + this.data.__user_info.id,
            success: function(t) {}
        };
    }
});