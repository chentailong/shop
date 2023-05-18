Page({
    data: {
        total_price: 0,
        cart_check_all: !1,
        cart_list: [],
        mch_list: [],
        loading: !0,
        check_all_self: !1
    },
    // t -> data(传输数据)
    onLoad: function (data) {
        wx.showShareMenu({
            withShareTicket: true,
            menus: ['shareAppMessage', 'shareTimeline']
        })
        getApp().page.onLoad(this, data);
    },
    onReady: function () {
    },
    onShow: function () {
        getApp().page.onShow(this);
        this.setData({
            cart_check_all: !1,
            show_cart_edit: !1,
            check_all_self: !1
        }), this.getCartList();
    },
    // a -> that(指向性)
    getCartList: function () {
        var that = this;
        getApp().core.showNavigationBarLoading(), that.setData({
            show_no_data_tip: !1,
            loading: !0
        }), getApp().request({
            url: getApp().api.cart.list,
            success: function (res) {
                0 == res.code && that.setData({
                    cart_list: res.data.list,
                    mch_list: res.data.mch_list,
                    total_price: 0,
                    cart_check_all: !1,
                    show_cart_edit: !1
                }), that.setData({
                    show_no_data_tip: 0 == that.data.cart_list.length
                });
            },
            complete: function () {
                getApp().core.hideNavigationBarLoading(), that.setData({
                    loading: !1
                });
            }
        });
    },
    // t -> data; a -> that;  c -> page(页数); i -> index; e -> cartList(数据列表); s -> subscript
    cartLess: function (data) {
        var that = this;
        if (data.currentTarget.dataset.type && "mch" == data.currentTarget.dataset.type) {
            var index = data.currentTarget.dataset.mchIndex, page = data.currentTarget.dataset.index;
            that.data.mch_list[index].list[page].num = that.data.mch_list[index].list[page].num - 1, that.data.mch_list[index].list[page].price = that.data.mch_list[index].list[page].num * that.data.mch_list[index].list[page].unitPrice,
                that.setData({
                    mch_list: that.data.mch_list
                });
        } else {
            var cartList = that.data.cart_list;
            for (var subscript in cartList) data.currentTarget.id == cartList[subscript].cart_id && (cartList[subscript].num = that.data.cart_list[subscript].num - 1,
                cartList[subscript].price = that.data.cart_list[subscript].unitPrice * cartList[subscript].num, that.setData({
                cart_list: cartList
            }));
        }
        that.updateTotalPrice();
    },

    // t -> data; a -> that;  c -> page(页数); i -> index; e -> cartList(数据列表); s -> subscript
    cartAdd: function (data) {
        var that = this;
        if (data.currentTarget.dataset.type && "mch" == data.currentTarget.dataset.type) {
            var index = data.currentTarget.dataset.mchIndex, page = data.currentTarget.dataset.index;
            that.data.mch_list[index].list[page].num = that.data.mch_list[index].list[page].num + 1, that.data.mch_list[index].list[page].price = that.data.mch_list[index].list[page].num * that.data.mch_list[index].list[page].unitPrice,
                that.setData({
                    mch_list: this.cartAdd.data.mch_list
                });
        } else {
            var cartList = that.data.cart_list;
            for (var subscript in cartList) data.currentTarget.id == cartList[subscript].cart_id && (cartList[subscript].num = that.data.cart_list[subscript].num + 1,
                cartList[subscript].price = that.data.cart_list[subscript].unitPrice * cartList[subscript].num, that.setData({
                cart_list: cartList
            }));
        }
        that.updateTotalPrice();
    },
    // t -> data; a -> that;  c -> type(类型); i -> index; e -> page;
    cartCheck: function (data) {
        var that = this, index = data.currentTarget.dataset.index, type = data.currentTarget.dataset.type,
            page = data.currentTarget.dataset.mchIndex;
        "self" == type && (that.data.cart_list[index].checked = !that.data.cart_list[index].checked, that.setData({
            cart_list: that.data.cart_list
        })), "mch" == type && (that.data.mch_list[page].list[index].checked = !that.data.mch_list[page].list[index].checked,
            that.setData({
                mch_list: that.data.mch_list
            })),
            that.updateTotalPrice();
    },
    // t -> that; a -> cartList(购物车列表); i -> checked(选择状态); c -> index;  e -> page
    cartCheckAll: function () {
        var that = this, cartList = that.data.cart_list, checked = !1;
        for (var index in checked = !that.data.cart_check_all, cartList) cartList[index].disabled && !that.data.show_cart_edit || (cartList[index].checked = checked);
        if (that.data.mch_list && that.data.mch_list.length) for (var index in that.data.mch_list) for (var page in that.data.mch_list[index].list) that.data.mch_list[index].list[page].checked = checked;
        that.setData({
            cart_check_all: checked,
            cart_list: cartList,
            mch_list: that.data.mch_list
        }), that.updateTotalPrice();
    },
    // t -> that; i -> cartList(购物车列表);  a-> number(选择数量); c -> index;  e -> page
    updateTotalPrice: function () {
        var that = this, number = 0, cartList = that.data.cart_list;
        for (var index in cartList) cartList[index].checked && (number += cartList[index].price);
        for (var index in that.data.mch_list) for (var page in that.data.mch_list[index].list) that.data.mch_list[index].list[page].checked && (number += that.data.mch_list[index].list[page].price);
        that.setData({
            total_price: number.toFixed(2)
        });
    },
    // t -> that; a -> cartList(购物车列表); i -> mchList(选择状态); c -> cart_id; r -> cartId; e -> mchId; s -> mch_id;
    // l -> index; d -> cartList; h -> goodsList; n -> mchList_id
    cartSubmit: function () {
        var that = this, cartList = that.data.cart_list, mchList = that.data.mch_list, cart_id = [], mchId = [], mch_id = [], cartId = [];
        for (var index in cartList) cartList[index].checked && (cart_id.push(cartList[index].cart_id), cartId.push({
            cart_id: cartList[index].cart_id
        }));
        for (var index in 0 < cart_id.length && mch_id.push({
            mch_id: 0,
            goods_list: cartId
        }), mchList) {
            var cartList = [], goodsList = [];
            if (mchList[index].list && mchList[index].list.length) for (var mchList_id in mchList[index].list) mchList[index].list[mchList_id].checked && (cartList.push(mchList[index].list[mchList_id].cart_id),
                goodsList.push({
                    cart_id: mchList[index].list[mchList_id].cart_id
                }));
            cartList.length && (mchId.push({
                id: mchList[index].id,
                cart_id_list: cartList
            }), mch_id.push({
                mch_id: mchList[index].id,
                goods_list: goodsList
            }));
        }
        if (0 == cart_id.length && 0 == mchId.length) return !0;
        getApp().core.showLoading({
            title: "正在提交",
            mask: !0
        }), that.saveCart(function () {
            getApp().core.navigateTo({
                url: "/pages/new-order-submit/new-order-submit?mch_list=" + JSON.stringify(mch_id)
            });
        }), getApp().core.hideLoading();
    },

    // t -> cartList; a -> cartId
    cartEdit: function () {
        var cartList = this.data.cart_list;
        for (var cartId in cartList) cartList[cartId].checked = !1;
        this.setData({
            cart_list: cartList,
            show_cart_edit: !0,
            cart_check_all: !1
        }), this.updateTotalPrice();
    },

    //t -> cartList; a -> cartId
    cartDone: function () {
        var cartList = this.data.cart_list;
        for (var cartId in cartList) cartList[cartId].checked = !1;
        this.setData({
            cart_list: cartList,
            show_cart_edit: !1,
            cart_check_all: !1
        }), this.updateTotalPrice();
    },

    // a -> that; t -> cartList; i -> cartId; c -> index; e -> list;
    cartDelete: function () {
        var that = this, cartList = that.data.cart_list, cartId = [];
        for (var index in cartList) cartList[index].checked && cartId.push(cartList[index].cart_id);
        if (that.data.mch_list && that.data.mch_list.length) for (var index in that.data.mch_list) for (var list in that.data.mch_list[index].list) that.data.mch_list[index].list[list].checked && cartId.push(that.data.mch_list[index].list[list].cart_id);
        if (0 == cartId.length) return !0;
        getApp().core.showModal({
            title: "提示",
            content: "确认删除" + cartId.length + "项内容？",
            success: function (res) {
                if (res.cancel) return !0;
                getApp().core.showLoading({
                    title: "正在删除",
                    mask: !0
                }), getApp().request({
                    url: getApp().api.cart.delete,
                    data: {
                        cart_id_list: JSON.stringify(cartId)
                    },
                    success: function (e) {
                        getApp().core.hideLoading(), getApp().core.showToast({
                            title: e.msg
                        }), 0 == e.code && that.getCartList(), e.code;
                    }
                });
            }
        });
    },
    onHide: function () {
        this.saveCart();
    },
    onUnload: function () {
        this.saveCart();
    },
    // a -> cartList
    saveCart: function (data) {
        var cartList = JSON.stringify(this.data.cart_list);
        getApp().request({
            url: getApp().api.cart.cart_edit,
            method: "post",
            data: {
                list: cartList,
                mch_list: JSON.stringify(this.data.mch_list)
            },
            success: function (res) {
                res.code;
            },
            complete: function () {
                "function" == typeof data && data();
            }
        });
    },

    // t -> data; a -> that; i -> type; c -> index; e -> page;
    checkGroup: function (data) {
        var that = this, type = data.currentTarget.dataset.type, index = data.currentTarget.dataset.index;
        if ("self" == type) {
            for (var page in that.data.cart_list) that.data.cart_list[page].checked = !that.data.check_all_self;
            that.setData({
                check_all_self: !that.data.check_all_self,
                cart_list: that.data.cart_list
            });
        }
        if ("mch" == type) {
            for (var page in that.data.mch_list[index].list) that.data.mch_list[index].list[page].checked = !that.data.mch_list[index].checked_all;
            that.data.mch_list[index].checked_all = !that.data.mch_list[index].checked_all, that.setData({
                mch_list: that.data.mch_list
            });
        }
        that.updateTotalPrice();
    }
});