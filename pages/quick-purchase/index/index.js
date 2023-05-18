var shoppingCart = require("../../../components/shopping_cart/shopping_cart.js"),
    specificationsModel = require("../../../components/specifications_model/specifications_model.js");

Page({
    data: {
        quick_list: [],
        goods_list: [],
        carGoods: [],
        currentGood: {},
        checked_attr: [],
        checkedGood: [],
        attr_group_list: [],
        temporaryGood: {
            price: 0,
            num: 0,
            use_attr: 1
        },
        check_goods_price: 0,
        showModal: !1,
        checked: !1,
        cat_checked: !1,
        color: "",
        total: {
            total_price: 0,
            total_num: 0
        }
    },
    onLoad: function (t) {
        wx.showShareMenu({
            withShareTicket: true,
            menus: ['shareAppMessage', 'shareTimeline']
        })
        getApp().page.onLoad(this, t);
    },
    onShow: function () {
        getApp().page.onShow(this), shoppingCart.init(this), specificationsModel.init(this, shoppingCart),
            this.loadData();
    },
    onHide: function () {
        getApp().page.onHide(this), shoppingCart.saveItemData(this);
    },
    onUnload: function () {
        getApp().page.onUnload(this), shoppingCart.saveItemData(this);
    },
    loadData: function (event) {
        var that = this, item = getApp().core.getStorageSync(getApp().const.ITEM);
        that.setData({
            total: void 0 !== item.total ? item.total : {
                total_num: 0,
                total_price: 0
            },
            carGoods: void 0 !== item.carGoods ? item.carGoods : []
        }), getApp().core.showLoading({
            title: "加载中"
        }), getApp().request({
            url: getApp().api.quick.quick,
            success: function (res) {
                if (getApp().core.hideLoading(), 0 === res.code) {
                    var list = res.data.list, goods_lists = [], quick_list = [];
                    for (var s in list) if (0 < list[s].goods.length) for (var i in quick_list.push(list[s]), list[s].goods) {
                        var carGoods = that.data.carGoods;
                        for (var n in carGoods  ) item.carGoods[n].goods_id === parseInt(list[s].goods[i].id) && (list[s].goods[i].num = list[s].goods[i].num ? list[s].goods[i].num : 0,
                            list[s].goods[i].num += item.carGoods[n].num);
                        parseInt(list[s].goods[i].hot_cakes) && goods_lists.push(list[s].goods[i]);
                    }
                    that.setData({
                        quick_hot_goods_lists: goods_lists,
                        quick_list: quick_list
                    });
                }
            }
        });
    },
    get_goods_info: function (t) {
        var that = this, carGoods = that.data.carGoods, total = that.data.total, goods_lists = that.data.quick_hot_goods_lists, quick_list = that.data.quick_list,
            item = {
                carGoods: carGoods,
                total: total,
                quick_hot_goods_lists: goods_lists,
                check_num: that.data.check_num,
                quick_list: quick_list
            };
        getApp().core.setStorageSync(getApp().const.ITEM, item);
        var id = t.currentTarget.dataset.id;
        getApp().core.navigateTo({
            url: "/pages/goods/goods?id=" + id + "&quick=1"
        });
    },
    selectMenu: function (t) {
        var dataset = t.currentTarget.dataset, quick_list = this.data.quick_list;
        if ("hot_cakes" === dataset.tag) for (var cat_checked = !0, s = quick_list.length, i = 0; i < s; i++) quick_list[i].cat_checked = !1; else {
            var index = dataset.index;
            for (s = quick_list.length, i = 0; i < s; i++) quick_list[i].cat_checked = !1, quick_list[i].id === quick_list[index].id && (quick_list[i].cat_checked = !0);
            cat_checked = !1;
        }
        this.setData({
            toView: dataset.tag,
            quick_list: quick_list,
            cat_checked: cat_checked
        });
    },
    onShareAppMessage: function (t) {
        getApp().page.onShareAppMessage(this);
        var that = this;
        return {
            path: "/pages/quick-purchase/index/index?user_id=" + getApp().core.getStorageSync(getApp().const.USER_INFO).id,
            success: function (t) {
                share_count++, 1 === share_count && that.shareSendCoupon(that);
            }
        };
    },
    close_box: function (t) {
        this.setData({
            showModal: !1
        });
    },
    hideModal: function () {
        this.setData({
            showModal: !1
        });
    }
});