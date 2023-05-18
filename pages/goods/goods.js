var WxParse = require("../../wxParse/wxParse.js"),
    shoppingCart = require("../../components/shopping_cart/shopping_cart.js"),
    specificationsModel = require("../../components/specifications_model/specifications_model.js"),
    gSpecificationsModel = require("../../components/goods/specifications_model.js"),
    goodsBanner = require("../../components/goods/goods_banner.js"),
    goodsInfo = require("../../components/goods/goods_info.js"),
    goodsBuy = require("../../components/goods/goods_buy.js"),
    goodsRecommend = require("../../components/goods/goods_recommend.js"), p = 1, is_loading_comment = !1,
    is_more_comment = !0, share_count = 0;
Page({
    data: {
        pageType: "STORE",
        id: null,
        goods: {},
        attr: {},
        userInfo: {},
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

    onLoad: function (info) {
        wx.showShareMenu({
            withShareTicket: true,
            menus: ['shareAppMessage', 'shareTimeline']
        })
        getApp().page.onLoad(this, info);
        var that = this;
        share_count = 0, is_more_comment = !(is_loading_comment = !(p = 1));
        var quick = info.quick;
        if (quick) {
            var item = getApp().core.getStorageSync(getApp().const.ITEM);
            if (item) var total = item.total, carGoods = item.carGoods; else total = {
                total_price: 0,
                total_num: 0
            }, carGoods = [];
            that.setData({
                quick: quick,
                quick_list: item.quick_list,
                total: total,
                carGoods: carGoods,
                quick_hot_goods_lists: item.quick_hot_goods_lists
            });
        }
        if ("undefined" == typeof my) {
            var scene = decodeURIComponent(info.scene);
            if (void 0 !== scene) {
                var ids = getApp().helper.scene_decode(scene);
                ids.uid && ids.gid && (info.id = ids.gid);
            }
        } else if (null !== getApp().query) {
            var query = app.query;
            getApp().query = null, info.id = query.gid;
        }
        that.setData({
            id: info.id
        }), that.getGoods(), that.getCommentList();
    },
    //  转发朋友圈设置
    onShareTimeline() {
        return {
            title: this.data.goods.name,
            imageUrl: this.data.goods.cover_pic
        }
    },
    onReady: function () {
        getApp().page.onReady(this);
    },
    onShow: function () {
        var userInfo = wx.getStorageSync("USER_INFO")
        getApp().page.onShow(this), shoppingCart.init(this), specificationsModel.init(this, shoppingCart),
            gSpecificationsModel.init(this), goodsBanner.init(this), goodsInfo.init(this), goodsBuy.init(this),
            goodsRecommend.init(this);
        let item = getApp().core.getStorageSync(getApp().const.ITEM);
        if (item) var total = item.total, carGoods = item.carGoods, goods_num = this.data.goods_num; else total = {
            total_price: 0,
            total_num: 0
        }, carGoods = [], goods_num = 0;
        this.setData({
            total: total,
            carGoods: carGoods,
            goods_num: goods_num,
            userInfo:userInfo,
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
    onReachBottom: function () {
        getApp().page.onReachBottom(this);
        var that = this;
        "active" === that.data.tab_detail && that.data.drop ? (that.data.drop = !1, that.goods_recommend({
            goods_id: that.data.goods.id,
            loadmore: !0
        })) : "active" === that.data.tab_comment && that.getCommentList(!0);
    },
    onShareAppMessage: function () {
        getApp().page.onShareAppMessage(this);
        var that = this, user = getApp().getUser();
        return {
            path: "/pages/goods/goods?id=" + this.data.id + "&user_id=" + user.id,
            success: function (t) {
                1 === ++share_count && that.shareSendCoupon(that);
            },
            title: that.data.goods.name,
            imageUrl: that.data.goods.pic_list[0]
        };
    },

    closeCouponBox: function (t) {
        this.setData({
            get_coupon_list: ""
        });
    },
    to_dial: function (t) {
        var that = this.data.store.contact_tel;
        getApp().core.makePhoneCall({
            phoneNumber: that
        });
    },
    getGoods: function () {
        let that = this;
        if (that.data.quick) {
            let carGoods = that.data.carGoods;
            if (carGoods) {
                for (var index = carGoods.length, goods_num = 0, i = 0; i < index; i++) carGoods[i].goods_id === that.data.id && (goods_num += parseInt(carGoods[i].num));
                that.setData({
                    goods_num: goods_num
                });
            }
        }
        getApp().request({
            url: getApp().api.default.goods,
            data: {
                id: that.data.id
            },
            success: function (res) {
                var attr = JSON.parse(res.data.attr)
                if (0 === res.code) {
                    var detail = res.data.detail;
                    WxParse.wxParse("detail", "html", detail, that);
                    var goods = res.data;
                    goods.attr_pic = res.data.attr_pic, goods.cover_pic = res.data.pic_list[0].pic_url;
                    var pic_list = goods.pic_list, list = [];
                    for (var pic_index in pic_list) list.push(pic_list[pic_index].pic_url);
                    goods.pic_list = list, that.setData({
                        goods: goods,
                        attr: attr,
                        attr_group_list: res.data.attr_group_list,
                        btn: !0
                    }), that.goods_recommend({
                        goods_id: res.data.id,
                        reload: !0
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
    getCommentList: function (list) {
        var that = this;
        list && "active" !== that.data.tab_comment || is_loading_comment || is_more_comment && (is_loading_comment = !0,
            getApp().request({
                url: getApp().api.default.comment_list,
                data: {
                    goods_id: that.data.id,
                    page: p
                },
                success: function (t) {
                    0 === t.code && (is_loading_comment = !1, p++, that.setData({
                        comment_count: t.data.comment_count,
                        comment_list: list ? that.data.comment_list.concat(t.data.list) : t.data.list
                    }), 0 === t.data.list.length && (is_more_comment = !1));
                }
            }));
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

    // 获取滚动条当前位置
    onPageScroll: function (e) {
        let isTop = e.scrollTop > 100;
        this.setData({
            floorstatus: isTop ? true : false
        });
    },

    //回到顶部
    goTop: function (e) {
        if (wx.pageScrollTo) {
            wx.pageScrollTo({
                scrollTop: 0
            })
        } else {
            wx.showModal({
                title: '提示',
                content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
            })
        }
    }
});