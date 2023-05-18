Page({
    data: {
        cid: 0,
        scrollLeft: 600,
        scrollTop: 0,
        emptyGoods: 0,
        page_count: 0,
        pt_url: !1,
        page: 1,
        is_show: 0
    },
    onLoad: function (options) {
        wx.showShareMenu({
            withShareTicket: true,
            menus: ['shareAppMessage', 'shareTimeline']
        })
        getApp().page.onLoad(this, options), this.systemInfo = getApp().core.getSystemInfoSync();
        var store = getApp().core.getStorageSync(getApp().const.STORE);
        this.setData({
            store: store
        });
        var that = this;
        if (options.cid) {
            options.cid;
            return this.setData({
                pt_url: !1
            }), getApp().core.showLoading({
                title: "正在加载",
                mask: !0
            }), void getApp().request({
                url: getApp().api.group.index,
                method: "get",
                success: function (res) {
                    if (that.switchNav({
                        currentTarget: {
                            dataset: {
                                id: options.cid
                            }
                        }
                    }), 0 === res.code) {
                        var block = {
                            data: {
                                pic_list: res.data.ad
                            }
                        };
                        that.setData({
                            banner: res.data.banner,
                            ad: res.data.ad,
                            page: res.data.goods.page,
                            page_count: res.data.goods.page_count,
                            block: block
                        });
                    }
                }
            });
        }
        this.setData({
            pt_url: !0
        }), this.loadIndexInfo(this);
    },
    onReady: function (a) {
        getApp().page.onReady(this);
    },
    onShow: function (a) {
        getApp().page.onShow(this);
    },
    onHide: function (a) {
        getApp().page.onHide(this);
    },
    onUnload: function (a) {
        getApp().page.onUnload(this);
    },
    onPullDownRefresh: function (a) {
        getApp().page.onPullDownRefresh(this);
    },
    onReachBottom: function (a) {
        getApp().page.onReachBottom(this);
        var that = this;
        that.setData({
            show_loading_bar: 1
        }), that.data.page < that.data.page_count ? (that.setData({
            page: that.data.page + 1
        }), that.getGoods(that)) : that.setData({
            is_show: 1,
            emptyGoods: 1,
            show_loading_bar: 0
        });
    },

    loadIndexInfo: function (event) {
        var data = event;
        getApp().core.showLoading({
            title: "正在加载",
            mask: !0
        }), getApp().request({
            url: getApp().api.group.index,
            method: "get",
            data: {
                page: data.data.page
            },
            success: function (res) {
                if (0 === res.code) {
                    getApp().core.hideLoading();
                    var block = {
                        data: {
                            pic_list: res.data.ad
                        }
                    };
                    data.setData({
                        cat: res.data.cat,
                        banner: res.data.banner,
                        ad: res.data.ad,
                        goods: res.data.goods.list,
                        page: res.data.goods.page,
                        page_count: res.data.goods.page_count,
                        block: block
                    }), res.data.goods.row_count <= 0 && data.setData({
                        emptyGoods: 1
                    });
                }
            }
        });
    },

    getGoods: function (data) {
        var list = data;
        getApp().core.showLoading({
            title: "正在加载",
            mask: !0
        }), getApp().request({
            url: getApp().api.group.list,
            method: "get",
            data: {
                page: list.data.page,
                cid: list.data.cid
            },
            success: function (res) {
                0 === res.code && (getApp().core.hideLoading(), list.data.goods = list.data.goods.concat(res.data.list),
                    list.setData({
                        goods: list.data.goods,
                        page: res.data.page,
                        page_count: res.data.page_count,
                        show_loading_bar: 0
                    }));
            }
        });
    },
    switchNav: function (event) {
        var that = this;
        getApp().core.showLoading({
            title: "正在加载",
            mask: !0
        });
        var id = event.currentTarget.dataset.id;
        if (that.setData({
            cid: id
        }), "undefined" == typeof my) {
            var width = this.systemInfo.windowWidth, offLeft = event.currentTarget.offsetLeft,
                scrollLeft = this.data.scrollLeft;
            scrollLeft = width / 2 < offLeft ? offLeft : 0, that.setData({
                scrollLeft: scrollLeft
            });
        } else {
            for (var cat = that.data.cat, n = !0, g = 0; g < cat.length; ++g) if (cat[g].id === event.currentTarget.id) {
                n = !1, 1 <= g ? that.setData({
                    toView: cat[g - 1].id
                }) : that.setData({
                    toView: "0"
                });
                break;
            }
            n && that.setData({
                toView: "0"
            });
        }
        that.setData({
            cid: id,
            page: 1,
            scrollTop: 0,
            emptyGoods: 0,
            goods: [],
            show_loading_bar: 1,
            is_show: 0
        }), getApp().request({
            url: getApp().api.group.list,
            method: "get",
            data: {
                cid: id
            },
            success: function (res) {
                if (getApp().core.hideLoading(), 0 === res.code) {
                    var goods = res.data.list;
                    res.data.page_count >= res.data.page ? that.setData({
                        goods: goods,
                        page: res.data.page,
                        page_count: res.data.page_count,
                        row_count: res.data.row_count,
                        show_loading_bar: 0
                    }) : that.setData({
                        emptyGoods: 1
                    });
                }
            }
        });
    },
    pullDownLoading: function (a) {
        var that = this;
        if (1 !== that.data.emptyGoods && 1 !== that.data.show_loading_bar) {
            that.setData({
                show_loading_bar: 1
            });
            var page = parseInt(that.data.page + 1), cid = that.data.cid;
            getApp().request({
                url: getApp().api.group.list,
                method: "get",
                data: {
                    page: page,
                    cid: cid
                },
                success: function (res) {
                    if (0 === res.code) {
                        var goods = that.data.goods;
                        res.data.page > that.data.page && Array.prototype.push.apply(goods, res.data.list), res.data.page_count >= res.data.page ? that.setData({
                            goods: goods,
                            page: res.data.page,
                            page_count: res.data.page_count,
                            row_count: res.data.row_count,
                            show_loading_bar: 0
                        }) : that.setData({
                            emptyGoods: 1
                        });
                    }
                }
            });
        }
    },
    navigatorClick: function (a) {
        var open_type = a.currentTarget.dataset.open_type, url = a.currentTarget.dataset.url;
        return "wxapp" !== open_type || ((url = function (a) {
            var t = /([^&=]+)=([\w\W]*?)(&|$|#)/g, e = /^[^\?]+\?([\w\W]+)$/.exec(a), o = {};
            if (e && e[1]) for (var d, p = e[1]; null != (d = t.exec(p));) o[d[1]] = d[2];
            return o;
        }(url)).path = url.path ? decodeURIComponent(url.path) : "", getApp().core.navigateToMiniProgram({
            appId: url.appId,
            path: url.path,
            complete: function (a) {
            }
        }), !1);
    },
    to_dial: function () {
        var contact_tel = this.data.store.contact_tel;
        getApp().core.makePhoneCall({
            phoneNumber: contact_tel
        });
    },
    onShareAppMessage: function () {
        getApp().page.onShareAppMessage(this);
        return {
            path: "/pages/pt/index/index?user_id=" + this.data.__user_info.id,
            success: function (a) {
            }
        };
    }
});