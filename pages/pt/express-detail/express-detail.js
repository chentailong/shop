Page({
    data: {},
    onLoad: function(options) {
        wx.showShareMenu({
            withShareTicket: true,
            menus: ['shareAppMessage', 'shareTimeline']
        })
        getApp().page.onLoad(this, options), this.loadData(options);
    },
    loadData: function(event) {
        var that = this;
        getApp().core.showLoading({
            title: "正在加载"
        }), getApp().request({
            url: getApp().api.group.order.express_detail,
            data: {
                order_id: event.id
            },
            success: function(res) {
                getApp().core.hideLoading(), 0 === res.code && that.setData({
                    data: res.data
                }), 1 === res.code && getApp().core.showModal({
                    title: "提示",
                    content: res.msg,
                    showCancel: !1,
                    success: function(o) {
                        o.confirm && getApp().core.navigateBack();
                    }
                });
            }
        });
    },
    onReady: function(o) {
        getApp().page.onReady(this);
    },
    onShow: function(o) {
        getApp().page.onShow(this);
    },
    onHide: function(o) {
        getApp().page.onHide(this);
    },
    onUnload: function(o) {
        getApp().page.onUnload(this);
    },
    onPullDownRefresh: function(o) {
        getApp().page.onPullDownRefresh(this);
    },
    onReachBottom: function(o) {
        getApp().page.onReachBottom(this);
    }
});