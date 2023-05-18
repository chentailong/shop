const app = getApp()

Page({
    data: {
        option1: [
            {text: '全部商品', value: 0},
            {text: '新款商品', value: 1},
            {text: '活动商品', value: 2},
        ],
        value1: 0,
        checked: false,
    },

    onLoad(options) {
        wx.showShareMenu({
            withShareTicket: true,
            menus: ['shareAppMessage', 'shareTimeline']
        })
    },
    checked(event) {
        this.setData({
            checked: event.detail,
        });
    },

})
