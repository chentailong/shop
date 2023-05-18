var WxParse = require("../../wxParse/wxParse.js");

Page({
    data: {
        score: [ 1, 2, 3, 4, 5 ]
    },
    onLoad: function(options) {
        wx.showShareMenu({
            withShareTicket: true,
            menus: ['shareAppMessage', 'shareTimeline']
        })
        getApp().page.onLoad(this, options);
        var that = this;
        that.setData({
            shop_id: options.shop_id
        }), getApp().core.showLoading({
            title: "加载中"
        }), getApp().request({
            url: getApp().api.default.shop_detail,
            method: "GET",
            data: {
                shop_id: options.shop_id
            },
            success: function(res) {
                if (0 === res.code) {
                    that.setData(res.data);
                    var content = res.data.shop.content ? res.data.shop.content : "<span>暂无信息</span>";
                    WxParse.wxParse("detail", "html", content, that);
                } else getApp().core.showModal({
                    title: "提示",
                    content: res.msg,
                    showCancel: !1,
                    success: function(e) {
                        e.confirm && getApp().core.redirectTo({
                            url: "/pages/shop/shop"
                        });
                    }
                });
            },
            complete: function() {
                getApp().core.hideLoading();
            }
        });
    },
    onShow: function() {
        getApp().page.onShow(this);
    },
    mobile: function() {
        getApp().core.makePhoneCall({
            phoneNumber: this.data.shop.mobile
        });
    },
    goto: function() {
        var that = this;
        "undefined" != typeof my ? that.location() : getApp().core.getSetting({
            success: function(res) {
                res.authSetting["scope.userLocation"] ? that.location() : getApp().getauth({
                    content: "需要获取您的地理位置授权，请到小程序设置中打开授权！",
                    cancel: !1,
                    author: "scope.userLocation",
                    success: function(e) {
                        e.authSetting["scope.userLocation"] && that.location();
                    }
                });
            }
        });
    },
    location: function() {
        var shop = this.data.shop;
        getApp().core.openLocation({
            latitude: parseFloat(shop.latitude),
            longitude: parseFloat(shop.longitude),
            name: shop.name,
            address: shop.address
        });
    },
    onShareAppMessage: function(e) {
        getApp().page.onShareAppMessage(this);
        var USER_INFO = getApp().core.getStorageSync(getApp().const.USER_INFO);
        return {
            path: "/pages/shop-detail/shop-detail?shop_id=" + this.data.shop_id + "&user_id=" + USER_INFO.id
        };
    }
});