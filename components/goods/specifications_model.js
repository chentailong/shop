module.exports = {
    currentPage: null,
    init: function (t) {
        var that = this;
        void 0 === (that.currentPage = t).previewImage && (t.previewImage = function (t) {
            that.previewImage(t);
        }), void 0 === t.showAttrPicker && (t.showAttrPicker = function (t) {
            that.showAttrPicker(t);
        }), void 0 === t.hideAttrPicker && (t.hideAttrPicker = function (t) {
            that.hideAttrPicker(t);
        }), void 0 === t.storeAttrClick && (t.storeAttrClick = function (t) {
            that.storeAttrClick(t);
        }), void 0 === t.numberAdd && (t.numberAdd = function (t) {
            that.numberAdd(t);
        }), void 0 === t.numberSub && (t.numberSub = function (t) {
            that.numberSub(t);
        }), void 0 === t.numberBlur && (t.numberBlur = function (t) {
            that.numberBlur(t);
        }), void 0 === t.selectDefaultAttr && (t.selectDefaultAttr = function (t) {
            that.selectDefaultAttr(t);
        });
    },
    previewImage: function (t) {
        var url = t.currentTarget.dataset.url;
        getApp().core.previewImage({
            urls: [url]
        });
    },
    hideAttrPicker: function () {
        this.currentPage.setData({
            show_attr_picker: !1
        });
    },
    showAttrPicker: function () {
        this.currentPage.setData({
            show_attr_picker: !0
        });
    },
    storeAttrClick: function (t) {
        var currentPage = this.currentPage, groupId = t.target.dataset.groupId,
            datasetId = parseInt(t.target.dataset.id),
            group_list = JSON.parse(JSON.stringify(currentPage.data.attr_group_list)),
            attr = currentPage.data.goods.attr, data = [];
        for (var index in "string" == typeof attr && (attr = JSON.parse(attr)), group_list) if (group_list[index].attr_group_id == groupId) for (var attr_list_index in group_list[index].attr_list) {
            var attr_list = group_list[index].attr_list[attr_list_index];
            parseInt(attr_list.attr_id) === datasetId && attr_list.checked ? attr_list.checked = !1 : attr.checked = parseInt(attr_list.attr_id) === datasetId;
        }
        for (var index in group_list) for (var attr_list_index in group_list[index].attr_list) group_list[index].attr_list[attr_list_index].checked && data.push(group_list[index].attr_list[attr_list_index].attr_id);
        for (var index in group_list) for (var attr_list_index in group_list[index].attr_list) {
            if ((attr_list = group_list[index].attr_list[attr_list_index]).attr_id === datasetId && !0 === attr_list.attr_num_0) return;
        }
        var lists = [];
        for (var index in attr) {
            var list = [], _ = 0;
            for (var attr_list_index in attr[index].attr_list) getApp().helper.inArray(attr[index].attr_list[attr_list_index].attr_id, data) || (_ += 1),
                list.push(attr[index].attr_list[attr_list_index].attr_id);
            0 === attr[index].num && _ <= 1 && lists.push(list);
        }
        var g = data.length, l = [];
        if (group_list.length - g <= 1) for (var index in data) for (var attr_list_index in lists) if (getApp().helper.inArray(data[index], lists[attr_list_index]))
            for (var f in lists[attr_list_index]) lists[attr_list_index][f] !== data[index] && l.push(lists[attr_list_index][f]);
        for (var index in group_list) for (var attr_list_index in group_list[index].attr_list) {
            var m = group_list[index].attr_list[attr_list_index];
            getApp().helper.inArray(m.attr_id, l) && !getApp().helper.inArray(m.attr_id, data) ? m.attr_num_0 = !0 : m.attr_num_0 = !1;
        }
        currentPage.setData({
            attr_group_list: group_list
        });
        var h = [], A = !0;
        for (var n in group_list) {
            var v = !1;
            for (var d in group_list[n].attr_list) if (group_list[n].attr_list[d].checked) {
                if ("INTEGRAL" !== currentPage.data.pageType) {
                    h.push(group_list[n].attr_list[d].attr_id), v = !0;
                    break;
                }
                attr = {
                    attr_id: group_list[n].attr_list[d].attr_id,
                    attr_name: group_list[n].attr_list[d].attr_name
                };
                h.push(attr);
            }
            if ("INTEGRAL" !== currentPage.data.pageType && !v) {
                A = !1;
                break;
            }
        }
        if ("INTEGRAL" === currentPage.data.pageType || A) {
            getApp().core.showLoading({
                title: "正在加载",
                mask: !0
            });
            var b = currentPage.data.pageType;
            v = 0;
            if ("STORE" === b) var k = getApp().api.default.goods_attr_info; else if ("PINTUAN" === b) {
                k = getApp().api.group.goods_attr_info;
                v = currentPage.data.group_checked;
            } else {
                if ("INTEGRAL" === b) return getApp().core.hideLoading(), void this.integralMallAttrClick(h);
                if ("BOOK" === b) k = getApp().api.book.goods_attr_info; else if ("STEP" === b) k = getApp().api.default.goods_attr_info; else {
                    if ("MIAOSHA" !== b) return getApp().core.showModal({
                        title: "提示",
                        content: "pageType变量未定义或变量值不是预期的"
                    }), void getApp().core.hideLoading();
                    k = getApp().api.default.goods_attr_info;
                }
            }
            getApp().request({
                url: k,
                data: {
                    goods_id: "MIAOSHA" === b ? currentPage.data.id : currentPage.data.goods.id,
                    group_id: currentPage.data.group_checked,
                    attr_list: JSON.stringify(h),
                    type: "MIAOSHA" === b ? "ms" : "",
                    group_checked: v
                },
                success: function (t) {
                    if (getApp().core.hideLoading(), 0 == t.code) {
                        var a = currentPage.data.goods;
                        if (a.price = t.data.price, a.num = t.data.num, a.attr_pic = t.data.pic, a.is_member_price = t.data.is_member_price,
                            a.single_price = t.data.single_price ? t.data.single_price : 0, a.group_price = t.data.price,
                        "MIAOSHA" === b) {
                            var r = t.data.miaosha;
                            a.price = r.price, a.num = r.miaosha_num, a.is_member_price = r.is_member_price,
                                a.attr_pic = r.pic, currentPage.setData({
                                miaosha_data: r
                            });
                        }
                        "BOOK" === b && (a.price = 0 < a.price ? a.price : "免费预约"), currentPage.setData({
                            goods: a
                        });
                    }
                }
            });
        }
    },


    attrClick: function (t) {
        var r = this
        var a = t.target.dataset.groupId
        var e = t.target.dataset.id, i = r.data.attr_group_list;
        for (var o in i) if (i[o].attr_group_id == a) for (var s in i[o].attr_list) i[o].attr_list[s].attr_id == e ? i[o].attr_list[s].checked = !0 : i[o].attr_list[s].checked = !1;
        r.setData({
            attr_group_list: i
        });
        var n = [], d = !0;
        for (var o in i) {
            var p = !1;
            for (var s in i[o].attr_list) if (i[o].attr_list[s].checked) {
                n.push(i[o].attr_list[s].attr_id), p = !0;
                break;
            }
            if (!p) {
                d = !1;
                break;
            }
        }
        d && (getApp().core.showLoading({
            title: "正在加载",
            mask: !0
        }), getApp().request({
            url: getApp().api.default.goods_attr_info,
            data: {
                goods_id: r.data.id,
                attr_list: JSON.stringify(n),
                type: "ms"
            },
            success: function (t) {
                if (getApp().core.hideLoading(), 0 == t.code) {
                    var a = r.data.goods;
                    a.price = t.data.price, a.num = t.data.num, a.attr_pic = t.data.pic, r.setData({
                        goods: a,
                        miaosha_data: t.data.miaosha
                    });
                }
            }
        }));
    },

    integralMallAttrClick: function (t) {
        var a = this.currentPage, r = a.data.goods, e = r.attr, i = 0, o = 0;
        for (var s in e) JSON.stringify(e[s].attr_list) == JSON.stringify(t) && (i = 0 < parseFloat(e[s].price) ? e[s].price : r.price,
            o = 0 < parseInt(e[s].integral) ? e[s].integral : r.integral, r.attr_pic = e[s].pic,
            r.num = e[s].num, a.setData({
            attr_integral: o,
            attr_num: e[s].num,
            attr_price: i,
            status: "attr",
            goods: r
        }));
    },

    numberSub: function () {
        var t = this.currentPage, a = t.data.form.number;
        if (a <= 1) return !0;
        a--, t.setData({
            form: {
                number: a
            }
        });
    },

    numberAdd: function () {
        var t = this.currentPage, a = t.data.form.number, r = t.data.pageType;
        if (!(++a > t.data.goods.one_buy_limit && 0 != t.data.goods.one_buy_limit)) return "MIAOSHA" === r && a > t.data.goods.miaosha.buy_max && 0 != t.data.goods.miaosha.buy_max ? (getApp().core.showToast({
            title: "一单限购" + t.data.goods.miaosha.buy_max,
            image: "/images/icon-warning.png"
        }), !0) : void t.setData({
            form: {
                number: a
            }
        });
        getApp().core.showModal({
            title: "提示",
            content: "数量超过最大限购数",
            showCancel: !1,
            success: function (t) {
            }
        });
    },

    numberBlur: function (t) {
        var a = this.currentPage, r = t.detail.value, e = a.data.pageType;
        if (r = parseInt(r), isNaN(r) && (r = 1), r <= 0 && (r = 1), r > a.data.goods.one_buy_limit && 0 != a.data.goods.one_buy_limit && (getApp().core.showModal({
            title: "提示",
            content: "数量超过最大限购数",
            showCancel: !1,
            success: function (t) {
            }
        }), r = a.data.goods.one_buy_limit), "MIAOSHA" === e && r > a.data.goods.miaosha.buy_max && 0 != a.data.goods.miaosha.buy_max) return getApp().core.showToast({
            title: "一单限购" + a.data.goods.miaosha.buy_max,
            image: "/images/icon-warning.png"
        }), !0;
        a.setData({
            form: {
                number: r
            }
        });
    },

    selectDefaultAttr: function () {
        var t = this.currentPage;
        if (t.data.goods && 0 == t.data.goods.use_attr) {
            for (var a in t.data.attr_group_list) for (var r in t.data.attr_group_list[a].attr_list) 0 == a && 0 == r && (t.data.attr_group_list[a].attr_list[r].checked = !0);
            t.setData({
                attr_group_list: t.data.attr_group_list
            });
        }
    }
};