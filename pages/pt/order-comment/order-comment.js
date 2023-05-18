Page({
    data: {
        goods_list: []
    },
    onLoad: function(options) {
        wx.showShareMenu({
            withShareTicket: true,
            menus: ['shareAppMessage', 'shareTimeline']
        })
        getApp().page.onLoad(this, options);
        var that = this;
        that.setData({
            order_id: options.id
        }), getApp().core.showLoading({
            title: "正在加载",
            mask: !0
        }), getApp().request({
            url: getApp().api.group.order.comment_preview,
            data: {
                order_id: options.id
            },
            success: function(res) {
                if (getApp().core.hideLoading(), 1 == res.code && getApp().core.showModal({
                    title: "提示",
                    content: res.msg,
                    showCancel: !1,
                    success: function(t) {
                        t.confirm && getApp().core.navigateBack();
                    }
                }), 0 == res.code) {
                    for (var e in res.data.goods_list) res.data.goods_list[e].score = 3, res.data.goods_list[e].content = "",
                        res.data.goods_list[e].pic_list = [], res.data.goods_list[e].uploaded_pic_list = [];
                    that.setData({
                        goods_list: res.data.goods_list
                    });
                }
            }
        });
    },
    setScore: function(t) {
        var index = t.currentTarget.dataset.index, score = t.currentTarget.dataset.score, goods_list = this.data.goods_list;
        goods_list[index].score = score, this.setData({
            goods_list: goods_list
        });
    },
    contentInput: function(t) {
        var that = this, index = t.currentTarget.dataset.index;
        that.data.goods_list[index].content = t.detail.value, that.setData({
            goods_list: that.data.goods_list
        });
    },
    chooseImage: function(t) {
        var that = this, index = t.currentTarget.dataset.index, goods_list = that.data.goods_list, i = goods_list[index].pic_list.length;
        getApp().core.chooseImage({
            count: 6 - i,
            success: function(t) {
                goods_list[index].pic_list = goods_list[index].pic_list.concat(t.tempFilePaths), that.setData({
                    goods_list: goods_list
                });
            }
        });
    },
    deleteImage: function(t) {
        var index = t.currentTarget.dataset.index, picIndex = t.currentTarget.dataset.picIndex, goods_list = this.data.goods_list;
        goods_list[index].pic_list.splice(picIndex, 1), this.setData({
            goods_list: goods_list
        });
    },
    commentSubmit: function(t) {
        var that = this;
        getApp().core.showLoading({
            title: "正在提交",
            mask: !0
        });
        var goods_list = that.data.goods_list;
        !function submits(number) {
            if (number === goods_list.length) return void getApp().request({
                url: getApp().api.group.order.comment,
                method: "post",
                data: {
                    order_id: that.data.order_id,
                    goods_list: JSON.stringify(goods_list)
                },
                success: function(t) {
                    getApp().core.hideLoading(), 0 === t.code && getApp().core.showModal({
                        title: "提示",
                        content: t.msg,
                        showCancel: !1,
                        success: function(t) {
                            t.confirm && getApp().core.redirectTo({
                                url: "/pages/pt/order/order?status=2"
                            });
                        }
                    }), 1 === t.code && getApp().core.showToast({
                        title: t.msg,
                        image: "/images/icon-warning.png"
                    });
                }
            });
            var index = 0;
            if (!goods_list[number].pic_list.length || 0 === goods_list[number].pic_list.length) return submits(number + 1);
            for (var t in goods_list[number].pic_list) !function(o) {
                getApp().core.uploadFile({
                    url: getApp().api.default.upload_image,
                    name: "image",
                    filePath: goods_list[number].pic_list[o],
                    complete: function(t) {
                        if (t.data) {
                            var data = JSON.parse(t.data);
                            0 === data.code && (goods_list[number].uploaded_pic_list[o] = data.data.url);
                        }
                        if (++index === goods_list[number].pic_list.length) return submits(number + 1);
                    }
                });
            }(t);
        }(0);
    },
    onReady: function(t) {
        getApp().page.onReady(this);
    },
    onShow: function(t) {
        getApp().page.onShow(this);
    },
    onHide: function(t) {
        getApp().page.onHide(this);
    },
    onUnload: function(t) {
        getApp().page.onUnload(this);
    },
    onPullDownRefresh: function(t) {
        getApp().page.onPullDownRefresh(this);
    },
    onReachBottom: function(t) {
        getApp().page.onReachBottom(this);
    }
});