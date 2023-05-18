var interval = 0, page_first_init = !0, timer = 1, fullScreen = !1, page_first = [];

Page({
    data: {
        WindowWidth: getApp().core.getSystemInfoSync().windowWidth,
        WindowHeight: getApp().core.getSystemInfoSync().windowHeight,
        left: 0,
        show_notice: !1,
        animationData: {},
        play: -1,
        time: 0,
        buy: !1,
        opendate: !1,
        service: {},
        goods: "",
        form: {
            number: 1
        },
        time_all: []
    },
    onLoad: function (options) {
        wx.showShareMenu({
            withShareTicket: true,
            menus: ['shareAppMessage', 'shareTimeline']
        })
        let service = wx.getStorageSync("STORE")
        getApp().page.onLoad(this, options), options.page_id || (options.page_id = -1), this.setData({
            service: service,
            options: options
        }), this.loadData(options);
    },
    suspension: function () {
        var that = this;
        interval = setInterval(function () {
            getApp().request({
                url: getApp().api.default.buy_data,
                data: {
                    time: that.data.time
                },
                method: "POST",
                success: function (res) {
                    if (0 === res.code) {
                        var a = !1;
                        that.data.msgHistory === res.md5 && (a = !0);
                        var time = "", cha_time = res.cha_time,
                            second = Math.floor(cha_time / 60 - 60 * Math.floor(cha_time / 3600));
                        time = 0 === second ? cha_time % 60 + "秒" : second + "分" + cha_time % 60 + "秒", !a && res.cha_time <= 300 ? that.setData({
                            buy: {
                                time: time,
                                type: res.data.type,
                                url: res.data.url,
                                user: 5 <= res.data.user.length ? res.data.user.slice(0, 4) + "..." : res.data.user,
                                avatar_url: res.data.avatar_url,
                                address: 8 <= res.data.address.length ? res.data.address.slice(0, 7) + "..." : res.data.address,
                                content: res.data.content
                            },
                            msgHistory: res.md5
                        }) : that.setData({
                            buy: !1
                        });
                    }
                },
                noHandlerFail: !0
            });
        }, 1e4);
    },
    loadData: function () {
        var that = this, list = {}, options = that.data.options;
        if (-1 !== options.page_id) list.page_id = options.page_id; else {
            list.page_id = -1;
            var index = getApp().core.getStorageSync(getApp().const.PAGE_INDEX_INDEX);
            index && (index.act_modal_list = [], that.setData(index));
        }
        list.hideLogin = 1;
        getApp().request({
            url: getApp().api.default.index,
            data: list,
            success: function (res) {
                if (0 === res.code) {
                    if ("diy" === res.data.status) {
                        var act_modal_list = res.data.act_modal_list;
                        -1 !== options.page_id && (getApp().core.setNavigationBarTitle({
                            title: res.data.info
                        }), that.setData({
                            title: res.data.info
                        }));
                        for (var i = act_modal_list.length - 1; 0 <= i; i--) void 0 !== act_modal_list[i].status && 0 != act_modal_list[i].status || !getApp().helper.inArray(act_modal_list[i].page_id, page_first)
                        || that.data.user_info_show ? page_first.push(act_modal_list[i].page_id) : act_modal_list.splice(i, 1);
                        that.setData({
                            template: res.data.template,
                            act_modal_list: act_modal_list,
                            time_all: res.data.time_all
                        }), that.setTime();
                    } else page_first_init ? that.data.user_info_show || (page_first_init = !1) : res.data.act_modal_list = [],
                        that.setData(res.data), that.miaoshaTimer();
                    -1 === options.page_id && getApp().core.setStorageSync(getApp().const.PAGE_INDEX_INDEX, res.data);
                }
            },
            complete: function () {
                getApp().core.stopPullDownRefresh();
            }
        });
    },
    onShow: function () {
        var that = this;
        getApp().page.onShow(this), require("./../../components/diy/diy.js").init(this),
            getApp().getConfig(function (res) {
                var store = res.store;
                store && store.name && -1 === that.data.options.page_id && getApp().core.setNavigationBarTitle({
                    title: store.name
                }), store && 1 === store.purchase_frame ? that.suspension(that.data.time) : that.setData({
                    buy_user: ""
                });
            });
    },
    onPullDownRefresh: function () {
        getApp().getStoreData(), clearInterval(timer), this.loadData();
    },
    onShareAppMessage: function (t) {
        getApp().page.onShareAppMessage(this);
        var that = this, userInfo = getApp().getUser();
        return -1 != that.data.options.page_id ? {
            path: "/pages/index/index?user_id=" + userInfo.id + "&page_id=" + that.data.options.page_id,
            title: that.data.title
        } : {
            path: "/pages/index/index?user_id=" + userInfo.id,
            title: that.data.store.name
        };
    },
    showshop: function (res) {
        var that = this, id = res.currentTarget.dataset.id, dataset = res.currentTarget.dataset;
        getApp().request({
            url: getApp().api.default.goods,
            data: {
                id: id
            },
            success: function (list) {
                0 == list.code && that.setData({
                    data: dataset,
                    attr_group_list: list.data.attr_group_list,
                    goods: list.data,
                    showModal: !0
                });
            }
        });
    },
    miaoshaTimer: function () {
        var that = this;
        that.data.miaosha && 0 != that.data.miaosha.rest_time && (that.data.miaosha.ms_next || (timer = setInterval(function () {
            0 < that.data.miaosha.rest_time ? (that.data.miaosha.rest_time = that.data.miaosha.rest_time - 1,
                that.data.miaosha.times = that.setTimeList(that.data.miaosha.rest_time), that.setData({
                miaosha: that.data.miaosha
            })) : clearInterval(timer);
        }, 1e3)));
    },
    onHide: function () {
        getApp().page.onHide(this), this.setData({
            play: -1
        }), clearInterval(interval);
    },
    onUnload: function () {
        getApp().page.onUnload(this), this.setData({
            play: -1
        }), clearInterval(timer), clearInterval(interval);
    },
    showNotice: function () {
        this.setData({
            show_notice: !0
        });
    },
    closeNotice: function () {
        this.setData({
            show_notice: !1
        });
    },
    to_dial: function () {
        var contact_tel = this.data.store.contact_tel;
        getApp().core.makePhoneCall({
            phoneNumber: contact_tel
        });
    },
    closeActModal: function () {
        var that = this, act_modal_list = that.data.act_modal_list;
        for (var modal_list in act_modal_list) {
            var i = parseInt(modal_list);
            act_modal_list[i].show && (act_modal_list[i].show = !1);
            break;
        }
        that.setData({
            act_modal_list: act_modal_list
        }), setTimeout(function () {
            for (var modal_list in act_modal_list) if (act_modal_list[modal_list].show) {
                act_modal_list = act_modal_list.splice(modal_list, 1).concat(act_modal_list);
                break;
            }
            that.setData({
                act_modal_list: act_modal_list
            });
        }, 500);
    },
    naveClick: function (t) {
        getApp().navigatorClick(t, this);
    },
    onPageScroll: function (t) {
        var that = this;
        if (!fullScreen && -1 != that.data.play) {
            var windowHeight = getApp().core.getSystemInfoSync().windowHeight;
            "undefined" == typeof my ? getApp().core.createSelectorQuery().select(".video").fields({
                rect: !0
            }, function (t) {
                (t.top <= -200 || t.top >= windowHeight - 57) && that.setData({
                    play: -1
                });
            }).exec() : getApp().core.createSelectorQuery().select(".video").boundingClientRect().scrollOffset().exec(function (t) {
                (t[0].top <= -200 || t[0].top >= windowHeight - 57) && that.setData({
                    play: -1
                });
            });
        }
    },
    fullscreenchange: function (t) {
        fullScreen = !!t.detail.fullScreen;
    },

})
;