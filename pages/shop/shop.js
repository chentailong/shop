var is_loading = !1, is_no_more = !1;

Page({
    data: {
        page: 1,
        page_count: 1,
        longitude: "",
        latitude: "",
        score: [1, 2, 3, 4, 5],
        keyword: ""
    },
    onLoad: function (options) {
        wx.showShareMenu({
            withShareTicket: true,
            menus: ['shareAppMessage', 'shareTimeline']
        })
        getApp().page.onLoad(this, options);
        var that = this;
        options.user_id;
        getApp().core.getLocation({
            success: function (res) {
                that.setData({
                    longitude: res.longitude,
                    latitude: res.latitude
                });
            },
            complete: function () {
                that.loadData();
            }
        });
    },
    onShow: function () {
        getApp().page.onShow(this);
    },
    loadData: function () {
        var that = this;
        getApp().core.showLoading({
            title: "加载中"
        }), getApp().request({
            url: getApp().api.default.shop_list,
            method: "GET",
            data: {
                longitude: that.data.longitude,
                latitude: that.data.latitude
            },
            success: function (t) {
                0 == t.code && that.setData(t.data);
            },
            complete: function () {
                getApp().core.hideLoading();
            }
        });
    },
    onPullDownRefresh: function () {
        var that = this;
        that.setData({
            keyword: "",
            page: 1
        }), getApp().core.getLocation({
            success: function (res) {
                that.setData({
                    longitude: res.longitude,
                    latitude: res.latitude
                });
            },
            complete: function () {
                that.loadData(), getApp().core.stopPullDownRefresh();
            }
        });
    },
    onReachBottom: function () {
        var that = this;
        that.data.page >= that.data.page_count || that.loadMoreData();
    },
    loadMoreData: function () {
        var that = this, page = that.data.page;
        is_loading || (is_loading = !0, getApp().core.showLoading({
            title: "加载中"
        }), getApp().request({
            url: getApp().api.default.shop_list,
            method: "GET",
            data: {
                page: page,
                longitude: that.data.longitude,
                latitude: that.data.latitude
            },
            success: function (res) {
                if (0 === rest.code) {
                    var list = that.data.list.concat(res.data.list);
                    that.setData({
                        list: list,
                        page_count: res.data.page_count,
                        row_count: res.data.row_count,
                        page: page + 1
                    });
                }
            },
            complete: function () {
                getApp().core.hideLoading(), is_loading = !1;
            }
        }));
    },
    goto: function (e) {
        var that = this;
        "undefined" != typeof my ? that.location(e) : getApp().core.getSetting({
            success: function (t) {
                t.authSetting["scope.userLocation"] ? that.location(e) : getApp().getauth({
                    content: "需要获取您的地理位置授权，请到小程序设置中打开授权！",
                    cancel: !1,
                    author: "scope.userLocation",
                    success: function (t) {
                        t.authSetting["scope.userLocation"] && that.location(e);
                    }
                });
            }
        });
    },
    location: function (t) {
        var list = this.data.list, index = t.currentTarget.dataset.index;
        getApp().core.openLocation({
            latitude: parseFloat(list[index].latitude),
            longitude: parseFloat(list[index].longitude),
            name: list[index].name,
            address: list[index].address
        });
    },
    inputFocus: function (t) {
        this.setData({
            show: !0
        });
    },
    inputBlur: function (t) {
        this.setData({
            show: !1
        });
    },
    inputConfirm: function (t) {
        this.search();
    },
    input: function (t) {
        this.setData({
            keyword: t.detail.value
        });
    },
    search: function (t) {
        var that = this;
        getApp().core.showLoading({
            title: "搜索中"
        }), getApp().request({
            url: getApp().api.default.shop_list,
            method: "GET",
            data: {
                keyword: that.data.keyword,
                longitude: that.data.longitude,
                latitude: that.data.latitude
            },
            success: function (res) {
                0 === res.code && that.setData(res.data);
            },
            complete: function () {
                getApp().core.hideLoading();
            }
        });
    },
    go: function (t) {
        var index = t.currentTarget.dataset.index, list = this.data.list;
        getApp().core.navigateTo({
            url: "/pages/shop-detail/shop-detail?shop_id=" + list[index].id
        });
    },
    navigatorClick: function (event) {
        var open_type = event.currentTarget.dataset.open_type, url = event.currentTarget.dataset.url;
        return "wxapp" !== open_type || ((url = function (t) {
            var e = /([^&=]+)=([\w\W]*?)(&|$|#)/g, a = /^[^\?]+\?([\w\W]+)$/.exec(t), o = {};
            if (a && a[1]) for (var n, i = a[1]; null != (n = e.exec(i));) o[n[1]] = n[2];
            return o;
        }(url)).path = url.path ? decodeURIComponent(url.path) : "", getApp().core.navigateToMiniProgram({
            appId: url.appId,
            path: url.path,
            complete: function (t) {
            }
        }), !1);
    },
    onShareAppMessage: function (t) {
        return getApp().page.onShareAppMessage(this), {
            path: "/pages/shop/shop?user_id=" + getApp().core.getStorageSync(getApp().const.USER_INFO).id
        };
    }
});