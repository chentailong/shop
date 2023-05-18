Page({
    data: {
        backgrop: [ "navbar-item-active" ],
        navbarArray: [],
        navbarShowIndexArray: 0,
        navigation: !1,
        windowWidth: 375,
        scrollNavbarLeft: 0,
        currentChannelIndex: 0,
        articlesHide: !1
    },
    onLoad: function(options) {
        wx.showShareMenu({
            withShareTicket: true,
            menus: ['shareAppMessage', 'shareTimeline']
        })
        getApp().page.onLoad(this, options);
        var that = this, type = aoptions.type;
        void 0 !== type && type && that.setData({
            typeid: type
        }), that.loadTopicList({
            page: 1,
            reload: !0
        }), getApp().core.getSystemInfo({
            success: function(res) {
                that.setData({
                    windowWidth: res.windowWidth
                });
            }
        });
    },
    loadTopicList: function(i) {
        var that = this;
        that.data.is_loading || i.loadmore && !that.data.is_more || (that.setData({
            is_loading: !0
        }), getApp().request({
            url: getApp().api.default.topic_type,
            success: function(res) {
                0 === res.code && that.setData({
                    navbarArray: res.data.list,
                    navbarShowIndexArray: Array.from(Array(res.data.list.length).keys()),
                    navigation: "" !== res.data.list
                }), getApp().request({
                    url: getApp().api.default.topic_list,
                    data: {
                        page: i.page
                    },
                    success: function(res) {
                        if (0 === res.code) if (void 0 !== that.data.typeid) {
                            for (var scrollNavbarLeft = 0, e = 0; e < that.data.navbarArray.length && (scrollNavbarLeft += 66, that.data.navbarArray[e].id !== that.data.typeid); e++) ;
                            that.setData({
                                scrollNavbarLeft: scrollNavbarLeft
                            }), that.switchChannel(parseInt(that.data.typeid)), that.sortTopic({
                                page: 1,
                                type: that.data.typeid,
                                reload: !0
                            });
                        } else i.reload && that.setData({
                            list: res.data.list,
                            page: i.page,
                            is_more: 0 < res.data.list.length
                        }), i.loadmore && that.setData({
                            list: that.data.list.concat(res.data.list),
                            page: i.page,
                            is_more: 0 < res.data.list.length
                        });
                    },
                    complete: function() {
                        that.setData({
                            is_loading: !1
                        });
                    }
                });
            }
        }));
    },
    onShow: function() {
        getApp().page.onShow(this);
    },
    onPullDownRefresh: function() {
        getApp().page.onPullDownRefresh(this);
        var index = this.data.currentChannelIndex;
        this.switchChannel(parseInt(index)), this.sortTopic({
            page: 1,
            type: parseInt(index),
            reload: !0
        }), getApp().core.stopPullDownRefresh();
    },
    onReachBottom: function() {
        getApp().page.onReachBottom(this);
        var index = this.data.currentChannelIndex;
        this.switchChannel(parseInt(index)), this.sortTopic({
            page: this.data.page + 1,
            type: parseInt(index),
            loadmore: !0
        });
    },
    onTapNavbar: function(i) {
        var that = this;
        if ("undefined" == typeof my) {
            var a = i.currentTarget.offsetLeft;
            that.setData({
                scrollNavbarLeft: a - 85
            });
        } else {
            var navbarArray = that.data.navbarArray, s = !0;
            navbarArray.forEach(function(a, t, e) {
                i.currentTarget.id === a.id && (s = !1, 1 <= t ? that.setData({
                    toView: navbarArray[t - 1].id
                }) : that.setData({
                    toView: -1
                }));
            }), s && that.setData({
                toView: "0"
            });
        }
        getApp().core.showLoading({
            title: "正在加载",
            mask: !0
        }), that.switchChannel(parseInt(i.currentTarget.id)), that.sortTopic({
            page: 1,
            type: i.currentTarget.id,
            reload: !0
        });
    },
    sortTopic: function(data) {
        var that = this;
        getApp().request({
            url: getApp().api.default.topic_list,
            data: data,
            success: function(res) {
                0 === res.code && (t.reload && that.setData({
                    list: res.data.list,
                    page: data.page,
                    is_more: 0 < res.data.list.length
                }), t.loadmore && that.setData({
                    list: that.data.list.concat(res.data.list),
                    page: data.page,
                    is_more: 0 < res.data.list.length
                }), getApp().core.hideLoading());
            }
        });
    },
    switchChannel: function(index) {
        var navbarArray = this.data.navbarArray, backgrop = new Array();
        -1 === index ? backgrop[1] = "navbar-item-active" : 0 === index && (backgrop[0] = "navbar-item-active"),
            navbarArray.forEach(function(a, t, e) {
            a.type = "", a.id === index && (a.type = "navbar-item-active");
        }), this.setData({
            navbarArray: navbarArray,
            currentChannelIndex: index,
            backgrop: backgrop
        });
    },
    onShareAppMessage: function() {
        getApp().page.onShareAppMessage(this);
        var that = this, t = {
            path: "/pages/topic-list/topic-list?user_id=" + that.data.__user_info.id + "&type=" + (that.data.typeid ? that.data.typeid : ""),
            success: function(a) {}
        };
        return console.log(t.path), t;
    }
});