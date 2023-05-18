var app = getApp(), api = getApp().api;

Page({
    data: {
        status: 1,
        show_menu: !1,
        order_list: [],
        no_orders: !1,
        no_more_orders: !1
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
        }), that.loadOrderList(function() {
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
    onReachBottom: function() {},
    showMenu: function(t) {
        this.setData({
            show_menu: !this.data.show_menu
        });
    },
    loadOrderList: function(event) {
        var that = this, status = that.data.status, page = (that.data.current_page || 0) + 1, keyword = that.data.keyword || "";
        getApp().request({
            url: getApp().api.mch.order.list,
            data: {
                status: status,
                page: page,
                keyword: keyword
            },
            success: function(res) {
                0 === res.code && (1 != page || res.data.list && res.data.list.length || that.setData({
                    no_orders: !0
                }), res.data.list && res.data.list.length ? (that.data.order_list = that.data.order_list || [],
                    that.data.order_list = that.data.order_list.concat(res.data.list), that.setData({
                    order_list: that.data.order_list,
                    current_page: page
                })) : that.setData({
                    no_more_orders: !0
                }));
            },
            complete: function() {
                "function" == typeof event && event();
            }
        });
    },
    showSendModal: function(t) {
        this.setData({
            show_send_modal: !0,
            send_type: "express",
            order_index: t.currentTarget.dataset.index
        });
    },
    hideSendModal: function() {
        this.setData({
            show_send_modal: !1
        });
    },
    switchSendType: function(event) {
        var type = event.currentTarget.dataset.type;
        this.setData({
            send_type: type
        });
    },
    sendSubmit: function() {
        var that = this;
        if ("express" == that.data.send_type) return that.hideSendModal(), void getApp().core.navigateTo({
            url: "/mch/m/order-send/order-send?id=" + that.data.order_list[that.data.order_index].id
        });
        getApp().core.showModal({
            title: "提示",
            content: "无需物流方式订单将直接标记成已发货，确认操作？",
            success: function(res) {
                res.confirm && (getApp().core.showLoading({
                    title: "正在提交",
                    mask: !0
                }), getApp().request({
                    url: getApp().api.mch.order.send,
                    method: "post",
                    data: {
                        send_type: "none",
                        order_id: that.data.order_list[that.data.order_index].id
                    },
                    success: function(es) {
                        getApp().core.showModal({
                            title: "提示",
                            content: es.msg,
                            success: function(t) {
                                t.confirm && 0 == es.code && getApp().core.redirectTo({
                                    url: "/mch/m/order/order?status=2"
                                });
                            }
                        });
                    },
                    complete: function() {
                        getApp().core.hideLoading({
                            title: "正在提交",
                            mask: !0
                        });
                    }
                }));
            }
        });
    },
    showPicList: function(t) {
        getApp().core.previewImage({
            urls: this.data.order_list[t.currentTarget.dataset.index].pic_list,
            current: this.data.order_list[t.currentTarget.dataset.index].pic_list[t.currentTarget.dataset.pindex]
        });
    },
    refundPass: function(event) {
        var that = this, index = event.currentTarget.dataset.index, id = that.data.order_list[index].id, type = that.data.order_list[index].type;
        getApp().core.showModal({
            title: "提示",
            content: "确认同意" + (1 === type ? "退款？资金将原路返回！" : "换货？"),
            success: function(res) {
                res.confirm && (getApp().core.showLoading({
                    title: "正在处理",
                    mask: !0
                }), getApp().request({
                    url: getApp().api.mch.order.refund,
                    method: "post",
                    data: {
                        id: id,
                        action: "pass"
                    },
                    success: function(t) {
                        getApp().core.showModal({
                            title: "提示",
                            content: t.msg,
                            showCancel: !1,
                            success: function(t) {
                                getApp().core.redirectTo({
                                    url: "/" + that.route + "?" + getApp().helper.objectToUrlParams(that.options)
                                });
                            }
                        });
                    },
                    complete: function() {
                        getApp().core.hideLoading();
                    }
                }));
            }
        });
    },
    refundDeny: function(event) {
        var that = this, index = event.currentTarget.dataset.index, id = that.data.order_list[index].id;
        that.data.order_list[index].type;
        getApp().core.showModal({
            title: "提示",
            content: "确认拒绝？",
            success: function(t) {
                t.confirm && (getApp().core.showLoading({
                    title: "正在处理",
                    mask: !0
                }), getApp().request({
                    url: getApp().api.mch.order.refund,
                    method: "post",
                    data: {
                        id: id,
                        action: "deny"
                    },
                    success: function(t) {
                        getApp().core.showModal({
                            title: "提示",
                            content: t.msg,
                            showCancel: !1,
                            success: function(t) {
                                getApp().core.redirectTo({
                                    url: "/" + that.route + "?" + getApp().helper.objectToUrlParams(that.options)
                                });
                            }
                        });
                    },
                    complete: function() {
                        getApp().core.hideLoading();
                    }
                }));
            }
        });
    },
    searchSubmit: function(t) {
        var that = this, value = t.detail.value;
        that.setData({
            keyword: value,
            loading_more: !0,
            order_list: [],
            current_page: 0
        }), that.loadOrderList(function() {
            that.setData({
                loading_more: !1
            });
        });
    }
});