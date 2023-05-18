Page({
    data: {
        load_more_count: 0,
        last_load_more_time: 0,
        is_loading: !1,
        loading_class: "",
        cat_id: !1,
        keyword: !1,
        page: 1,
        limit: 20,
        pageCount: 0,
        goods_list: [],
        show_history: !0,
        show_result: !1,
        history_list: [],
        is_search: !0,
        is_show: !1,
        cats: [],
        default_cat: []
    },
    onLoad: function(options) {
        wx.showShareMenu({
            withShareTicket: true,
            menus: ['shareAppMessage', 'shareTimeline']
        })
        getApp().page.onLoad(this, options), this.cats();
    },
    onReady: function(t) {
        getApp().page.onReady(this);
    },
    onShow: function(t) {
        getApp().page.onShow(this);
        this.setData({
            history_list: this.getHistoryList(!0)
        });
    },
    onReachBottom: function() {
        getApp().page.onReachBottom(this);
        var that = this, page = that.data.page + 1;
        page <= that.data.pageCount && (that.setData({
            page: page
        }), that.getGoodsList());
    },
    cats: function() {
        var that = this;
        getApp().request({
            url: getApp().api.default.cats,
            success: function(res) {
                0 === res.code && that.setData({
                    cats: res.data.list,
                    default_cat: res.data.default_cat
                });
            }
        });
    },
    change_cat: function(t) {
        var cats = this.data.cats, id = t.currentTarget.dataset.id;
        for (var s in cats) if (id === cats[s].id) var default_cat = {
            id: cats[s].id,
            name: cats[s].name,
            key: cats[s].key,
            url: cats[s].url
        };
        this.setData({
            default_cat: default_cat
        });
    },
    pullDown: function() {
        var that = this, cats = that.data.cats, default_cat = that.data.default_cat;
        for (var s in cats) cats[s].id === default_cat.id ? cats[s].is_active = !0 : cats[s].is_active = !1;
        that.setData({
            is_show: !that.data.is_show,
            cats: cats
        });
    },
    inputFocus: function() {
        this.setData({
            show_history: !0,
            show_result: !1
        });
    },
    inputBlur: function() {
        var that = this;
        0 < that.data.goods_list.length && setTimeout(function() {
            that.setData({
                show_history: !1,
                show_result: !0
            });
        }, 300);
    },
    inputConfirm: function(t) {
        var that = this, value = t.detail.value;
        0 != value.length && (that.setData({
            page: 1,
            keyword: value,
            goods_list: []
        }), that.setHistory(value), that.getGoodsList());
    },
    searchCancel: function() {
        getApp().core.navigateBack({
            delta: 1
        });
    },
    historyClick: function(t) {
        var value = t.currentTarget.dataset.value;
        0 != value.length && (this.setData({
            page: 1,
            keyword: value,
            goods_list: []
        }), this.getGoodsList());
    },
    getGoodsList: function() {
        var that = this;
        that.setData({
            show_history: !1,
            show_result: !0,
            is_search: !0
        });
        var data = {};
        that.data.cat_id && (data.cat_id = that.data.cat_id, that.setActiveCat(data.cat_id)), that.data.keyword && (data.keyword = that.data.keyword),
            data.defaultCat = JSON.stringify(that.data.default_cat), data.page = that.data.page, that.showLoadingBar(),
            that.is_loading = !0, getApp().request({
            url: getApp().api.default.search,
            data: data,
            success: function(res) {
                if (0 === res.code) {
                    var list = that.data.goods_list.concat(res.data.list);
                    that.setData({
                        goods_list: list,
                        pageCount: res.data.page_count
                    }), 0 === res.data.list.length ? that.setData({
                        is_search: !1
                    }) : that.setData({
                        is_search: !0
                    });
                }
                res.code;
            },
            complete: function() {
                that.hideLoadingBar(), that.is_loading = !1;
            }
        });
    },
    getHistoryList: function(t) {
        t = t || !1;
        var a = getApp().core.getStorageSync(getApp().const.SEARCH_HISTORY_LIST);
        if (!a) return [];
        if (!t) return a;
        for (var e = [], s = a.length - 1; 0 <= s; s--) e.push(a[s]);
        return e;
    },
    setHistory: function(t) {
        var a = this.getHistoryList();
        for (var e in a.push({
            keyword: t
        }), a) {
            if (a.length <= 20) break;
            a.splice(e, 1);
        }
        getApp().core.setStorageSync(getApp().const.SEARCH_HISTORY_LIST, a);
    },
    getMoreGoodsList: function() {
        var that = this, data = {};
        that.data.cat_id && (data.cat_id = that.data.cat_id, that.setActiveCat(data.cat_id)), that.data.keyword && (data.keyword = that.data.keyword),
            data.page = that.data.page || 1, that.showLoadingMoreBar(), that.setData({
            is_loading: !0
        }), that.setData({
            load_more_count: that.data.load_more_count + 1
        }), data.page = that.data.page + 1, data.defaultCat = that.data.default_cat, that.setData({
            page: data.page
        }), data.defaultCat = JSON.stringify(that.data.default_cat), getApp().request({
            url: getApp().api.default.search,
            data: data,
            success: function(t) {
                if (0 == t.code) {
                    var goods_list = that.data.goods_list;
                    if (0 < t.data.list.length) {
                        for (var e in t.data.list) goods_list.push(t.data.list[e]);
                        that.setData({
                            goods_list: goods_list
                        });
                    } else that.setData({
                        page: data.page - 1
                    });
                }
                t.code;
            },
            complete: function() {
                that.setData({
                    is_loading: !1
                }), that.hideLoadingMoreBar();
            }
        });
    },
    showLoadingBar: function() {
        this.setData({
            loading_class: "active"
        });
    },
    hideLoadingBar: function() {
        this.setData({
            loading_class: ""
        });
    },
    showLoadingMoreBar: function() {
        this.setData({
            loading_more_active: "active"
        });
    },
    hideLoadingMoreBar: function() {
        this.setData({
            loading_more_active: ""
        });
    },
    deleteSearchHistory: function() {
        this.setData({
            history_list: null
        }), getApp().core.removeStorageSync(getApp().const.SEARCH_HISTORY_LIST);
    }
});