var longitude = "", latitude = "";

Page({
    data: {
        address: null,
        offline: 1,
        payment: -1,
        show_payment: !1
    },
    onLoad: function (options) {
        wx.showShareMenu({
            withShareTicket: true,
            menus: ['shareAppMessage', 'shareTimeline']
        })
        getApp().page.onLoad(this, options), getApp().core.removeStorageSync(getApp().const.INPUT_DATA);
        var offline, goods_info = options.goods_info, info = JSON.parse(goods_info);
        offline = 3 === info.deliver_type || 1 === info.deliver_type ? 1 : 2, this.setData({
            options: options,
            type: info.type,
            offline: offline,
            parent_id: info.parent_id ? info.parent_id : 0
        });
    },
    onReady: function (t) {
        getApp().page.onReady(this);
    },
    onShow: function (t) {
        getApp().page.onShow(this);
        var that = this, address = getApp().core.getStorageSync(getApp().const.PICKER_ADDRESS);
        address && (that.setData({
            address: address,
            name: address.name,
            mobile: address.mobile
        }), getApp().core.removeStorageSync(getApp().const.PICKER_ADDRESS), that.getInputData()),
            that.getOrderData(that.data.options);
    },
    onHide: function (t) {
        getApp().page.onHide(this), this.getInputData();
    },
    onUnload: function (t) {
        getApp().page.onUnload(this), getApp().core.removeStorageSync(getApp().const.INPUT_DATA);
    },
    onPullDownRefresh: function (t) {
        getApp().page.onPullDownRefresh(this);
    },
    onReachBottom: function (t) {
        getApp().page.onReachBottom(this);
    },
    getOrderData: function (event) {
        var that = this, address_id = "";
        that.data.address && that.data.address.id && (address_id = that.data.address.id), event.goods_info && (getApp().core.showLoading({
            title: "正在加载",
            mask: !0
        }), getApp().request({
            url: getApp().api.group.submit_preview,
            data: {
                goods_info: event.goods_info,
                group_id: event.group_id,
                address_id: address_id,
                type: that.data.type,
                longitude: longitude,
                latitude: latitude
            },
            success: function (res) {
                if (getApp().core.hideLoading(), 0 === res.code) {
                    var level_price = 0;
                    for (var a in res.data.list) level_price = res.data.list[a].level_price;
                    if (2 === that.data.offline) var o = parseFloat(0 < level_price - res.data.colonel ? level_price - res.data.colonel : .01),
                        express_price = 0; else o = parseFloat(0 < level_price - res.data.colonel ? level_price - res.data.colonel : .01) + res.data.express_price,
                        express_price = parseFloat(res.data.express_price);
                    var input_data = getApp().core.getStorageSync(getApp().const.INPUT_DATA);
                    getApp().core.removeStorageSync(getApp().const.INPUT_DATA), input_data || (input_data = {
                        address: res.data.address,
                        name: res.data.address ? res.data.address.name : "",
                        mobile: res.data.address ? res.data.address.mobile : ""
                    }, 0 < res.data.pay_type_list.length && (input_data.payment = res.data.pay_type_list[0].payment,
                    1 < res.data.pay_type_list.length && (input_data.payment = -1)), res.data.shop && (input_data.shop = res.data.shop),
                    res.data.shop_list && 1 === res.data.shop_list.length && (input_data.shop = res.data.shop_list[0])),
                        input_data.total_price = res.data.total_price, input_data.total_price_1 = o.toFixed(2), input_data.goods_list = res.data.list,
                        input_data.goods_info = res.data.goods_info, input_data.express_price = express_price, input_data.send_type = res.data.send_type,
                        input_data.colonel = res.data.colonel, input_data.pay_type_list = res.data.pay_type_list, input_data.shop_list = res.data.shop_list,
                        input_data.res = res.data, input_data.is_area = res.data.is_area, that.setData(input_data), that.getInputData();
                }
                1 === res.code && getApp().core.showModal({
                    title: "提示",
                    content: res.msg,
                    showCancel: !1,
                    confirmText: "返回",
                    success: function (t) {
                        t.confirm && getApp().core.navigateBack({
                            delta: 1
                        });
                    }
                });
            }
        }));
    },
    bindkeyinput: function (t) {
        this.setData({
            content: t.detail.value
        });
    },
    orderSubmit: function (t) {
        var that = this, address_list = {}, offline = that.data.offline;
        if (1 === (address_list.offline = offline)) {
            if (!that.data.address || !that.data.address.id) return void getApp().core.showToast({
                title: "请选择收货地址",
                image: "/images/icon-warning.png"
            });
            address_list.address_id = that.data.address.id;
        } else {
            if (address_list.address_name = that.data.name, address_list.address_mobile = that.data.mobile, !that.data.shop.id) return void getApp().core.showToast({
                title: "请选择核销门店",
                image: "/images/icon-warning.png"
            });
            if (address_list.shop_id = that.data.shop.id, !address_list.address_name || null == address_list.address_name) return void getApp().core.showToast({
                title: "请填写收货人",
                image: "/images/icon-warning.png"
            });
            if (!address_list.address_mobile || null == address_list.address_mobile) return void getApp().core.showToast({
                title: "请填写联系方式",
                image: "/images/icon-warning.png"
            });
            if (!/^\+?\d[\d -]{8,12}\d/.test(address_list.address_mobile)) return void getApp().core.showModal({
                title: "提示",
                content: "手机号格式不正确"
            });
        }
        if (-1 === that.data.payment) return that.setData({
            show_payment: !0
        }), !1;
        that.data.goods_info && (address_list.goods_info = JSON.stringify(that.data.goods_info)), that.data.picker_coupon && (address_list.user_coupon_id = that.data.picker_coupon.user_coupon_id),
        that.data.content && (address_list.content = that.data.content), that.data.type && (address_list.type = that.data.type),
        that.data.parent_id && (address_list.parent_id = that.data.parent_id), address_list.payment = that.data.payment,
            address_list.formId = t.detail.formId, that.order_submit(address_list, "pt");
    },
    KeyName: function (t) {
        this.setData({
            name: t.detail.value
        });
    },
    KeyMobile: function (t) {
        this.setData({
            mobile: t.detail.value
        });
    },
    getOffline: function (t) {
        var that = this, index = t.target.dataset.index,
            price = parseFloat(0 < that.data.res.total_price - that.data.res.colonel ? that.data.res.total_price - that.data.res.colonel : .01) + that.data.res.express_price;
        if (1 == index) this.setData({
            offline: 1,
            express_price: that.data.res.express_price,
            total_price_1: price.toFixed(2)
        }); else {
            var total_price_1 = (that.data.total_price_1 - that.data.express_price).toFixed(2);
            this.setData({
                offline: 2,
                express_price: 0,
                total_price_1: total_price_1
            });
        }
    },
    showShop: function (t) {
        var that = this;
        that.getInputData(), that.dingwei(), that.data.shop_list && 1 <= thatdata.shop_list.length && that.setData({
            show_shop: !0
        });
    },
    dingwei: function () {
        var that = this;
        getApp().getauth({
            content: "需要获取您的地理位置授权，请到小程序设置中打开授权",
            author: "scope.userLocation",
            success: function (res) {
                res && (res.authSetting["scope.userLocation"] ? getApp().core.chooseLocation({
                    success: function (t) {
                        longitude = t.longitude, latitude = t.latitude, that.setData({
                            location: t.address
                        });
                    }
                }) : getApp().core.showToast({
                    title: "您取消了授权",
                    image: "/images/icon-warning.png"
                }));
            }
        });
    },
    pickShop: function (t) {
        var input_data = getApp().core.getStorageSync(getApp().const.INPUT_DATA), index = t.currentTarget.dataset.index;
        input_data.show_shop = !1, input_data.shop = "-1" !== index && -1 != index && this.data.shop_list[index], this.setData(input_data);
    },
    showPayment: function () {
        this.setData({
            show_payment: !0
        });
    },
    payPicker: function (t) {
        var index = t.currentTarget.dataset.index;
        this.setData({
            payment: index,
            show_payment: !1
        });
    },
    payClose: function () {
        this.setData({
            show_payment: !1
        });
    },
    getInputData: function () {
        var that = this, data = {
            address: that.data.address,
            name: that.data.name,
            mobile: that.data.mobile,
            payment: that.data.payment,
            content: that.data.content,
            shop: that.data.shop
        };
        getApp().core.setStorageSync(getApp().const.INPUT_DATA, data);
    }
});