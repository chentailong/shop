var area_picker = require("./../../../components/area-picker/area-picker.js"), app = getApp(), api = getApp().api;

Page({
    data: {},
    onLoad: function (options) {
        wx.showShareMenu({
            withShareTicket: true,
            menus: ['shareAppMessage', 'shareTimeline']
        })
        getApp().page.onLoad(this, options);
        var that = this;
        that.getDistrictData(function (data) {
            area_picker.init({
                page: that,
                data: data
            });
        }), getApp().core.showLoading({
            title: "正在加载"
        }), getApp().request({
            url: getApp().api.mch.user.setting,
            success: function (res) {
                getApp().core.hideLoading(), that.setData(res.data);
            }
        });
    },
    getDistrictData: function (event) {
        var district = getApp().core.getStorageSync(getApp().const.DISTRICT);
        if (!district) return getApp().core.showLoading({
            title: "正在加载",
            mask: !0
        }), void getApp().request({
            url: getApp().api.default.district,
            success: function (res) {
                getApp().core.hideLoading(), 0 === res.code && (district = res.data, getApp().core.setStorageSync(getApp().const.DISTRICT, district),
                    event(district));
            }
        });
        event(district);
    },
    onAreaPickerConfirm: function (t) {
        this.setData({
            edit_district: {
                province: {
                    id: t[0].id,
                    name: t[0].name
                },
                city: {
                    id: t[1].id,
                    name: t[1].name
                },
                district: {
                    id: t[2].id,
                    name: t[2].name
                }
            }
        });
    },
    mchCommonCatChange: function (t) {
        this.setData({
            mch_common_cat_index: t.detail.value
        });
    },
    formSubmit: function (event) {
        var that = this;
        getApp().core.showLoading({
            title: "正在提交",
            mask: !0
        }), event.detail.value.form_id = event.detail.formId, event.detail.value.mch_common_cat_id = that.data.mch_common_cat_index ?
            that.data.mch_common_cat_list[that.data.mch_common_cat_index].id : that.data.mch && that.data.mch.mch_common_cat_id ? that.data.mch.mch_common_cat_id : "",
            getApp().request({
                url: getApp().api.mch.user.setting_submit,
                method: "post",
                data: event.detail.value,
                success: function (res) {
                    getApp().core.hideLoading(), 0 == res.code ? getApp().core.showModal({
                        title: "提示",
                        content: res.msg,
                        showCancel: !1,
                        success: function (t) {
                            t.confirm && getApp().core.navigateBack({
                                delta: 1
                            });
                        }
                    }) : that.showToast({
                        title: res.msg
                    });
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
    uploadLogo: function () {
        var that = this;
        getApp().uploader.upload({
            start: function (t) {
                getApp().core.showLoading({
                    title: "正在上传",
                    mask: !0
                });
            },
            success: function (res) {
                0 === res.code ? (that.data.mch.logo = res.data.url, that.setData({
                    mch: that.data.mch
                })) : that.showToast({
                    title: res.msg
                });
            },
            error: function (err) {
                that.showToast({
                    title: err
                });
            },
            complete: function () {
                getApp().core.hideLoading();
            }
        });
    },
    uploadHeaderBg: function () {
        var that = this;
        getApp().uploader.upload({
            start: function (t) {
                getApp().core.showLoading({
                    title: "正在上传",
                    mask: !0
                });
            },
            success: function (res) {
                0 == res.code ? (that.data.mch.header_bg = res.data.url, that.setData({
                    mch: res.data.mch
                })) : that.showToast({
                    title: res.msg
                });
            },
            error: function (err) {
                that.showToast({
                    title: err
                });
            },
            complete: function () {
                getApp().core.hideLoading();
            }
        });
    }
});