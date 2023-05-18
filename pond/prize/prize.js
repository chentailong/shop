Page({
    data: {
        args: !1,
        page: 1
    },
    onLoad: function(t) {
        wx.showShareMenu({
            withShareTicket: true,
            menus: ['shareAppMessage', 'shareTimeline']
        })
        getApp().page.onLoad(this, t);
    },
    onShow: function() {
        getApp().page.onShow(this);
        var that = this;
        getApp().core.showLoading({
            title: "加载中"
        }), getApp().request({
            url: getApp().api.pond.prize,
            data: {
                page: 1
            },
            success: function(t) {
                0 != t.code || that.setData({
                    list: t.data
                });
            },
            complete: function(t) {
                getApp().core.hideLoading();
            }
        });
    },
    onReachBottom: function() {
        getApp().page.onReachBottom(this);
        var that = this;
        if (!that.data.args) {
            var page = that.data.page + 1;
            getApp().request({
                url: getApp().api.pond.prize,
                data: {
                    page: page
                },
                success: function(res) {
                    0 == res.code ? that.setData({
                        list: that.data.list.concat(res.data),
                        page: page
                    }) : that.data.args = !0;
                }
            });
        }
    },
    submit: function(t) {
        var goods_id = t.currentTarget.dataset.gift, attr = JSON.parse(t.currentTarget.dataset.attr), id = t.currentTarget.dataset.id;
        getApp().core.navigateTo({
            url: "/pages/order-submit/order-submit?pond_id=" + id + "&goods_info=" + JSON.stringify({
                goods_id: goods_id,
                attr: attr,
                num: 1
            })
        });
    }
});