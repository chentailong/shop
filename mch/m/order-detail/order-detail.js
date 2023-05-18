var app = getApp(), api = getApp().api;

Page({
    data: {
        show_edit_modal: !1,
        order_sub_price: "",
        order_sub_price_mode: !0,
        order_add_price: "",
        order_add_price_mode: !1,
        show_send_modal: !1,
        send_type: "express",
        order: null
    },
    onLoad: function (options) {
        wx.showShareMenu({
            withShareTicket: true,
            menus: ['shareAppMessage', 'shareTimeline']
        })
        getApp().page.onLoad(this, options);
        var that = this;
        getApp().core.showLoading({
            title: "正在加载",
            mask: !0
        }), getApp().request({
            url: getApp().api.mch.order.detail,
            data: {
                id: options.id
            },
            success: function (res) {
                0 === res.code ? that.setData({
                    order: res.data.order
                }) : getApp().core.showModal({
                    title: "提示",
                    content: res.msg,
                    showCancel: !1,
                    success: function (e) {
                        e.confirm && getApp().core.navigateBack();
                    }
                });
            },
            complete: function () {
                getApp().core.hideLoading();
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
    },
    onReachBottom: function () {
    },
    copyUserAddress: function () {
        var that = this;
        getApp().core.setClipboardData({
            data: "收货人:" + that.data.order.username + ",联系电话:" + that.data.order.mobile + ",收货地址:" + that.data.order.address,
            success: function (e) {
                getApp().core.getClipboardData({
                    success: function (e) {
                        that.showToast({
                            title: "已复制收货信息"
                        });
                    }
                });
            }
        });
    },
    showEditModal: function (e) {
        this.setData({
            show_edit_modal: !0,
            order_sub_price: "",
            order_add_price: "",
            order_sub_price_mode: !0,
            order_add_price_mode: !1
        });
    },
    hideEditModal: function (e) {
        this.setData({
            show_edit_modal: !1
        });
    },
    tabSwitch: function (e) {
        var tab = e.currentTarget.dataset.tab;
        "order_sub_price_mode" == tab && this.setData({
            order_sub_price_mode: !0,
            order_add_price_mode: !1
        }), "order_add_price_mode" == tab && this.setData({
            order_sub_price_mode: !1,
            order_add_price_mode: !0
        });
    },
    subPriceInput: function (e) {
        this.setData({
            order_sub_price: e.detail.value
        });
    },
    subPriceBlur: function (e) {
        var value = parseFloat(e.detail.value);
        value = isNaN(value) ? "" : value <= 0 ? "" : value.toFixed(2), this.setData({
            order_sub_price: value
        });
    },
    addPriceInput: function (event) {
        this.setData({
            order_add_price: event.detail.value
        });
    },
    addPriceBlur: function (e) {
        var value = parseFloat(e.detail.value);
        value = isNaN(value) ? "" : value <= 0 ? "" : value.toFixed(2), this.setData({
            order_add_price: value
        });
    },
    editPriceSubmit: function () {
        var that = this, type = that.data.order_sub_price_mode ? "sub" : "add";
        getApp().core.showLoading({
            mask: !0,
            title: "正在处理"
        }), getApp().request({
            url: getApp().api.mch.order.edit_price,
            method: "post",
            data: {
                order_id: that.data.order.id,
                type: type,
                price: "sub" === type ? that.data.order_sub_price : that.data.order_add_price
            },
            success: function (t) {
                getApp().core.showModal({
                    title: "提示",
                    content: t.msg,
                    showCancel: !1,
                    success: function (res) {
                        res.confirm && 0 === t.code && getApp().core.redirectTo({
                            url: "/mch/m/order-detail/order-detail?id=" + that.data.order.id
                        });
                    }
                });
            },
            complete: function () {
                getApp().core.hideLoading();
            }
        });
    },
    showSendModal: function () {
        this.setData({
            show_send_modal: !0,
            send_type: "express"
        });
    },
    hideSendModal: function () {
        this.setData({
            show_send_modal: !1
        });
    },
    switchSendType: function (event) {
        var type = event.currentTarget.dataset.type;
        this.setData({
            send_type: type
        });
    },
    sendSubmit: function () {
        var that = this;
        if ("express" === that.data.send_type) return that.hideSendModal(), void getApp().core.navigateTo({
            url: "/mch/m/order-send/order-send?id=" + that.data.order.id
        });
        getApp().core.showModal({
            title: "提示",
            content: "无需物流方式订单将直接标记成已发货，确认操作？",
            success: function (e) {
                e.confirm && (getApp().core.showLoading({
                    title: "正在提交",
                    mask: !0
                }), getApp().request({
                    url: getApp().api.mch.order.send,
                    method: "post",
                    data: {
                        send_type: "none",
                        order_id: that.data.order.id
                    },
                    success: function (t) {
                        getApp().core.showModal({
                            title: "提示",
                            content: t.msg,
                            success: function (res) {
                                res.confirm && 0 === t.code && getApp().core.redirectTo({
                                    url: "/mch/m/order-detail/order-detail?id=" + that.data.order.id
                                });
                            }
                        });
                    },
                    complete: function () {
                        getApp().core.hideLoading({
                            title: "正在提交",
                            mask: !0
                        });
                    }
                }));
            }
        });
    }
});