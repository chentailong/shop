var lotteryInter, options_id, timer, luckyTimer, utils = getApp().helper, videoContext = "",
    WxParse = require("../../wxParse/wxParse.js");

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
        show_animate: !0,
        animationTranslottery: {},
        award_bg: !1
    },
    onLoad: function (options) {
        wx.showShareMenu({
            withShareTicket: true,
            menus: ['shareAppMessage', 'shareTimeline']
        })
        if (getApp().page.onLoad(this, options), options.user_id && this.buyZero(), "undefined" == typeof my) {
            var scene = decodeURIComponent(options.scene);
            if (void 0 !== scene) {
                var decode = utils.scene_decode(scene);
                decode.gid && (options.id = decode.gid);
            }
        } else if (null !== getApp().query) {
            var query = app.query;
            getApp().query = null, options.id = query.gid;
        }
        options_id = options.id;
    },
    onShow: function () {
        getApp().page.onShow(this), this.getGoods({
            id: options_id
        });
    },
    getGoods: function (res) {
        var id = res.id;
        console.log(res), getApp().core.showLoading({
            title: "加载中"
        });
        var that = this;
        getApp().request({
            url: getApp().api.lottery.goods,
            data: {
                id: id,
                user_id: res.user_id,
                page: 1
            },
            success: function (res) {
                if (0 == res.code) {
                    var detail = res.data.goods.detail, end_time = res.data.lottery_info.end_time;
                    that.setTimeStart(end_time), WxParse.wxParse("detail", "html", detail, that), that.setData(res.data);
                } else getApp().core.showModal({
                    title: "提示",
                    content: res.msg,
                    showCancel: !1,
                    success: function (t) {
                        t.confirm && getApp().core.redirectTo({
                            url: "/lottery/index/index"
                        });
                    }
                });
            },
            complete: function (t) {
                getApp().core.hideLoading();
            }
        });
    },
    catchTouchMove: function (t) {
        return !1;
    },
    onHide: function () {
        getApp().page.onHide(this), clearInterval(timer);
    },
    onUnload: function () {
        getApp().page.onUnload(this), clearInterval(timer);
    },

    //计算抽奖时间
    setTimeStart: function (date) {
        var that = this, time = new Date(), s = parseInt(date - time.getTime() / 1e3);
        clearInterval(timer), timer = setInterval(function () {
            var day = 0, hour = 0, minute = 0, second = 0;
            0 < s && (day = Math.floor(s / 86400), hour = Math.floor(s / 3600) - 24 * day, minute = Math.floor(s / 60) - 24 * day * 60 - 60 * hour,
                second = Math.floor(s) - 24 * day * 60 * 60 - 60 * hour * 60 - 60 * minute);
            var i = {
                day: day,
                hour: hour,
                minute: minute,
                second: second
            };
            that.setData({
                time_list: i
            }), s--;
        }, 1e3), s <= 0 && clearInterval(timer);
    },

    buyZero: function () {
        var that = this, award_bg = !that.data.award_bg;
        that.setData({
            award_bg: award_bg
        });
        var Animation = getApp().core.createAnimation({
            duration: 1e3,
            timingFunction: "linear",
            transformOrigin: "50% 50%"
        });
        that.data.award_bg ? Animation.width("360rpx").height("314rpx").step() : Animation.scale(0, 0).opacity(0).step(),
            that.setData({
                animationTranslottery: Animation.export()
            });
        var time = 0;
        lotteryInter = setInterval(function () {
            time % 2 == 0 ? Animation.scale(.9).opacity(1).step() : Animation.scale(1).opacity(1).step(), that.setData({
                animationTranslottery: Animation.export()
            }), 500 == ++time && (time = 0);
        }, 500);
    },

    submitTime: function () {
        var Animation = getApp().core.createAnimation({
            duration: 500,
            transformOrigin: "50% 50%"
        }), that = this, time = 0;
        lotteryInter = setInterval(function () {
            time % 2 == 0 ? Animation.scale(2.3, 2.3).opacity(1).step() : Animation.scale(2.5, 2.5).opacity(1).step(),
                that.setData({
                    animationTranslottery: Animation.export()
                }), 500 == ++time && (time = 0);
        }, 500);
    },
    submit: function (t) {
        var formId = t.detail.formId, lottery_id = t.currentTarget.dataset.lottery_id;
        getApp().core.navigateTo({
            url: "/lottery/detail/detail?lottery_id=" + lottery_id + "&form_id=" + formId
        }), clearInterval(lotteryInter), this.setData({
            award_bg: !1
        });
    },
    play: function (t) {
        var url = t.target.dataset.url;
        this.setData({
            url: url,
            hide: "",
            show: !0
        }), (videoContext = getApp().core.createVideoContext("video")).play();
    },
    close: function (t) {
        if ("video" == t.target.id) return !0;
        this.setData({
            hide: "hide",
            show: !1
        }), videoContext.pause();
    },
    onGoodsImageClick: function (t) {
        var urls = [], index = t.currentTarget.dataset.index;
        for (var i in this.data.goods.pic_list) urls.push(this.data.goods.pic_list[i].pic_url);
        getApp().core.previewImage({
            urls: urls,
            current: urls[index]
        });
    },
    hide: function (t) {
        0 == t.detail.current ? this.setData({
            img_hide: ""
        }) : this.setData({
            img_hide: "hide"
        });
    },
    buyNow: function (t) {
        var goods_list = [], list = {
            goods_id: this.data.goods.id,
            num: 1,
            attr: JSON.parse(this.data.lottery_info.attr)
        };
        goods_list.push(list);
        var lists = [];
        lists.push({
            mch_id: 0,
            goods_list: goods_list
        }), getApp().core.navigateTo({
            url: "/pages/new-order-submit/new-order-submit?mch_list=" + JSON.stringify(lists)
        });
    },
    onShareAppMessage: function () {
        getApp().page.onShareAppMessage(this);
        var user = getApp().getUser(), id = this.data.lottery_info.id;
        return {
            imageUrl: this.data.goods.pic_list[0].pic_url,
            path: "/lottery/goods/goods?id=" + id + "&user_id=" + user.id
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
            url: getApp().api.lottery.qrcode,
            data: {
                goods_id: that.data.lottery_info.id
            },
            success: function (t) {
                0 == t.code && that.setData({
                    goods_qrcode: t.data.pic_url
                }), 1 == t.code && (that.goodsQrcodeClose(), getApp().core.showModal({
                    title: "提示",
                    content: t.msg,
                    showCancel: !1,
                    success: function (t) {
                        t.confirm;
                    }
                }));
            }
        });
    },
    qrcodeClick: function (t) {
        var src = t.currentTarget.dataset.src;
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
            success: function (t) {
                getApp().core.showLoading({
                    title: "正在保存图片",
                    mask: !1
                }), getApp().core.saveImageToPhotosAlbum({
                    filePath: t.tempFilePath,
                    success: function () {
                        getApp().core.showModal({
                            title: "提示",
                            content: "商品海报保存成功",
                            showCancel: !1
                        });
                    },
                    fail: function (t) {
                        getApp().core.showModal({
                            title: "图片保存失败",
                            content: t.errMsg,
                            showCancel: !1
                        });
                    },
                    complete: function (t) {
                        getApp().core.hideLoading();
                    }
                });
            },
            fail: function (t) {
                getApp().core.showModal({
                    title: "图片下载失败",
                    content: t.errMsg + ";" + that.data.goods_qrcode,
                    showCancel: !1
                });
            },
            complete: function (t) {
                getApp().core.hideLoading();
            }
        })) : getApp().core.showModal({
            title: "提示",
            content: "当前版本过低，无法使用该功能，请升级到最新版本后重试。",
            showCancel: !1
        });
    }
});