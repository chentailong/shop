//成为分销商
var app = getApp(), api = app.api;
var   audit_template = '6ayhmRgcR5be3UlsfHHT4YJpHdlnUlOjBdk6fhxDkR4'    //审核状态
Page({
    data: {
        form: {
            name: "",
            mobile: ""
        },
        img: "/images/img-share-un.png",
        agree: 0,
        show_modal: !1
    },
    onLoad: function(add_shareData) {
        getApp().page.onLoad(this, add_shareData);
    },
    onReady: function() {
        getApp().page.onReady(this);
    },
    // o>that t>user e>share_setting
    onShow: function() {
        getApp().page.onShow(this);
        var that = this, user = getApp().getUser(), share_setting = getApp().core.getStorageSync(getApp().const.SHARE_SETTING);
        getApp().getConfig(function(e) {
            var userInfo = e.store, distributor = "分销商";
            userInfo && userInfo.share_custom_data && (distributor = userInfo.share_custom_data.words.share_name.name), that.setData({
                share_name: distributor
            }), wx.setNavigationBarTitle({
                title: "申请成为" + distributor
            });
        }), getApp().core.showLoading({
            title: "加载中"
        }), that.setData({
            share_setting: share_setting
        }), getApp().request({
            url: getApp().api.share.check,
            method: "POST",
            success: function(e) {
                0 == e.code && (user.is_distributor = e.data, getApp().setUser(user), 1 == e.data && getApp().core.redirectTo({
                    url: "/pages/share/index"
                })), that.setData({
                    __user_info: user
                });
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
    // t>that  e>data  a>user  o>detail
    formSubmit: function(data) {
        var that = this, user = getApp().getUser();
        if (that.data.form = data.detail.value, null != that.data.form.name && "" != that.data.form.name) if (null != that.data.form.mobile && "" != that.data.form.mobile) {
            if (/^\+?\d[\d -]{8,12}\d/.test(that.data.form.mobile)) {
                var detail = data.detail.value;
                detail.form_id = data.detail.formId, 0 != that.data.agree ? (getApp().core.showLoading({
                    title: "正在提交",
                    mask: !0
                }), getApp().request({
                    url: getApp().api.share.join,
                    method: "POST",
                    data: detail,
                    success: function(e) {
                        wx.requestSubscribeMessage({
                            tmplIds: [audit_template],
                            success(res) {
                                console.log(res)
                            },
                            fail(err) {
                                console.log(err)
                            }
                        });
                        0 == e.code ? (user.is_distributor = 2, getApp().setUser(user), getApp().core.redirectTo({
                            url: "/pages/add-share/index"
                        })) : getApp().core.showToast({
                            title: e.msg,
                            image: "/images/icon-warning.png"
                        });
                    }
                })) : getApp().core.showToast({
                    title: "请先阅读并确认分销申请协议！！",
                    image: "/images/icon-warning.png"
                });
            } else getApp().core.showModal({
                title: "提示",
                content: "手机号格式不正确",
                showCancel: !1
            });
        } else getApp().core.showToast({
            title: "请填写联系方式！",
            image: "/images/icon-warning.png"
        }); else getApp().core.showToast({
            title: "请填写姓名！",
            image: "/images/icon-warning.png"
        });
    },
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    agreement: function() {
        getApp().core.getStorageSync(getApp().const.SHARE_SETTING);
        this.setData({
            show_modal: !0
        });
    },
    // e>that  t>consent
    agree: function() {
        var that = this, consent = that.data.agree;
        0 == consent ? (consent = 1, that.setData({
            img: "/images/img-share-agree.png",
            agree: consent
        })) : 1 == consent && (consent = 0, that.setData({
            img: "/images/img-share-un.png",
            agree: consent
        }));
    },
    close: function() {
        this.setData({
            show_modal: !1,
            img: "/images/img-share-agree.png",
            agree: 1
        });
    }
});