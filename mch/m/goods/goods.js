var app = getApp(), api = getApp().api;

Page({
    data: {
        status: 1,
        goods_list: [],
        no_goods: !1,
        no_more_goods: !1
    },
    onLoad: function(options) {
        wx.showShareMenu({
            withShareTicket: true,
            menus: ['shareAppMessage', 'shareTimeline']
        })
        getApp().page.onLoad(this, options);
        var that = this;
        that.setData({
            status: parseInt(options.status || 1),
            loading_more: !0
        }), that.loadGoodsList(function() {
            that.setData({
                loading_more: !1
            });
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
    onReachBottom: function(t) {
        var that = this;
        that.data.loading_more || (that.setData({
            loading_more: !0
        }), that.loadGoodsList(function() {
            that.setData({
                loading_more: !1
            });
        }));
    },
    searchSubmit: function(event) {
        var that = this, value = event.detail.value;
        that.setData({
            keyword: value,
            loading_more: !0,
            goods_list: [],
            current_page: 0
        }), that.loadGoodsList(function() {
            that.setData({
                loading_more: !1
            });
        });
    },
    loadGoodsList: function(t) {
        var that = this;
        if (that.data.no_goods || o.data.no_more_goods) "function" == typeof t && t(); else {
            var page = (that.data.current_page || 0) + 1;
            getApp().request({
                url: getApp().api.mch.goods.list,
                data: {
                    page: page,
                    status: that.data.status,
                    keyword: that.data.keyword || ""
                },
                success: function(res) {
                    0 == res.code && (1 != page || res.data.list && res.data.list.length || that.setData({
                        no_goods: !0
                    }), res.data.list && res.data.list.length ? (that.data.goods_list = that.data.goods_list || [],
                        that.data.goods_list = that.data.goods_list.concat(res.data.list), that.setData({
                        goods_list: that.data.goods_list,
                        current_page: page
                    })) : that.setData({
                        no_more_goods: !0
                    }));
                },
                complete: function() {
                    "function" == typeof t && t();
                }
            });
        }
    },
    showMoreAlert: function(event) {
        var that = this;
        setTimeout(function() {
            var index = event.currentTarget.dataset.index;
            that.data.goods_list[index].show_alert = !0, that.setData({
                goods_list: that.data.goods_list
            });
        }, 50);
    },
    hideMoreAlert: function(t) {
        var that = this, page = !1;
        for (var s in that.data.goods_list) that.data.goods_list[s].show_alert && (page = !(that.data.goods_list[s].show_alert = !1));
        page && setTimeout(function() {
            that.setData({
                goods_list: that.data.goods_list
            });
        }, 100);
    },
    setGoodsStatus: function(event) {
        var that = this, status = event.currentTarget.dataset.targetStatus, index = event.currentTarget.dataset.index;
        getApp().core.showLoading({
            title: "正在处理",
            mask: !0
        }), getApp().request({
            url: getApp().api.mch.goods.set_status,
            data: {
                id: that.data.goods_list[index].id,
                status: status
            },
            success: function(res) {
                0 == res.code && (that.data.goods_list[index].status = res.data.status, that.setData({
                    goods_list: that.data.goods_list
                })), that.showToast({
                    title: res.msg,
                    duration: 1500
                });
            },
            complete: function() {
                getApp().core.hideLoading();
            }
        });
    },
    goodsDelete: function(event) {
        var that = this, index = event.currentTarget.dataset.index;
        getApp().core.showModal({
            title: "警告",
            content: "确认删除该商品？",
            success: function(t) {
                t.confirm && (getApp().core.showLoading({
                    title: "正在处理",
                    mask: !0
                }), getApp().request({
                    url: getApp().api.mch.goods.delete,
                    data: {
                        id: that.data.goods_list[index].id
                    },
                    success: function(t) {
                        that.showToast({
                            title: t.msg
                        }), 0 == t.code && (that.data.goods_list.splice(index, 1), that.setData({
                            goods_list: that.data.goods_list
                        }));
                    },
                    complete: function() {
                        getApp().core.hideLoading();
                    }
                }));
            }
        });
    }
});