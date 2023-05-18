var app = getApp(), api = app.api, is_no_more = !1, is_loading = !1, p = 2;

Page({
    data: {
        status: -1,
        list: [],
        hidden: -1,
        is_no_more: !1,
        is_loading: !1
    },
    onLoad: function(t) {
        wx.showShareMenu({
            withShareTicket: true,
            menus: ['shareAppMessage', 'shareTimeline']
        })
        getApp().page.onLoad(this, t);
        is_loading = is_no_more = !1, p = 2, this.GetList(t.status || -1);
    },
    GetList: function(t) {
        var that = this;
        that.setData({
            status: parseInt(t || -1)
        }), getApp().core.showLoading({
            title: "正在加载",
            mask: !0
        }), getApp().request({
            url: getApp().api.share.get_order,
            data: {
                status: that.data.status
            },
            success: function(t) {
                that.setData({
                    list: t.data
                }), 0 == t.data.length && that.setData({
                    is_no_more: !0
                });
            },
            complete: function() {
                getApp().core.hideLoading();
            }
        });
    },
    onReady: function() {
        getApp().page.onReady(this);
    },
    onShow: function() {
        getApp().page.onShow(this);
    },
    onHide: function() {
        getApp().page.onHide(this);
    },
    onUnload: function() {
        getApp().page.onUnload(this);
    },
    onPullDownRefresh: function() {},
    click: function(t) {
        var index = t.currentTarget.dataset.index;
        this.setData({
            hidden: this.data.hidden === index ? -1 : index
        });
    },
    onReachBottom: function() {
        var that = this;
        is_loading || is_no_more || (is_loading = !0, that.setData({
            is_loading: is_loading
        }), getApp().request({
            url: getApp().api.share.get_order,
            data: {
                status: that.data.status,
                page: p
            },
            success: function(res) {
                if (0 === res.code) {
                    var list = that.data.list.concat(res.data);
                    that.setData({
                        list: list
                    }), 0 === res.data.length && (is_no_more = !0, that.setData({
                        is_no_more: is_no_more
                    }));
                }
                p++;
            },
            complete: function() {
                is_loading = !1, that.setData({
                    is_loading: is_loading
                });
            }
        }));
    }
});