Page({
    data: {
        address_list: null
    },
    onLoad: function(addressData) {
        wx.showShareMenu({
            withShareTicket: true,
            menus: ['shareAppMessage', 'shareTimeline']
        })
        getApp().page.onLoad(this, addressData);
    },
    // t > that
    onShow: function() {
        getApp().page.onShow(this);
        var that = this;
        getApp().core.showNavigationBarLoading(), getApp().request({
            url: getApp().api.user.address_list,
            success: function(e) {
                getApp().core.hideNavigationBarLoading(), 0 == e.code && that.setData({
                    address_list: e.data.list
                });
            }
        });
    },
    // t > pages(页数)  a > address(地址)
    pickAddress: function(e) {
        var pages = e.currentTarget.dataset.index, address = this.data.address_list[pages];
        getApp().core.setStorageSync(getApp().const.PICKER_ADDRESS, address), getApp().core.navigateBack();
    },
    getWechatAddress: function() {
        getApp().core.chooseAddress({
            success: function(e) {
                "chooseAddress:ok" == e.errMsg && (getApp().core.showLoading(), getApp().request({
                    url: getApp().api.user.add_wechat_address,
                    method: "post",
                    data: {
                        national_code: e.nationalCode,
                        name: e.userName,
                        mobile: e.telNumber,
                        detail: e.detailInfo,
                        province_name: e.provinceName,
                        city_name: e.cityName,
                        county_name: e.countyName
                    },
                    success: function(e) {
                        1 != e.code ? 0 == e.code && (getApp().core.setStorageSync(getApp().const.PICKER_ADDRESS, e.data), 
                        getApp().core.navigateBack()) : getApp().core.showModal({
                            title: "提示",
                            content: e.msg,
                            showCancel: !1
                        });
                    },
                    complete: function() {
                        getApp().core.hideLoading();
                    }
                }));
            }
        });
    }
});