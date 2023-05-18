var app = getApp(), api = app.api, is_no_more = !1, is_loading = !1, p = 2;

Page({
    data: {
        status: 1,
        first_count: 0,
        second_count: 0,
        third_count: 0,
        list: Array,
        no_more: !1
    },
    onLoad: function(options) {
        wx.showShareMenu({
            withShareTicket: true,
            menus: ['shareAppMessage', 'shareTimeline']
        })
        getApp().page.onLoad(this, options);
        var setting = getApp().core.getStorageSync(getApp().const.SHARE_SETTING);
        this.setData({
            share_setting: setting
        }), is_no_more = is_loading = !1, p = 2, this.GetList(options.status || 1);
    },
    GetList: function(t) {
        var that = this;
        is_loading || (is_loading = !0, that.setData({
            status: parseInt(t || 1)
        }), getApp().core.showLoading({
            title: "正在加载",
            mask: !0
        }), getApp().request({
            url: getApp().api.share.get_team,
            data: {
                status: that.data.status,
                page: 1
            },
            success: function(res) {
                that.setData({
                    first_count: res.data.first,
                    second_count: res.data.second,
                    third_count: res.data.third,
                    list: res.data.list
                }), 0 === res.data.list.length && (is_no_more = !0, that.setData({
                    no_more: !0
                }));
            },
            complete: function() {
                getApp().core.hideLoading(), is_loading = !1;
            }
        }));
    },
    onReachBottom: function() {
        is_no_more || this.loadData();
    },
    loadData: function() {
        if (!is_loading) {
            is_loading = !0;
            var that = this;
            getApp().core.showLoading({
                title: "正在加载",
                mask: !0
            }), getApp().request({
                url: getApp().api.share.get_team,
                data: {
                    status: that.data.status,
                    page: p
                },
                success: function(res) {
                    that.setData({
                        first_count: res.data.first,
                        second_count: res.data.second,
                        third_count: res.data.third,
                        list: that.data.list.concat(res.data.list)
                    }), 0 === res.data.list.length && (is_no_more = !0, that.setData({
                        no_more: !0
                    }));
                },
                complete: function() {
                    getApp().core.hideLoading(), is_loading = !1, p++;
                }
            });
        }
    }
});