var utils = require("../../../utils/helper.js"), WxParse = require("../../../wxParse/wxParse.js"),
    gSpecificationsModel = require("../../../components/goods/specifications_model.js"),
    goodsBanner = require("../../../components/goods/goods_banner.js"),
    goodsInfo = require("../../../components/goods/goods_info.js"),
    goodsBuy = require("../../../components/goods/goods_buy.js");

Page({
    data: {
        pageType: "PINTUAN",
        hide: "hide",
        form: {
            number: 1,
            pt_detail: !1
        }
    },
    onLoad: function (options) {
        wx.showShareMenu({
            withShareTicket: true,
            menus: ['shareAppMessage', 'shareTimeline']
        })
        getApp().page.onLoad(this, options);
        var user_id = options.user_id, scene = decodeURIComponent(options.scene);
        if (void 0 !== user_id) user_id; else if (void 0 !== scene) {
            var decode = utils.scene_decode(scene);
            decode.uid && decode.gid ? (decode.uid, options.gid = decode.gid) : scene;
        } else if ("undefined" != typeof my && null !== getApp().query) {
            var query = getApp().query;
            getApp().query = null, options.id = query.gid;
        }
        this.setData({
            id: options.gid,
            oid: options.oid ? options.oid : 0,
            group_checked: options.group_id ? options.group_id : 0
        }), this.getGoodsInfo(options);
        var store = getApp().core.getStorageSync(getApp().const.STORE);
        this.setData({
            store: store
        });
    },
    onReady: function () {
        getApp().page.onReady(this);
    },
    onShow: function () {
        getApp().page.onShow(this), gSpecificationsModel.init(this), goodsBanner.init(this),
            goodsInfo.init(this), goodsBuy.init(this);
    },
    onHide: function () {
        getApp().page.onHide(this);
    },
    onUnload: function () {
        getApp().page.onUnload(this), getApp().core.removeStorageSync(getApp().const.PT_GROUP_DETAIL);
    },
    onPullDownRefresh: function () {
        getApp().page.onPullDownRefresh(this);
    },
    onReachBottom: function () {
        getApp().page.onReachBottom(this);
    },
    onShareAppMessage: function () {
        getApp().page.onShareAppMessage(this);
        var that = this, userInfo = getApp().core.getStorageSync(getApp().const.USER_INFO),
            url = "/pages/pt/details/details?gid=" + that.data.goods.id + "&user_id=" + userInfo.id;
        return {
            title: that.data.goods.name,
            path: url,
            imageUrl: that.data.goods.cover_pic,
            success: function (t) {
            }
        };
    },
    getGoodsInfo: function (event) {
        var gid = event.gid, that = this;
        getApp().core.showLoading({
            title: "正在加载",
            mask: !0
        }), getApp().core.showNavigationBarLoading(), getApp().request({
            url: getApp().api.group.details,
            method: "get",
            data: {
                gid: gid
            },
            success: function (res) {
                if (0 === res.code) {
                    that.countDownRun(res.data.info.limit_time_ms);
                    var detail = res.data.info.detail;
                    WxParse.wxParse("detail", "html", detail, that), getApp().core.setNavigationBarTitle({
                        title: res.data.info.name
                    }), getApp().core.hideNavigationBarLoading();
                    var a = (res.data.info.original_price - res.data.info.price).toFixed(2), goods = res.data.info;
                    goods.service_list = res.data.info.service, that.setData({
                        group_checked: that.data.group_checked ? that.data.group_checked : 0,
                        goods: goods,
                        attr_group_list: res.data.attr_group_list,
                        attr_group_num: res.data.attr_group_num,
                        limit_time: res.data.limit_time_res,
                        group_list: res.data.groupList,
                        group_num: res.data.groupList.length,
                        group_rule_id: res.data.groupRuleId,
                        comment: res.data.comment,
                        comment_num: res.data.commentNum,
                        reduce_price: a < 0 ? 0 : a
                    }), that.countDown(), that.selectDefaultAttr();
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
                getApp().core.hideLoading();
            }
        });
    },
    more: function () {
        this.setData({
            pt_detail: !0
        });
    },
    end_more: function () {
        this.setData({
            pt_detail: !1
        });
    },
    previewImage: function (t) {
        var url = t.currentTarget.dataset.url;
        getApp().core.previewImage({
            urls: [url]
        });
    },
    selectDefaultAttr: function () {
        var that = this;
        if (!that.data.goods || "0" === that.data.goods.use_attr) for (var e in that.data.attr_group_list) for (var a in that.data.attr_group_list[e].attr_list) 0 == e && 0 == a && (that.data.attr_group_list[e].attr_list[a].checked = !0);
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
                        days: days < 0 ? "00" : days,
                        hours: hours < 0 ? "00" : hours,
                        mins: mins < 0 ? "00" : mins,
                        secs: secs < 0 ? "00" : secs
                    }
                });
        }, 1e3);
    },
    checkTime: function (t) {
        return t < 0 ? "00" : (t < 10 && (t = "0" + t), t);
    },
    goToGroup: function (t) {
        getApp().core.navigateTo({
            url: "/pages/pt/group/details?oid=" + t.target.dataset.id
        });
    },
    goToComment: function (t) {
        getApp().core.navigateTo({
            url: "/pages/pt/comment/comment?id=" + this.data.goods.id
        });
    },
    goArticle: function (t) {
        this.data.group_rule_id && getApp().core.navigateTo({
            url: "/pages/article-detail/article-detail?id=" + this.data.group_rule_id
        });
    },
    buyNow: function () {
        this.submit("GROUP_BUY", this.data.group_checked);
    },
    onlyBuy: function () {
        this.submit("ONLY_BUY", 0);
    },
    submit: function (type, group_id) {
        var that = this, groupNum = "GROUP_BUY" === type;
        if (!that.data.show_attr_picker || groupNum !== that.data.groupNum) return that.setData({
            show_attr_picker: !0,
            groupNum: groupNum
        }), !0;
        if (that.data.form.number > that.data.goods.num) return getApp().core.showToast({
            title: "商品库存不足，请选择其它规格或数量",
            image: "/images/icon-warning.png"
        }), !0;
        var attr_group_list = that.data.attr_group_list, attr = [];
        for (var s in attr_group_list) {
            var attr_list = !1;
            for (var d in attr_group_list[s].attr_list) if (attr_group_list[s].attr_list[d].checked) {
                attr_list = {
                    attr_id: attr_group_list[s].attr_list[d].attr_id,
                    attr_name: attr_group_list[s].attr_list[d].attr_name
                };
                break;
            }
            if (!attr_list) return getApp().core.showToast({
                title: "请选择" + attr_group_list[s].attr_group_name,
                image: "/images/icon-warning.png"
            }), !0;
            attr.push({
                attr_group_id: attr_group_list[s].attr_group_id,
                attr_group_name: attr_group_list[s].attr_group_name,
                attr_id: attr_list.attr_id,
                attr_name: attr_list.attr_name
            });
        }
        that.setData({
            show_attr_picker: !1
        });
        var parent_id = 0;
        that.data.oid && (type = "GROUP_BUY_C", parent_id = that.data.oid), getApp().core.redirectTo({
            url: "/pages/pt/order-submit/order-submit?goods_info=" + JSON.stringify({
                goods_id: that.data.goods.id,
                attr: attr,
                num: that.data.form.number,
                type: type,
                deliver_type: that.data.goods.type,
                group_id: group_id,
                parent_id: parent_id
            })
        });
    },
    countDown: function () {
        var that = this;
        setInterval(function () {
            var group_list = that.data.group_list;
            for (var e in group_list) {
                var time = new Date(group_list[e].limit_time_ms[0], group_list[e].limit_time_ms[1] - 1, group_list[e].limit_time_ms[2],
                    group_list[e].limit_time_ms[3], group_list[e].limit_time_ms[4], group_list[e].limit_time_ms[5]) - new Date(),
                    days = parseInt(time / 1e3 / 60 / 60 / 24, 10), hours = parseInt(time / 1e3 / 60 / 60 % 24, 10),
                    mins = parseInt(time / 1e3 / 60 % 60, 10), secs = parseInt(time / 1e3 % 60, 10);
                days = that.checkTime(days), hours = that.checkTime(hours), mins = that.checkTime(mins), secs = that.checkTime(secs),
                    group_list[e].limit_time = {
                        days: days,
                        hours: 0 < hours ? hours : "00",
                        mins: 0 < mins ? mins : "00",
                        secs: 0 < secs ? secs : "00"
                    }, that.setData({
                    group_list: group_list
                });
            }
        }, 1e3);
    },
    bigToImage: function (event) {
        var pic_list = this.data.comment[event.target.dataset.index].pic_list;
        getApp().core.previewImage({
            current: event.target.dataset.url,
            urls: pic_list
        });
    },
    groupCheck: function () {
        var that = this, attr_group_num = that.data.attr_group_num, attr_list = that.data.attr_group_num.attr_list;
        for (var i in attr_list) attr_list[i].checked = !1;
        attr_group_num.attr_list = attr_list;
        that.data.goods;
        that.setData({
            group_checked: 0,
            attr_group_num: attr_group_num
        });
        var attr_group_list = that.data.attr_group_list, list = [], s = !0;
        for (var i in attr_group_list) {
            var n = !1;
            for (var d in attr_group_list[i].attr_list) if (attr_group_list[i].attr_list[d].checked) {
                list.push(attr_group_list[i].attr_list[d].attr_id), n = !0;
                break;
            }
            if (!n) {
                s = !1;
                break;
            }
        }
        s && (getApp().core.showLoading({
            title: "正在加载",
            mask: !0
        }), getApp().request({
            url: getApp().api.group.goods_attr_info,
            data: {
                goods_id: that.data.goods.id,
                group_id: that.data.group_checked,
                attr_list: JSON.stringify(r)
            },
            success: function (res) {
                if (getApp().core.hideLoading(), 0 === res.code) {
                    var goods = that.data.goods;
                    goods.price = res.data.price, goods.num = res.data.num, goods.attr_pic = res.data.pic, goods.single_price = res.data.single_price ? res.data.single_price : 0,
                        goods.group_price = res.data.price, goods.is_member_price = res.data.is_member_price, that.setData({
                        goods: goods
                    });
                }
            }
        }));
    },
    attrNumClick: function (t) {
        var that = this, id = t.target.dataset.id, attr_group_num = that.data.attr_group_num,
            attr_list = attr_group_num.attr_list;
        for (var r in attr_list) attr_list[r].id === id ? attr_list[r].checked = !0 : attr_list[r].checked = !1;
        attr_group_num.attr_list = attr_list, that.setData({
            attr_group_num: attr_group_num,
            group_checked: id
        });
        var attr_group_list = that.data.attr_group_list
        var n = [], d = !0;
        for (var r in attr_group_list) {
            var p = !1;
            for (var g in attr_group_list[r].attr_list) if (attr_group_list[r].attr_list[g].checked) {
                n.push(attr_group_list[r].attr_list[g].attr_id), p = !0;
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
            url: getApp().api.group.goods_attr_info,
            data: {
                goods_id: that.data.goods.id,
                group_id: that.data.group_checked,
                attr_list: JSON.stringify(n)
            },
            success: function (res) {
                if (getApp().core.hideLoading(), 0 === res.code) {
                    var goods = that.data.goods;
                    goods.price = res.data.price, goods.num = res.data.num, goods.attr_pic = res.data.pic, goods.single_price = res.data.single_price ? res.data.single_price : 0,
                        goods.group_price = res.data.price, goods.is_member_price = res.data.is_member_price, that.setData({
                        goods: goods
                    });
                }
            }
        }));
    }
});