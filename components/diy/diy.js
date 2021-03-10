module.exports = {
    currentPage: null,
    gSpecificationsModel: null,
    init: function (state) {
        this.currentPage = state;
        var that = this;
        this.gSpecificationsModel = require("../../components/goods/specifications_model.js"),
            this.gSpecificationsModel.init(state), void 0 === state.showNotice && (state.showNotice = function () {
            that.showNotice();
        }), void 0 === state.closeNotice && (state.closeNotice = function () {
            that.closeNotice();
        }), void 0 === state.play && (state.play = function (t) {
            that.play(t);
        }), void 0 === state.receive && (state.receive = function (t) {
            that.receive(t);
        }), void 0 === state.closeCouponBox && (state.closeCouponBox = function (t) {
            that.closeCouponBox(t);
        }), void 0 === state.catBind && (state.catBind = function (t) {
            that.catBind(t);
        }), void 0 === state.modalShowGoods && (state.modalShowGoods = function (t) {
            that.modalShowGoods(t);
        }), void 0 === state.modalConfirmGoods && (state.modalConfirmGoods = function (t) {
            that.modalConfirmGoods(t);
        }), void 0 === state.modalCloseGoods && (state.modalCloseGoods = function (t) {
            that.modalCloseGoods(t);
        }), void 0 === state.setTime && (state.setTime = function (t) {
            that.setTime(t);
        }), void 0 === state.closeActModal && (state.closeActModal = function (t) {
            that.closeActModal(t);
        }), void 0 === state.goto && (state.goto = function (t) {
            that.goto(t);
        }), void 0 === state.go && (state.go = function (t) {
            that.go(t);
        });
    },
    showNotice: function () {
        this.currentPage.setData({
            show_notice: !0
        });
    },
    closeNotice: function () {
        this.currentPage.setData({
            show_notice: !1
        });
    },
    play: function (t) {
        this.currentPage.setData({
            play: t.currentTarget.dataset.index
        });
    },
    receive: function (data) {
        var currentPage = this.currentPage, index = data.currentTarget.dataset.index;
        getApp().core.showLoading({
            title: "领取中",
            mask: !0
        }), currentPage.hideGetCoupon || (currentPage.hideGetCoupon = function (page) {
            var url = page.currentTarget.dataset.url || !1;
            currentPage.setData({
                get_coupon_list: null
            }), wx.navigateTo({
                url: url || "/pages/list/list"
            });
        }), getApp().request({
            url: getApp().api.coupon.receive,
            data: {
                id: index
            },
            success: function (res) {
                getApp().core.hideLoading(), 0 == res.code ? currentPage.setData({
                    get_coupon_list: res.data.list,
                    coupon_list: res.data.coupon_list
                }) : (getApp().core.showToast({
                    title: res.msg,
                    duration: 2e3
                }), currentPage.setData({
                    coupon_list: res.data.coupon_list
                }));
            }
        });
    },
    closeCouponBox: function (t) {
        this.currentPage.setData({
            get_coupon_list: ""
        });
    },
    catBind: function (cat) {
        var currentPage = this.currentPage, template = cat.currentTarget.dataset.template,
            index = cat.currentTarget.dataset.index, templates = currentPage.data.template;
        templates[template].param.cat_index = index, currentPage.setData({
            template: templates
        });
    },
    modalShowGoods: function (res) {
        var currentPage = this.currentPage, template = currentPage.data.template,
            templates = res.currentTarget.dataset.template,
            cat = res.currentTarget.dataset.cat, goods = res.currentTarget.dataset.goods,
            goods_list = template[templates].param.list[cat].goods_list[goods];
        "goods" == template[templates].type ? (goods_list.id = goods_list.goods_id, currentPage.setData({
            goods: goods_list,
            show_attr_picker: !0,
            attr_group_list: goods_list.attr_group_list,
            pageType: "STORE",
            id: goods_list.id
        }), this.gSpecificationsModel.selectDefaultAttr()) : getApp().core.navigateTo({
            url: goods_list.page_url
        });
    },
    modalConfirmGoods: function (res) {
        var currentPage = this.currentPage,
            pageType = (currentPage.data.pageType, require("../../components/goods/goods_buy.js"));
        pageType.currentPage = currentPage, pageType.submit("ADD_CART"), currentPage.setData({
            form: {
                number: 1
            }
        });
    },
    modalCloseGoods: function (t) {
        this.currentPage.setData({
            show_attr_picker: !1,
            form: {
                number: 1
            }
        });
    },
    template_time: null,
    setTime: function (res) {
        var currentPage = this.currentPage, time_all = currentPage.data.time_all;
        this["template_time_" + currentPage.data.options.page_id] && clearInterval(this["template_time_" + currentPage.data.options.page_id]),
            this["template_time_" + currentPage.data.options.page_id] = setInterval(function () {
                for (var time in time_all) if ("time" == time_all[time].type && (0 < time_all[time].param.start_time ? (time_all[time].param.start_time--,
                    time_all[time].param.end_time--, time_all[time].param.time_list = currentPage.setTimeList(time_all[time].param.start_time)) : 0 < time_all[time].param.end_time && (time_all[time].param.end_time--,
                    time_all[time].param.time_list = currentPage.setTimeList(time_all[time].param.end_time))), "miaosha" == time_all[time].type || "bargain" == time_all[time].type || "lottery" == time_all[time].type) {
                    var cat_index = time_all[time].param.cat_index;
                    for (var goods_list in time_all[time].param.list[cat_index].goods_list) 0 < time_all[time].param.list[cat_index].goods_list[goods_list].time ? (time_all[time].param.list[cat_index].goods_list[goods_list].time--,
                        time_all[time].param.list[cat_index].goods_list[goods_list].time_list = currentPage.setTimeList(time_all[time].param.list[cat_index].goods_list[goods_list].time),
                    0 < time_all[time].param.list[cat_index].goods_list[goods_list].time_end && (time_all[time].param.list[cat_index].goods_list[goods_list].time_end--,
                    1 == time_all[time].param.list[cat_index].goods_list[goods_list].time && (time_all[time].param.list[cat_index].goods_list[goods_list].is_start = 1,
                        time_all[time].param.list[cat_index].goods_list[goods_list].time = time_all[time].param.list[cat_index].goods_list[goods_list].time_end,
                        time_all[time].param.list[cat_index].goods_list[goods_list].time_end = 0, time_all[time].param.list[cat_index].goods_list[goods_list].time_content = 1 == time_all[t].param.list_style ? "仅剩" : "距结束仅剩"))) : (time_all[time].param.list[cat_index].goods_list[goods_list].is_start = 1,
                        time_all[time].param.list[cat_index].goods_list[goods_list].time = 0, time_all[time].param.list[cat_index].goods_list[goods_list].time_content = "活动已结束",
                        time_all[time].param.list[cat_index].goods_list[goods_list].time_list = {});
                }
                currentPage.setData({
                    time_all: time_all
                });
            }, 1e3);
    },
    closeActModal: function () {
        var page, currentPage = this.currentPage, act_modal_list = currentPage.data.act_modal_list, noNull = !0;
        for (var modal in act_modal_list) {
            var modal_list = parseInt(modal);
            act_modal_list[modal_list].show && (act_modal_list[modal_list].show = !1, void 0 !== act_modal_list[page = modal_list + 1] && noNull && (noNull = !1, setTimeout(function () {
                currentPage.data.act_modal_list[page].show = !0, currentPage.setData({
                    act_modal_list: currentPage.data.act_modal_list
                });
            }, 500)));
        }
        currentPage.setData({
            act_modal_list: act_modal_list
        });
    },
    goto: function (page) {
        var that = this;
        "undefined" != typeof my ? that.location(page) : getApp().core.getSetting({
            success: function (res) {
                res.authSetting["scope.userLocation"] ? that.location(page) : getApp().getauth({
                    content: "需要获取您的地理位置授权，请到小程序设置中打开授权！",
                    cancel: !1,
                    author: "scope.userLocation",
                    success: function (t) {
                        console.log(t), t.authSetting["scope.userLocation"] && that.location(page);
                    }
                });
            }
        });
    },
    location: function (data) {
        var currentPage = this.currentPage, list = [], template = data.currentTarget.dataset.template;
        list = void 0 !== template ? currentPage.data.template[template].param.list : currentPage.data.list;
        var index = data.currentTarget.dataset.index;
        getApp().core.openLocation({
            latitude: parseFloat(list[index].latitude),
            longitude: parseFloat(list[index].longitude),
            name: list[index].name,
            address: list[index].address
        });
    },
    go: function (router) {
        var currentPage = this.currentPage, template = router.currentTarget.dataset.template, list = [];
        list = void 0 !== template ? currentPage.data.template[template].param.list : currentPage.data.list;
        var index = router.currentTarget.dataset.index;
        getApp().core.navigateTo({
            url: "/pages/shop-detail/shop-detail?shop_id=" + list[index].id
        });
    }
};