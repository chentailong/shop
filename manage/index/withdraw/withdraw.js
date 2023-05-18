const app = getApp()
Page({
    data: {
        search: '',
        audit: [],
        remit: []
    },

    onLoad() {
        wx.showShareMenu({
            withShareTicket: true,
            menus: ['shareAppMessage', 'shareTimeline']
        })

    },
    cut_pattern(event) {

    }
})
