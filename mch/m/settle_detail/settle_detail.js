Page({
    data: {
        settle_type: "",
        settleList: [],
        page: 1,
        loading: !1,
        no_more: !1
    },
    onLoad: function(t) {
        wx.showShareMenu({
            withShareTicket: true,
            menus: ['shareAppMessage', 'shareTimeline']
        })
        getApp().page.onLoad(this, t);
        this.setData({
            settle_type: t.settle_type
        }), this.getSettleList();
    },
    onReady: function() {
        getApp().page.onReady(this);
    },
    onShow: function() {
        getApp().page.onShow(this);
    },
    onHide: function() {
        getApp().page.onHide(this);
    },
    onUnload: function() {
        getApp().page.onUnload(this);
    },
    onPullDownRefresh: function() {
        getApp().page.onPullDownRefresh(this);
    },
    onReachBottom: function() {
        getApp().page.onReachBottom(this);
        this.getSettleList();
    },
    onShareAppMessage: function() {
        getApp().page.onShareAppMessage(this);
    },
    getSettleList: function() {
        var that = this;
        if (!that.data.loading && !that.data.no_more) {
            that.setData({
                loading: !0
            });
            var settle_type = that.data.settle_type, page = that.data.page;
            getApp().core.showLoading({
                title: "正在加载",
                mask: !0
            }), getApp().request({
                url: getApp().api.mch.user.settle_log,
                data: {
                    settle_type: settle_type,
                    page: page
                },
                success: function(res) {
                    0 == res.code ? 0 < res.data.list.length ? that.setData({
                        settleList: that.data.settleList.concat(res.data.list),
                        page: page + 1
                    }) : that.setData({
                        no_more: !0
                    }) : getApp().core.showModal({
                        title: "提示",
                        content: res.msg,
                        showCancel: !1,
                        success: function(res) {
                            res.confirm && getApp().core.navigateBack();
                        }
                    });
                },
                complete: function() {
                    getApp().core.hideLoading(), that.setData({
                        loading: !1
                    });
                }
            });
        }
    }
});