var area_picker = require("./../../components/area-picker/area-picker.js"), app = getApp(), api = getApp().api;

Page({
    data: {
        is_form_show: !1
    },
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
            title: "正在加载",
            mask: !0
        }), getApp().request({
            url: getApp().api.mch.apply,
            success: function (res) {
                getApp().core.hideLoading(), 0 == res.code && (res.data.apply && (res.data.show_result = !0),
                    that.setData(res.data), res.data.apply || that.setData({
                    is_form_show: !0
                }));
            }
        });
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
            edit_district: {
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
    },
    mchCommonCatChange: function (e) {
        this.setData({
            mch_common_cat_index: e.detail.value
        });
    },
    applySubmit: function (e) {
        var that = this;
        !that.data.entry_rules || that.data.agree_entry_rules ? (getApp().core.showLoading({
            title: "正在提交",
            mask: !0
        }), 0 === that.data.mch_common_cat_index && (that.data.mch_common_cat_index = "0"), getApp().request({
            url: getApp().api.mch.apply_submit,
            method: "post",
            data: {
                realname: e.detail.value.realname,
                tel: e.detail.value.tel,
                name: e.detail.value.name,
                province_id: e.detail.value.province_id,
                city_id: e.detail.value.city_id,
                district_id: e.detail.value.district_id,
                address: e.detail.value.address,
                mch_common_cat_id: that.data.mch_common_cat_index ? that.data.mch_common_cat_list[that.data.mch_common_cat_index].id : that.data.apply && that.data.apply.mch_common_cat_id ? that.data.apply.mch_common_cat_id : "",
                service_tel: e.detail.value.service_tel,
                form_id: e.detail.formId,
                wechat_name: e.detail.value.wechat_name
            },
            success: function (e) {
                getApp().core.hideLoading(), 0 == e.code && getApp().core.showModal({
                    title: "提示",
                    content: e.msg,
                    showCancel: !1,
                    success: function (e) {
                        e.confirm && getApp().core.redirectTo({
                            url: "/mch/apply/apply"
                        });
                    }
                }), 1 == e.code && that.showToast({
                    title: e.msg
                });
            }
        })) : getApp().core.showModal({
            title: "提示",
            content: "请先阅读并同意《入驻协议》。",
            showCancel: !1
        });
    },
    hideApplyResult: function () {
        this.setData({
            show_result: !1,
            is_form_show: !0
        });
    },
    showApplyResult: function () {
        this.setData({
            show_result: !0
        });
    },
    showEntryRules: function () {
        this.setData({
            show_entry_rules: !0
        });
    },
    disagreeEntryRules: function () {
        this.setData({
            agree_entry_rules: !1,
            show_entry_rules: !1
        });
    },
    agreeEntryRules: function () {
        this.setData({
            agree_entry_rules: !0,
            show_entry_rules: !1
        });
    }
});