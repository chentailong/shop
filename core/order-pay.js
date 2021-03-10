var app = getApp();
var deliver_template = '_XyGBjtCXpWQgSdZ5lEBa03UCa5vMuc2PJkmUVeXufU' //发货模板id
var order_template = '9_o1f7zU4g42YEIl-8jjkc7qFciP7UWr_qByz5L4S5s'  //下单模板id
var pt_template = 'B9lA_l-HCzFWDToCzRmnRkxrVSDBhE2cl144Ohc6gjk'     //拼团发起模板id

function setOnShowScene(e) {
    app.onShowData || (app.onShowData = {}), app.onShowData.scene = e;
}

var pay = {
    init: function (l, e) {
        var that = this, Api = getApp().api;
        that.page = l, app = e;
        var parent_id = getApp().core.getStorageSync(getApp().const.PARENT_ID);
        parent_id || (parent_id = 0), that.page.orderPay = function (res) {
            var dataIndex = res.currentTarget.dataset.index, orderList = that.page.data.order_list[dataIndex],
                array = new Array();
            if (void 0 !== that.page.data.pay_type_list) array = that.page.data.pay_type_list; else if (void 0 !== orderList.pay_type_list) array = orderList.pay_type_list; else if (void 0 !== orderList.goods_list[0].pay_type_list) array = orderList.goods_list[0].pay_type_list; else {
                var payment = {
                    payment: 0
                };
                array.push(payment);
            }
            var page = getCurrentPages(), routes = page[page.length - 1].route, order_list = {};
            if (-1 != routes.indexOf("pt")) pay_data = Api.group.pay_data, order_list.order_id = orderList.order_id; else if (-1 != routes.indexOf("miaosha")) pay_data = Api.miaosha.pay_data,
                order_list.order_id = orderList.order_id; else if (-1 != routes.indexOf("book")) pay_data = Api.book.order_pay,
                order_list.id = orderList.id; else {
                var pay_data = Api.order.pay_data;
                order_list.order_id = orderList.order_id;
            }

            //微信支付
            function WECHAT_PAY(order_list, url, routes) {
                order_list.pay_type = "WECHAT_PAY", app.request({
                    url: url,
                    data: order_list,
                    complete: function () {
                        getApp().core.hideLoading();
                    },
                    success: function (res) {
                        0 == res.code && (setOnShowScene("pay"), getApp().core.requestPayment({
                            _res: res,
                            timeStamp: res.data.timeStamp,
                            nonceStr: res.data.nonceStr,
                            package: res.data.package,
                            signType: res.data.signType,
                            paySign: res.data.paySign,
                            success: function (e) {
                            },
                            fail: function (error) {
                            },
                            complete: function (info) {
                                "requestPayment:fail" != info.errMsg && "requestPayment:fail cancel" != info.errMsg ? getApp().core.redirectTo({
                                    url: "/" + routes + "?status=1"
                                }) : getApp().core.showModal({
                                    title: "提示",
                                    content: "订单尚未支付",
                                    showCancel: !1,
                                    confirmText: "确认",
                                    success: function (e) {
                                        e.confirm && getApp().core.redirectTo({
                                            url: "/" + routes + "?status=0"
                                        });
                                    }
                                });
                            }
                        })), 1 == res.code && getApp().core.showToast({
                            title: res.msg,
                            image: "/images/icon-warning.png"
                        });
                    }
                });
            }

            //余额支付
            function BALANCE_PAY(order_list, url, routes) {
                order_list.pay_type = "BALANCE_PAY";
                var userinfo = getApp().getUser();
                getApp().core.showModal({
                    title: "当前账户余额：" + userinfo.money,
                    content: "是否使用余额",
                    success: function (res) {
                        res.confirm && (getApp().core.showLoading({
                            title: "正在提交",
                            mask: !0
                        }), app.request({
                            url: url,
                            data: order_list,
                            complete: function () {
                                getApp().core.hideLoading();
                            },
                            success: function (e) {
                                0 == e.code && getApp().core.redirectTo({
                                    url: "/" + routes + "?status=1"
                                }), 1 == e.code && getApp().core.showModal({
                                    title: "提示",
                                    content: e.msg,
                                    showCancel: !1
                                });
                            }
                        }));
                    }
                });
            }

            order_list.parent_id = parent_id, order_list.condition = 2, 1 == array.length ? (getApp().core.showLoading({
                title: "正在提交",
                mask: !0
            }), 0 == array[0].payment && WECHAT_PAY(order_list, pay_data, routes), 3 == array[0].payment && BALANCE_PAY(order_list, pay_data, routes)) : getApp().core.showModal({
                title: "提示",
                content: "选择支付方式",
                cancelText: "余额支付",
                confirmText: "线上支付",
                success: function (e) {
                    e.confirm ? (getApp().core.showLoading({
                        title: "正在提交",
                        mask: !0
                    }), WECHAT_PAY(order_list, pay_data, routes)) : e.cancel && BALANCE_PAY(order_list, pay_data, routes);
                }
            });
        },
            that.page.order_submit = function (order_list, post_type) {
                var submit_url = Api.order.submit, pay_data = Api.order.pay_data, site = "/pages/order/order";
                if ("pt" == post_type ? (submit_url = Api.group.submit, pay_data = Api.group.pay_data, site = "/pages/pt/order/order") : "ms" == post_type ? (submit_url = Api.miaosha.submit,
                    pay_data = Api.miaosha.pay_data, site = "/pages/miaosha/order/order") : "pond" == post_type ? (submit_url = Api.pond.submit,
                    pay_data = Api.order.pay_data, site = "/pages/order/order") : "scratch" == post_type ? (submit_url = Api.scratch.submit,
                    pay_data = Api.order.pay_data, site = "/pages/order/order") : "lottery" == post_type ? (submit_url = Api.lottery.submit,
                    pay_data = Api.order.pay_data, site = "/pages/order/order") : "step" == post_type ? (submit_url = Api.step.submit,
                    pay_data = Api.order.pay_data, site = "/pages/order/order") : "s" == post_type && (submit_url = Api.order.new_submit,
                    pay_data = Api.order.pay_data, site = "/pages/order/order"), 3 == order_list.payment) {
                    var userinfo = getApp().getUser();
                    console.log(order_list)
                    // if (order_list.password == password) {
                    //     o();
                    // } else if (order_list.password == null || order_list.password == '') {
                    //     return
                    // } else if (order_list.password != password) {
                    //     return wx.showToast({
                    //         icon: "none",
                    //         title: '密码错误,请重新输入'
                    //     })
                    // }
                    getApp().core.showModal({
                        title: "当前账户余额：" + userinfo.money,
                        content: "是否确定使用余额支付",
                        success: function (res) {
                            res.confirm && pay();
                        }
                    });
                } else pay();

                function pay() {
                    getApp().core.showLoading({
                        title: "正在提交",
                        mask: !0
                    }), app.request({
                        url: submit_url,
                        method: "post",
                        data: order_list,
                        success: function (e) {
                            if (0 == e.code) {
                                var t = function () {
                                    app.request({
                                        url: pay_data,
                                        data: {
                                            order_id: d,
                                            order_id_list: o,
                                            pay_type: a,
                                            form_id: order_list.formId,
                                            parent_user_id: parent_id,
                                            condition: 2
                                        },
                                        success: function (e) {
                                            //获取用户权限，发送信息
                                            wx.requestSubscribeMessage({
                                                tmplIds: [deliver_template, order_template, pt_template],
                                                success(res) {
                                                    console.log(res)
                                                },
                                                fail(err) {
                                                    console.log(err)
                                                }
                                            })
                                            if (0 != e.code) return getApp().core.hideLoading(), void getApp().core.showModal({
                                                title: "提示",
                                                content: e.msg,
                                                showCancel: !1,
                                                confirmText: "确认",
                                                success: function (e) {
                                                    e.confirm && getApp().core.redirectTo({
                                                        url: site + "?status=0",
                                                    });
                                                }
                                            });
                                            setTimeout(function () {
                                                getApp().core.hideLoading();
                                            }, 1e3), "pt" == post_type ? "ONLY_BUY" == that.page.data.type ? getApp().core.redirectTo({
                                                url: site + "?status=2"
                                            }) : getApp().core.redirectTo({
                                                url: "/pages/pt/group/details?oid=" + d
                                            }) : void 0 !== that.page.data.goods_card_list && 0 < that.page.data.goods_card_list.length && 2 != order_list.payment ? that.page.setData({
                                                show_card: !0
                                            }) : getApp().core.redirectTo({
                                                url: site + "?status=-1",
                                            });
                                        }
                                    });
                                };
                                if (getApp().page.bindParent({
                                    parent_id: parent_id,
                                    condition: 1
                                }), null != e.data.p_price && 0 === e.data.p_price) return "step" == post_type ? getApp().core.showToast({
                                    title: "兑换成功"
                                }) : getApp().core.showToast({
                                    title: "提交成功"
                                }), void setTimeout(function () {
                                    getApp().coore.redirectTo({
                                        url: "/pages/order/order?status=1"
                                    });
                                }, 2e3);
                                setTimeout(function () {
                                    that.page.setData({
                                        options: {}
                                    });
                                }, 1);
                                var d = e.data.order_id || "",
                                    o = e.data.order_id_list ? JSON.stringify(e.data.order_id_list) : "", a = "";
                                0 == order_list.payment ? app.request({
                                    url: pay_data,
                                    data: {
                                        order_id: d,
                                        order_id_list: o,
                                        pay_type: "WECHAT_PAY",
                                        parent_user_id: parent_id,
                                        condition: 2
                                    },
                                    success: function (e) {
                                        if (0 != e.code) {
                                            if (1 == e.code) return getApp().core.hideLoading(), void getApp().core.showToast({
                                                title: e.msg,
                                                image: "/images/icon-warning.png"
                                            });
                                        } else {
                                            setTimeout(function () {
                                                getApp().core.hideLoading();
                                            }, 1e3), setOnShowScene("pay"), e.data && 0 == e.data.price ? void 0 !== that.page.data.goods_card_list && 0 < that.page.data.goods_card_list.length ? that.page.setData({
                                                show_card: !0
                                            }) : getApp().core.redirectTo({
                                                url: site + "?status=1"
                                            }) : getApp().core.requestPayment({
                                                _res: e,
                                                timeStamp: e.data.timeStamp,
                                                nonceStr: e.data.nonceStr,
                                                package: e.data.package,
                                                signType: e.data.signType,
                                                paySign: e.data.paySign,
                                                success: function (e) {
                                                    console.log(e)
                                                },
                                                fail: function (e) {
                                                    console.log("失败")
                                                    console.log(e)
                                                },
                                                complete: function (e) {
                                                    console.log(e)
                                                    console.log("全部")
                                                    "requestPayment:fail" != e.errMsg && "requestPayment:fail cancel" != e.errMsg ? "requestPayment:ok" != e.errMsg || (void 0 !== that.page.data.goods_card_list && 0 < _.page.data.goods_card_list.length ? _.page.setData({
                                                        show_card: !0
                                                    }) : "pt" == post_type ? "ONLY_BUY" == that.page.data.type ? getApp().core.redirectTo({
                                                        url: site + "?status=2"
                                                    }) : getApp().core.redirectTo({
                                                        url: "/pages/pt/group/details?oid=" + d
                                                    }) : getApp().core.redirectTo({
                                                        url: site + "?status=1"
                                                    })) : getApp().core.showModal({
                                                        title: "提示",
                                                        content: "订单尚未支付",
                                                        showCancel: !1,
                                                        confirmText: "确认",
                                                        success: function (e) {
                                                            e.confirm && getApp().core.redirectTo({
                                                                url: site + "?status=0"
                                                            });
                                                        }
                                                    });
                                                }
                                            });
                                            var t = getApp().core.getStorageSync(getApp().const.QUICK_LIST);
                                            if (t) {
                                                for (var o = t.length, a = 0; a < o; a++) for (var r = t[a].goods, p = r.length, s = 0; s < p; s++) r[s].num = 0;
                                                getApp().core.setStorageSync(getApp().const.QUICK_LISTS, t);
                                                var n = getApp().core.getStorageSync(getApp().const.CARGOODS);
                                                for (o = n.length, a = 0; a < o; a++) n[a].num = 0, n[a].goods_price = 0, l.setData({
                                                    carGoods: n
                                                });
                                                getApp().core.setStorageSync(getApp().const.CARGOODS, n);
                                                var c = getApp().core.getStorageSync(getApp().const.TOTAL);
                                                c && (c.total_num = 0, c.total_price = 0, getApp().core.setStorageSync(getApp().const.TOTAL, c));
                                                getApp().core.getStorageSync(getApp().const.CHECK_NUM);
                                                0, getApp().core.setStorageSync(getApp().const.CHECK_NUM, 0);
                                                var i = getApp().core.getStorageSync(getApp().const.QUICK_HOT_GOODS_LISTS);
                                                for (o = i.length, a = 0; a < o; a++) i[a].num = 0, l.setData({
                                                    quick_hot_goods_lists: i
                                                });
                                                getApp().core.setStorageSync(getApp().const.QUICK_HOT_GOODS_LISTS, i);
                                            }
                                        }
                                    }
                                }) : 2 == order_list.payment ? (a = "HUODAO_PAY", t()) : 3 == order_list.payment && (a = "BALANCE_PAY",
                                    t());
                            }
                            1 == e.code && (getApp().core.hideLoading(), "活力币不足" == e.msg && that.page.data.store.option.step.currency_name ? getApp().core.showToast({
                                icon: "none",
                                title: that.page.data.store.option.step.currency_name + "不足"
                            }) : getApp().core.showToast({
                                icon: "none",
                                title: e.msg
                            }));
                        }
                    });
                }
            };
    }
};

module.exports = pay;