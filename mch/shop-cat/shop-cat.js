var app = getApp(), api = getApp().api;

Page({
    data: {
        list: [{
            id: 1,
            name: "上衣"
        }, {
            id: 2,
            name: "下装",
            list: [{
                id: 3,
                name: "长裤"
            }, {
                id: 4,
                name: "长裤"
            }, {
                id: 5,
                name: "九分裤"
            }, {
                id: 6,
                name: "短裤"
            }]
        }, {
            id: 7,
            name: "帽子"
        }]
    },
    onLoad: function (options) {
        wx.showShareMenu({
            withShareTicket: true,
            menus: ['shareAppMessage', 'shareTimeline']
        })
        getApp().page.onLoad(this, options);
        var that = this;
        that.setData({
            mch_id: options.mch_id,
            cat_id: options.cat_id || ""
        });
        var mch_id = "shop_cat_list_mch_id_" + that.data.mch_id, list = getApp().core.getStorageSync(mch_id);
        list && that.setData({
            list: list
        }), getApp().core.showNavigationBarLoading(), getApp().request({
            url: getApp().api.mch.shop_cat,
            data: {
                mch_id: that.data.mch_id
            },
            success: function (res) {
                0 == res.code && (that.setData({
                    list: res.data.list
                }), getApp().core.setStorageSync(mch_id, res.data.list));
            },
            complete: function () {
                getApp().core.hideNavigationBarLoading();
            }
        });
    },
    onReady: function () {
        getApp().page.onReady(this);
    },
    onShow: function () {
        getApp().page.onShow(this);
    },
    onHide: function () {
        getApp().page.onHide(this);
    },
    onUnload: function () {
        getApp().page.onUnload(this);
    },
    onPullDownRefresh: function () {
    },
    onReachBottom: function () {
    }
});