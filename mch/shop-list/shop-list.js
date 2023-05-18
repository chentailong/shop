var app = getApp(), api = getApp().api;

Page({
    data: {
        cat_id: "",
        keyword: "",
        list: [],
        page: 1,
        no_more: !1,
        loading: !1
    },
    onLoad: function(options) {
        wx.showShareMenu({
            withShareTicket: true,
            menus: ['shareAppMessage', 'shareTimeline']
        })
        getApp().page.onLoad(this, options), options.cat_id && (this.data.cat_id = options.cat_id), this.loadShopList();
    },
    loadShopList: function(t) {
        var that = this;
        that.data.no_more ? "function" == typeof t && t() : that.data.loading || (that.setData({
            loading: !0
        }), getApp().request({
            url: getApp().api.mch.shop_list,
            data: {
                keyword: that.data.keyword,
                cat_id: that.data.cat_id,
                page: that.data.page
            },
            success: function(res) {
                if (0 == res.code) {
                    if (!res.data.list || !res.data.list.length) return void that.setData({
                        no_more: !0,
                        cat_list: res.data.cat_list
                    });
                    that.data.list || (that.data.list = []), that.data.list = that.data.list.concat(res.data.list),
                        that.setData({
                        list: that.data.list,
                        page: that.data.page + 1,
                        cat_list: res.data.cat_list
                    });
                }
            },
            complete: function() {
                that.setData({
                    loading: !1
                }), "function" == typeof t && t();
            }
        }));
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
    onReachBottom: function() {
        this.loadShopList();
    },
    searchSubmit: function(t) {
        var value = t.detail.value;
        this.setData({
            list: [],
            keyword: value,
            page: 1,
            no_more: !1
        }), this.loadShopList(function() {});
    },
    showCatList: function() {
        this.setData({
            show_cat_list: !0
        });
    },
    hideCatList: function() {
        this.setData({
            show_cat_list: !1
        });
    }
});