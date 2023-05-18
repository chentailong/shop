var is_no_more = !1
var is_loading = !1, p = 2;

Page({
    data: {},
    onLoad: function (options) {
        wx.showShareMenu({
            withShareTicket: true,
            menus: ['shareAppMessage', 'shareTimeline']
        })
        getApp().page.onLoad(this, options), is_loading = is_no_more = !1, p = 2;
        var that = this;
        that.setData({
            gid: options.id
        }), getApp().core.showLoading({
            title: "正在加载",
            mask: !0
        }), getApp().request({
            url: getApp().api.group.comment,
            data: {
                gid: options.id
            },
            success: function (res) {
                getApp().core.hideLoading(), 1 === res.code && getApp().core.showModal({
                    title: "提示",
                    content: res.msg,
                    showCancel: !1,
                    success: function (t) {
                        t.confirm && getApp().core.navigateBack();
                    }
                }), 0 === res.code && (0 === res.data.comment.length && getApp().core.showModal({
                    title: "提示",
                    content: "暂无评价",
                    showCancel: !1,
                    success: function (t) {
                        t.confirm && getApp().core.navigateBack();
                    }
                }), that.setData({
                    comment: res.data.comment
                })), that.setData({
                    show_no_data_tip: 0 === that.data.comment.length
                });
            }
        });
    },
    onReady: function (t) {
        getApp().page.onReady(this);
    },
    onShow: function (t) {
        getApp().page.onShow(this);
    },
    onHide: function (t) {
        getApp().page.onHide(this);
    },
    onUnload: function (t) {
        getApp().page.onUnload(this);
    },
    onPullDownRefresh: function (t) {
        getApp().page.onPullDownRefresh(this);
    },
    onReachBottom: function (t) {
        getApp().page.onReachBottom(this);
        var that = this;
        is_loading || is_no_more || (is_loading = !0, getApp().request({
            url: getApp().api.group.comment,
            data: {
                gid: that.data.gid,
                page: p
            },
            success: function (res) {
                if (0 == res.code) {
                    var e = that.data.comment.concat(res.data.comment);
                    that.setData({
                        comment: e
                    }), 0 === res.data.comment.length && (is_no_more = !0);
                }
                p++;
            },
            complete: function () {
                is_loading = !1;
            }
        }));
    },
    bigToImage: function (t) {
        var pic_list = this.data.comment[t.target.dataset.index].pic_list;
        getApp().core.previewImage({
            current: t.target.dataset.url,
            urls: pic_list
        });
    }
});