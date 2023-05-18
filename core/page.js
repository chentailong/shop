module.exports = {
    currentPage: null,
    currentPageOptions: {},
    userinfo : {},
    navbarPages: [
        "pages/index/index",
        "pages/cat/cat",
        "pages/cart/cart",
        "pages/user/user",
        "pages/list/list",
        "pages/search/search",
        "pages/topic-list/topic-list",
        "pages/video/video-list",
        "pages/miaosha/miaosha",
        "pages/shop/shop",
        "pages/pt/index/index",
        "pages/book/index/index",
        "pages/share/index",
        "pages/quick-purchase/index/index",
        "mch/m/myshop/myshop",
        "mch/shop-list/shop-list",
        "pages/integral-mall/index/index",
        "pages/integral-mall/register/index",
        "pages/article-detail/article-detail",
        "pages/article-list/article-list",
        "pages/order/order",
        "pages/set-pwd/set-pwd"
    ],
    onLoad: function (currentPage, currentPageOptions) {
        this.currentPage = currentPage, this.currentPageOptions = currentPageOptions;
        var that = this;
        if (this.setUserInfo(), this.setWxappImg(), this.setStore(), this.setParentId(currentPageOptions),
            this.getNavigationBarColor(), this.setDeviceInfo(), this.setPageClasses(), this.setPageNavbar(),
            this.setBarTitle(), "function" == typeof currentPage.onSelfLoad && currentPage.onSelfLoad(currentPageOptions), that._setFormIdSubmit(),
        "undefined" != typeof my && "pages/login/login" !== currentPage.route && currentPageOptions && (currentPage.options || (currentPage.options = currentPageOptions),
            getApp().core.setStorageSync("last_page_options", currentPageOptions)), "lottery/goods/goods" === currentPage.route && currentPageOptions) {
            if (currentPageOptions.user_id) var user_id = currentPageOptions.user_id,
                lottery_id = currentPageOptions.id; else if (currentPageOptions.scene && isNaN(currentPageOptions.scene)) {
                var scene = decodeURIComponent(currentPageOptions.scene);
                if (scene && (scene = getApp().helper.scene_decode(scene)) && scene.uid) user_id = scene.uid, lottery_id = scene.gid;
            }
            getApp().request({
                data: {
                    user_id: user_id,
                    lottery_id: lottery_id
                },
                url: getApp().api.lottery.clerk,
                success: function (e) {
                    e.code;
                }
            });
        }
        currentPage.navigatorClick = function (e) {
            that.navigatorClick(e, currentPage);
        }, currentPage.setData({
            __platform: getApp().platform
        }), void 0 === currentPage.showToast && (currentPage.showToast = function (e) {
            that.showToast(e);
        }), getApp().shareSendCoupon = function (e) {
            that.shareSendCoupon(e);
        }, void 0 === currentPage.setTimeList && (currentPage.setTimeList = function (e) {
            return that.setTimeList(e);
        }), void 0 === currentPage.showLoading && (currentPage.showLoading = function (e) {
            that.showLoading(e);
        }), void 0 === currentPage.hideLoading && (currentPage.hideLoading = function (e) {
            that.hideLoading(e);
        }), void 0 === currentPage.modalConfirm && (currentPage.modalConfirm = function (e) {
            that.modalConfirm(e);
        }), void 0 === currentPage.modalClose && (currentPage.modalClose = function (e) {
            that.modalClose(e);
        }), void 0 === currentPage.modalShow && (currentPage.modalShow = function (e) {
            that.modalShow(e);
        }), void 0 === currentPage.myLogin && (currentPage.myLogin = function () {
            that.myLogin();
        }), void 0 === currentPage.getUserProfile && (currentPage.getUserProfile = function (e) {
            that.getUserProfile(e);
        }), void 0 === currentPage.getPhoneNumber && (currentPage.getPhoneNumber = function (e) {
            that.getPhoneNumber(e);
        }), void 0 === currentPage.bindParent && (currentPage.bindParent = function (e) {
            that.bindParent(e);
        }), void 0 === currentPage.closeCouponBox && (currentPage.closeCouponBox = function (e) {
            that.closeCouponBox(e);
        }), void 0 === currentPage.relevanceSuccess && (currentPage.relevanceSuccess = function (e) {
            that.relevanceSuccess(e);
        }), void 0 === currentPage.relevanceError && (currentPage.relevanceError = function (e) {
            that.relevanceError(e);
        }), void 0 === currentPage.setUserInfoShowFalse && (currentPage.setUserInfoShowFalse = function () {
            that.setUserInfoShowFalse();
        });

    },
    onReady: function (e) {
        this.currentPage = e;
    },
    onShow: function (e) {
        this.currentPage = e, getApp().orderPay.init(e, getApp()), require("../components/quick-navigation/quick-navigation.js").init(this.currentPage);
    },
    onHide: function (e) {
        this.currentPage = e;
    },
    onUnload: function (e) {
        this.currentPage = e;
    },
    onPullDownRefresh: function (e) {
        this.currentPage = e;
    },
    onReachBottom: function (e) {
        this.currentPage = e;
    },
    onShareAppMessage: function (e) {
        this.currentPage = e, setTimeout(function () {
            getApp().shareSendCoupon(e);
        }, 1e3);
    },
    imageClick: function (e) {
        console.log("image click", e);
    },
    textClick: function (e) {
        console.log("text click", e);
    },
    tap1: function (e) {
        console.log("tap1", e);
    },
    tap2: function (e) {
        console.log("tap2", e);
    },
    formSubmit_collect: function (e) {
        e.detail.formId;
        console.log("formSubmit_collect--\x3e", e);
    },
    setUserInfo: function () {
        var currentPage = this.currentPage, user = getApp().getUser();
        user && currentPage.setData({
            __user_info: user
        });
    },
    setWxappImg: function (e) {
        var currentPage = this.currentPage;
        getApp().getConfig(function (info) {
            currentPage.setData({
                __wxapp_img: info.wxapp_img,
                store: info.store
            });
        });
    },
    setStore: function (e) {
        var currentPage = this.currentPage;
        getApp().getConfig(function (info) {
            info.store && currentPage.setData({
                store: info.store,
                __is_comment: info.store ? info.store.is_comment : 1,
                __is_sales: info.store ? info.store.is_sales : 1,
                __is_member_price: info.store ? info.store.is_member_price : 1,
                __is_share_price: info.store ? info.store.is_share_price : 1,
                __alipay_mp_config: info.alipay_mp_config
            });
        });
    },
    setParentId: function (info) {
        var currentPage = this.currentPage;
        if ("/pages/index/index" == currentPage.route && this.setOfficalAccount(), info) {
            var id = 0;
            if (info.user_id) id = info.user_id; else if (info.scene) {
                if (isNaN(info.scene)) {
                    var scene = decodeURIComponent(info.scene);
                    scene(scene = getApp().helper.scene_decode(scene)) && scene.uid && (id = scene.uid);
                } else -1 == currentPage.route.indexOf("clerk") && (id = info.scene);
                this.setOfficalAccount();
            } else if (null !== getApp().query) {
                var query = getApp().query;
                id = query.uid;
            }
            id && void 0 !== id && (getApp().core.setStorageSync(getApp().const.PARENT_ID, id),
                getApp().trigger.remove(getApp().trigger.events.login, "TRY_TO_BIND_PARENT"), getApp().trigger.add(getApp().trigger.events.login, "TRY_TO_BIND_PARENT", function () {
                currentPage.bindParent({
                    parent_id: id,
                    condition: 0
                });
            }));
        }
    },
    showToast: function (hint) {
        var currentPage = this.currentPage, duration = hint.duration || 2500, title = hint.title || "",
            returned = (hint.success,
                hint.fail, hint.complete || null);
        currentPage._toast_timer && clearTimeout(currentPage._toast_timer), currentPage.setData({
            _toast: {
                title: title
            }
        }), currentPage._toast_timer = setTimeout(function () {
            var toast = currentPage.data._toast;
            toast.hide = !0, currentPage.setData({
                _toast: toast
            }), "function" == typeof returned && a();
        }, duration);
    },
    setDeviceInfo: function () {
        var currentPage = this.currentPage, phone = [{
            id: "device_iphone_5",
            model: "iPhone 5"
        }, {
            id: "device_iphone_x",
            model: "iPhone X"
        }], info = getApp().core.getSystemInfoSync();
        if (info.model) for (var i in 0 <= info.model.indexOf("iPhone X") && (info.model = "iPhone X"),
            phone) phone[i].model == info.model && currentPage.setData({
            __device: phone[i].id
        });
    },
    setPageNavbar: function () {
        var that = this, r = this.currentPage, e = getApp().core.getStorageSync("_navbar");
        e && a(e);
        var o = !1;
        for (var n in that.navbarPages) if (r.route == that.navbarPages[n]) {
            o = !0;
            break;
        }

        function a(e) {
            var t = !1;
            for (var o in e.navs) {
                var n = e.navs[o].url, a = r.route || r.__route__ || null;
                for (var i in n = e.navs[o].new_url, r.options) getApp().helper.inArray(i, ["scene", "user_id", "uid"]) || (-1 == a.indexOf("?") ? a += "?" : a += "&",
                    a += i + "=" + r.options[i]);
                n === "/" + a ? t = e.navs[o].active = !0 : e.navs[o].active = !1;
            }
            t && r.setData({
                _navbar: e
            });
        }

        o && getApp().request({
            data: {hideLogin: 1},
            url: getApp().api.default.navbar,
            success: function (e) {
                0 == e.code && (a(e.data), getApp().core.setStorageSync("_navbar", e.data), that.setPageClasses());
            }
        });
    },
    setPageClasses: function () {
        var e = this.currentPage, t = e.data.__device;
        e.data._navbar && e.data._navbar.navs && 0 < e.data._navbar.navs.length && (t += " show_navbar"),
        t && e.setData({
            __page_classes: t
        });
    },
    showLoading: function (e) {
        var t = t;
        t.setData({
            _loading: !0
        });
    },
    hideLoading: function (e) {
        this.currentPage.setData({
            _loading: !1
        });
    },
    setTimeList: function (e) {
        function t(e) {
            return e <= 0 && (e = 0), e < 10 ? "0" + e : e;
        }

        var o = "00", n = "00", a = "00", i = 0, r = "", s = "", c = "";
        if (86400 <= e && (i = parseInt(e / 86400), e %= 86400, r += i + "天", s += i + "天",
            c += i + "天"), e < 86400) {
            var p = parseInt(e / 3600);
            e %= 3600, r += (a = t(p)) + "小时", s += a + ":", c = 0 < i || 0 < p ? c + a + ":" : "";
        }
        return e < 3600 && (n = t(parseInt(e / 60)), e %= 60, r += n + "分", s += n + ":",
            c += n + ":"), e < 60 && (r += (o = t(e)) + "秒", s += o, c += o), {
            d: i,
            h: a,
            m: n,
            s: o,
            content: r,
            content_1: s,
            content_ms: c
        };
    },
    setBarTitle: function (e) {
        var t = this.currentPage.route, o = getApp().core.getStorageSync(getApp().const.WX_BAR_TITLE);
        for (var n in o) o[n].url === t && getApp().core.setNavigationBarTitle({
            title: o[n].title
        });
    },
    getNavigationBarColor: function () {
        var t = getApp(), o = this;
        t.request({
            data: {hideLogin: 1},
            url: t.api.default.navigation_bar_color,
            success: function (e) {
                0 == e.code && (t.core.setStorageSync(getApp().const.NAVIGATION_BAR_COLOR, e.data),
                    o.setNavigationBarColor(), t.navigateBarColorCall && "function" == typeof t.navigateBarColorCall && t.navigateBarColorCall(e));
            }
        });
    },
    setNavigationBarColor: function () {
        var t = this.currentPage, e = getApp().core.getStorageSync(getApp().const.NAVIGATION_BAR_COLOR);
        e && (getApp().core.setNavigationBarColor(e), t.setData({
            _navigation_bar_color: e
        })), getApp().navigateBarColorCall = function (e) {
            getApp().core.setNavigationBarColor(e.data), t.setData({
                _navigation_bar_color: e.data
            });
        };
    },
    navigatorClick: function (e, t) {
        var o = e.currentTarget.dataset.open_type;
        if ("redirect" == o) return !0;
        if ("wxapp" != o) {
            if ("tel" == o) {
                var n = e.currentTarget.dataset.tel;
                getApp().core.makePhoneCall({
                    phoneNumber: n
                });
            }
            return !1;
        }
    },
    shareSendCoupon: function (o) {
        var n = getApp();
        n.core.showLoading({
            mask: !0
        }), o.hideGetCoupon || (o.hideGetCoupon = function (e) {
            var t = e.currentTarget.dataset.url || !1;
            o.setData({
                get_coupon_list: null
            }), t && n.core.navigateTo({
                url: t
            });
        }), n.request({
            url: n.api.coupon.share_send,
            success: function (e) {
                0 == e.code && o.setData({
                    get_coupon_list: e.data.list
                });
            },
            complete: function () {
                n.core.hideLoading();
            }
        });
    },
    bindParent: function (e) {
        var t = getApp();
        if ("undefined" != e.parent_id && 0 != e.parent_id) {
            var o = t.getUser();
            if (0 < t.core.getStorageSync(t.const.SHARE_SETTING).level) 0 != e.parent_id && t.request({
                url: t.api.share.bind_parent,
                data: {
                    parent_id: e.parent_id,
                    condition: e.condition
                },
                success: function (e) {
                    0 == e.code && (o.parent = e.data, t.setUser(o));
                }
            });
        }
    },
    _setFormIdSubmit: function (e) {
        var g = this.currentPage;
        g._formIdSubmit || (g._formIdSubmit = function (e) {
            var t = e.currentTarget.dataset, o = e.detail.formId, n = t.bind || null, a = t.type || null,
                i = t.url || null, r = t.appId || null, s = getApp().core.getStorageSync(getApp().const.FORM_ID_LIST);
            s && s.length || (s = []);
            var c = [];
            for (var p in s) c.push(s[p].form_id);
            switch (console.log("form_id"), "the formId is a mock one" === o || getApp().helper.inArray(o, c) || (s.push({
                time: getApp().helper.time(),
                form_id: o
            }), getApp().core.setStorageSync(getApp().const.FORM_ID_LIST, s)), g[n] && "function" == typeof g[n] && g[n](e),
                a) {
                case "navigate":
                    i && getApp().core.navigateTo({
                        url: i
                    });
                    break;

                case "redirect":
                    i && getApp().core.redirectTo({
                        url: i
                    });
                    break;

                case "switchTab":
                    i && getApp().core.switchTab({
                        url: i
                    });
                    break;

                case "reLaunch":
                    i && getApp().core.reLaunch({
                        url: i
                    });
                    break;

                case "navigateBack":
                    i && getApp().core.navigateBack({
                        url: i
                    });
                    break;

                case "wxapp":
                    r && getApp().core.navigateToMiniProgram({
                        url: i,
                        appId: r,
                        path: t.path || ""
                    });
            }
        });
    },
    modalClose: function (e) {
        this.currentPage.setData({
            modal_show: !1
        }), console.log("你点击了关闭按钮");
    },
    modalConfirm: function (e) {
        this.currentPage.setData({
            modal_show: !1
        }), console.log("你点击了确定按钮");
    },
    modalShow: function (e) {
        this.currentPage.setData({
            modal_show: !0
        }), console.log("点击会弹出弹框");
    },

    getUserProfile: function (o) {
        var n = this;
        wx.getUserInfo({
            success(res) {
                "getUserInfo:ok" === res.errMsg && getApp().core.login({
                    success: function (e) {
                        var t = e.code;
                        n.unionLogin({
                            code: t,
                            user_info: res.rawData,
                            encrypted_data: res.encryptedData,
                            iv:res.iv,
                            signature: res.signature
                        });
                    },
                    fail: function (e) {
                    }
                });
            }
        })
    },

    //   getUserProfile: function (e){
    //     var that =this
    //     wx.getUserProfile({
    //         desc: "获取你的昵称、头像、地区及性别",
    //         success(res) {
    //             "getUserProfile:ok" === res.errMsg && getApp().core.login({
    //                 success: function (e) {
    //                     var t = e.code;
    //                     that.unionLogin({
    //                         code: t,
    //                         user_info: res.rawData,
    //                         encrypted_data: res.encryptedData,
    //                         iv: res.iv,
    //                         signature: res.signature
    //                     });
    //                 },
    //             })
    //         }
    //     })
    // },

    myLogin: function () {
        console.log(411);
        var t = this;
        "my" === getApp().platform && (console.log(getApp().login_complete), getApp().login_complete || (getApp().login_complete = !0,
            my.getAuthCode({
                scopes: "auth_user",
                success: function (e) {
                    t.unionLogin({
                        code: e.authCode
                    });
                },
                fail: function (e) {
                    getApp().login_complete = !1, getApp().core.redirectTo({
                        url: "/pages/index/index"
                    });
                }
            })));
    },
    unionLogin: function (e) {
        console.log(e)
        var o = this.currentPage, n = this;
        getApp().core.showLoading({
            title: "正在登录",
            mask: !0
        }), getApp().request({
            url: getApp().api.passport.login,
            method: "POST",
            data: e,
            success: function (e) {
                if (0 === e.code) {
                    o.setData({
                        __user_info: e.data
                    }), getApp().setUser(e.data), getApp().core.setStorageSync(getApp().const.ACCESS_TOKEN, e.data.access_token),
                        getApp().trigger.run(getApp().trigger.events.login);
                    var t = getApp().core.getStorageSync(getApp().const.STORE);
                    e.data.binding || !t.option.phone_auth || t.option.phone_auth && 0 == t.option.phone_auth ? n.loadRoute() : ("undefined" == typeof wx && n.loadRoute(),
                        n.setPhone()), n.setUserInfoShowFalse();
                } else {
                    getApp().login_complete = !1, getApp().core.showModal({
                        title: "提示",
                        content: e.msg,
                        showCancel: !1
                    });
                }
            },
            fail: function () {
                getApp().login_complete = !1;
            },
            complete: function () {
                getApp().core.hideLoading();
            }
        });
    }
    ,
    getPhoneNumber: function (o) {
        var n = this.currentPage, a = this;
        "getPhoneNumber:fail user deny" == o.detail.errMsg ? getApp().core.showModal({
            title: "提示",
            showCancel: !1,
            content: "未授权"
        }) : (getApp().core.showLoading({
            title: "授权中"
        }), getApp().core.login({
            success: function (e) {
                if (e.code) {
                    var t = e.code;
                    getApp().request({
                        url: getApp().api.user.user_binding,
                        method: "POST",
                        data: {
                            iv: o.detail.iv,
                            encryptedData: o.detail.encryptedData,
                            code: t
                        },
                        success: function (e) {
                            if (0 == e.code) {
                                var t = n.data.__user_info;
                                t.binding = e.data.dataObj, getApp().setUser(t), n.setData({
                                    PhoneNumber: e.data.dataObj,
                                    __user_info: t,
                                    binding: !0,
                                    binding_num: e.data.dataObj
                                }), a.loadRoute();
                            } else getApp().core.showToast({
                                title: "授权失败,请重试"
                            });
                        },
                        complete: function (e) {
                            getApp().core.hideLoading();
                        }
                    });
                } else getApp().core.showToast({
                    title: "获取用户登录态失败！" + e.errMsg
                });
            }
        }));
    }
    ,
    setUserInfoShow: function () {
        var e = this.currentPage;
        "wx" === getApp().platform ? e.setData({
            user_info_show: !0
        }) : this.myLogin();
        console.log("执行了显示")
    }
    ,
    setPhone: function () {
        var e = this.currentPage;
        "undefined" == typeof my && e.setData({
            user_bind_show: !0
        });
    }
    ,
    setUserInfoShowFalse: function () {
        this.currentPage.setData({
            user_info_show: !1
        });
    }
    ,
    closeCouponBox: function (e) {
        this.currentPage.setData({
            get_coupon_list: ""
        });
    }
    ,
    relevanceSuccess: function (e) {
        console.log(e);
    }
    ,
    relevanceError: function (e) {
        console.log(e);
    }
    ,
    setOfficalAccount: function (e) {
        this.currentPage.setData({
            __is_offical_account: !0
        });
    }
    ,
    loadRoute: function () {
        var e = this.currentPage;
        "pages/index/index" == e.route || getApp().core.redirectTo({
            url: "/" + e.route + "?" + getApp().helper.objectToUrlParams(e.options)
        }), this.setUserInfoShowFalse();
    }
}
;