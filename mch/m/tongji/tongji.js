var app = getApp(), api = getApp().api;

Page({
    data: {
        current_year: "",
        current_month: "",
        month_scroll_x: 1e5,
        year_list: [],
        daily_avg: "-",
        month_count: "-",
        up_rate: "-"
    },
    onLoad: function(options) {
        wx.showShareMenu({
            withShareTicket: true,
            menus: ['shareAppMessage', 'shareTimeline']
        })
        getApp().page.onLoad(this, options);
        var that = this;
        getApp().core.showNavigationBarLoading(), getApp().request({
            url: getApp().api.mch.user.tongji_year_list,
            success: function(res) {
                that.setData({
                    year_list: res.data.year_list,
                    current_year: res.data.current_year,
                    current_month: res.data.current_month
                }), that.setMonthScroll(), that.getMonthData();
            },
            complete: function() {
                getApp().core.hideNavigationBarLoading();
            }
        });
    },
    onReady: function() {
        getApp().page.onReady(this);
    },
    onShow: function() {
        getApp().page.onShow(this);
    },
    onHide: function() {
        getApp().page.onHide(this);
    },
    onUnload: function() {
        getApp().page.onUnload(this);
    },
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    changeMonth: function(t) {
        var that = this, yearIndex = t.currentTarget.dataset.yearIndex, monthIndex = t.currentTarget.dataset.monthIndex;
        for (var n in that.data.year_list) for (var o in n == yearIndex ? (that.data.year_list[n].active = !0,
            that.data.current_year = that.data.year_list[n].year) : that.data.year_list[n].active = !1,
            that.data.year_list[n].month_list) n == yearIndex && o == monthIndex ? (that.data.year_list[n].month_list[o].active = !0,
            that.data.current_month = that.data.year_list[n].month_list[o].month) : that.data.year_list[n].month_list[o].active = !1;
        that.setData({
            year_list: that.data.year_list,
            current_year: that.data.current_year
        }), that.setMonthScroll(), that.getMonthData();
    },
    setMonthScroll: function() {
        var that = this, width = getApp().core.getSystemInfoSync().screenWidth / 5, index = 0;
        for (var r in that.data.year_list) {
            var n = !1;
            for (var o in that.data.year_list[r].month_list) {
                if (that.data.year_list[r].month_list[o].active) {
                    n = !0;
                    break;
                }
                index++;
            }
            if (n) break;
        }
        that.setData({
            month_scroll_x: (index - 0) * width
        });
    },
    setCurrentYear: function() {
        var that = this;
        for (var a in that.data.year_list) if (that.data.year_list[a].active) {
            that.data.current_year = that.data.year_list[a].year;
            break;
        }
        that.setData({
            current_year: that.data.current_year
        });
    },
    getMonthData: function() {
        var that = this;
        getApp().core.showNavigationBarLoading(), that.setData({
            daily_avg: "-",
            month_count: "-",
            up_rate: "-"
        }), getApp().request({
            url: getApp().api.mch.user.tongji_month_data,
            data: {
                year: that.data.current_year,
                month: that.data.current_month
            },
            success: function(t) {
                0 == t.code ? that.setData({
                    daily_avg: t.data.daily_avg,
                    month_count: t.data.month_count,
                    up_rate: t.data.up_rate
                }) : getApp().core.showModal({
                    title: "提示",
                    content: t.msg,
                    showCancel: !1
                });
            },
            complete: function() {
                getApp().core.hideNavigationBarLoading();
            }
        });
    }
});