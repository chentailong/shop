module.exports = {
    currentPage: null,
    init: function(e) {
        var that = this;
        void 0 === (that.currentPage = e).viewImage && (e.viewImage = function(e) {
            that.viewImage(e);
        }), void 0 === e.copyinfo && (e.copyinfo = function(e) {
            that.copyinfo(e);
        }), void 0 === e.bindExpressPickerChange && (e.bindExpressPickerChange = function(e) {
            that.bindExpressPickerChange(e);
        }), void 0 === e.sendFormSubmit && (e.sendFormSubmit = function(e) {
            that.sendFormSubmit(e);
        });
    },
    viewImage: function(e) {
        var currentPage = this.currentPage, index = e.currentTarget.dataset.index;
        getApp().core.previewImage({
            current: currentPage.data.order_refund.refund_pic_list[index],
            urls: currentPage.data.order_refund.refund_pic_list
        });
    },
    copyinfo: function(e) {
        this.currentPage;
        getApp().core.setClipboardData({
            data: e.target.dataset.info,
            success: function(e) {
                getApp().core.showToast({
                    title: "复制成功！",
                    icon: "success",
                    duration: 2e3,
                    mask: !0
                });
            }
        });
    },
    bindExpressPickerChange: function(e) {
        this.currentPage.setData({
            express_index: e.detail.value
        });
    },
    sendFormSubmit: function(e) {
        var currentPage = this.currentPage, formId = e.detail.formId, order_refund = currentPage.data.order_refund, express_index = currentPage.data.express_index, express_no = e.detail.value.express_no, pageType = currentPage.data.pageType;
        getApp().core.showLoading({
            title: "正在提交",
            mask: !0
        });
        var url = "";
        if ("STORE" === pageType) url = "/pages/order-refund-detail/order-refund-detail?id=" + order_refund.order_refund_id; else if ("MIAOSHA" === pageType)
            url = "/pages/miaosha/order-refund-detail/order-refund-detail?id=" + order_refund.order_refund_id; else {
            if ("PINTUAN" !== pageType) return void getApp().core.showModal({
                title: "提示",
                content: "pageType变量未定义或变量值不是预期的"
            });
            url = "/pages/pt/order-refund-detail/order-refund-detail?id=" + order_refund.order_refund_id;
        }
        getApp().request({
            url: getApp().api.order.refund_send,
            method: "POST",
            data: {
                order_refund_id: order_refund.order_refund_id,
                express: null !== express_index ? order_refund.express_list[d].name : "",
                express_no: express_no,
                form_id: formId,
                orderType: pageType
            },
            success: function(r) {
                getApp().core.showModal({
                    title: "提示",
                    content: r.msg,
                    showCancel: !1,
                    success: function(e) {
                        0 == r.code && getApp().core.redirectTo({
                            url: url
                        });
                    }
                });
            },
            complete: function() {
                getApp().core.hideLoading();
            }
        });
    }
};