var calendarSignData, date, calendarSignDay, app = getApp();

Page({
    data: {},
    onLoad: function (a) {
        wx.showShareMenu({
            withShareTicket: true,
            menus: ['shareAppMessage', 'shareTimeline']
        })
        var time = new Date(), year = time.getFullYear(), month = time.getMonth() + 1;
        date = time.getDate();
        var monthDaySize, c = time.getDay(), nbsp = 7 - (date - c) % 7;
        1 == month || 3 == month || 5 == month || 7 == month || 8 == month || 10 == month || 12 == month ? monthDaySize = 31 : 4 == month ||
        6 == month || 9 == month || 11 == month ? monthDaySize = 30 : 2 == month && (monthDaySize = (year - 2e3) % 4 == 0 ? 29 : 28),
        null != getApp().core.getStorageSync("calendarSignData") && "" != getApp().core.getStorageSync("calendarSignData") || getApp().core.setStorageSync("calendarSignData", new Array(monthDaySize)),
        null != getApp().core.getStorageSync("calendarSignDay") && "" != getApp().core.getStorageSync("calendarSignDay") || getApp().core.setStorageSync("calendarSignDay", 0),
            calendarSignData = getApp().core.getStorageSync("calendarSignData"), calendarSignDay = getApp().core.getStorageSync("calendarSignDay"),
            this.setData({
                year: year,
                month: month,
                nbsp: nbsp,
                monthDaySize: monthDaySize,
                date: date,
                calendarSignData: calendarSignData,
                calendarSignDay: calendarSignDay
            });
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
    onShareAppMessage: function () {
    },
    register_rule: function () {
        this.setData({
            register_rule: !0
        });
    },
    hideModal: function () {
        this.setData({
            register_rule: !1
        });
    },
    calendarSign: function () {
        calendarSignData[date] = date, calendarSignDay += 1, getApp().core.setStorageSync("calendarSignData", calendarSignData),
            getApp().core.setStorageSync("calendarSignDay", calendarSignDay), getApp().core.showToast({
            title: "签到成功",
            icon: "success",
            duration: 2e3
        }), this.setData({
            calendarSignData: calendarSignData,
            calendarSignDay: calendarSignDay
        });
    }
});