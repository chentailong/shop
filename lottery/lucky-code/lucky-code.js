var is_loading = !1;

Page({
    data: {
        page: 1,
        num: 0
    },
    onLoad: function(options) {
        wx.showShareMenu({
            withShareTicket: true,
            menus: ['shareAppMessage', 'shareTimeline']
        })
        if (getApp().page.onLoad(this, options), options) {
            var that = this;
            that.setData(options), getApp().core.showLoading({
                title: "加载中"
            }), getApp().request({
                url: getApp().api.lottery.lucky_code,
                data: {
                    id: options.id
                },
                success: function(res) {
                    if (0 == res.code) {
                        that.setData(res.data);
                        var data = res.data;
                        if (data.award && data.award.lucky_code == res.data.own.lucky_code) var num = res.data.parent.length; else num = res.data.parent.length + 1;
                        that.setData({
                            num: num
                        });
                    }
                },
                complete: function(a) {
                    getApp().core.hideLoading();
                }
            });
        }
    },
    onShow: function() {
        getApp().page.onShow(this);
    },
    userload: function() {
        if (!is_loading) {
            is_loading = !0, getApp().core.showLoading({
                title: "加载中"
            });
            var that = this, page = that.data.page + 1;
            getApp().request({
                url: getApp().api.lottery.lucky_code,
                data: {
                    id: that.data.id,
                    page: page
                },
                success: function(res) {
                    if (0 == res.code) {
                        if (null == res.data.parent || 0 == res.data.parent.length) return void (is_loading = !0);
                        that.setData({
                            parent: that.data.parent.concat(res.data.parent),
                            page: page,
                            num: that.data.parent.concat(res.data.parent).length
                        });
                    } else that.showToast({
                        title: res.msg
                    });
                },
                complete: function() {
                    getApp().core.hideLoading(), this.data.is_loading = !1;
                }
            });
        }
    }
});