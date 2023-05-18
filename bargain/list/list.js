var app = getApp(), api = getApp().api, is_loading = !1, is_no_more = !0;

Page({
    data: {
        page: 1,
        naver: "list"
    },
    onLoad: function (options) {
        wx.showShareMenu({
            withShareTicket: true,
            menus: ['shareAppMessage', 'shareTimeline']
        })
        app.page.onLoad(this, options);
        void 0 !== options.order_id && getApp().core.navigateTo({
            url: "/bargain/activity/activity?order_id=" + options.order_id + "&user_id=" + options.user_id
        }), void 0 !== options.goods_id && getApp().core.navigateTo({
            url: "/bargain/goods/goods?goods_id=" + options.goods_id + "&user_id=" + options.user_id
        }), this.loadDataFirst(options);
    },
    loadDataFirst: function (t) {
        var that = this;
        getApp().core.showLoading({
            title: "加载中"
        }), getApp().request({
            url: getApp().api.bargain.index,
            type: "get",
            success: function (res) {
                0 == res.code && (that.setData(res.data), that.setData({
                    page: 2
                }), 0 < res.data.goods_list.length && (is_no_more = !1));
            },
            complete: function (o) {
                void 0 === t.order_id && getApp().core.hideLoading(), getApp().core.stopPullDownRefresh();
            }
        });
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
        this.loadDataFirst({});
    },
    onReachBottom: function () {
        is_no_more || this.loadData();
    },
    loadData: function () {
        if (!is_loading) {
            is_loading = !0, getApp().core.showLoading({
                title: "加载中"
            });
            var that = this, page = that.data.page;
            app.request({
                url: api.bargain.index,
                data: {
                    page: page
                },
                success: function (o) {
                    if (0 == o.code) {
                        var t = that.data.goods_list;
                        0 == o.data.goods_list.length && (is_no_more = !0), t = t.concat(o.data.goods_list),
                            that.setData({
                                goods_list: t,
                                page: page + 1
                            });
                    } else that.showToast({
                        title: o.msg
                    });
                },
                complete: function (o) {
                    getApp().core.hideLoading(), is_loading = !1;
                }
            });
        }
    },
    goToGoods: function (res) {
        var index = res.currentTarget.dataset.index;
        getApp().core.navigateTo({
            url: "/bargain/goods/goods?goods_id=" + index
        });
    },
    onShareAppMessage: function () {
        getApp().page.onShareAppMessage(this);
        return {
            path: "/bargain/list/list?user_id=" + this.data.__user_info.id,
            success: function (o) {
            }
        };
    }
});