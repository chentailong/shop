Page({
    data: {
        friend: !0,
        country: !1,
        avatar: "",
        name: "",
        noun: "",
        bg: "../image/topBG.png",
        id: 1,
        page: 2,
        money: "",
        loading: !1,
        unit_id: "",
        list: [],
        over: !1,
        ad: !1
    },
    adError: function (a) {
        console.log(a.detail);
    },
    onLoad: function (a) {
        getApp().page.onLoad(this, a);
        var that = this;
        this.data.list;
        getApp().core.showLoading({
            title: "数据加载中...",
            mask: !0
        }), getApp().request({
            url: getApp().api.step.ranking,
            data: {
                status: 1,
                page: 1
            },
            success: function (res) {
                getApp().core.hideLoading();
                var user = res.data.user, list = res.data.list, ad_data = res.data.ad_data;
                if (3 < list.length) {
                    for (var n = 3; n < list.length; n++) list[n].noun = n + 1;
                    list[0].img = "../image/top1.png", list[1].img = "../image/top2.png", list[2].img = "../image/top3.png";
                } else 0 < list.length && list.length <= 3 && (list[0].img = "../image/top1.png", 1 < list.length && (list[1].img = "../image/top2.png"),
                2 < list.length && (list[2].img = "../image/top3.png"));
                var unit_id = !1, ad = !1;
                null !== res.data.ad_data && (unit_id = res.data.ad_data.unit_id, ad = !0), that.setData({
                    list: list,
                    name: user.user.nickname,
                    avatar: user.user.avatar_url,
                    noun: user.raking,
                    money: user.step_currency,
                    unit_id: unit_id,
                    ad_data: ad_data,
                    ad: ad
                });
            }
        });
    },
    onReachBottom: function () {
        var that = this, over = that.data.over;
        if (!over) {
            var id = this.data.id, list = this.data.list, page = this.data.page;
            this.setData({
                loading: !0
            }), getApp().request({
                url: getApp().api.step.ranking,
                data: {
                    status: id,
                    page: page
                },
                success: function (res) {
                    var lists = res.data.list;
                    list = list.concat(lists), this.data.loading = !1;
                    for (var e = 10 * (page - 1); e < list.length; e++) list[e].noun = e + 1;
                    lists.length < 10 && (over = !0), that.setData({
                        list: list,
                        id: id,
                        page: page + 1,
                        loading: !1,
                        over: over
                    });
                }
            });
        }
    },
    change: function (a) {
        getApp().core.showLoading({
            title: "数据加载中...",
            mask: !0
        });
        var id = a.target.id, friend = void 0, country = void 0, that = this;
        this.data.list;
        1 == id ? country = !(friend = !0) : 2 == id && (country = !(friend = !1)), getApp().request({
            url: getApp().api.step.ranking,
            data: {
                status: id
            },
            success: function (a) {
                getApp().core.hideLoading();
                var user = a.data.user, list = a.data.list;
                if (3 < list.length) {
                    for (var i = 3; i < list.length; i++) list[i].noun = i + 1;
                    list[0].img = "../image/top1.png", list[1].img = "../image/top2.png", list[2].img = "../image/top3.png";
                } else 0 < list.length && list.length <= 3 && (list[0].img = "../image/top1.png", 1 < list.length && (list[1].img = "../image/top2.png"),
                2 < list.length && (list[2].img = "../image/top3.png"));
                that.setData({
                    list: list,
                    id: id,
                    name: user.user.nickname,
                    avatar: user.user.avatar_url,
                    noun: user.raking,
                    money: user.step_currency,
                    friend: friend,
                    page: 2,
                    over: !1,
                    country: country
                });
            }
        });
    }
});