var WxParse = require("../../wxParse/wxParse.js"),
    shoppingCart = require("../../components/shopping_cart/shopping_cart.js"),
    specificationsModel = require("../../components/specifications_model/specifications_model.js"),
    gSpecificationsModel = require("../../components/goods/specifications_model.js"),
    goodsBanner = require("../../components/goods/goods_banner.js"),
    goodsInfo = require("../../components/goods/goods_info.js"),
    goodsBuy = require("../../components/goods/goods_buy.js"),
    quickNavigation = require("../../components/quick-navigation/quick-navigation.js"), p = 1, is_loading_comment = !1,
    is_more_comment = !0, share_count = 0;

Page({
    data: {
        pageType: "STEP",
        id: null,
        goods: {},
        show_attr_picker: !1,
        form: {
            number: 1
        },
        tab_detail: "active",
        tab_comment: "",
        comment_list: [],
        comment_count: {
            score_all: 0,
            score_3: 0,
            score_2: 0,
            score_1: 0
        },
        autoplay: !1,
        hide: "hide",
        show: !1,
        x: getApp().core.getSystemInfoSync().windowWidth,
        y: getApp().core.getSystemInfoSync().windowHeight - 20,
        page: 1,
        drop: !1,
        goodsModel: !1,
        goods_num: 0,
        temporaryGood: {
            price: 0,
            num: 0,
            use_attr: 1
        },
        goodNumCount: 0
    },
    onLoad: function (options) {
        wx.showShareMenu({
            withShareTicket: true,
            menus: ['shareAppMessage', 'shareTimeline']
        })
        getApp().page.onLoad(this, options);
        var that = this;
        share_count = 0, is_more_comment = !(is_loading_comment = !(p = 1));
        var quick = options.quick;
        if (quick) {
            var list = getApp().core.getStorageSync(getApp().const.ITEM);
            if (list) var total = list.total, carGoods = list.carGoods; else total = {
                total_price: 0,
                total_num: 0
            }, carGoods = [];
            that.setData({
                quick: quick,
                quick_list: list.quick_list,
                total: total,
                carGoods: carGoods,
                quick_hot_goods_lists: list.quick_hot_goods_lists
            });
        }
        if ("undefined" == typeof my) {
            var scene = decodeURIComponent(options.scene);
            if (void 0 !== scene) {
                var scene_decode = getApp().helper.scene_decode(scene);
                scene_decode.uid && scene_decode.gid && (options.id = scene_decode.gid);
            }
        } else if (null !== getApp().query) {
            var query = app.query;
            getApp().query = null, options.id = query.gid;
        }
        that.setData({
            id: options.goods_id,
            user_id: options.user_id
        }), that.getGoods();
    },

    onReady: function () {
        getApp().page.onReady(this);
    },
    onShow: function () {
        getApp().page.onShow(this), shoppingCart.init(this), specificationsModel.init(this, shoppingCart),
            gSpecificationsModel.init(this), goodsBanner.init(this), goodsInfo.init(this), goodsBuy.init(this),
            quickNavigation.init(this);
        var item = getApp().core.getStorageSync(getApp().const.ITEM);
        if (item) var total = item.total, carGoods = item.carGoods, goods_num = this.data.goods_num; else total = {
            total_price: 0,
            total_num: 0
        }, carGoods = [], goods_num = 0;
        this.setData({
            total: total,
            carGoods: carGoods,
            goods_num: goods_num
        });
    },
    onHide: function () {
        getApp().page.onHide(this), shoppingCart.saveItemData(this);
    },
    onUnload: function () {
        getApp().page.onUnload(this), shoppingCart.saveItemData(this);
    },
    onPullDownRefresh: function () {
        getApp().page.onPullDownRefresh(this);
    },
    onShareAppMessage: function () {
        getApp().page.onShareAppMessage(this);
        var that = this, info = getApp().getUser();
        return {
            path: "/step/goods/goods?goods_id=" + this.data.id + "&user_id=" + info.id,
            success: function (t) {
                1 === ++share_count && that.shareSendCoupon(that);
            },
            title: that.data.goods.name,
            imageUrl: that.data.goods.pic_list[0]
        };
    },
    play: function (t) {
        var url = t.target.dataset.url;
        this.setData({
            url: url,
            hide: "",
            show: !0
        }), getApp().core.createVideoContext("video").play();
    },
    close: function (t) {
        if ("video" === t.target.id) return !0;
        this.setData({
            hide: "hide",
            show: !1
        }), getApp().core.createVideoContext("video").pause();
    },
    closeCouponBox: function (t) {
        this.setData({
            get_coupon_list: ""
        });
    },
    to_dial: function (t) {
        var contact_tel = this.data.store.contact_tel;
        getApp().core.makePhoneCall({
            phoneNumber: contact_tel
        });
    },
    getGoods: function () {
        var that = this;
        if (that.data.quick) {
            var carGoods = that.data.carGoods;
            if (carGoods) {
                for (var i = carGoods.length, goods_num = 0, index = 0; index < i; index++) carGoods[index].goods_id === that.data.id && (goods_num += parseInt(carGoods[index].num));
                that.setData({
                    goods_num: goods_num
                });
            }
        }
        getApp().request({
            url: getApp().api.step.goods,
            data: {
                goods_id: that.data.id,
                user_id: that.data.user_id
            },
            success: function (res) {
                if (0 === res.code) {
                    var detail = res.data.goods.detail;
                    WxParse.wxParse("detail", "html", detail, that);
                    var goods = res.data.goods;
                    goods.attr_pic = res.data.goods.attr_pic, goods.cover_pic = res.data.goods.pic_list[0].pic_url;
                    var pic_list = goods.pic_list, list = [];
                    for (var s in pic_list) list.push(pic_list[s].pic_url);
                    goods.pic_list = list, that.setData({
                        goods: goods,
                        attr_group_list: res.data.goods.attr_group_list,
                        btn: !0
                    }), that.selectDefaultAttr();
                }
                1 === res.code && getApp().core.showModal({
                    title: "提示",
                    content: res.msg,
                    showCancel: !1,
                    success: function (t) {
                        t.confirm && getApp().core.switchTab({
                            url: "/pages/index/index"
                        });
                    }
                });
            }
        });
    },
    tabSwitch: function (t) {
        "detail" === t.currentTarget.dataset.tab ? this.setData({
            tab_detail: "active",
            tab_comment: ""
        }) : this.setData({
            tab_detail: "",
            tab_comment: "active"
        });
    },
    commentPicView: function (t) {
        var index = t.currentTarget.dataset.index, picIndex = t.currentTarget.dataset.picIndex;
        getApp().core.previewImage({
            current: this.data.comment_list[index].pic_list[picIndex],
            urls: this.data.comment_list[index].pic_list
        });
    },
    exchangeGoods: function () {
        var that = this;
        if (!that.data.show_attr_picker) return that.setData({
            show_attr_picker: !0
        }), !0;
        var attr_group_list = that.data.attr_group_list, attr = [];
        for (var a in attr_group_list) {
            var i = !1;
            for (var s in attr_group_list[a].attr_list) if (attr_group_list[a].attr_list[s].checked) {
                i = {
                    attr_id: attr_group_list[a].attr_list[s].attr_id,
                    attr_name: attr_group_list[a].attr_list[s].attr_name
                };
                break;
            }
            if (!i) return getApp().core.showToast({
                title: "请选择" + attr_group_list[a].attr_group_name,
                image: "/images/icon-warning.png"
            }), !0;
            attr.push({
                attr_group_id: attr_group_list[a].attr_group_id,
                attr_group_name: attr_group_list[a].attr_group_name,
                attr_id: i.attr_id,
                attr_name: i.attr_name
            });
        }
        var number = that.data.form.number;
        if (number <= 0) return getApp().core.showToast({
            title: "商品库存不足!",
            image: "/images/icon-warning.png"
        }), !0;
        var goods = that.data.goods;
        that.setData({
            show_attr_picker: !1
        }), getApp().core.navigateTo({
            url: "/pages/order-submit/order-submit?step_id=" + goods.id + "&goods_info=" + JSON.stringify({
                goods_id: goods.id,
                attr: attr,
                num: number
            })
        });
    }
});