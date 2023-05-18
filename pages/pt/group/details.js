var _Page;
var succeed_template = 'l2jNYVkSLHwDyjZniuWIhAeuAIaolk7VD2LAaNyNkts'  //拼团成功
var defeated_template = '2t1miCFykTAB3ZTf59AnaDjMgcFXAJ498mnGQGs2qLQ'  //拼团失败
var utils = require("../../../utils/helper.js");

function _defineProperty(t, e, o) {
    return e in t ? Object.defineProperty(t, e, {
        value: o,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : t[e] = o, t;
}


Page((_defineProperty(_Page = {
    data: {
        groupFail: 0,
        show_attr_picker: !1,
        form: {
            number: 1
        }
    },
    onLoad: function (options) {
        wx.showShareMenu({
            withShareTicket: true,
            menus: ['shareAppMessage', 'shareTimeline']
        })
        wx.requestSubscribeMessage({
            tmplIds: [succeed_template, defeated_template],
            success(res) {
                console.log(res)
            },
            fail(err) {
                console.log(err)
            }
        });
        getApp().page.onLoad(this, options);
        var user_id = options.user_id, scene = decodeURIComponent(options.scene);
        if (void 0 !== user_id) user_id; else if (void 0 !== scene) {
            var scene_decode = utils.scene_decode(scene);
            scene_decode.uid && scene_decode.oid ? (scene_decode.uid, options.oid = scene_decode.oid) : scene;
        } else if ("undefined" != typeof my && null !== getApp().query) {
            var query = getApp().query;
            getApp().query = null, options.oid = query.oid, query.uid;
        }
        this.setData({
            oid: options.oid
        }), this.getInfo(options);
    },
    onReady: function () {
    },
    onShow: function () {
    },
    onHide: function () {
    },
    onUnload: function () {
    },
    onPullDownRefresh: function () {
    },
    onReachBottom: function () {
    },
    onShareAppMessage: function (t) {
        getApp().page.onShareAppMessage(this);
        var that = this, userInfo = getApp().core.getStorageSync(getApp().const.USER_INFO),
            url = "/pages/pt/group/details?oid=" + that.data.oid + "&user_id=" + userInfo.id;
        return {
            title: "快来" + that.data.goods.price + "元拼  " + that.data.goods.name,
            path: url,
            success: function (t) {
            }
        };
    },
    getInfo: function (info) {
        var oid = info.oid, that = this;
        getApp().core.showLoading({
            title: "正在加载",
            mask: !0
        }), getApp().request({
            url: getApp().api.group.group_info,
            method: "get",
            data: {
                oid: oid
            },
            success: function (res) {
                if (0 === res.code) {
                    0 === res.data.groupFail && that.countDownRun(res.data.limit_time_ms);
                    var reduce_price = (res.data.goods.original_price - res.data.goods.price).toFixed(2);
                    that.setData({
                        goods: res.data.goods,
                        groupList: res.data.groupList,
                        surplus: res.data.surplus,
                        limit_time_ms: res.data.limit_time_ms,
                        goods_list: res.data.goodsList,
                        group_fail: res.data.groupFail,
                        oid: res.data.oid,
                        in_group: res.data.inGroup,
                        attr_group_list: res.data.attr_group_list,
                        group_rule_id: res.data.groupRuleId,
                        reduce_price: reduce_price < 0 ? 0 : reduce_price,
                        group_id: res.data.goods.class_group
                    }), 0 !== res.data.groupFail && res.data.inGroup && that.setData({
                        oid: !1,
                        group_id: !1
                    }), that.selectDefaultAttr();
                } else getApp().core.showModal({
                    title: "提示",
                    content: res.msg,
                    showCancel: !1,
                    success: function (t) {
                        t.confirm && getApp().core.redirectTo({
                            url: "/pages/pt/index/index"
                        });
                    }
                });
            },
            complete: function (t) {
                setTimeout(function () {
                    getApp().core.hideLoading();
                }, 1e3);
            }
        });
    },
    selectDefaultAttr: function () {
        var that = this;
        if (!that.data.goods || 0 === that.data.goods.use_attr) for (var e in that.data.attr_group_list) for (var o in that.data.attr_group_list[e].attr_list)
            0 == e && 0 == o && (that.data.attr_group_list[e].attr_list[o].checked = !0);
        that.setData({
            attr_group_list: that.data.attr_group_list
        });
    },
    countDownRun: function (r) {
        var that = this;
        setInterval(function () {
            var time = new Date(r[0], r[1] - 1, r[2], r[3], r[4], r[5]) - new Date(),
                days = parseInt(time / 1e3 / 60 / 60 / 24, 10), hours = parseInt(time / 1e3 / 60 / 60 % 24, 10),
                mins = parseInt(time / 1e3 / 60 % 60, 10), secs = parseInt(time / 1e3 % 60, 10);
            days = that.checkTime(days), hours = that.checkTime(hours), mins = that.checkTime(mins), secs = that.checkTime(secs),
                that.setData({
                    limit_time: {
                        days: days,
                        hours: hours,
                        mins: mins,
                        secs: secs
                    }
                });
        }, 1e3);
    },
    checkTime: function (t) {
        return (t = 0 < t ? t : 0) < 10 && (t = "0" + t), t;
    },
    goToHome: function () {
        getApp().core.redirectTo({
            url: "/pages/pt/index/index"
        });
    },
    goToGoodsDetails: function (t) {
        getApp().core.redirectTo({
            url: "/pages/pt/details/details?gid=" + this.data.goods.id
        });
    },
    hideAttrPicker: function () {
        this.setData({
            show_attr_picker: !1
        });
    },
    showAttrPicker: function () {
        this.setData({
            show_attr_picker: !0
        });
    },
    attrClick: function (t) {
        var that = this, groupId = t.target.dataset.groupId, id = t.target.dataset.id, attr_group_list = that.data.attr_group_list;
        for (var r in attr_group_list) if (attr_group_list[r].attr_group_id === groupId) for (var s in attr_group_list[r].attr_list)
            attr_group_list[r].attr_list[s].attr_id === id ? attr_group_list[r].attr_list[s].checked = !0 : attr_group_list[r].attr_list[s].checked = !1;
        that.setData({
            attr_group_list: attr_group_list
        });
        var d = [], n = !0;
        for (var r in attr_group_list) {
            var c = !1;
            for (var s in attr_group_list[r].attr_list) if (attr_group_list[r].attr_list[s].checked) {
                d.push(attr_group_list[r].attr_list[s].attr_id), c = !0;
                break;
            }
            if (!c) {
                n = !1;
                break;
            }
        }
        n && (getApp().core.showLoading({
            title: "正在加载",
            mask: !0
        }), getApp().request({
            url: getApp().api.group.goods_attr_info,
            data: {
                goods_id: that.data.goods.id,
                group_id: that.data.goods.class_group,
                attr_list: JSON.stringify(d)
            },
            success: function (res) {
                if (getApp().core.hideLoading(), 0 === res.code) {
                    var goods = that.data.goods;
                    goods.price = res.data.price, goods.snum = res.data.num, goods.attr_pic = res.data.pic, that.setData({
                        goods: goods
                    });
                }
            }
        }));
    },
    buyNow: function () {
        this.submit("GROUP_BUY_C");
    },
    submit: function (type) {
        var that = this;
        if (!that.data.show_attr_picker) return that.setData({
            show_attr_picker: !0
        }), !0;
        if (that.data.form.number > that.data.goods.num) return getApp().core.showToast({
            title: "商品库存不足，请选择其它规格或数量",
            image: "/images/icon-warning.png"
        }), !0;
        var attr_group_list = that.data.attr_group_list, attr = [];
        for (var i in attr_group_list) {
            var attr_list = !1;
            for (var s in attr_group_list[i].attr_list) if (attr_group_list[i].attr_list[s].checked) {
                attr_list = {
                    attr_id: attr_group_list[i].attr_list[s].attr_id,
                    attr_name: attr_group_list[i].attr_list[s].attr_name
                };
                break;
            }
            if (!attr_list) return getApp().core.showToast({
                title: "请选择" + attr_group_list[i].attr_group_name,
                image: "/images/icon-warning.png"
            }), !0;
            attr.push({
                attr_group_id: attr_group_list[i].attr_group_id,
                attr_group_name: attr_group_list[i].attr_group_name,
                attr_id: attr_list.attr_id,
                attr_name: attr_list.attr_name
            });
        }
        that.setData({
            show_attr_picker: !1
        }), getApp().core.redirectTo({
            url: "/pages/pt/order-submit/order-submit?goods_info=" + JSON.stringify({
                goods_id: that.data.goods.id,
                attr: attr,
                num: that.data.form.number,
                type: type,
                parent_id: that.data.oid,
                deliver_type: that.data.goods.type,
                group_id: that.data.goods.class_group
            })
        });
    },
    numberSub: function () {
        var number = this.data.form.number;
        if (number <= 1) return !0;
        number--, this.setData({
            form: {
                number: number
            }
        });
    },
    numberAdd: function () {
        var that = this, number = that.data.form.number;
        ++number > that.data.goods.one_buy_limit && 0 !== that.data.goods.one_buy_limit ? getApp().core.showModal({
            title: "提示",
            content: "最多只允许购买" + that.data.goods.one_buy_limit,
            showCancel: !1
        }) : that.setData({
            form: {
                number: number
            }
        });
    },
    numberBlur: function (t) {
        var that = this, value = t.detail.value;
        if (value = parseInt(value), isNaN(value) && (value = 1), value <= 0 && (value = 1), value > that.data.goods.one_buy_limit && 0 !== that.data.goods.one_buy_limit) return getApp().core.showModal({
            title: "提示",
            content: "最多只允许购买" + that.data.goods.one_buy_limit + "件",
            showCancel: !1
        }), void that.setData({
            form: {
                number: value
            }
        });
        that.setData({
            form: {
                number: value
            }
        });
    },
    goArticle: function (t) {
        this.data.group_rule_id && getApp().core.navigateTo({
            url: "/pages/article-detail/article-detail?id=" + this.data.group_rule_id
        });
    },
    showShareModal: function (t) {
        this.setData({
            share_modal_active: "active",
            no_scroll: !0
        });
    },
    shareModalClose: function () {
        this.setData({
            share_modal_active: "",
            no_scroll: !1
        });
    },
    getGoodsQrcode: function () {
        var that = this;
        if (that.setData({
            goods_qrcode_active: "active",
            share_modal_active: ""
        }), that.data.goods_qrcode) return !0;
        getApp().request({
            url: getApp().api.group.order.goods_qrcode,
            data: {
                order_id: that.data.oid
            },
            success: function (t) {
                0 == t.code && that.setData({
                    goods_qrcode: t.data.pic_url
                }), 1 == t.code && (that.goodsQrcodeClose(), getApp().core.showModal({
                    title: "提示",
                    content: t.msg,
                    showCancel: !1,
                    success: function (t) {
                        t.confirm;
                    }
                }));
            }
        });
    },
    goodsQrcodeClose: function () {
        this.setData({
            goods_qrcode_active: "",
            no_scroll: !1
        });
    }
}, "goodsQrcodeClose", function () {
    this.setData({
        goods_qrcode_active: "",
        no_scroll: !1
    });
}), _defineProperty(_Page, "saveGoodsQrcode", function () {
    var that = this;
    getApp().core.saveImageToPhotosAlbum ? (getApp().core.showLoading({
        title: "正在保存图片",
        mask: !1
    }), getApp().core.downloadFile({
        url: that.data.goods_qrcode,
        success: function (t) {
            getApp().core.showLoading({
                title: "正在保存图片",
                mask: !1
            }), getApp().core.saveImageToPhotosAlbum({
                filePath: t.tempFilePath,
                success: function () {
                    getApp().core.showModal({
                        title: "提示",
                        content: "商品海报保存成功",
                        showCancel: !1
                    });
                },
                fail: function (t) {
                    getApp().core.showModal({
                        title: "图片保存失败",
                        content: t.errMsg,
                        showCancel: !1
                    });
                },
                complete: function (t) {
                    getApp().core.hideLoading();
                }
            });
        },
        fail: function (t) {
            getApp().core.showModal({
                title: "图片下载失败",
                content: t.errMsg + ";" + that.data.goods_qrcode,
                showCancel: !1
            });
        },
        complete: function (t) {
            getApp().core.hideLoading();
        }
    })) : getApp().core.showModal({
        title: "提示",
        content: "当前版本过低，无法使用该功能，请升级到最新版本后重试。",
        showCancel: !1
    });
}), _defineProperty(_Page, "goodsQrcodeClick", function (t) {
    var src = t.currentTarget.dataset.src;
    getApp().core.previewImage({
        urls: [src]
    });
}), _Page));