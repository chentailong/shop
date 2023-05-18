var pageNum = 1;

Page({
    data: {
        history_show: !1,
        search_val: "",
        list: [],
        history_info: [],
        show_loading_bar: !1,
        emptyGoods: !1,
        newSearch: !0
    },
    onLoad: function(t) {
        wx.showShareMenu({
            withShareTicket: true,
            menus: ['shareAppMessage', 'shareTimeline']
        })
        getApp().page.onLoad(this, t);
    },
    onReady: function(t) {
        getApp().page.onReady(this);
    },
    onShow: function(t) {
        getApp().page.onShow(this);
        var that = this;
        getApp().core.getStorage({
            key: "history_info",
            success: function(res) {
                0 < res.data.length && that.setData({
                    history_info: res.data,
                    history_show: !0
                });
            }
        });
    },
    onHide: function(t) {
        getApp().page.onHide(this);
    },
    onUnload: function(t) {
        getApp().page.onUnload(this);
    },
    onPullDownRefresh: function(t) {
        getApp().page.onPullDownRefresh(this);
    },
    onReachBottom: function(t) {
        getApp().page.onReachBottom(this);
        var that = this;
        that.data.emptyGoods || (that.data.page_count <= pageNum && that.setData({
            emptyGoods: !0
        }), pageNum++, that.getSearchGoods());
    },
    toSearch: function(t) {
        var value = t.detail.value, that = this;
        if (value) {
            var history_info = that.data.history_info;
            for (var s in history_info.unshift(value), history_info) {
                if (history_info.length <= 20) break;
                history_info.splice(value, 1);
            }
            getApp().core.setStorageSync(getApp().const.HISTORY_INFO, history_info), that.setData({
                history_info: history_info,
                history_show: !1,
                keyword: value,
                list: []
            }), that.getSearchGoods();
        }
    },
    cancelSearchValue: function(t) {
        getApp().core.navigateBack({
            delta: 1
        });
    },
    newSearch: function(t) {
        var history_show = !1;
        0 < this.data.history_info.length && (history_show = !0), pageNum = 1, this.setData({
            history_show: history_show,
            list: [],
            newSearch: [],
            emptyGoods: !1
        });
    },
    clearHistoryInfo: function(t) {
        var history_info = [];
        getApp().core.setStorageSync(getApp().const.HISTORY_INFO, history_info), this.setData({
            history_info: history_info,
            history_show: !1
        });
    },
    getSearchGoods: function() {
        var that = this, keyword = that.data.keyword;
        keyword && (that.setData({
            show_loading_bar: !0
        }), getApp().request({
            url: getApp().api.group.search,
            data: {
                keyword: keyword,
                page: pageNum
            },
            success: function(res) {
                if (0 === res.code) {
                    if (that.data.newSearch) var list = res.data.list; else list = that.data.list.concat(res.data.list);
                    that.setData({
                        list: list,
                        page_count: res.data.page_count,
                        emptyGoods: !0,
                        show_loading_bar: !1
                    }), res.data.page_count > pageNum && that.setData({
                        newSearch: !1,
                        emptyGoods: !1
                    });
                }
            },
            complete: function() {}
        }));
    },
    historyItem: function(t) {
        var keyword = t.currentTarget.dataset.keyword;
        this.setData({
            keyword: keyword,
            history_show: !1
        }), this.getSearchGoods();
    }
});