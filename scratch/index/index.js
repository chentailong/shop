var interval;

Page({
    ctx: null,
    data: {
        isStart: !0,
        name: "",
        monitor: "",
        detect: !0,
        type: 5,
        error: "",
        oppty: 0,
        log: [],
        register: !0,
        award_name: !1
    },
    onLoad: function (options) {
        wx.showShareMenu({
            withShareTicket: true,
            menus: ['shareAppMessage', 'shareTimeline']
        })
        getApp().page.onLoad(this, options);
    },
    onShow: function () {
        getApp().page.onShow(this), getApp().core.showLoading({
            title: "加载中"
        });
        var that = this;
        getApp().request({
            url: getApp().api.scratch.setting,
            success: function (res) {
                var setting = res.data.setting;
                setting.title && getApp().core.setNavigationBarTitle({
                    title: setting.title
                }), that.setData({
                    title: setting.title,
                    deplete_register: setting.deplete_register,
                    register: null == title.deplete_register || 0 === title.deplete_register
                }), getApp().request({
                    url: getApp().api.scratch.index,
                    success: function (res) {
                        if (0 === res.code) {
                            that.init();
                            var list = res.data.list, name = that.setName(list);
                            console.log("name=>" + name), that.setData({
                                name: name,
                                oppty: res.data.oppty,
                                id: list.id,
                                type: list.type
                            });
                        } else that.setData({
                            error: res.msg,
                            isStart: !0,
                            oppty: res.data.oppty
                        });
                    },
                    complete: function (t) {
                        getApp().core.hideLoading();
                    }
                });
            }
        }), that.prizeLog(), interval = setInterval(function () {
            that.prizeLog();
        }, 1e4);
    },
    prizeLog: function () {
        var that = this;
        getApp().request({
            url: getApp().api.scratch.log,
            success: function (t) {
                0 == t.code && that.setData({
                    log: t.data
                });
            }
        });
    },
    register: function () {
        this.data.error ? getApp().core.showModal({
            title: "提示",
            content: this.data.error,
            showCancel: !1
        }) : (this.setData({
            register: !0
        }), this.init());
    },
    init: function () {
        var Query = getApp().core.createSelectorQuery(), that = this;
        that.setData({
            award_name: !1
        }), Query.select("#frame").boundingClientRect(), Query.exec(function (t) {
            var width = t[0].width, height = t[0].height;
            that.setData({
                r: 16,
                lastX: "",
                lastY: "",
                minX: "",
                minY: "",
                maxX: "",
                maxY: "",
                canvasWidth: width,
                canvasHeight: height
            });
            var scratch = getApp().core.createCanvasContext("scratch");
            scratch.drawImage("/scratch/images/scratch_hide_2.png", 0, 0, width, height), that.ctx = scratch, "undefined" == typeof my ? (console.log(111),
                scratch.draw(!1, function (t) {
                    that.setData({
                        register: !0,
                        award_name: !0
                    });
                })) : scratch.draw(!0), that.setData({
                isStart: !0,
                isScroll: !0
            });
        });
    },
    onReady: function () {
        "undefined" != typeof my && this.init();
    },
    onStart: function () {
        this.setData({
            register: null == this.data.deplete_register || 0 === this.data.deplete_register,
            name: this.data.monitor,
            isStart: !0,
            award: !1,
            award_name: !1
        }), this.init();
    },

    drawRect: function (t, e) {
        var a = this.data.r / 2, minX = 0 < t - a ? t - a : 0, maxY = 0 < e - a ? e - a : 0;
        return "" !== this.data.minX ? this.setData({
            minX: this.data.minX > minX ? minX : this.data.minX,
            minY: this.data.minY > maxY ? maxY : this.data.minY,
            maxX: this.data.maxX > minX ? this.data.maxX : minX,
            maxY: this.data.maxY > maxY ? this.data.maxY : maxY
        }) : this.setData({
            minX: minX,
            minY: maxY,
            maxX: minX,
            maxY: maxY
        }), this.setData({
            lastX: minX,
            lastY: maxY
        }), [minX, maxY, 2 * a];
    },

    clearArc: function (t, e, a) {
        var i = this.data.r, s = this.ctx, o = i - a, r = Math.sqrt(i * i - o * o), c = t - o, n = e - r, d = 2 * o,
            p = 2 * r;
        a <= i && (s.clearRect(c, n, d, p), a += 1, this.clearArc(t, e, a));
    },

    touchStart: function (t) {
        if (this.setData({
            award_name: !0
        }), this.data.isStart) if (this.data.error) getApp().core.showModal({
            title: "提示",
            content: this.data.error,
            showCancel: !1
        }); else ;
    },

    touchMove: function (t) {
        if (this.data.isStart && !this.data.error) {
            this.drawRect(t.touches[0].x, t.touches[0].y), this.clearArc(t.touches[0].x, t.touches[0].y, 1),
                this.ctx.draw(!0);
        }
    },

    touchEnd: function (t) {
        if (this.data.isStart && !this.data.error) {
            var that = this, width = this.data.canvasWidth, height = this.data.canvasHeight, minX = this.data.minX,
                minY = this.data.minY,
                maxX = this.data.maxX, maxY = this.data.maxY;
            .4 * width < maxX - minX && .4 * height < maxY - minY && this.data.detect && (that.setData({
                detect: !1
            }), getApp().request({
                url: getApp().api.scratch.receive,
                data: {
                    id: that.data.id
                },
                success: function (t) {
                    if (0 === t.code) {
                        that.setData({
                            award: 5 !== that.data.type,
                            isStart: !1,
                            isScroll: !0
                        }), that.ctx.draw();
                        var list = t.data.list;
                        t.data.oppty <= 0 || "" === list ? that.setData({
                            monitor: "谢谢参与",
                            error: t.msg ? t.msg : "机会已用完",
                            detect: !0,
                            type: 5,
                            oppty: t.data.oppty
                        }) : that.setData({
                            monitor: that.setName(list),
                            id: list.id,
                            detect: !0,
                            type: list.type,
                            oppty: t.data.oppty
                        });
                    } else getApp().core.showModal({
                        title: "提示",
                        content: t.msg ? t.msg : "网络异常，请稍后重试",
                        showCancel: !1
                    }), that.setData({
                        monitor: "谢谢参与",
                        detect: !0
                    }), that.onStart();
                }
            }));
        }
    },

    setName: function (event) {
        var result = "";
        switch (parseInt(event.type)) {
            case 1:
                result = event.price + "元红包";
                break;

            case 2:
                result = event.coupon;
                break;

            case 3:
                result = event.num + "积分";
                break;

            case 4:
                result = event.gift;
                break;

            default:
                result = "谢谢参与";
        }
        return result;
    },
    onShareAppMessage: function () {
        getApp().page.onShareAppMessage(this), this.setData({
            share_modal_active: !1
        });
        var info = {
            path: "/scratch/index/index?user_id=" + getApp().getUser().id,
            title: this.data.title ? this.data.title : "刮刮卡"
        };
        setTimeout(function () {
            return info;
        }, 500);
    },
    onHide: function () {
        getApp().page.onHide(this), clearInterval(interval);
    },
    onUnload: function () {
        getApp().page.onUnload(this), clearInterval(interval);
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
            url: getApp().api.scratch.qrcode,
            success: function (t) {
                0 === t.code && that.setData({
                    goods_qrcode: t.data.pic_url
                }), 1 === t.code && (that.goodsQrcodeClose(), getApp().core.showModal({
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
    },
    goodsQrcodeClose: function () {
        this.setData({
            goods_qrcode_active: "",
            no_scroll: !1
        });
    }
});