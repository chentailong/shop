var util = require("../../utils/helper.js"), utils = getApp().helper;

Page({
    data: {
        unit_id: "",
        ad: !1,
        space: !1,
        step: 0,
        page: 2,
        over: !1,
        success: !1
    },
    onReachBottom: function() {
        var that = this, over = that.data.over, activity_data = that.data.activity_data, code = void 0, iv = void 0, encrypted_data = void 0;
        if (!over) {
            var page = this.data.page;
            this.setData({
                loading: !0
            }), getApp().core.login({
                success: function(t) {
                    code = t.code, getApp().core.getWeRunData({
                        success: function(t) {
                            iv = t.iv, encrypted_data = t.encryptedData, getApp().request({
                                url: getApp().api.step.activity,
                                method: "POST",
                                data: {
                                    encrypted_data: encrypted_data,
                                    iv: iv,
                                    code: code,
                                    user_id: void 0,
                                    page: page
                                },
                                success: function(t) {
                                    getApp().core.hideLoading();
                                    for (var e = 0; e < t.list.activity_data.length; e++) activity_data.push(t.list.activity_data[e]);
                                    t.list.activity_data.length < 3 && (over = !0);
                                    for (var a = 0; a < activity_data.length; a++) activity_data[a].date = activity_data[a].open_date.replace("-", "").replace("-", "");
                                    that.setData({
                                        page: page + 1,
                                        over: over,
                                        loading: !1,
                                        activity_data: activity_data
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    },
    openSetting: function() {
        var that = this, user_id = that.data.user_id;
        getApp().core.openSetting({
            success: function(t) {
                1 === t.authSetting["scope.werun"] && 1 === t.authSetting["scope.userInfo"] && (that.setData({
                    authorize: !0
                }), getApp().core.showLoading({
                    title: "数据加载中...",
                    mask: !0
                }), that.activity(user_id));
            },
            fail: function(t) {
                that.setData({
                    authorize: !1
                }), getApp().core.hideLoading();
            }
        });
    },
    onLoad: function(options) {
        wx.showShareMenu({
            withShareTicket: true,
            menus: ['shareAppMessage', 'shareTimeline']
        })
        getApp().page.onLoad(this, options);
        var that = this, open_date = !1, join = !1, user_id = void 0;
        null !== options.user_id && (user_id = options.user_id), getApp().request({
            url: getApp().api.step.setting,
            success: function(t) {
                0 == t.code && that.setData({
                    title: t.data.title,
                    share_title: t.data.share_title
                });
            }
        });
        var date = util.formatTime(new Date()), time = date[0] + date[1] + date[2] + date[3] + date[5] + date[6] + date[8] + date[9];
        this.setData({
            page: 2,
            time: time
        }), null !== options.open_date && (open_date = options.open_date), null !== options.join && (join = options.join),
            that.setData({
            join: join,
            open_date: open_date
        }), getApp().core.showLoading({
            title: "数据加载中...",
            mask: !0
        }), getApp().core.getSetting({
            success: function(t) {
                1 === t.authSetting["scope.werun"] && 1 === t.authSetting["scope.userInfo"] ? that.activity(user_id) : getApp().core.authorize({
                    scope: "scope.userInfo",
                    success: function(t) {
                        getApp().core.authorize({
                            scope: "scope.werun",
                            success: function(t) {
                                "authorize:ok" === t.errMsg && that.activity(user_id);
                            },
                            fail: function(t) {
                                that.setData({
                                    authorize: !1
                                }), getApp().core.hideLoading();
                            }
                        });
                    }
                });
            },
            fail: function(t) {
                that.setData({
                    authorize: !1
                }), getApp().core.hideLoading();
            }
        });
    },
    activity: function(user_id) {
        var that = this, code = void 0, iv = void 0, encrypted_data = void 0;
        getApp().core.login({
            success: function(t) {
                code = t.code, getApp().core.getWeRunData({
                    success: function(t) {
                        iv = t.iv, encrypted_data = t.encryptedData, getApp().request({
                            url: getApp().api.step.activity,
                            method: "POST",
                            data: {
                                encrypted_data: encrypted_data,
                                iv: iv,
                                code: code,
                                user_id: user_id
                            },
                            success: function(t) {
                                var step = t.list.run_data;
                                getApp().core.hideLoading();
                                var ad_data = t.list.ad_data, activity_data = t.list.activity_data, space = void 0;
                                if (space = !1, activity_data.length < 1) space = !0; else for (var o = 0; o < activity_data.length; o++) activity_data[o].date = activity_data[o].open_date.replace("-", "").replace("-", "");
                                var unit_id = !1, ad = !1;
                                null !== ad_data && (unit_id = t.list.ad_data.unit_id, ad = !0), that.setData({
                                    unit_id: unit_id,
                                    step: step,
                                    space: space,
                                    activity_data: activity_data,
                                    ad_data: ad_data,
                                    ad: ad
                                });
                            }
                        });
                    }
                });
            }
        });
    },
    adError: function(t) {
        console.log(t.detail);
    },
    close: function() {
        this.setData({
            join: !1
        });
    },
    onShareAppMessage: function(t) {
        return getApp().page.onShareAppMessage(this), this.setData({
            join: !1
        }), {
            path: "/step/index/index?user_id=" + getApp().getUser().id,
            title: this.data.share_title ? this.data.share_title : this.data.title
        };
    },
    submit: function(t) {
        var code = void 0, iv = void 0, encrypted_data = void 0;
        console.log(t);
        var id = t.currentTarget.dataset.id, step = (t.currentTarget.dataset.step, this), num = this.data.step;
        getApp().core.showLoading({
            title: "正在提交...",
            mask: !0
        }), getApp().core.login({
            success: function(t) {
                code = t.code, getApp().core.getWeRunData({
                    success: function(t) {
                        iv = t.iv, id = t.encryptedData, getApp().request({
                            url: getApp().api.step.activity_submit,
                            method: "POST",
                            data: {
                                code: code,
                                iv: iv,
                                encrypted_data: encrypted_data,
                                num: num,
                                activity_id: id
                            },
                            success: function(t) {
                                getApp().core.hideLoading(), 0 === t.code ? step.setData({
                                    success: !0
                                }) : getApp().core.showModal({
                                    content: t.msg,
                                    showCancel: !1
                                });
                            }
                        });
                    }
                });
            }
        });
    },

    success: function() {
        this.setData({
            success: !1
        }), getApp().core.redirectTo({
            url: "../dare/dare"
        });
    }
});