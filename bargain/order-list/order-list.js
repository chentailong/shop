var app = getApp(), api = getApp().api, is_loading = !1, is_no_more = !0, intval = null;

Page({
    data: {
        naver: "order",
        status: -1,
        intval: [],
        page: 1
    },
    onLoad: function (res) {
        wx.showShareMenu({
            withShareTicket: true,
            menus: ['shareAppMessage', 'shareTimeline']
        })
        getApp().page.onLoad(this, res);
        null == res.status && (res.status = -1), this.setData(res), this.getList();
    },
    getList: function () {
        var that = this;
        getApp().core.showLoading({
            title: "加载中"
        }), getApp().request({
            url: getApp().api.bargain.order_list,
            data: {
                status: that.data.status || -1
            },
            success: function (t) {
                0 == t.code ? (that.setData(t.data), that.setData({
                    page: 1
                }), that.getTimeList()) : that.showLoading({
                    title: t.msg
                });
            },
            complete: function (t) {
                getApp().core.hideLoading(), is_no_more = !1;
            }
        });
    },
    getTimeList: function () {
        clearInterval(intval);
        var that = this, list = that.data.list;
        intval = setInterval(function () {
            for (var t in list) if (0 < list[t].reset_time) {
                var reset_time = list[t].reset_time - 1, time_list = that.setTimeList(reset_time);
                list[t].reset_time = reset_time, list[t].time_list = time_list;
            }
            that.setData({
                list: list
            });
        }, 1e3);
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
    onReachBottom: function () {
        is_no_more || this.loadData();
    },
    loadData: function () {
        var that = this;
        if (!is_loading) {
            is_loading = !0, getApp().core.showLoading({
                title: "加载中"
            });
            var page = that.data.page + 1;
            getApp().request({
                url: getApp().api.bargain.order_list,
                data: {
                    status: that.data.status,
                    page: page
                },
                success: function (t) {
                    if (0 == t.code) {
                        var list = that.data.list.concat(t.data.list);
                        that.setData({
                            list: list,
                            page: page
                        }), 0 == t.data.list.length && (is_no_more = !0), that.getTimeList();
                    } else that.showLoading({
                        title: t.msg
                    });
                },
                complete: function (t) {
                    getApp().core.hideLoading(), is_loading = !0;
                }
            });
        }
    },
    submit: function (res) {
        var list = [], goods_list = [];
        goods_list.push({
            bargain_order_id: res.currentTarget.dataset.index
        }), list.push({
            mch_id: 0,
            goods_list: goods_list
        }), getApp().core.navigateTo({
            url: "/pages/new-order-submit/new-order-submit?mch_list=" + JSON.stringify(list)
        });
    }
});