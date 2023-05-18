Page({
    data: {
        page_num: 1,
        is_loading: !1
    },
    onLoad: function(options) {
        wx.showShareMenu({
            withShareTicket: true,
            menus: ['shareAppMessage', 'shareTimeline']
        })
        getApp().page.onLoad(this, options);
        var that = this;
        getApp().core.showLoading({
            title: "加载中"
        }), getApp().request({
            url: getApp().api.lottery.detail,
            data: {
                id: options.id ? options.id : 0,
                lottery_id: options.lottery_id ? options.lottery_id : 0,
                form_id: options.form_id,
                page_num: 1
            },
            success: function(t) {
                0 == t.code && that.setData(t.data);
            },
            complete: function(t) {
                getApp().core.hideLoading();
            }
        }), getApp().request({
            url: getApp().api.lottery.setting,
            success: function(res) {
                if (0 == res.code) {
                    var title = res.data.title;
                    title && (getApp().core.setNavigationBarTitle({
                        title: title
                    }), that.setData({
                        title: title
                    }));
                }
            }
        });
    },
    submit: function(t) {
        var goods_id = this.data.list.goods_id, attr = JSON.parse(this.data.list.attr);
        getApp().core.navigateTo({
            url: "/pages/order-submit/order-submit?lottery_id=" + this.data.list.id + "&goods_info=" + JSON.stringify({
                goods_id: goods_id,
                attr: attr,
                num: 1
            })
        });
    },
    userload: function() {
        var that = this;
        if (!that.data.is_loading) {
            that.data;
            var page_num = that.data.page_num + 1;
            getApp().core.showLoading({
                title: "加载中"
            }), getApp().request({
                url: getApp().api.lottery.detail,
                data: {
                    id: this.data.list.id,
                    page_num: page_num
                },
                success: function(t) {
                    if (0 == t.code) {
                        if (null == t.data.user_list || 0 == t.data.user_list) return void that.setData({
                            is_loading: !0
                        });
                        that.setData({
                            user_list: that.data.user_list.concat(t.data.user_list),
                            page_num: page_num
                        });
                    }
                },
                complete: function(t) {
                    getApp().core.hideLoading();
                }
            });
        }
    },
    onShareAppMessage: function() {
        getApp().page.onShareAppMessage(this), getApp().core.hideLoading();
        var user = getApp().getUser(), lottery_id = this.data.list.lottery_id;
        return {
            path: "/lottery/goods/goods?user_id=" + user.id + "&id=" + lottery_id,
            title: this.data.title ? this.data.title : "抽奖"
        };
    }
});