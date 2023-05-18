Page({
    data: {
        name: 0,
        open_date: "",
        step_num: 0,
        bail_currency: 0,
        join: !1
    },
    onLoad: function(options) {
        wx.showShareMenu({
            withShareTicket: true,
            menus: ['shareAppMessage', 'shareTimeline']
        })
        getApp().page.onLoad(this, options);
        var that = this, id = void 0;
        null == options.id ? getApp().core.reLaunch({
            url: "../index/index"
        }) : id = options.id, getApp().core.showLoading({
            title: "数据加载中...",
            mask: !0
        }), getApp().request({
            url: getApp().api.step.activity_detail,
            data: {
                activity_id: id
            },
            success: function(res) {
                getApp().core.hideLoading();
                var open_date = res.data.list.open_date.replace(".", "/").replace(".", "/");
                that.setData({
                    id: id,
                    name: res.data.list.name,
                    open_date: open_date,
                    step_num: res.data.list.step_num,
                    bail_currency: res.data.list.bail_currency
                });
            }
        });
    },
    onShareAppMessage: function(e) {
        return getApp().page.onShareAppMessage(this), {
            path: "/step/dare/dare?user_id=" + getApp().getUser().id,
            title: this.data.title ? this.data.title : "步数挑战"
        };
    },
    apply: function() {
        var that = this;
        getApp().request({
            url: getApp().api.step.activity_join,
            data: {
                activity_id: that.data.id
            },
            success: function(res) {
                var open_date = that.data.open_date.slice(5);
                0 === res.code ? getApp().core.redirectTo({
                    url: "../dare/dare?open_date=" + open_date + "&join=true"
                }) : "活力币不足" === res.msg && that.data.store.option.step.currency_name ? getApp().core.showModal({
                    content: that.data.store.option.step.currency_name + "不足",
                    showCancel: !1
                }) : getApp().core.showModal({
                    content: res.msg,
                    showCancel: !1
                });
            }
        });
    }
});