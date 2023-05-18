var WxParse = require("./../../wxParse/wxParse.js");

Page({
    data: {},
    onLoad: function(options) {
        wx.showShareMenu({
            withShareTicket: true,
            menus: ['shareAppMessage', 'shareTimeline']
        })
        getApp().page.onLoad(this, options);
        var that = this;
        if ("undefined" == typeof my) {
            var scene = decodeURIComponent(options.scene);
            if (void 0 !== scene) {
                var scene_decode = getApp().helper.scene_decode(scene);
                scene_decode.uid && scene_decode.gid && (options.id = scene_decode.gid);
            }
        } else if (null !== getApp().query) {
            var query = app.query;
            getApp().query = null, options.id = query.gid;
        }
        getApp().request({
            url: getApp().api.default.topic,
            data: {
                id: options.id
            },
            success: function(res) {
                0 === res.code ? (that.setData(res.data), WxParse.wxParse("content", "html", res.data.content, that)) : getApp().core.showModal({
                    title: "提示",
                    content: res.msg,
                    showCancel: !1,
                    success: function(e) {
                        e.confirm && getApp().core.redirectTo({
                            url: "/pages/index/index"
                        });
                    }
                });
            }
        });
    },
    wxParseTagATap: function(url) {
        if (url.currentTarget.dataset.goods) {
            var src = url.currentTarget.dataset.src || !1;
            if (!src) return;
            getApp().core.navigateTo({
                url: src
            });
        }
    },
    quickNavigation: function() {
        this.setData({
            quick_icon: !this.data.quick_icon
        });
        var animation = getApp().core.createAnimation({
            duration: 300,
            timingFunction: "ease-out"
        });
        this.data.quick_icon ? animation.opacity(0).step() : animation.translateY(-55).opacity(1).step(),
        this.setData({
            animationPlus: animation.export()
        });
    },
    favoriteClick: function(e) {
        var that = this, action = e.currentTarget.dataset.action;
        getApp().request({
            url: getApp().api.user.topic_favorite,
            data: {
                topic_id: that.data.id,
                action: action
            },
            success: function(res) {
                getApp().core.showToast({
                    title: res.msg
                }), 0 === res.code && that.setData({
                    is_favorite: action
                });
            }
        });
    },
    onShow: function() {
        getApp().page.onShow(this);
    },
    onShareAppMessage: function() {
        getApp().page.onShareAppMessage(this);
        var user = getApp().getUser(), id = this.data.id;
        return {
            title: this.data.title,
            path: "/pages/topic/topic?id=" + id + "&user_id=" + user.id
        };
    },
    showShareModal: function() {
        this.setData({
            share_modal_active: "active"
        });
    },
    shareModalClose: function() {
        this.setData({
            share_modal_active: ""
        });
    },
    getGoodsQrcode: function() {
        var that = this;
        if (that.setData({
            qrcode_active: "active",
            share_modal_active: ""
        }), that.data.goods_qrcode) return !0;
        getApp().request({
            url: getApp().api.default.topic_qrcode,
            data: {
                goods_id: that.data.id
            },
            success: function(res) {
                0 === res.code && that.setData({
                    goods_qrcode: res.data.pic_url
                }), 1 === res.code && (that.goodsQrcodeClose(), getApp().core.showModal({
                    title: "提示",
                    content: res.msg,
                    showCancel: !1,
                    success: function(e) {
                        e.confirm;
                    }
                }));
            }
        });
    },
    qrcodeClick: function(e) {
        var src = e.currentTarget.dataset.src;
        getApp().core.previewImage({
            urls: [ src ]
        });
    },
    qrcodeClose: function() {
        this.setData({
            qrcode_active: ""
        });
    },
    goodsQrcodeClose: function() {
        this.setData({
            goods_qrcode_active: "",
            no_scroll: !1
        });
    },
    saveQrcode: function() {
        var that = this;
        getApp().core.saveImageToPhotosAlbum ? (getApp().core.showLoading({
            title: "正在保存图片",
            mask: !1
        }), getApp().core.downloadFile({
            url: that.data.goods_qrcode,
            success: function(e) {
                getApp().core.showLoading({
                    title: "正在保存图片",
                    mask: !1
                }), getApp().core.saveImageToPhotosAlbum({
                    filePath: e.tempFilePath,
                    success: function() {
                        getApp().core.showModal({
                            title: "提示",
                            content: "专题海报保存成功",
                            showCancel: !1
                        });
                    },
                    fail: function(e) {
                        getApp().core.showModal({
                            title: "图片保存失败",
                            content: e.errMsg,
                            showCancel: !1
                        });
                    },
                    complete: function(e) {
                        getApp().core.hideLoading();
                    }
                });
            },
            fail: function(e) {
                getApp().core.showModal({
                    title: "图片下载失败",
                    content: e.errMsg + ";" + that.data.goods_qrcode,
                    showCancel: !1
                });
            },
            complete: function(e) {
                getApp().core.hideLoading();
            }
        })) : getApp().core.showModal({
            title: "提示",
            content: "当前版本过低，无法使用该功能，请升级到最新版本后重试。",
            showCancel: !1
        });
    }
});