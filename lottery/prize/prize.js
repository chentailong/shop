var is_loading = !1, is_no_more = !0;

Page({
    data: {
        naver: "prize",
        list: [],
        page: 1
    },
    onLoad: function(options) {
        wx.showShareMenu({
            withShareTicket: true,
            menus: ['shareAppMessage', 'shareTimeline']
        })
        getApp().page.onLoad(this, options), this.setData({
            status: options.status || 0
        });
        var that = this;
        getApp().core.showLoading({
            title: "加载中"
        }), getApp().request({
            url: getApp().api.lottery.prize,
            data: {
                status: that.data.status,
                page: that.data.page
            },
            success: function(res) {
                0 == res.code && (that.setData({
                    list: res.data.list
                }), null != res.data.list && 0 < res.data.list.length && (is_no_more = !1));
            },
            complete: function() {
                getApp().core.hideLoading();
            }
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
                url: getApp().api.lottery.prize,
                data: {
                    status: that.data.status,
                    page: page
                },
                success: function(t) {
                    if (0 == t.code) {
                        if (null == t.data.list || 0 == t.data.list.length) return void (is_no_more = !0);
                        that.setData({
                            list: that.data.list.concat(t.data.list),
                            page: page
                        });
                    } else that.showToast({
                        title: t.msg
                    });
                },
                complete: function() {
                    getApp().core.hideLoading(), is_loading = !1;
                }
            });
        }
    }
});