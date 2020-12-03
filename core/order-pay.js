var app = getApp();

function setOnShowScene(e) {
    app.onShowData || (app.onShowData = {}), app.onShowData.scene = e;
}

var pay = {
    init: function (l, e) {
        var _ = this, A = getApp().api;
        _.page = l, app = e;
        var m = getApp().core.getStorageSync(getApp().const.PARENT_ID);
        m || (m = 0), _.page.orderPay = function (e) {
            var t = e.currentTarget.dataset.index, o = _.page.data.order_list[t], a = new Array();
            if (void 0 !== _.page.data.pay_type_list) a = _.page.data.pay_type_list; else if (void 0 !== o.pay_type_list) a = o.pay_type_list; else if (void 0 !== o.goods_list[0].pay_type_list) a = o.goods_list[0].pay_type_list; else {
                var r = {
                    payment: 0
                };
                a.push(r);
            }
            var p = getCurrentPages(), s = p[p.length - 1].route, n = {};
            if (-1 != s.indexOf("pt")) c = A.group.pay_data, n.order_id = o.order_id; else if (-1 != s.indexOf("miaosha")) c = A.miaosha.pay_data,
                n.order_id = o.order_id; else if (-1 != s.indexOf("book")) c = A.book.order_pay,
                n.id = o.id; else {
                var c = A.order.pay_data;
                n.order_id = o.order_id;
            }

            function i(e, t, o) {
                e.pay_type = "WECHAT_PAY", app.request({
                    url: t,
                    data: e,
                    complete: function () {
                        getApp().core.hideLoading();
                    },
                    success: function (e) {
                        0 == e.code && (setOnShowScene("pay"), getApp().core.requestPayment({
                            _res: e,
                            timeStamp: e.data.timeStamp,
                            nonceStr: e.data.nonceStr,
                            package: e.data.package,
                            signType: e.data.signType,
                            paySign: e.data.paySign,
                            success: function (e) {
                            },
                            fail: function (e) {
                            },
                            complete: function (e) {
                                "requestPayment:fail" != e.errMsg && "requestPayment:fail cancel" != e.errMsg ? getApp().core.redirectTo({
                                    url: "/" + o + "?status=1"
                                }) : getApp().core.showModal({
                                    title: "提示",
                                    content: "订单尚未支付",
                                    showCancel: !1,
                                    confirmText: "确认",
                                    success: function (e) {
                                        e.confirm && getApp().core.redirectTo({
                                            url: "/" + o + "?status=0"
                                        });
                                    }
                                });
                            }
                        })), 1 == e.code && getApp().core.showToast({
                            title: e.msg,
                            image: "/images/icon-warning.png"
                        });
                    }
                });
            }

            function d(t, o, a) {
                t.pay_type = "BALANCE_PAY";
                var e = getApp().getUser();
                getApp().core.showModal({
                    title: "当前账户余额：" + e.money,
                    content: "是否使用余额",
                    success: function (e) {
                        e.confirm && (getApp().core.showLoading({
                            title: "正在提交",
                            mask: !0
                        }), app.request({
                            url: o,
                            data: t,
                            complete: function () {
                                getApp().core.hideLoading();
                            },
                            success: function (e) {
                                0 == e.code && getApp().core.redirectTo({
                                    url: "/" + a + "?status=1"
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

            n.parent_id = m, n.condition = 2, 1 == a.length ? (getApp().core.showLoading({
                title: "正在提交",
                mask: !0
            }), 0 == a[0].payment && i(n, c, s), 3 == a[0].payment && d(n, c, s)) : getApp().core.showModal({
                title: "提示",
                content: "选择支付方式",
                cancelText: "余额支付",
                confirmText: "线上支付",
                success: function (e) {
                    e.confirm ? (getApp().core.showLoading({
                        title: "正在提交",
                        mask: !0
                    }), i(n, c, s)) : e.cancel && d(n, c, s);
                }
            });
        }, _.page.order_submit = function (r, g) {
            var e = A.order.submit, p = A.order.pay_data, u = "/pages/order/order";
            if ("pt" == g ? (e = A.group.submit, p = A.group.pay_data, u = "/pages/pt/order/order") : "ms" == g ? (e = A.miaosha.submit,
                p = A.miaosha.pay_data, u = "/pages/miaosha/order/order") : "pond" == g ? (e = A.pond.submit,
                p = A.order.pay_data, u = "/pages/order/order") : "scratch" == g ? (e = A.scratch.submit,
                p = A.order.pay_data, u = "/pages/order/order") : "lottery" == g ? (e = A.lottery.submit,
                p = A.order.pay_data, u = "/pages/order/order") : "step" == g ? (e = A.step.submit,
                p = A.order.pay_data, u = "/pages/order/order") : "s" == g && (e = A.order.new_submit,
                p = A.order.pay_data, u = "/pages/order/order"), 3 == r.payment) {
                var t = getApp().getUser();
                getApp().core.showModal({
                    title: "当前账户余额：" + t.money,
                    content: "是否确定使用余额支付",
                    success: function (e) {
                        e.confirm && o();
                    }
                });
            } else o();

            function o() {
                // var appId = 'wx257210a837db11b0'
                // var appSecret = '512c724e265ce71c6868ba0aa0636bd3'
                // var url = 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=' + appId + '&secret=' + appSecret;
                // wx.request({
                //     url,
                //     success: (res) => {
                //         console.log(res.data.access_token)
                //         var _access_token = res.data.access_token
                //         let Message_url = 'https://api.weixin.qq.com/cgi-bin/message/subscribe/send?access_token=' + _access_token
                        getApp().core.showLoading({
                            title: "正在提交",
                            mask: !0
                        }), app.request({
                            url: e,
                            method: "post",
                            data: r,
                            success: function (e) {
                                if (0 == e.code) {
                                    var t = function () {
                                        app.request({
                                            url: p,
                                            data: {
                                                order_id: d,
                                                order_id_list: o,
                                                pay_type: a,
                                                form_id: r.formId,
                                                parent_user_id: m,
                                                condition: 2
                                            },
                                            success: function (e) {
                                                // h获取订单编号
                                                // getApp().request({
                                                //     url: getApp().api.order.detail,
                                                //     data: {
                                                //         order_id: d
                                                //     },
                                                //     success: function (e) {
                                                //         console.log(e.data)
                                                //         //进行订阅信息弹窗授权
                                                //         var open_Id = 'o7RSe4vjs8_0pVlTTQn8Y8C1VIvo'
                                                        wx.requestSubscribeMessage({
                                                            tmplIds: ['9_o1f7zU4g42YEIl-8jjkc7qFciP7UWr_qByz5L4S5s'],
                                                            success(res) {
                                                                console.log(res)
                                                                console.log('成功')
                                                                //订阅信息数据
                                                                // let jsonData = {
                                                                //     access_token: _access_token,
                                                                //     touser: open_Id,
                                                                //     template_id: '9_o1f7zU4g42YEIl-8jjkc7qFciP7UWr_qByz5L4S5s',
                                                                //     page: "pages/order/order",
                                                                //     data: {
                                                                //         "amount1": {"value": e.data.total_price},
                                                                //         "date2": {"value": e.data.addtime},
                                                                //         "character_string3": {"value": e.data.order_no},
                                                                //         "character_string7": {"value": e.data.integral.forehead},
                                                                //         "thing8": {"value": e.data.status},
                                                                //     },
                                                                //     miniprogram_state: 'developer',
                                                                // }
                                                                //订阅信息发送
                                                                // wx.request({
                                                                //     url: Message_url,
                                                                //     data: jsonData,
                                                                //     method: 'POST',
                                                                //     success(res) {
                                                                //         console.log(res.data.errcode)
                                                                //     },
                                                                //     complete(e) {
                                                                //         console.log(e)
                                                                //     }
                                                                // })
                                                            },
                                                            fail(err) {
                                                                console.log(err)
                                                                console.log('失败')
                                                            }
                                                        })
                                                        if (0 != e.code) return getApp().core.hideLoading(), void getApp().core.showModal({
                                                            title: "提示",
                                                            content: e.msg,
                                                            showCancel: !1,
                                                            confirmText: "确认",
                                                            success: function (e) {
                                                                e.confirm && getApp().core.redirectTo({
                                                                    url: u + "?status=0",
                                                                });
                                                            }
                                                        });
                                                        setTimeout(function () {
                                                            getApp().core.hideLoading();
                                                        }, 1e3), "pt" == g ? "ONLY_BUY" == _.page.data.type ? getApp().core.redirectTo({
                                                            url: u + "?status=2"
                                                        }) : getApp().core.redirectTo({
                                                            url: "/pages/pt/group/details?oid=" + d
                                                        }) : void 0 !== _.page.data.goods_card_list && 0 < _.page.data.goods_card_list.length && 2 != r.payment ? _.page.setData({
                                                            show_card: !0
                                                        }) : getApp().core.redirectTo({
                                                            url: u + "?status=-1",
                                                        });
                                                //     }
                                                // })
                                            }
                                        });
                                    };
                                    if (getApp().page.bindParent({
                                        parent_id: m,
                                        condition: 1
                                    }), null != e.data.p_price && 0 === e.data.p_price) return "step" == g ? getApp().core.showToast({
                                        title: "兑换成功"
                                    }) : getApp().core.showToast({
                                        title: "提交成功"
                                    }), void setTimeout(function () {
                                        getApp().core.redirectTo({
                                            url: "/pages/order/order?status=1"
                                        });
                                    }, 2e3);
                                    setTimeout(function () {
                                        _.page.setData({
                                            options: {}
                                        });
                                    }, 1);
                                    var d = e.data.order_id || "",
                                        o = e.data.order_id_list ? JSON.stringify(e.data.order_id_list) : "", a = "";
                                    0 == r.payment ? app.request({
                                        url: p,
                                        data: {
                                            order_id: d,
                                            order_id_list: o,
                                            pay_type: "WECHAT_PAY",
                                            parent_user_id: m,
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
                                                }, 1e3), setOnShowScene("pay"), e.data && 0 == e.data.price ? void 0 !== _.page.data.goods_card_list && 0 < _.page.data.goods_card_list.length ? _.page.setData({
                                                    show_card: !0
                                                }) : getApp().core.redirectTo({
                                                    url: u + "?status=1"
                                                }) : getApp().core.requestPayment({
                                                    _res: e,
                                                    timeStamp: e.data.timeStamp,
                                                    nonceStr: e.data.nonceStr,
                                                    package: e.data.package,
                                                    signType: e.data.signType,
                                                    paySign: e.data.paySign,
                                                    success: function (e) {
                                                    },
                                                    fail: function (e) {
                                                    },
                                                    complete: function (e) {
                                                        "requestPayment:fail" != e.errMsg && "requestPayment:fail cancel" != e.errMsg ? "requestPayment:ok" != e.errMsg || (void 0 !== _.page.data.goods_card_list && 0 < _.page.data.goods_card_list.length ? _.page.setData({
                                                            show_card: !0
                                                        }) : "pt" == g ? "ONLY_BUY" == _.page.data.type ? getApp().core.redirectTo({
                                                            url: u + "?status=2"
                                                        }) : getApp().core.redirectTo({
                                                            url: "/pages/pt/group/details?oid=" + d
                                                        }) : getApp().core.redirectTo({
                                                            url: u + "?status=1"
                                                        })) : getApp().core.showModal({
                                                            title: "提示",
                                                            content: "订单尚未支付",
                                                            showCancel: !1,
                                                            confirmText: "确认",
                                                            success: function (e) {
                                                                e.confirm && getApp().core.redirectTo({
                                                                    url: u + "?status=0"
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
                                    }) : 2 == r.payment ? (a = "HUODAO_PAY", t()) : 3 == r.payment && (a = "BALANCE_PAY",
                                        t());
                                }
                                1 == e.code && (getApp().core.hideLoading(), "活力币不足" == e.msg && _.page.data.store.option.step.currency_name ? getApp().core.showToast({
                                    icon: "none",
                                    title: _.page.data.store.option.step.currency_name + "不足"
                                }) : getApp().core.showToast({
                                    icon: "none",
                                    title: e.msg
                                }));
                            }
                        });
                //     }
                // })
            }

        };
    }
};

module.exports = pay;