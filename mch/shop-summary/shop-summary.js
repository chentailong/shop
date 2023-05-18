Page({
    data: {
        markers: []
    },
    onLoad: function(options) {
        wx.showShareMenu({
            withShareTicket: true,
            menus: ['shareAppMessage', 'shareTimeline']
        })
        getApp().page.onLoad(this, options), options.mch_id && (this.setData({
            mch_id: options.mch_id
        }), this.getShopData());
    },
    onShow: function() {
        getApp().page.onShow(this);
    },
    getShopData: function() {
        var that = this;
        getApp().core.showLoading({
            title: "加载中"
        }), getApp().request({
            url: getApp().api.mch.shop,
            data: {
                mch_id: that.data.mch_id,
                tab: 0,
                cat_id: 0
            },
            success: function(res) {
                if (0 == res.code) {
                    var shop = res.data.shop, markers = [ {
                        iconPath: "/mch/images/img-map.png",
                        id: 0,
                        width: 20,
                        height: 43,
                        longitude: shop.longitude,
                        latitude: shop.latitude
                    } ];
                    that.setData({
                        markers: markers,
                        shop: res.data.shop
                    });
                }
            },
            complete: function() {
                getApp().core.hideLoading(), that.setData({
                    loading: !1
                });
            }
        });
    },
    callPhone: function(t) {
        getApp().core.makePhoneCall({
            phoneNumber: t.target.dataset.info
        });
    },
    map_power: function() {
        var that = this;
        getApp().getConfig(function(t) {
            var shop = that.data.shop;
            void 0 !== shop ? that.map_goto(shop) : getApp().core.getSetting({
                success: function(t) {
                    t.authSetting["scope.userLocation"] ? that.map_goto(shop) : getApp().getauth({
                        content: "需要获取您的地理位置授权，请到小程序设置中打开授权！",
                        cancel: !1,
                        author: "scope.userLocation",
                        success: function(t) {
                            t.authSetting["scope.userLocation"] && that.map_goto(shop);
                        }
                    });
                }
            });
        });
    },
    map_goto: function(t) {
        getApp().core.openLocation({
            latitude: parseFloat(t.latitude),
            longitude: parseFloat(t.longitude),
            address: t.address
        });
    }
});