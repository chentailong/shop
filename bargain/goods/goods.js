var app = getApp(), api = getApp().api, utils = getApp().helper, videoContext = "", setIntval = null,
    WxParse = require("../../wxParse/wxParse.js"), userIntval = null, scrollIntval = null, is_loading = !1;

Page({
    data: {
        hide: "hide",
        time_list: {
            day: 0,
            hour: "00",
            minute: "00",
            second: "00"
        },
        p: 1,
        user_index: 0,
        show_content: !1
    },
    onLoad: function (res) {
        wx.showShareMenu({
            withShareTicket: true,
            menus: ['shareAppMessage', 'shareTimeline']
        })
        if (getApp().page.onLoad(this, res), "undefined" == typeof my) {
            var scene = decodeURIComponent(res.scene);
            if (void 0 !== scene) {
                var scene = utils.scene_decode(scene);
                scene.gid && (res.goods_id = scene.gid);
            }
        } else if (null !== app.query) {
            var query = app.query;
            app.query = null, res.goods_id = query.gid;
        }
        this.getGoods(res.goods_id);
    },

    getGoods: function (goods_id) {
        var that = this;
        getApp().core.showLoading({
            title: "加载中"
        }), getApp().request({
            url: getApp().api.bargain.goods,
            data: {
                goods_id: goods_id,
                page: 1
            },
            success: function (e) {
                if (0 == e.code) {
                    var detail = e.data.goods.detail;
                    WxParse.wxParse("detail", "html", detail, that), that.setData(e.data), that.setData({
                        reset_time: that.data.goods.reset_time,
                        time_list: that.setTimeList(e.data.goods.reset_time),
                        p: 1,
                        foreshow_time: that.data.goods.foreshow_time,
                        foreshow_time_list: that.setTimeList(that.data.goods.foreshow_time)
                    }), that.setTimeOver(), e.data.bargain_info && that.getUserTime();
                } else getApp().core.showModal({
                    title: "提示",
                    content: e.msg,
                    showCancel: !1,
                    success: function (e) {
                        e.confirm && getApp().core.navigateBack({
                            delta: -1
                        });
                    }
                });
            },
            complete: function (e) {
                getApp().core.hideLoading();
            }
        });
    },

    onReady: function () {
        app.page.onReady(this);
    },
    onShow: function () {
        app.page.onShow(this);
    },
    onHide: function () {
        app.page.onHide(this);
    },
    onUnload: function () {
        app.page.onUnload(this), clearInterval(setIntval), setIntval = null, clearInterval(userIntval),
            userIntval = null, clearInterval(scrollIntval), scrollIntval = null;
    },
    play: function (e) {
        var url = e.target.dataset.url;
        this.setData({
            url: url,
            hide: "",
            show: !0
        }), (videoContext = getApp().core.createVideoContext("video")).play();
    },
    close: function (e) {
        if ("video" == e.target.id) return !0;
        this.setData({
            hide: "hide",
            show: !1
        }), videoContext.pause();
    },
    onGoodsImageClick: function (e) {
        var url_list = [], index = e.currentTarget.dataset.index;
        for (var pic_index in this.data.goods.pic_list) url_list.push(this.data.goods.pic_list[pic_index].pic_url);
        getApp().core.previewImage({
            urls: url_list,
            current: url_list[index]
        });
    },
    hide: function (e) {
        0 == e.detail.current ? this.setData({
            img_hide: ""
        }) : this.setData({
            img_hide: "hide"
        });
    },
    setTimeOver: function () {
        var that = this;
        setIntval = setInterval(function () {
            that.data.resset_time <= 0 && clearInterval(setIntval);
            var reset_time = that.data.reset_time - 1, time_list = that.setTimeList(reset_time), foreShow_time = that.data.foreshow_time - 1,
                foreShow_time_list = that.setTimeList(foreShow_time);
            that.setData({
                reset_time: reset_time,
                time_list: time_list,
                foreshow_time: foreShow_time,
                foreshow_time_list: foreShow_time_list
            });
        }, 1e3);
    },
    orderSubmit: function () {
        var that = this;
        getApp().core.showLoading({
            title: "加载中"
        }), getApp().request({
            url: getApp().api.bargain.bargain_submit,
            method: "POST",
            data: {
                goods_id: that.data.goods.id
            },
            success: function (e) {
                0 == e.code ? getApp().core.redirectTo({
                    url: "/bargain/activity/activity?order_id=" + e.data.order_id
                }) : that.showToast({
                    title: e.msg
                });
            },
            complete: function (e) {
                getApp().core.hideLoading();
            }
        });
    },
    buyNow: function () {
        var list = [], goods_list = [], bargain_info = this.data.bargain_info;
        bargain_info && (goods_list.push({
            bargain_order_id: bargain_info.order_id
        }), list.push({
            mch_id: 0,
            goods_list: goods_list
        }), getApp().core.redirectTo({
            url: "/pages/new-order-submit/new-order-submit?mch_list=" + JSON.stringify(list)
        }));
    },
    getUserTime: function () {
        var that = this;
        userIntval = setInterval(function () {
            that.loadData();
        }, 1e3), scrollIntval = setInterval(function () {
            var user_index = that.data.user_index;
            3 < that.data.bargain_info.bargain_info.length - user_index ? user_index += 3 : user_index = 0, that.setData({
                user_index: user_index
            });
        }, 3e3);
    },
    loadData: function () {
        var that = this, path = that.data.path;
        is_loading || (is_loading = !0, app.request({
            url: api.bargain.goods_user,
            data: {
                page: path + 1,
                goods_id: that.data.goods.id
            },
            success: function (e) {
                if (0 == e.code) {
                    var bargain_infos = that.data.bargain_info.bargain_info, bargain_info = e.data.bargain_info;
                    0 == bargain_info.bargain_info.length && (clearInterval(userIntval), userIntval = null), bargain_info.bargain_info = bargain_infos.concat(bargain_info.bargain_info),
                        that.setData({
                            bargain_info: bargain_info,
                            path: path + 1
                        });
                } else that.showToast({
                    title: e.msg
                });
            },
            complete: function () {
                is_loading = !1;
            }
        }));
    },
    contentClose: function () {
        this.setData({
            show_content: !1
        });
    },
    contentOpen: function () {
        this.setData({
            show_content: !0
        });
    },
    onShareAppMessage: function () {
        getApp().page.onShareAppMessage(this);
        return {
            path: "/bargain/list/list?goods_id=" + this.data.goods.id + "&user_id=" + this.data.__user_info.id,
            success: function (e) {
            },
            title: this.data.goods.name,
            imageUrl: this.data.goods.pic_list[0].pic_url
        };
    },
    showShareModal: function () {
        this.setData({
            share_modal_active: "active"
        });
    },
    shareModalClose: function () {
        this.setData({
            share_modal_active: ""
        });
    },
    getGoodsQrcode: function () {
        var that = this;
        if (that.setData({
            qrcode_active: "active",
            share_modal_active: ""
        }), that.data.goods_qrcode) return !0;
        getApp().request({
            url: getApp().api.bargain.qrcode,
            data: {
                goods_id: that.data.goods.id
            },
            success: function (e) {
                0 == e.code && that.setData({
                    goods_qrcode: e.data.pic_url
                }), 1 == e.code && (that.goodsQrcodeClose(), getApp().core.showModal({
                    title: "提示",
                    content: e.msg,
                    showCancel: !1,
                    success: function (e) {
                        e.confirm;
                    }
                }));
            }
        });
    },
    qrcodeClick: function (e) {
        var src = e.currentTarget.dataset.src;
        getApp().core.previewImage({
            urls: [src]
        });
    },
    qrcodeClose: function () {
        this.setData({
            qrcode_active: ""
        });
    },
    goodsQrcodeClose: function () {
        this.setData({
            goods_qrcode_active: "",
            no_scroll: !1
        });
    },
    saveQrcode: function () {
        var that = this;
        getApp().core.saveImageToPhotosAlbum ? (getApp().core.showLoading({
            title: "正在保存图片",
            mask: !1
        }), getApp().core.downloadFile({
            url: that.data.goods_qrcode,
            success: function (e) {
                getApp().core.showLoading({
                    title: "正在保存图片",
                    mask: !1
                }), getApp().core.saveImageToPhotosAlbum({
                    filePath: e.tempFilePath,
                    success: function () {
                        getApp().core.showModal({
                            title: "提示",
                            content: "商品海报保存成功",
                            showCancel: !1
                        });
                    },
                    fail: function (e) {
                        getApp().core.showModal({
                            title: "图片保存失败",
                            content: e.errMsg,
                            showCancel: !1
                        });
                    },
                    complete: function (e) {
                        getApp().core.hideLoading();
                    }
                });
            },
            fail: function (e) {
                getApp().core.showModal({
                    title: "图片下载失败",
                    content: e.errMsg + ";" + that.data.goods_qrcode,
                    showCancel: !1
                });
            },
            complete: function (e) {
                getApp().core.hideLoading();
            }
        })) : getApp().core.showModal({
            title: "提示",
            content: "当前版本过低，无法使用该功能，请升级到最新版本后重试。",
            showCancel: !1
        });
    }
});