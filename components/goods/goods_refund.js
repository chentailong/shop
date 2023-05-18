var _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (t) {
    return typeof t;
} : function (t) {
    return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
};

module.exports = {
    currentPage: null,
    init: function (t) {
        var that = this;
        void 0 === (that.currentPage = t).switchTab && (t.switchTab = function (t) {
            that.switchTab(t);
        }), void 0 === t.descInput && (t.descInput = function (t) {
            that.descInput(t);
        }), void 0 === t.chooseImage && (t.chooseImage = function (t) {
            that.chooseImage(t);
        }), void 0 === t.deleteImage && (t.deleteImage = function (t) {
            that.deleteImage(t);
        }), void 0 === t.refundSubmit && (t.refundSubmit = function (t) {
            that.refundSubmit(t);
        });
    },
    switchTab: function (t) {
        var currentPage = this.currentPage;
        1 == t.currentTarget.dataset.id ? currentPage.setData({
            switch_tab_1: "active",
            switch_tab_2: ""
        }) : currentPage.setData({
            switch_tab_1: "",
            switch_tab_2: "active"
        });
    },
    descInput: function (t) {
        var currentPage = this.currentPage, type = t.currentTarget.dataset.type, value = t.detail.value;
        if (1 == type) {
            var refund_data_1 = currentPage.data.refund_data_1;
            refund_data_1.desc = value, currentPage.setData({
                refund_data_1: refund_data_1
            });
        }
        if (2 == type) {
            var refund_data_2 = currentPage.data.refund_data_2;
            refund_data_2.desc = value, currentPage.setData({
                refund_data_2: refund_data_2
            });
        }
    },
    chooseImage: function (t) {
        var currentPage = this.currentPage, type = t.currentTarget.dataset.type;
        if (1 == type) {
            var refund_data_1 = currentPage.data.refund_data_1, pic_list = 0;
            refund_data_1.pic_list && (pic_list = refund_data_1.pic_list.length || 0);
            var count = 6 - pic_list;
            getApp().core.chooseImage({
                count: count,
                success: function (t) {
                    refund_data_1.pic_list || (refund_data_1.pic_list = []), refund_data_1.pic_list = refund_data_1.pic_list.concat(t.tempFilePaths),
                        currentPage.setData({
                            refund_data_1: refund_data_1
                        });
                }
            });
        }
        if (2 == type) {
            var refund_data_2 = currentPage.data.refund_data_2;
            pic_list = 0;
            refund_data_2.pic_list && (pic_list = refund_data_2.pic_list.length || 0);
            count = 6 - pic_list;
            getApp().core.chooseImage({
                count: count,
                success: function (t) {
                    refund_data_2.pic_list || (refund_data_2.pic_list = []), refund_data_2.pic_list = refund_data_2.pic_list.concat(t.tempFilePaths),
                        currentPage.setData({
                            refund_data_2: refund_data_2
                        });
                }
            });
        }
    },
    deleteImage: function (t) {
        var currentPage = this.currentPage, type = t.currentTarget.dataset.type, index = t.currentTarget.dataset.index;
        if (1 == type) {
            var refund_data_1 = currentPage.data.refund_data_1;
            refund_data_1.pic_list.splice(index, 1), currentPage.setData({
                refund_data_1: refund_data_1
            });
        }
        if (2 == type) {
            var refund_data_2 = currentPage.data.refund_data_2;
            refund_data_2.pic_list.splice(index, 1), currentPage.setData({
                refund_data_2: refund_data_2
            });
        }
    },

    refundSubmit: function (t) {
        var currentPage = this.currentPage, type = t.currentTarget.dataset.type, formId = t.detail.formId,
            pic_list = [], n = 0,
            pageType = currentPage.data.pageType, refund = getApp().api.order.refund, url = "", orderType = "";
        if ("STORE" === pageType) url = "/pages/order/order?status=4", orderType = "STORE"; else if ("PINTUAN" === pageType) url = "/pages/pt/order/order?status=4",
            orderType = "PINTUAN"; else {
            if ("MIAOSHA" !== pageType) return void getApp().core.showModal({
                title: "提示",
                content: "pageType变量未定义或变量值不是预期的"
            });
            url = "/pages/miaosha/order/order?status=4", orderType = "MIAOSHA";
        }
        if (1 == type) {
            var p = function () {
                var submit = function () {
                    getApp().core.showLoading({
                        title: "正在提交",
                        mask: !0
                    }), getApp().request({
                        url: refund,
                        method: "post",
                        data: {
                            type: 1,
                            order_detail_id: currentPage.data.goods.order_detail_id,
                            desc: u,
                            pic_list: JSON.stringify(pic_list),
                            form_id: formId,
                            orderType: orderType
                        },
                        success: function (t) {
                            getApp().core.hideLoading(), 0 == t.code && getApp().core.showModal({
                                title: "提示",
                                content: t.msg,
                                showCancel: !1,
                                success: function (t) {
                                    t.confirm && getApp().core.redirectTo({
                                        url: url
                                    });
                                }
                            }), 1 === t.code && getApp().core.showModal({
                                title: "提示",
                                content: t.msg,
                                showCancel: !1,
                                success: function (t) {
                                    t.confirm && getApp().core.navigateBack({
                                        delta: 2
                                    });
                                }
                            });
                        }
                    });
                };
                if (0 == (u = currentPage.data.refund_data_1.desc || "").length) return getApp().core.showToast({
                    title: "请填写退款原因",
                    image: "/images/icon-warning.png"
                }), {
                    v: void 0
                };
                if (currentPage.data.refund_data_1.pic_list && 0 < currentPage.data.refund_data_1.pic_list.length) for (l in getApp().core.showLoading({
                    title: "正在上传图片",
                    mask: !0
                }), currentPage.data.refund_data_1.pic_list) !function (e) {
                    getApp().core.uploadFile({
                        url: getApp().api.default.upload_image,
                        filePath: currentPage.data.refund_data_1.pic_list[e],
                        name: "image",
                        success: function (t) {
                        },
                        complete: function (t) {
                            n++, 200 == t.statusCode && 0 == (t = JSON.parse(t.data)).code && (pic_list[e] = t.data.url),
                            n == currentPage.data.refund_data_1.pic_list.length && (getApp().core.hideLoading(), submit());
                        }
                    });
                }(l); else submit();
            }();
            if ("object" === (void 0 === p ? "undefined" : _typeof(p))) return p.v;
        }
        if (2 == type) {
            var u, l, f = function () {
                var a = function () {
                    getApp().core.showLoading({
                        title: "正在提交",
                        mask: !0
                    }), getApp().request({
                        url: refund,
                        method: "post",
                        data: {
                            type: 2,
                            order_detail_id: currentPage.data.goods.order_detail_id,
                            desc: u,
                            pic_list: JSON.stringify(pic_list)
                        },
                        success: function (t) {
                            getApp().core.hideLoading(), 0 == t.code && getApp().core.showModal({
                                title: "提示",
                                content: t.msg,
                                showCancel: !1,
                                success: function (t) {
                                    t.confirm && getApp().core.redirectTo({
                                        url: url
                                    });
                                }
                            }), 1 == t.code && getApp().core.showModal({
                                title: "提示",
                                content: t.msg,
                                showCancel: !1,
                                success: function (t) {
                                    t.confirm && getApp().core.navigateBack({
                                        delta: 2
                                    });
                                }
                            });
                        }
                    });
                };
                if (0 == (u = currentPage.data.refund_data_2.desc || "").length) return getApp().core.showToast({
                    title: "请填写换货说明",
                    image: "/images/icon-warning.png"
                }), {
                    v: void 0
                };
                if (pic_list = [], n = 0, currentPage.data.refund_data_2.pic_list && 0 < currentPage.data.refund_data_2.pic_list.length) for (l in getApp().core.showLoading({
                    title: "正在上传图片",
                    mask: !0
                }), currentPage.data.refund_data_2.pic_list) !function (e) {
                    getApp().core.uploadFile({
                        url: getApp().api.default.upload_image,
                        filePath: currentPage.data.refund_data_2.pic_list[e],
                        name: "image",
                        success: function (t) {
                        },
                        complete: function (t) {
                            n++, 200 == t.statusCode && 0 == (t = JSON.parse(t.data)).code && (pic_list[e] = t.data.url),
                            n == currentPage.data.refund_data_2.pic_list.length && (getApp().core.hideLoading(), a());
                        }
                    });
                }(l); else a();
            }();
            if ("object" === (void 0 === f ? "undefined" : _typeof(f))) return f.v;
        }
    }
};