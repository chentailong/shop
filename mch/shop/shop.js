var utils = getApp().helper, app = getApp(), api = getApp().api;

Page({
    data: {
        tab: 1,
        sort: 1,
        coupon_list: [],
        copy: !1
    },
    onLoad: function (options) {
        wx.showShareMenu({
            withShareTicket: true,
            menus: ['shareAppMessage', 'shareTimeline']
        })
        getApp().page.onLoad(this, options);
        var that = this;
        if ("undefined" == typeof my) {
            if (options.scene) {
                var scene = decodeURIComponent(options.scene);
                scene && (scene = utils.scene_decode(scene)).mch_id && (options.mch_id = scene.mch_id);
            }
        } else if (null !== getApp().query) {
            var query = getApp().query;
            getApp().query = null, options.mch_id = query.mch_id;
        }
        that.setData({
            tab: options.tab || 1,
            sort: options.sort || 1,
            mch_id: options.mch_id || !1,
            cat_id: options.cat_id || ""
        }), that.data.mch_id || getApp().core.showModal({
            title: "提示",
            content: "店铺不存在！店铺id为空"
        }), setInterval(function () {
            that.onScroll();
        }, 40), this.getShopData();
    },
    quickNavigation: function () {
        this.setData({
            quick_icon: !this.data.quick_icon
        });
        this.data.store;
        var time = getApp().core.createAnimation({
            duration: 300,
            timingFunction: "ease-out"
        });
        this.data.quick_icon ? time.opacity(0).step() : time.translateY(-55).opacity(1).step(),
            this.setData({
                animationPlus: time.export()
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
    },
    onReachBottom: function () {
        this.getGoodsList();
    },
    onShareAppMessage: function () {
        getApp().page.onShareAppMessage(this);
        var that = this;
        return {
            path: "/mch/shop/shop?user_id=" + getApp().getUser().id + "&mch_id=" + that.data.mch_id,
            title: that.data.shop ? that.data.shop.name : "商城首页"
        };
    },
    kfuStart: function () {
        this.setData({
            copy: !0
        });
    },
    kfuEnd: function () {
        this.setData({
            copy: !1
        });
    },
    copyInfo: function (t) {
        getApp().core.setClipboardData({
            data: t.target.dataset.info,
            success: function (t) {
                getApp().core.showToast({
                    title: "复制成功！",
                    icon: "success",
                    duration: 2e3,
                    mask: !0
                });
            }
        });
    },
    callPhone: function (t) {
        getApp().core.makePhoneCall({
            phoneNumber: t.target.dataset.info
        });
    },
    onScroll: function (t) {
        var that = this;
        getApp().core.createSelectorQuery().selectViewport(".after-navber").scrollOffset(function (t) {
            var tab = 2 == that.data.tab ? 136.5333 : 85.3333;
            t.scrollTop >= tab ? that.setData({
                fixed: !0
            }) : that.setData({
                fixed: !1
            });
        }).exec();
    },
    getShopData: function () {
        var that = this, page = (that.data.current_page || 0) + 1, mch_id = "shop_data_mch_id_" + that.data.mch_id,
            mch = getApp().core.getStorageSync(mch_id);
        mch && that.setData({
            shop: mch.shop
        }), getApp().core.showNavigationBarLoading(), that.setData({
            loading: !0
        }), getApp().request({
            url: getApp().api.mch.shop,
            data: {
                mch_id: that.data.mch_id,
                tab: that.data.tab,
                sort: that.data.sort,
                page: page,
                cat_id: that.data.cat_id
            },
            success: function (res) {
                1 != res.code ? 0 == res.code && (that.setData({
                    shop: res.data.shop,
                    coupon_list: res.data.coupon_list,
                    hot_list: res.data.goods_list,
                    goods_list: res.data.goods_list,
                    new_list: res.data.new_list,
                    current_page: page,
                    cs_icon: res.data.shop.cs_icon
                }), getApp().core.setStorageSync(mch_id, res.data)) : getApp().core.showModal({
                    title: "提示",
                    content: res.msg,
                    showCancel: !1,
                    success: function (t) {
                        t.confirm && getApp().core.redirectTo({
                            url: "/pages/index/index"
                        });
                    }
                });
            },
            complete: function () {
                getApp().core.hideNavigationBarLoading(), that.setData({
                    loading: !1
                });
            }
        });
    },
    getGoodsList: function () {
        var that = this;
        if (3 != that.data.tab && !that.data.loading && !that.data.no_more) {
            that.setData({
                loading: !0
            });
            var page = (that.data.current_page || 0) + 1;
            getApp().request({
                url: getApp().api.mch.shop,
                data: {
                    mch_id: that.data.mch_id,
                    tab: that.data.tab,
                    sort: that.data.sort,
                    page: page,
                    cat_id: that.data.cat_id
                },
                success: function (t) {
                    0 == t.code && (1 == that.data.tab && (t.data.goods_list && t.data.goods_list.length ? (that.data.hot_list = that.data.hot_list.concat(t.data.goods_list),
                        that.setData({
                            hot_list: that.data.hot_list,
                            current_page: page
                        })) : that.setData({
                        no_more: !0
                    })), 2 == that.data.tab && (t.data.goods_list && t.data.goods_list.length ? (that.data.goods_list = that.data.goods_list.concat(t.data.goods_list),
                        that.setData({
                            goods_list: that.data.goods_list,
                            current_page: page
                        })) : that.setData({
                        no_more: !0
                    })));
                },
                complete: function () {
                    that.setData({
                        loading: !1
                    });
                }
            });
        }
    }
});