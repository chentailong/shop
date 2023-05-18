const app = getApp()
Page({
    data: {
        search: '',
        response: [],
        no_response: [],
        active: 0,

    },

    onLoad() {
        wx.showShareMenu({
            withShareTicket: true,
            menus: ['shareAppMessage', 'shareTimeline']
        })

    },
    cut_pattern(event) {

    },
    change_order() {

    }
})
