module.exports = {
    currentPage: null,
    shoppingCart: null,
    init: function(t, r) {
        var that = this;
        that.currentPage = t, that.shoppingCart = r, void 0 === t.showDialogBtn && (t.showDialogBtn = function(t) {
            that.showDialogBtn(t);
        }), void 0 === t.attrClick && (t.attrClick = function(t) {
            that.attrClick(t);
        }), void 0 === t.onConfirm && (t.onConfirm = function(t) {
            that.onConfirm(t);
        }), void 0 === t.guigejian && (t.guigejian = function(t) {
            that.guigejian(t);
        }), void 0 === t.close_box && (t.close_box = function(t) {
            that.close_box(t);
        }), void 0 === t.hideModal && (t.hideModal = function(t) {
            that.hideModal(t);
        });
    },
    showDialogBtn: function(t) {
        var currentPage = this.currentPage, that = this, dataset = t.currentTarget.dataset;
        getApp().request({
            url: getApp().api.default.goods,
            data: {
                id: dataset.id
            },
            success: function(t) {
                0 == t.code && (currentPage.setData({
                    currentGood: t.data,
                    goods_name: t.data.name,
                    attr_group_list: t.data.attr_group_list,
                    showModal: !0
                }), that.resetData(), that.updateData(), that.checkAttrNum());
            }
        });
    },
    resetData: function() {
        this.currentPage.setData({
            checked_attr: [],
            check_num: 0,
            check_goods_price: 0,
            temporaryGood: {
                price: "0.00",
                num: 0
            }
        });
    },
    updateData: function() {
        var currentPage = this.currentPage, currentGood = currentPage.data.currentGood,
            carGoods = currentPage.data.carGoods, attr = JSON.parse(currentGood.attr), attr_group_list = currentGood.attr_group_list;
        for (var e in attr) {
            var checked_attr = [];
            for (var s in attr[e].attr_list) checked_attr.push([ attr[e].attr_list[s].attr_id, currentGood.id ]);
            for (var d in carGoods) {
                var c = [];
                for (var u in carGoods[d].attr) c.push([ carGoods[d].attr[u].attr_id, carGoods[d].goods_id ]);
                if (checked_attr.sort().join() === c.sort().join()) {
                    for (var _ in attr_group_list) for (var p in attr_group_list[_].attr_list) for (var h in checked_attr) {
                        if (parseInt(attr_group_list[_].attr_list[p].attr_id) === parseInt(checked_attr[h])) {
                            attr_group_list[_].attr_list[p].checked = !0;
                            break;
                        }
                        attr_group_list[_].attr_list[p].checked = !1;
                    }
                    var temporaryGood = {
                        price: carGoods[d].price
                    };
                    return void currentPage.setData({
                        attr_group_list: attr_group_list,
                        check_num: carGoods[d].num,
                        check_goods_price: carGoods[d].goods_price,
                        checked_attr: checked_attr,
                        temporaryGood: temporaryGood
                    });
                }
            }
        }
    },
    checkUpdateData: function(t) {
        var currentPage = this.currentPage, carGoods = currentPage.data.carGoods;
        for (var i in carGoods) {
            var list = [];
            for (var e in carGoods[i].attr) list.push([ carGoods[i].attr[e].attr_id, carGoods[i].goods_id ]);
            list.sort().join() === t.sort().join() && currentPage.setData({
                check_num: carGoods[i].num,
                check_goods_price: carGoods[i].goods_price
            });
        }
    },
    attrClick: function(t) {
        var currentPage = this.currentPage, a = parseInt(t.target.dataset.groupId), i = parseInt(t.target.dataset.id),
            o = currentPage.data.attr_group_list, e = currentPage.data.currentGood, n = JSON.parse(e.attr), s = [];
        for (var d in o) if (o[d].attr_group_id == a) for (var c in o[d].attr_list) {
            (G = o[d].attr_list[c]).attr_id == i && !0 !== G.checked ? G.checked = !0 : G.checked = !1;
        }
        var u = [];
        for (var d in o) for (var c in o[d].attr_list) {
            !0 === (G = o[d].attr_list[c]).checked && (u.push([ G.attr_id, e.id ]), s.push(G.attr_id));
        }
        var _ = JSON.parse(e.attr), p = currentPage.data.temporaryGood;
        for (var h in _) {
            var g = [];
            for (var l in _[h].attr_list) g.push([ _[h].attr_list[l].attr_id, e.id ]);
            if (g.sort().join() === u.sort().join()) {
                if (0 === parseInt(_[h].num)) return;
                p = parseFloat(_[h].price) ? {
                    price: parseFloat(_[h].price).toFixed(2),
                    num: _[h].num
                } : {
                    price: parseFloat(e.price).toFixed(2),
                    num: _[h].num
                };
            }
        }
        var v = [];
        for (var d in console.log(s), n) {
            g = [];
            var f = 0;
            for (var c in n[d].attr_list) getApp().helper.inArray(n[d].attr_list[c].attr_id, s) || (f += 1), 
            g.push(n[d].attr_list[c].attr_id);
            0 === n[d].num && f <= 1 && v.push(g);
        }
        var m = s.length, k = [];
        if (o.length - m <= 1) for (var d in s) for (var c in v) if (getApp().helper.inArray(s[d], v[c]))
            for (var h in v[c]) v[c][h] !== s[d] && k.push(v[c][h]);
        for (var d in console.log(k), console.log(s), o) for (var c in o[d].attr_list) {
            var G = o[d].attr_list[c];
            getApp().helper.inArray(G.attr_id, k) && !getApp().helper.inArray(G.attr_id, s) ? G.is_attr_num = !0 : G.is_attr_num = !1;
        }
        this.resetData(), this.checkUpdateData(u), currentPage.setData({
            attr_group_list: o,
            temporaryGood: p,
            checked_attr: u
        });
    },

    checkAttrNum: function() {
        var currentPage = this.currentPage, group_list = currentPage.data.attr_group_list,
            attr = JSON.parse(currentPage.data.currentGood.attr), checked_attr = currentPage.data.checked_attr, list = [];
        for (var e in checked_attr) o.push(checked_attr[e][0]);
        for (var e in attr) {
            var n = [], s = 0;
            for (var d in attr[e].attr_list) {
                var c = attr[e].attr_list[d].attr_id;
                getApp().helper.inArray(c, list) ? s += 1 : n.push(c);
            }
            if (group_list.length - s == 1 && 0 == attr[e].num) for (var u in group_list) for (var _ in group_list[u].attr_list) {
                var p = group_list[u].attr_list[_];
                getApp().helper.inArray(p.attr_id, n) && (p.is_attr_num = !0);
            }
        }
        currentPage.setData({
            attr_group_list: group_list
        });
    },
    onConfirm: function(t) {
        var currentPage = this.currentPage, group_list = currentPage.data.attr_group_list,
            checked_attr = currentPage.data.checked_attr, currentGood = currentPage.data.currentGood;
        if (checked_attr.length === group_list.length) {
            var check_num = currentPage.data.check_num ? currentPage.data.check_num + 1 : 1, n = JSON.parse(currentGood.attr);
            for (var s in n) {
                var d = [];
                for (var c in n[s].attr_list) if (d.push([ n[s].attr_list[c].attr_id, currentGood.id ]),
                d.sort().join() === checked_attr.sort().join()) {
                    var price = n[s].price ? n[s].price : currentGood.price, attr_list = n[s].attr_list;
                    if (check_num > n[s].num) return void wx.showToast({
                        title: "商品库存不足",
                        image: "/images/icon-warning.png"
                    });
                }
            }
            var carGoods = currentPage.data.carGoods, h = 1, goods_price = parseFloat(price * check_num).toFixed(2);
            for (var l in carGoods) {
                var list = [];
                for (var f in carGoods[l].attr) list.push([ carGoods[l].attr[f].attr_id, carGoods[l].goods_id ]);
                if (list.sort().join() === checked_attr.sort().join()) {
                    h = 0, carGoods[l].num = carGoods[l].num + 1, carGoods[l].goods_price = parseFloat(price * carGoods[l].num).toFixed(2);
                    break;
                }
            }
            1 !== h && 0 !== carGoods.length || carGoods.push({
                goods_id: currentGood.id,
                attr: attr_list,
                goods_name: currentGood.name,
                goods_price: price,
                num: 1,
                price: price
            }), currentPage.setData({
                carGoods: carGoods,
                check_goods_price: goods_price,
                check_num: check_num
            }), this.shoppingCart.carStatistics(currentPage), this.attrGoodStatistics(), this.shoppingCart.updateGoodNum();
        } else wx.showToast({
            title: "请选择规格",
            image: "/images/icon-warning.png"
        });
    },

    guigejian: function(t) {
        var currentPage = this.currentPage, checked_attr = currentPage.data.checked_attr,
            carGoods = currentPage.data.carGoods, check_num = currentPage.data.check_num ? --currentPage.data.check_num : 1;
        currentPage.data.currentGood;
        for (var e in carGoods) {
            var n = [];
            for (var s in carGoods[e].attr) n.push([ carGoods[e].attr[s].attr_id, carGoods[e].goods_id ]);
            if (n.sort().join() === checked_attr.sort().join()) return 0 < carGoods[e].num && (carGoods[e].num -= 1,
                carGoods[e].goods_price = parseFloat(carGoods[e].num * carGoods[e].price).toFixed(2)), currentPage.setData({
                carGoods: carGoods,
                check_goods_price: carGoods[e].goods_price,
                check_num: check_num
            }), this.shoppingCart.carStatistics(currentPage), this.attrGoodStatistics(), void this.shoppingCart.updateGoodNum();
        }
    },
    attrGoodStatistics: function() {
        var currentPage = this.currentPage, currentGood = currentPage.data.currentGood, carGoods = currentPage.data.carGoods,
            quick_list = currentPage.data.quick_list, goods_lists = currentPage.data.quick_hot_goods_lists, e = 0;
        for (var n in carGoods) carGoods[n].goods_id === currentGood.id && (e += carGoods[n].num);
        for (var n in quick_list) for (var s in quick_list[n].goods) parseInt(quick_list[n].goods[s].id) === currentGood.id && (quick_list[n].goods[s].num = e);
        for (var n in goods_lists) parseInt(goods_lists[n].id) === currentGood.id && (goods_lists[n].num = e);
        currentPage.setData({
            quick_list: quick_list,
            quick_hot_goods_lists: goods_lists
        });
    },
    close_box: function(t) {
        this.currentPage.setData({
            showModal: !1
        });
    },
    hideModal: function() {
        this.currentPage.setData({
            showModal: !1
        });
    }
};