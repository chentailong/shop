Page({
    data: {
        img: [],
        todayStep: 0,
        pic_list: "",
        save: !0,
        page: 1,
        left: !1,
        right: !0,
        get: !1
    },
    tagChoose: function (t) {
        var that = this, id = t.currentTarget.dataset.id, num = that.data.num;
        that.setData({
            currentItem: id
        }), getApp().core.showLoading({
            title: "分享图片生成中...",
            mask: !0
        }), getApp().request({
            url: getApp().api.step.qrcode,
            data: {
                goods_id: id,
                num: num
            },
            success: function (t) {
                console.log(t), 0 == t.code ? that.setData({
                    img: t.data.pic_url
                }) : getApp().core.showModal({
                    content: t.msg,
                    showCancel: !1
                }), setTimeout(function () {
                    getApp().core.hideLoading();
                }, 1e3);
            },
            fail: function (t) {
                getApp().core.showModal({
                    content: t.msg,
                    showCancel: !1
                });
            }
        });
    },
    screen: function () {
        var img = this.data.img;
        getApp().core.previewImage({
            urls: [img]
        });
    },
    saveImage: function () {
        var that = this;
        getApp().core.authorize({
            scope: "scope.writePhotosAlbum",
            success: function (t) {
                "authorize:ok" == t.errMsg && getApp().core.getImageInfo({
                    src: that.data.img,
                    success: function (t) {
                        getApp().core.saveImageToPhotosAlbum({
                            filePath: t.path,
                            success: function (t) {
                                getApp().core.showToast({
                                    title: "保存成功，快去发朋友圈吧！",
                                    icon: "success",
                                    duration: 2e3
                                });
                            },
                            fail: function (t) {
                                getApp().core.showModal({
                                    content: "授权失败",
                                    showCancel: !1
                                });
                            }
                        });
                    }
                });
            },
            fail: function (t) {
                getApp().core.showModal({
                    content: "为确保您的正常使用，请点击下方按钮授权",
                    showCancel: !1
                }), that.setData({
                    save: !1,
                    get: !0
                });
            }
        });
    },
    openSetting: function () {
        var that = this;
        wx.openSetting({
            success: function (t) {
                1 == t.authSetting["scope.writePhotosAlbum"] && that.setData({
                    save: !0,
                    get: !1
                });
            },
            fail: function (t) {
                getApp().core.showModal({
                    content: "为确保您的正常使用，请点击下方按钮授权",
                    showCancel: !1
                });
            }
        });
    },
    chooseImg: function (t) {
        var that = this, page = this.data.page, left = !0, right = !0, id = t.currentTarget.dataset.id;
        1 == id ? page-- : 2 == id && page++, getApp().request({
            url: getApp().api.step.pic_list,
            data: {
                page: page
            },
            success: function (t) {
                var pic_list = t.data.pic_list;
                0 == pic_list.length ? (getApp().core.showToast({
                    title: "没有更多了",
                    icon: "none",
                    duration: 1e3
                }), right = !1, that.setData({
                    right: right
                })) : (1 == page && (left = !1), pic_list.length < 4 && (right = !1), that.setData({
                    page: page,
                    pic_list: pic_list,
                    left: left,
                    right: right
                }));
            }
        });
    },
    onLoad: function (t) {
        getApp().page.onLoad(this, t);
        var that = this, num = 0;
        t.todayStep && (num = t.todayStep), that.setData({
            num: num
        });
        getApp().core.showLoading({
            title: "分享图片生成中...",
            mask: !0
        }), getApp().request({
            url: getApp().api.step.pic_list,
            data: {
                page: 1
            },
            success: function (t) {
                var pic_list = t.data.pic_list, right = !0;
                0 < pic_list[0].pic_url.length ? (pic_list.length < 4 && (right = !1), that.setData({
                    pic_list: pic_list,
                    currentItem: pic_list[0].id,
                    right: right
                }), getApp().request({
                    url: getApp().api.step.qrcode,
                    data: {
                        goods_id: pic_list[0].id,
                        num: num
                    },
                    success: function (t) {
                        setTimeout(function () {
                            0 == t.code ? that.setData({
                                img: t.data.pic_url
                            }) : getApp().core.showModal({
                                content: t.msg,
                                showCancel: !1
                            }), getApp().core.hideLoading();
                        }, 1e3);
                    }
                })) : (getApp().core.hideLoading(), getApp().core.showToast({
                    title: "暂无海报模板",
                    icon: "none",
                    duration: 1e3
                }), setTimeout(function () {
                    getApp().core.navigateTo({
                        url: "../index/index"
                    });
                }, 1e3));
            }
        });
    }
});