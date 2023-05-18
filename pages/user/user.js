Page({
    data: {
        contact_tel: "",
        show_customer_service: 0
    },
    onLoad: function (options) {
        wx.showShareMenu({
            withShareTicket: true,
            menus: ['shareAppMessage', 'shareTimeline']
        })
        getApp().page.onLoad(this, options);
    },
    loadData: function (e) {
        var that = this;
        that.setData({
            store: getApp().core.getStorageSync(getApp().const.STORE)
        }), getApp().request({
            url: getApp().api.user.index,
            success: function (res) {
                console.log(res)
                if (0 === res.code) {
                    if ("my" === that.data.__platform) res.data.menus.forEach(function (e, t, a) {
                        "bangding" === e.id && res.data.menus.splice(t, 1, 0);
                    });
                    that.setData(res.data), getApp().core.setStorageSync(getApp().const.PAGES_USER_USER, res.data),
                        getApp().core.setStorageSync(getApp().const.SHARE_SETTING, res.data.share_setting),
                        getApp().core.setStorageSync(getApp().const.USER_INFO, res.data.user_info);
                }
            }
        });
    },
    onReady: function (e) {
        getApp().page.onReady(this);
    },
    onShow: function (e) {
        getApp().page.onShow(this);
        this.loadData();
    },
    callTel: function (e) {
        var t = e.currentTarget.dataset.tel;
        getApp().core.makePhoneCall({
            phoneNumber: t
        });
    },
    apply: function (t) {
        var setting = getApp().core.getStorageSync(getApp().const.SHARE_SETTING), user = getApp().getUser();
        1 === setting.share_condition ? getApp().core.navigateTo({
            url: "/pages/add-share/index"
        }) : 0 !== setting.share_condition && 2 !== setting.share_condition || (0 === user.is_distributor ? getApp().core.showModal({
            title: "申请成为" + this.data.store.share_custom_data.words.share_name.name,
            content: "是否申请？",
            success: function (e) {
                e.confirm && (getApp().core.showLoading({
                    title: "正在加载",
                    mask: !0
                }), getApp().request({
                    url: getApp().api.share.join,
                    method: "POST",
                    data: {
                        form_id: t.detail.formId
                    },
                    success: function (e) {
                        0 === e.code && (0 === setting.share_condition ? (user.is_distributor = 2, getApp().core.navigateTo({
                            url: "/pages/add-share/index"
                        })) : (user.is_distributor = 1, getApp().core.navigateTo({
                            url: "/pages/share/index"
                        })), getApp().core.setStorageSync(getApp().const.USER_INFO, user));
                    },
                    complete: function () {
                        getApp().core.hideLoading();
                    }
                }));
            }
        }) : getApp().core.navigateTo({
            url: "/pages/add-share/index"
        }));
    },
    verify: function (e) {
        getApp().core.scanCode({
            onlyFromCamera: !1,
            success: function (e) {
                getApp().core.navigateTo({
                    url: "/" + e.path
                });
            },
            fail: function (e) {
                getApp().core.showToast({
                    title: "失败"
                });
            }
        });
    },
    member: function () {
        getApp().core.navigateTo({
            url: "/pages/member/member"
        });
    },
    integral_mall: function (e) {
        var t, a;
        getApp().permission_list && getApp().permission_list.length && (t = getApp().permission_list,
            a = "integralmall", -1 !== ("," + t.join(",") + ",").indexOf("," + a + ",")) && getApp().core.navigateTo({
            url: "/pages/integral-mall/index/index"
        });
    },
    clearCache: function () {
        wx.showActionSheet({
            itemList: ["清除缓存"],
            success: function (e) {
                if (0 === e.tapIndex) {
                    wx.showLoading({
                        title: "清除中..."
                    });
                    getApp().getStoreData();
                    setInterval(function () {
                        wx.hideLoading();
                    }, 1e3);
                }
            }
        });
    },
    store: function () {
        wx.navigateTo({
            url: "/manage/index/index/index"
        })
    },
});