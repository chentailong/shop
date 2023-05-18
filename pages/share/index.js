var app = getApp(), api = app.api;

Page({
    data: {
        total_price: 0,
        price: 0,
        cash_price: 0,
        total_cash: 0,
        team_count: 0,
        order_money: 0
    },
    onLoad: function(e) {
        wx.showShareMenu({
            withShareTicket: true,
            menus: ['shareAppMessage', 'shareTimeline']
        })
        getApp().page.onLoad(this, e);
        this.setData({
            custom: getApp().core.getStorageSync(getApp().const.CUSTOM)
        });
    },
    onReady: function() {
        getApp().page.onReady(this);
    },
    onShow: function() {
        getApp().page.onShow(this);
        var that = this, setting = getApp().core.getStorageSync(getApp().const.SHARE_SETTING), user_info = that.data.__user_info;
        that.setData({
            share_setting: setting
        }), user_info && 1 === user_info.is_distributor ? that.checkUser() : that.loadData();
    },
    checkUser: function() {
        var that = this;
        getApp().core.showLoading({
            title: "正在加载",
            mask: !0
        }), getApp().request({
            url: getApp().api.share.get_info,
            success: function(res) {
                0 === res.code && (that.setData({
                    total_price: res.data.price.total_price,
                    price: res.data.price.price,
                    cash_price: res.data.price.cash_price,
                    total_cash: res.data.price.total_cash,
                    team_count: res.data.team_count,
                    order_money: res.data.order_money,
                    custom: res.data.custom,
                    order_money_un: res.data.order_money_un
                }), getApp().core.setStorageSync(getApp().const.CUSTOM, res.data.custom), that.loadData()),
                1 === res.code && (__user_info.is_distributor = res.data.is_distributor, that.setData({
                    __user_info: __user_info
                }), getApp().setUser(__user_info));
            },
            complete: function() {
                getApp().core.hideLoading();
            }
        });
    },
    loadData: function() {
        var that = this;
        getApp().core.showLoading({
            title: "正在加载",
            mask: !0
        }), getApp().request({
            url: getApp().api.share.index,
            success: function(e) {
                if (0 == e.code) {
                    if (e.data.share_setting) var share_setting = e.data.share_setting; else share_setting = e.data;
                    getApp().core.setStorageSync(getApp().const.SHARE_SETTING, share_setting), that.setData({
                        share_setting: share_setting
                    });
                }
            },
            complete: function() {
                getApp().core.hideLoading();
            }
        });
    },
    onHide: function() {
        getApp().page.onHide(this);
    },
    onUnload: function() {
        getApp().page.onUnload(this);
    },
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    apply: function(t) {
        var share = getApp().core.getStorageSync(getApp().const.SHARE_SETTING), user = getApp().getUser();
        1 === share.share_condition ? getApp().core.navigateTo({
            url: "/pages/add-share/index"
        }) : 0 !== share.share_condition && 2 !== share.share_condition || (0 === user.is_distributor ? getApp().core.showModal({
            title: "申请成为" + (this.data.custom.share_name || "分销商"),
            content: "是否申请？",
            success: function(e) {
                e.confirm && (getApp().core.showLoading({
                    title: "正在加载",
                    mask: !0
                }), getApp().request({
                    url: getApp().api.share.join,
                    method: "POST",
                    data: {
                        form_id: t.detail.formId
                    },
                    success: function(e) {
                        0 === e.code && (0 === share.share_condition ? (user.is_distributor = 2, getApp().core.navigateTo({
                            url: "/pages/add-share/index"
                        })) : (user.is_distributor = 1, getApp().core.redirectTo({
                            url: "/pages/share/index"
                        })), getApp().setUser(user));
                    },
                    complete: function() {
                        getApp().core.hideLoading();
                    }
                }));
            }
        }) : getApp().core.navigateTo({
            url: "/pages/add-share/index"
        }));
    }
});