var time = require("../commons/time.js"),
    app = getApp(), api = getApp().api,
    setIntval = null,
    is_loading = !1, is_no_more = !0;

Page({
    data: {
        show_more: !0,
        page: 1,
        show_modal: !1,
        show: !1,
        show_more_btn: !0,
        animationData: null,
        show_modal_a: !1
    },
    onLoad: function(res) {
        wx.showShareMenu({
            withShareTicket: true,
            menus: ['shareAppMessage', 'shareTimeline']
        })
        getApp().page.onLoad(this, res);
        var that = this;
        that.setData({
            order_id: res.order_id
        }), that.joinBargain(), time.init(that);
    },
    joinBargain: function() {
        var that = this;
        getApp().request({
            url: getApp().api.bargain.bargain,
            data: {
                order_id: that.data.order_id
            },
            success: function(t) {
                0 == t.code ? (that.getOrderInfo(), that.setData(t.data)) : (that.showToast({
                    title: t.msg
                }), getApp().core.hideLoading());
            }
        });
    },
    getOrderInfo: function() {
        var that = this;
        getApp().request({
            url: getApp().api.bargain.activity,
            data: {
                order_id: that.data.order_id,
                page: 1
            },
            success: function(t) {
                0 == t.code ? (that.setData(t.data), that.setData({
                    time_list: that.setTimeList(t.data.reset_time),
                    show: !0
                }), that.data.bargain_status && that.setData({
                    show_modal: !0
                }), that.setTimeOver(), is_no_more = !1, that.animationCr()) : that.showToast({
                    title: t.msg
                });
            },
            complete: function(t) {
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
        getApp().page.onUnload(this), clearInterval(setIntval), setIntval = null;
    },
    onShareAppMessage: function() {
        getApp().page.onShareAppMessage(this);
        var that = this;
        return {
            path: "/bargain/activity/activity?order_id=" + that.data.order_id + "&user_id=" + that.data.__user_info.id,
            success: function(t) {},
            title: that.data.share_title || null
        };
    },
    loadData: function() {
        var that = this;
        if (getApp().core.showLoading({
            title: "加载中"
        }), !is_loading) {
            is_loading = !0, getApp().core.showNavigationBarLoading();
            var page = that.data.page + 1;
            getApp().request({
                url: getApp().api.bargain.activity,
                data: {
                    order_id: that.data.order_id,
                    page: page
                },
                success: function(res) {
                    if (0 == res.code) {
                        var bargain_info = that.data.bargain_info;
                        bargain_info = bargain_info.concat(res.data.bargain_info), that.setData({
                            bargain_info: bargain_info,
                            page: page,
                            price: res.data.price,
                            money_per: res.data.money_per,
                            money_per_t: res.data.money_per_t
                        }), 0 == res.data.bargain_info.length && (is_no_more = !0, page -= 1, that.setData({
                            show_more_btn: !1,
                            show_more: !0,
                            page: page
                        }));
                    } else that.showToast({
                        title: res.msg
                    });
                },
                complete: function(t) {
                    getApp().core.hideLoading(), getApp().core.hideNavigationBarLoading(), is_loading = !1;
                }
            });
        }
    },
    showMore: function(t) {
        this.data.show_more_btn && (is_no_more = !1), is_no_more || this.loadData();
    },
    hideMore: function() {
        this.setData({
            show_more_btn: !0,
            show_more: !1
        });
    },
    orderSubmit: function() {
        var that = this;
        getApp().core.showLoading({
            title: "加载中"
        }), getApp().core.redirectTo({
            url: "/bargain/goods/goods?goods_id=" + that.data.goods_id
        });
    },
    close: function() {
        this.setData({
            show_modal: !1
        });
    },
    buyNow: function() {
        var list = [], goods_list = [];
        goods_list.push({
            bargain_order_id: this.data.order_id
        }), list.push({
            mch_id: 0,
            goods_list: goods_list
        }), getApp().core.showModal({
            title: "提示",
            content: "是否确认购买？",
            success: function(t) {
                t.confirm && getApp().core.redirectTo({
                    url: "/pages/new-order-submit/new-order-submit?mch_list=" + JSON.stringify(list)
                });
            }
        });
    },
    goToList: function() {
        getApp().core.redirectTo({
            url: "/bargain/list/list"
        });
    },
    animationCr: function() {
        var that = this;
        that.animationT(), setTimeout(function() {
            that.setData({
                show_modal_a: !0
            }), that.animationBig(), that.animationS();
        }, 800);
    },
    animationBig: function() {
        var create = getApp().core.createAnimation({
            duration: 500,
            transformOrigin: "50% 50%"
        }), that = this, e = 0;
        setInterval(function() {
            e % 2 == 0 ? create.scale(.9).step() : create.scale(1).step(), that.setData({
                animationData: create.export()
            }), 500 == ++e && (e = 0);
        }, 500);
    },
    animationS: function() {
        var create = getApp().core.createAnimation({
            duration: 500
        });
        create.width("512rpx").height("264rpx").step(), create.rotate(-2).step(), create.rotate(4).step(),
            create.rotate(-2).step(), create.rotate(0).step(), this.setData({
            animationDataHead: create.export()
        });
    },
    animationT: function() {
        var create = getApp().core.createAnimation({
            duration: 200
        });
        create.width("500rpx").height("500rpx").step(), this.setData({
            animationDataT: create.export()
        });
    }
});