module.exports = {
    currentPage: null,
    init: function(init) {
        var that = this;
        void 0 === (that.currentPage = init).favoriteAdd && (init.favoriteAdd = function(t) {
            that.favoriteAdd(t);
        }), void 0 === init.favoriteRemove && (init.favoriteRemove = function(t) {
            that.favoriteRemove(t);
        }), void 0 === init.kfMessage && (init.kfMessage = function(t) {
            that.kfMessage(t);
        }), void 0 === init.callPhone && (init.callPhone = function(t) {
            that.callPhone(t);
        }), void 0 === init.addCart && (init.addCart = function(t) {
            that.addCart(t);
        }), void 0 === init.buyNow && (init.buyNow = function(t) {
            that.buyNow(t);
        }), void 0 === init.goHome && (init.goHome = function(t) {
            that.goHome(t);
        });
    },
    favoriteAdd: function() {
        var currentPage = this.currentPage;
        getApp().request({
            url: getApp().api.user.favorite_add,
            method: "post",
            data: {
                goods_id: currentPage.data.goods.id
            },
            success: function(t) {
                if (0 == t.code) {
                    var goods = currentPage.data.goods;
                    goods.is_favorite = 1, currentPage.setData({
                        goods: goods
                    });
                }
            }
        });
    },
    favoriteRemove: function() {
        var currentPage = this.currentPage;
        getApp().request({
            url: getApp().api.user.favorite_remove,
            method: "post",
            data: {
                goods_id: currentPage.data.goods.id
            },
            success: function(t) {
                if (0 == t.code) {
                    var goods = currentPage.data.goods;
                    goods.is_favorite = 0, currentPage.setData({
                        goods: goods
                    });
                }
            }
        });
    },
    kfMessage: function() {
        getApp().core.getStorageSync(getApp().const.STORE).show_customer_service || getApp().core.showToast({
            title: "未启用客服功能"
        });
    },
    callPhone: function(t) {
        getApp().core.makePhoneCall({
            phoneNumber: t.target.dataset.info
        });
    },
    addCart: function() {
        this.currentPage.data.btn && this.submit("ADD_CART");
    },
    buyNow: function() {
        this.currentPage.data.btn && this.submit("BUY_NOW");
    },
    submit: function(t) {
        var currentPage = this.currentPage;
        if (!currentPage.data.show_attr_picker) return currentPage.setData({
            show_attr_picker: !0
        }), !0;
        if (currentPage.data.miaosha_data && 0 < currentPage.data.miaosha_data.rest_num
            && currentPage.data.form.number > currentPage.data.miaosha_data.rest_num) return getApp().core.showToast({
            title: "商品库存不足，请选择其它规格或数量",
            image: "/images/icon-warning.png"
        }), !0;
        if (currentPage.data.form.number > currentPage.data.goods.num) return getApp().core.showToast({
            title: "商品库存不足，请选择其它规格或数量",
            image: "/images/icon-warning.png"
        }), !0;
        var attr_group_list = currentPage.data.attr_group_list, list = [];
        for (var group_index in attr_group_list) {
            var attrs = !1;
            for (var attr_list in attr_group_list[group_index].attr_list) if (attr_group_list[group_index].attr_list[attr_list].checked) {
                attrs = {
                    attr_id: attr_group_list[group_index].attr_list[attr_list].attr_id,
                    attr_name: attr_group_list[group_index].attr_list[attr_list].attr_name
                };
                break;
            }
            if (!attrs) return getApp().core.showToast({
                title: "请选择" + attr_group_list[group_index].attr_group_name,
                image: "/images/icon-warning.png"
            }), !0;
            list.push({
                attr_group_id: attr_group_list[group_index].attr_group_id,
                attr_group_name: attr_group_list[group_index].attr_group_name,
                attr_id: attrs.attr_id,
                attr_name: attrs.attr_name
            });
        }
        if ("ADD_CART" == t && (getApp().core.showLoading({
            title: "正在提交",
            mask: !0
        }), getApp().request({
            url: getApp().api.cart.add_cart,
            method: "POST",
            data: {
                goods_id: currentPage.data.goods.id,
                attr: JSON.stringify(list),
                num: currentPage.data.form.number
            },
            success: function(t) {
                getApp().core.hideLoading(), getApp().core.showToast({
                    title: t.msg,
                    duration: 1500
                }), currentPage.setData({
                    show_attr_picker: !1
                });
            }
        })), "BUY_NOW" == t) {
            currentPage.setData({
                show_attr_picker: !1
            });
            var goods_list = [];
            goods_list.push({
                goods_id: currentPage.data.id,
                num: currentPage.data.form.number,
                attr: list
            });
            var goods = currentPage.data.goods, mch_id = 0;
            null != goods.mch && (mch_id = goods.mch.id);
            var pic = [];
            pic.push({
                mch_id: mch_id,
                goods_list: goods_list
            }), getApp().core.redirectTo({
                url: "/pages/new-order-submit/new-order-submit?mch_list=" + JSON.stringify(pic)
            });
        }
    },
    goHome: function(t) {
        var pageType = this.currentPage.data.pageType;
        if ("PINTUAN" === pageType) var url = "/pages/pt/index/index"; else if ("BOOK" === pageType) url = "/pages/book/index/index"; else url = "/pages/index/index";
        getApp().core.redirectTo({
            url: url
        });
    }
};