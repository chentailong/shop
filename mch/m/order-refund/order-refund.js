var app = getApp(), api = getApp().api;

Page({
    data: {},
    onLoad: function (options) {
        wx.showShareMenu({
            withShareTicket: true,
            menus: ['shareAppMessage', 'shareTimeline']
        })
        getApp().page.onLoad(this, options);
        var that = this;
        that.setData({
            id: options.id || 0
        }), getApp().core.showLoading({
            title: "加载中",
            mask: !0
        }), getApp().request({
            url: getApp().api.mch.order.refund_detail,
            data: {
                id: that.data.id
            },
            success: function (res) {
                0 === res.code && that.setData(res.data), 1 === res.code && getApp().core.showModal({
                    title: "提示",
                    content: res.msg,
                    showCancel: !1
                });
            },
            complete: function (e) {
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
    showPicList: function (e) {
        getApp().core.previewImage({
            urls: this.data.pic_list,
            current: this.data.pic_list[e.currentTarget.dataset.pindex]
        });
    },
    refundPass: function (event) {
        var that = this, id = that.data.id, type = that.data.type;
        getApp().core.showModal({
            title: "提示",
            content: "确认同意" + (1 == type ? "退款？资金将原路返回！" : "换货？"),
            success: function (res) {
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
                    success: function (res) {
                        getApp().core.showModal({
                            title: "提示",
                            content: res.msg,
                            showCancel: !1,
                            success: function (e) {
                                getApp().core.redirectTo({
                                    url: "/" + that.route + "?" + getApp().helper.objectToUrlParams(that.options)
                                });
                            }
                        });
                    },
                    complete: function () {
                        getApp().core.hideLoading();
                    }
                }));
            }
        });
    },
    refundDeny: function (e) {
        var that = this, id = that.data.id;
        getApp().core.showModal({
            title: "提示",
            content: "确认拒绝？",
            success: function (res) {
                res.confirm && (getApp().core.showLoading({
                    title: "正在处理",
                    mask: !0
                }), getApp().request({
                    url: getApp().api.mch.order.refund,
                    method: "post",
                    data: {
                        id: id,
                        action: "deny"
                    },
                    success: function (res) {
                        getApp().core.showModal({
                            title: "提示",
                            content: res.msg,
                            showCancel: !1,
                            success: function (e) {
                                getApp().core.redirectTo({
                                    url: "/" + that.route + "?" + getApp().helper.objectToUrlParams(that.options)
                                });
                            }
                        });
                    },
                    complete: function () {
                        getApp().core.hideLoading();
                    }
                }));
            }
        });
    }
});