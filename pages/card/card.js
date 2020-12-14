var is_loading = !1;

Page({
    data: {
        page: 1,
        show_qrcode: !1,
        status: 1
    },
    onLoad: function(cardData) {
        getApp().page.onLoad(this, cardData), cardData.status && this.setData({
            status: cardData.status
        }), this.loadData();
    },
    // e > that, t > res
    loadData: function() {
        var that = this;
        getApp().core.showLoading({
            title: "加载中"
        }), getApp().request({
            url: getApp().api.user.card,
            data: {
                page: 1,
                status: that.data.status
            },
            success: function(res) {
                0 == res.code && that.setData(res.data);
            },
            complete: function() {
                getApp().core.hideLoading();
            }
        });
    },
    onReachBottom: function() {
        getApp().page.onReachBottom(this), this.data.page != this.data.page_count && this.loadMore();
    },
    // a > that; o > page(页数);  t > res;  e > list(列表)
    loadMore: function() {
        var that = this;
        if (!is_loading) {
            is_loading = !0, getApp().core.showLoading({
                title: "加载中"
            });
            var page = that.data.page;
            getApp().request({
                url: getApp().api.user.card,
                data: {
                    page: page + 1,
                    status: that.data.status
                },
                success: function(res) {
                    if (0 == res.code) {
                        var list = that.data.list.concat(res.data.list);
                        that.setData({
                            list: list,
                            page_count: res.data.page_count,
                            row_count: res.data.row_count,
                            page: page + 1
                        });
                    }
                },
                complete: function() {
                    is_loading = !1, getApp().core.hideLoading();
                }
            });
        }
    },
    // e > that; a > page(页数); o > list(列表)
    getQrcode: function(t) {
        var that = this, page = t.currentTarget.dataset.index, list = that.data.list[page];
        getApp().core.showLoading({
            title: "加载中"
        }), getApp().request({
            url: getApp().api.user.card_qrcode,
            data: {
                user_card_id: list.id
            },
            success: function(e) {
                0 == e.code ? that.setData({
                    show_qrcode: !0,
                    qrcode: e.data.url
                }) : getApp().core.showModal({
                    title: "提示",
                    content: e.msg,
                    showCancel: !1
                });
            },
            complete: function() {
                getApp().core.hideLoading();
            }
        });
    },
    hide: function() {
        this.setData({
            show_qrcode: !1
        });
    },
    // e >  status(状态)
    goto: function(data) {
        var status = data.currentTarget.dataset.status;
        getApp().core.redirectTo({
            url: "/pages/card/card?status=" + status
        });
    },
    save: function() {
        var that = this;
        getApp().core.saveImageToPhotosAlbum ? (getApp().core.showLoading({
            title: "正在保存图片",
            mask: !1
        }), getApp().core.downloadFile({
            url: that.data.qrcode,
            success: function(res) {
                getApp().core.showLoading({
                    title: "正在保存图片",
                    mask: !1
                }), that.saveImg(res);
            },
            fail: function(error) {
                getApp().core.showModal({
                    title: "下载失败",
                    content: error.errMsg + ";" + that.data.goods_qrcode,
                    showCancel: !1
                });
            },
            complete: function() {
                getApp().core.hideLoading();
            }
        })) : getApp().core.showModal({
            title: "提示",
            content: "当前版本过低，无法使用该功能，请升级到最新版本后重试。"
        });
    },
    // a -> that; t -> data
    saveImg: function(data) {
        var that = this;
        getApp().core.saveImageToPhotosAlbum({
            filePath: data.tempFilePath,
            success: function() {
                getApp().core.showModal({
                    title: "提示",
                    content: "保存成功",
                    showCancel: !1
                });
            },
            fail: function(error) {
                getApp().core.getSetting({
                    success: function(power) {
                        power.authSetting["scope.writePhotosAlbum"] || getApp().getauth({
                            content: "小程序需要授权保存到相册",
                            author: "scope.writePhotosAlbum",
                            success: function(res) {
                                res && that.saveImg(error);
                            }
                        });
                    }
                });
            },
            complete: function() {
                getApp().core.hideLoading();
            }
        });
    }
});