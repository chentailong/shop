var app = getApp(), api = getApp().api;

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
        if (options.inId) var data = {
            order_id: options.inId,
            type: "IN"
        }; else data = {
            order_id: options.id,
            type: "mall"
        };
        that.setData({
            order_id: data.order_id,
            type: data.type
        }), getApp().core.showLoading({
            title: "正在加载",
            mask: !0
        }), getApp().request({
            url: getApp().api.order.comment_preview,
            data: data,
            success: function(res) {
                if (getApp().core.hideLoading(), 1 === res.code && getApp().core.showModal({
                    title: "提示",
                    content: res.msg,
                    showCancel: !1,
                    success: function(t) {
                        t.confirm && getApp().core.navigateBack();
                    }
                }), 0 === res.code) {
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
        var that = this, index = t.currentTarget.dataset.index, goods_list = that.data.goods_list, length = goods_list[index].pic_list.length;
        getApp().core.chooseImage({
            count: 6 - length,
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
        let that = this;
        getApp().core.showLoading({
            title: "正在提交",
            mask: !0
        });
        var goods_list = that.data.goods_list, d = (getApp().siteInfo, {});
        !function a(i) {
            if (i === goods_list.length) return void getApp().request({
                url: getApp().api.order.comment,
                method: "post",
                data: {
                    order_id: that.data.order_id,
                    goods_list: JSON.stringify(goods_list),
                    type: that.data.type
                },
                success: function(e) {
                    getApp().core.hideLoading(), 0 === e.code && getApp().core.showModal({
                        title: "提示",
                        content: e.msg,
                        showCancel: !1,
                        success: function(t) {
                            t.confirm && ("IN" === e.type ? getApp().core.redirectTo({
                                url: "/pages/integral-mall/order/order?status=3"
                            }) : getApp().core.redirectTo({
                                url: "/pages/order/order?status=3"
                            }));
                        }
                    }), 1 === e.code && getApp().core.showToast({
                        title: e.msg,
                        image: "/images/icon-warning.png"
                    });
                },
                complete(res) {
                    console.log(res)
                }
            });
            var s = 0;
            if (!goods_list[i].pic_list.length || 0 === goods_list[i].pic_list.length) return a(i + 1);
            for (var t in goods_list[i].pic_list) !function(o) {
                getApp().core.uploadFile({
                    url: getApp().api.default.upload_image,
                    name: "image",
                    formData: d,
                    filePath: goods_list[i].pic_list[o],
                    complete: function(t) {
                        if (t.data) {
                            var e = JSON.parse(t.data);
                            0 === e.code && (goods_list[i].uploaded_pic_list[o] = e.data.url);
                        }
                        if (++s === goods_list[i].pic_list.length) return a(i + 1);
                    }
                });
            }(t);
        }(0);
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {}
});