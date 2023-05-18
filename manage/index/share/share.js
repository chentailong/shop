
const app = getApp()
Page({
    data: {
        search:'',
        apply:[]
    },

    onLoad() {
        wx.showShareMenu({
            withShareTicket: true,
            menus: ['shareAppMessage', 'shareTimeline']
        })
    },

})
