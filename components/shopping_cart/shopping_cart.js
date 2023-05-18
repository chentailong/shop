module.exports = {
    currentPage: null,
    init: function (t) {
        var currentPage = this;
        void 0 === (currentPage.currentPage = t).shoppingCartListModel && (t.shoppingCartListModel = function (t) {
            currentPage.shoppingCartListModel(t);
        }), void 0 === t.hideShoppingCart && (t.hideShoppingCart = function (t) {
            currentPage.hideShoppingCart(t);
        }), void 0 === t.clearShoppingCart && (t.clearShoppingCart = function (t) {
            currentPage.clearShoppingCart(t);
        }), void 0 === t.jia && (t.jia = function (t) {
            currentPage.jia(t);
        }), void 0 === t.jian && (t.jian = function (t) {
            currentPage.jian(t);
        }), void 0 === t.goodNumChange && (t.goodNumChange = function (t) {
            currentPage.goodNumChange(t);
        }), void 0 === t.buynow && (t.buynow = function (t) {
            currentPage.buynow(t);
        });
    },
    carStatistics: function (t) {
        var carGoods = t.data.carGoods, total_num = 0, total_price = 0;
        for (var i in carGoods) total_num += carGoods[i].num, total_price = parseFloat(total_price) + parseFloat(carGoods[i].goods_price);
        var total = {
            total_num: total_num,
            total_price: total_price.toFixed(2)
        };
        0 === total_num && this.hideShoppingCart(t), t.setData({
            total: total
        });
    },
    hideShoppingCart: function () {
        this.currentPage.setData({
            shoppingCartModel: !1
        });
    },
    shoppingCartListModel: function () {
        var currentPage = this.currentPage, o = (currentPage.data.carGoods, currentPage.data.shoppingCartModel);
        console.log(o), o ? currentPage.setData({
            shoppingCartModel: !1
        }) : currentPage.setData({
            shoppingCartModel: !0
        });
    },
    clearShoppingCart: function (currentPage) {
        var quick_hot_goods_lists = (currentPage = this.currentPage).data.quick_hot_goods_lists,
            quick_list = currentPage.data.quick_list;
        for (var i in quick_hot_goods_lists) for (var r in quick_hot_goods_lists[i]) quick_hot_goods_lists[i].num = 0;
        for (var s in quick_list) for (var n in quick_list[s].goods) quick_list[s].goods[n].num = 0;
        currentPage.setData({
            goodsModel: !1,
            carGoods: [],
            total: {
                total_num: 0,
                total_price: 0
            },
            check_num: 0,
            quick_hot_goods_lists: quick_hot_goods_lists,
            quick_list: quick_list,
            currentGood: [],
            checked_attr: [],
            check_goods_price: 0,
            temporaryGood: {},
            goodNumCount: 0,
            goods_num: 0
        }), currentPage.setData({
            shoppingCartModel: !1
        }), getApp().core.removeStorageSync(getApp().const.ITEM);
    },

    saveItemData: function (t) {
        var item = {
            quick_list: t.data.quick_list,
            carGoods: t.data.carGoods,
            total: t.data.total,
            quick_hot_goods_lists: t.data.quick_hot_goods_lists,
            checked_attr: t.data.checked_attr
        };
        getApp().core.setStorageSync(getApp().const.ITEM, item);
    },
    jia: function (t) {
        var currentPage = this.currentPage, dataset = t.currentTarget.dataset, quick_list = currentPage.data.quick_list;
        for (var r in quick_list) for (var s in quick_list[r].goods) {
            var goods = quick_list[r].goods[s];
            if (parseInt(goods.id) === parseInt(dataset.id)) {
                var num = goods.num ? goods.num + 1 : 1;
                if (num > JSON.parse(goods.attr)[0].num) return void wx.showToast({
                    title: "商品库存不足",
                    image: "/images/icon-warning.png"
                });
                goods.num = num;
                var carGoods = currentPage.data.carGoods, c = 1, price = dataset.price ? dataset.price : goods.price;
                for (var g in carGoods) {
                    if (parseInt(carGoods[g].goods_id) === parseInt(goods.id) && 1 === JSON.parse(goods.attr).length) {
                        c = 0, carGoods[g].num = num, carGoods[g].goods_price = (carGoods[g].num * carGoods[g].price).toFixed(2);
                        break;
                    }
                    var index = dataset.index;
                    if (carGoods[index]) {
                        c = 0, carGoods[index].num = carGoods[index].num + 1, carGoods[index].goods_price = (carGoods[index].num * carGoods[index].price).toFixed(2);
                        break;
                    }
                }
                if (1 === c || 0 === carGoods.length) {
                    var h = JSON.parse(quick_list[r].goods[s].attr);
                    carGoods.push({
                        goods_id: parseInt(quick_list[r].goods[s].id),
                        attr: h[0].attr_list,
                        goods_name: quick_list[r].goods[s].name,
                        goods_price: price,
                        num: 1,
                        price: price
                    });
                }
            }
        }
        currentPage.setData({
            carGoods: carGoods,
            quick_list: quick_list
        }), this.carStatistics(currentPage), this.quickHotStatistics(), this.updateGoodNum();
    },

    jian: function (t) {
        var currentPage = this.currentPage, dataset = t.currentTarget.dataset, quick_list = currentPage.data.quick_list;
        for (var r in quick_list) for (var s in quick_list[r].goods) {
            var goods = quick_list[r].goods[s];
            if (parseInt(goods.id) === parseInt(dataset.id)) {
                var num = 0 < goods.num ? goods.num - 1 : goods.num;
                goods.num = num;
                var carGoods = currentPage.data.carGoods;
                for (var c in carGoods) {
                    dataset.price ? dataset.price : goods.price;
                    if (parseInt(carGoods[c].goods_id) === parseInt(goods.id) && 1 === JSON.parse(goods.attr).length) {
                        carGoods[c].num = num, carGoods[c].goods_price = (carGoods[c].num * carGoods[c].price).toFixed(2);
                        break;
                    }
                    var index = dataset.index;
                    if (carGoods[index] && 0 < carGoods[index].num) {
                        carGoods[index].num = carGoods[index].num - 1, carGoods[index].goods_price = (carGoods[index].num * carGoods[index].price).toFixed(2);
                        break;
                    }
                }
            }
        }
        currentPage.setData({
            carGoods: carGoods,
            quick_list: quick_list
        }), this.carStatistics(currentPage), this.quickHotStatistics(), this.updateGoodNum();
    },

    goodNumChange: function (t) {
        var currentPage = this.currentPage, value = parseInt(t.detail.value) ? parseInt(t.detail.value) : 0,
            id = t.target.dataset.id ? parseInt(t.target.dataset.id) : currentPage.data.currentGood.id, carGoods = currentPage.data.carGoods,
            quick_list = currentPage.data.quick_list, goods_lists = currentPage.data.quick_hot_goods_lists, e = value, d = 0, c = "";
        for (var u in quick_list) for (var g in quick_list[u].goods) {
            var use_attr = parseInt(quick_list[u].goods[g].use_attr);
            if ((C = parseInt(quick_list[u].goods[g].id)) === id && 0 === use_attr) {
                var h = parseInt(quick_list[u].goods[g].goods_num);
                h < value && (wx.showToast({
                    title: "商品库存不足",
                    image: "/images/icon-warning.png"
                }), e = h), quick_list[u].goods[g].num = e, d = use_attr;
            }
            if (C === id && 1 === use_attr) {
                var _ = currentPage.data.temporaryGood;
                _.num < value && (wx.showToast({
                    title: "商品库存不足",
                    image: "/images/icon-warning.png"
                }), e = _.num), d = use_attr, c = quick_list[u].goods[g], currentPage.setData({
                    check_goods_price: (e * _.price).toFixed(2)
                });
            }
        }
        var m = 0;
        for (var l in carGoods) {
            if ((C = parseInt(carGoods[l].goods_id)) === id && 0 === d && (carGoods[l].num = e,
                carGoods[l].goods_price = (e * carGoods[l].price).toFixed(2)),
            C === id && 1 === d) {
                var v = currentPage.data.checked_attr, f = carGoods[l].attr, k = [];
                for (var u in f) k.push([f[u].attr_id, id]);
                k.sort().join() === v.sort().join() && (carGoods[l].num = e,
                    carGoods[l].goods_price = (e * carGoods[l].price).toFixed(2));
            }
            C === id && (m += carGoods[l].num);
        }
        for (var S in 1 === d && (c.num = m), goods_lists) {
            var C;
            (C = parseInt(goods_lists[S].id)) === id && 0 === d && (goods_lists[S].num = e), C === id && 1 === d && (goods_lists[S].num = m);
        }
        currentPage.setData({
            carGoods: carGoods,
            quick_list: quick_list,
            quick_hot_goods_lists: goods_lists
        }), this.carStatistics(currentPage);
    },

    quickHotStatistics: function () {
        var currentPage = this.currentPage, quick_hot_goods_lists = currentPage.data.quick_hot_goods_lists,
            quick_list = currentPage.data.quick_list;
        for (var i in quick_hot_goods_lists) for (var r in quick_list) for (var s in quick_list[r].goods)
            parseInt(quick_list[r].goods[s].id) === parseInt(quick_hot_goods_lists[i].id) && (quick_hot_goods_lists[i].num = quick_list[r].goods[s].num);
        currentPage.setData({
            quick_hot_goods_lists: quick_hot_goods_lists
        });
    },

    updateGoodNum: function () {
        var currentPage = this.currentPage, quick_list = currentPage.data.quick_list, goods = currentPage.data.goods;
        if (quick_list && goods) for (var i in quick_list) for (var r in quick_list[i].goods) if (parseInt(quick_list[i].goods[r].id) === parseInt(goods.id)) {
            var numCount = quick_list[i].goods[r].num, goods_num = quick_list[i].goods[r].num;
            currentPage.setData({
                goods_num: goods_num,
                goodNumCount: numCount
            });
            break;
        }
    },

    buynow: function (t) {
        var currentPage = this.currentPage, carGoods = currentPage.data.carGoods;
        currentPage.data.goodsModel;
        currentPage.setData({
            goodsModel: !1
        });
        for (var i = carGoods.length, goods_list = [], goods = [], n = 0; n < i; n++) 0 !== carGoods[n].num && (goods = {
            goods_id: carGoods[n].goods_id,
            num: carGoods[n].num,
            attr: carGoods[n].attr
        }, goods_list.push(goods));
        var data = [];
        data.push({
            mch_id: 0,
            goods_list: goods_list
        }), getApp().core.navigateTo({
            url: "/pages/new-order-submit/new-order-submit?mch_list=" + JSON.stringify(data)
        }), this.clearShoppingCart();
    }
};