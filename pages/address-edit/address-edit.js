var area_picker = require("./../../components/area-picker/area-picker.js");

Page({
    data: {
        name: "",
        mobile: "",
        detail: "",
        district: null
    },

    onLoad: function (address) {
        getApp().page.onLoad(this, address);
        var that = this;

        that.getDistrictData(function (data) {
            area_picker.init({
                page: that,
                data: data
            });
        }), that.setData({
            address_id: address.id
        }), address.id && (getApp().core.showLoading({
            title: "正在加载",
            mask: !0
        }), getApp().request({
            url: getApp().api.user.address_detail,
            data: {
                id: address.id
            },
            success: function (e) {
                getApp().core.hideLoading(), 0 == e.code && that.setData(e.data);
            }
        }));
    },

    getDistrictData: function (t) {
        var district = getApp().core.getStorageSync(getApp().const.DISTRICT);
        if (!district) return getApp().core.showLoading({
            title: "正在加载",
            mask: !0
        }), void getApp().request({
            url: getApp().api.default.district,
            success: function (e) {
                getApp().core.hideLoading(), 0 == e.code && (district = e.data, getApp().core.setStorageSync(getApp().const.DISTRICT, district),
                    t(district));
            }
        });
        t(district);
    },
    onAreaPickerConfirm: function (e) {
        this.setData({
            district: {
                province: {
                    id: e[0].id,
                    name: e[0].name
                },
                city: {
                    id: e[1].id,
                    name: e[1].name
                },
                district: {
                    id: e[2].id,
                    name: e[2].name
                }
            }
        });
    },
    //保存地址
    saveAddress: function () {
        var that = this;
        getApp().core.showLoading({
            title: "正在保存",
            mask: !0
        });
        var district = that.data.district;
        district|| (district = {
            province: {
                id: ""
            },
            city: {
                id: ""
            },
            district: {
                id: ""
            }
        }), getApp().request({
            url: getApp().api.user.address_save,
            method: "post",
            data: {
                address_id: that.data.address_id || "",
                name: that.data.name,
                mobile: that.data.mobile,
                province_id: district.province.id,
                city_id: district.city.id,
                district_id: district.district.id,
                detail: that.data.detail
            },
            success: function (e) {
                getApp().core.hideLoading(), 0 == e.code && getApp().core.showModal({
                    title: "提示",
                    content: e.msg,
                    showCancel: !1,
                    success: function (e) {
                        e.confirm && getApp().core.navigateBack();
                    }
                }), 1 == e.code && that.showToast({
                    title: e.msg
                });
            }
        });
    },

    inputBlur: function (e) {
        var message = '{"' + e.currentTarget.dataset.name + '":"' + e.detail.value + '"}';
        this.setData(JSON.parse(message));
    },

    getWechatAddress: function () {
        var that = this;
        getApp().core.chooseAddress({
            success: function (t) {
                "chooseAddress:ok" == t.errMsg && (getApp().core.showLoading(), getApp().request({
                    url: getApp().api.user.wechat_district,
                    data: {
                        national_code: t.nationalCode,
                        province_name: t.provinceName,
                        city_name: t.cityName,
                        county_name: t.countyName
                    },
                    success: function (e) {
                        1 == e.code && getApp().core.showModal({
                            title: "提示",
                            content: e.msg,
                            showCancel: !1
                        }), that.setData({
                            name: t.userName || "",
                            mobile: t.telNumber || "",
                            detail: t.detailInfo || "",
                            district: e.data.district
                        });
                    },
                    complete: function () {
                        getApp().core.hideLoading();
                    }
                }));
            }
        });
    },
    onShow: function () {
        getApp().page.onShow(this);
    }
});