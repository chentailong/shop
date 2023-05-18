const app = getApp()
Page({
    data: {
        option1: [
            {text: '支付金额', value: 0},
            {text: '支付订单数', value: 1},
            {text: '支付人数', value: 2},
            {text: '支付件数', value: 3},
        ],
        option2: [
            {text: '全部', value: 0},
            {text: '商城', value: 1},
            {text: '拼团', value: 2},
            {text: '预约', value: 3},
            {text: '商品预售', value: 4},
            {text: '积分商城', value: 5},
            {text: '整点秒杀', value: 6},
        ],
        active: 1,
        value1: 0,
        value2: 0,
        userInfo: {},
        payOrder: 5,
        payMoney: 87,
        hasUserInfo: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        canIUseGetUserProfile: false,
        canIUseOpenData: wx.canIUse('open-data.type.userAvatarUrl') && wx.canIUse('open-data.type.userNickName'),
        user: {},
        obligation: '1',
        drop_shipping: '1',
        protect_rights: '0',
        order_number: '',
    },

    onLoad() {
        wx.showShareMenu({
            withShareTicket: true,
            menus: ['shareAppMessage', 'shareTimeline']
        })
        let that = this
        if (wx.getUserProfile) {
            this.setData({
                canIUseGetUserProfile: true
            })
        }
        getApp().request({
            url: getApp().api.user.index,
            success(res) {
                console.log(res)
                that.setData({
                    order_number: res.data.order_count.all,
                    obligation: res.data.order_count.status_0,
                    drop_shipping: res.data.order_count.status_1,
                    protect_rights: res.data.order_count.status_3
                })
            }
        })
    },
    getUserInfo(e) {
        this.setData({
            userInfo: e.detail.userInfo,
            hasUserInfo: true,
            user: e.detail
        })
    },
    drop_shipping() {
        app.globalData.actives = 2
        app.globalData.active = 0
        wx.navigateTo({
            url: '/manage/order/order'
        })
    },
    protect_rights() {
        app.globalData.active = 1
        wx.navigateTo({
            url: '/manage/order/order'
        })
    },
    obligation() {
        app.globalData.actives = 1
        app.globalData.active = 0
        wx.navigateTo({
            url: '/manage/order/order'
        })
    }
})
