Page({
    data: {
        invite_list: [],
        info: [],
        page: 2,
        loading: !1,
        length: 0
    },
    onLoad: function(options) {
        wx.showShareMenu({
            withShareTicket: true,
            menus: ['shareAppMessage', 'shareTimeline']
        })
        getApp().page.onLoad(this, options);
        var that = this;
        getApp().core.showLoading({
            title: "数据加载中...",
            mask: !0
        }), getApp().request({
            url: getApp().api.step.invite_detail,
            data: {
                page: 1
            },
            success: function(res) {
                getApp().core.hideLoading();
                var info = res.data.info, invite_list = res.data.invite_list, length = invite_list.length;
                that.setData({
                    info: info,
                    length: length,
                    invite_list: invite_list
                });
            }
        });
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {
        var that = this, over = that.data.over, invite_list = that.data.invite_list;
        if (!over) {
            var page = this.data.page;
            this.setData({
                loading: !0
            }), getApp().request({
                url: getApp().api.step.invite_detail,
                data: {
                    page: page
                },
                success: function(res) {
                    for (var i = 0; i < res.data.invite_list.length; i++) invite_list.push(res.data.invite_list[i]);
                    res.data.invite_list.length < 15 && (over = !0), that.setData({
                        page: page + 1,
                        over: over,
                        loading: !1,
                        invite_list: invite_list
                    });
                }
            });
        }
    },
    onShareAppMessage: function() {}
});