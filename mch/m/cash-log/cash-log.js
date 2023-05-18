var app = getApp(), api = getApp().api;

Page({
    data: {
        list: [],
        current_page: 0,
        loading: !1,
        no_more: !1
    },
    getList: function () {
        var that = this;
        if (!that.data.loading && !that.data.no_more) {
            that.setData({
                loading: !0
            });
            var page = that.data.current_page + 1;
            getApp().request({
                url: getApp().api.mch.user.cash_log,
                data: {
                    page: page,
                    year: "",
                    month: ""
                },
                success: function (t) {
                    0 == t.code && (t.data.list && t.data.list.length ? (that.data.list = that.data.list.concat(t.data.list),
                        that.setData({
                            list: that.data.list,
                            current_page: page
                        })) : that.setData({
                        no_more: !0
                    })), 1 == t.code && getApp().core.showModal({
                        title: "提示",
                        content: t.msg,
                        showCancel: !1
                    });
                },
                complete: function (t) {
                    that.setData({
                        loading: !1
                    });
                }
            });
        }
    },
    onLoad: function (t) {
        wx.showShareMenu({
            withShareTicket: true,
            menus: ['shareAppMessage', 'shareTimeline']
        })
        getApp().page.onLoad(this, t);
        this.getList();
    },
    onReady: function () {
        getApp().page.onReady(this);
    },
    onShow: function () {
        getApp().page.onShow(this);
    },
    onHide: function () {
        getApp().page.onHide(this);
    },
    onUnload: function () {
        getApp().page.onUnload(this);
    },
    onPullDownRefresh: function () {
    },
    onReachBottom: function () {
        this.getList();
    }
});