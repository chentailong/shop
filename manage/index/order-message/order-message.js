const app = getApp()
let access_token = wx.getStorageSync("ACCESS_TOKEN")
Page({
    data: {
        active: 0,
        option1: [
            {text: '全部', value: 0},
            {text: '商城', value: 1},
            {text: '拼团', value: 2},
            {text: '预约', value: 3},
            {text: '商品预售', value: 4},
            {text: '积分商城', value: 5},
            {text: '整点秒杀', value: 6},
        ],
        value1: 0,
        order: [],
        refund: [],
        after_sale: []
    },

    onLoad() {
        wx.showShareMenu({
            withShareTicket: true,
            menus: ['shareAppMessage', 'shareTimeline']
        })
        let that = this
        getApp().request({
            url: getApp().api.order.list,
            data: {
                status: 1,
                access_token: access_token,
            },
            success(res) {
                console.log(res)
                that.setData({
                    order: res.data.list
                })
            }
        })
    },
    changeTab(event) {
        let that = this
        if (event.detail.index === 2) {
            getApp().request({
                url: getApp().api.order.list,
                data: {
                    status: 4,
                    access_token: access_token,
                },
                success(res) {
                    that.setData({
                        after_sale: res.data.list
                    })
                }
            })
        } else if (event.detail.index === 1) {

        }
    }

})
