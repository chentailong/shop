module.exports = {
    currentPage: null,
    init: function(o) {
        var that = this;
        void 0 === (that.currentPage = o).showShareModal && (o.showShareModal = function(o) {
            that.showShareModal(o);
        }), void 0 === o.shareModalClose && (o.shareModalClose = function(o) {
            that.shareModalClose(o);
        }), void 0 === o.getGoodsQrcode && (o.getGoodsQrcode = function(o) {
            that.getGoodsQrcode(o);
        }), void 0 === o.goodsQrcodeClose && (o.goodsQrcodeClose = function(o) {
            that.goodsQrcodeClose(o);
        }), void 0 === o.saveGoodsQrcode && (o.saveGoodsQrcode = function(o) {
            that.saveGoodsQrcode(o);
        }), void 0 === o.goodsQrcodeClick && (o.goodsQrcodeClick = function(o) {
            that.goodsQrcodeClick(o);
        });
    },
    showShareModal: function() {
        this.currentPage.setData({
            share_modal_active: "active",
            no_scroll: !0
        });
    },
    shareModalClose: function() {
        this.currentPage.setData({
            share_modal_active: "",
            no_scroll: !1
        });
    },
    getGoodsQrcode: function() {
        var currentPage = this.currentPage;
        if (currentPage.setData({
            goods_qrcode_active: "active",
            share_modal_active: ""
        }), currentPage.data.goods_qrcode) return !0;
        var goods_qrcode = "", pageType = currentPage.data.pageType;
        if ("PINTUAN" === pageType) goods_qrcode = getApp().api.group.goods_qrcode; else if ("BOOK" === pageType) goods_qrcode = getApp().api.book.goods_qrcode; else if ("STORE" === pageType) goods_qrcode = getApp().api.default.goods_qrcode; else {
            if ("MIAOSHA" !== pageType) return void getApp().core.showModal({
                title: "提示",
                content: "pageType未定义或组件js未进行判断"
            });
            goods_qrcode = getApp().api.miaosha.goods_qrcode;
        }
        getApp().request({
            url: goods_qrcode,
            data: {
                goods_id: currentPage.data.id
            },
            success: function(o) {
                0 == o.code && currentPage.setData({
                    goods_qrcode: o.data.pic_url
                }), 1 == o.code && (currentPage.goodsQrcodeClose(), getApp().core.showModal({
                    title: "提示",
                    content: o.msg,
                    showCancel: !1,
                    success: function(o) {
                        o.confirm;
                    }
                }));
            }
        });
    },
    goodsQrcodeClose: function() {
        this.currentPage.setData({
            goods_qrcode_active: "",
            no_scroll: !1
        });
    },
    saveGoodsQrcode: function() {
        var currentPage = this.currentPage;
        getApp().core.saveImageToPhotosAlbum ? (getApp().core.showLoading({
            title: "正在保存图片",
            mask: !1
        }), getApp().core.downloadFile({
            url: currentPage.data.goods_qrcode,
            success: function(o) {
                getApp().core.showLoading({
                    title: "正在保存图片",
                    mask: !1
                }), getApp().core.saveImageToPhotosAlbum({
                    filePath: o.tempFilePath,
                    success: function() {
                        getApp().core.showModal({
                            title: "提示",
                            content: "商品海报保存成功",
                            showCancel: !1
                        });
                    },
                    fail: function(o) {
                        getApp().core.showModal({
                            title: "图片保存失败",
                            content: o.errMsg,
                            showCancel: !1
                        });
                    },
                    complete: function(o) {
                        getApp().core.hideLoading();
                    }
                });
            },
            fail: function(o) {
                getApp().core.showModal({
                    title: "图片下载失败",
                    content: o.errMsg + ";" + currentPage.data.goods_qrcode,
                    showCancel: !1
                });
            },
            complete: function(o) {
                getApp().core.hideLoading();
            }
        })) : getApp().core.showModal({
            title: "提示",
            content: "当前版本过低，无法使用该功能，请升级到最新版本后重试。",
            showCancel: !1
        });
    },
    goodsQrcodeClick: function(o) {
        var src = o.currentTarget.dataset.src;
        getApp().core.previewImage({
            urls: [ src ]
        });
    }
};