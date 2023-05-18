const app = getApp()
Page({
    data: {
        search_user: '',
        search_distributor: "",
        search_cancel: '',
        user_list: [{
            img: 'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=159942811,4074864988&fm=11&gp=0.jpg',
            user_name: '棒棒糖🍭',
            member: '普通会员',
            price_sum: '0.00',
            order: '0',
            integral: '0',
            balance: '0.00'
        },
            {
                img: 'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=159942811,4074864988&fm=11&gp=0.jpg',
                user_name: '晴天',
                member: '一级会员',
                price_sum: '21.00',
                order: '1',
                integral: '0',
                balance: '203.00'
            }],
        distributor_list: [{
            img: 'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=4277010421,1238629898&fm=11&gp=0.jpg',
            distributor_name: '棒棒糖🍭',
            price_amounts: '123.03',
            withdraw: "0.00"
        }],
        cancel_list: [],
        active: 0,
        sort_order: true,
        sort_deal:true,
        sort_accruing:true,
        sort_withdraw:true,
        reimburse_order:true,
        reimburse_money:true,
        reimburse_coupon:true
    },

    onLoad() {
        wx.showShareMenu({
            withShareTicket: true,
            menus: ['shareAppMessage', 'shareTimeline']
        })
    },
    onChange() {
    },
    //排序
    deal() {
        if (this.data.sort_deal) {
            this.setData({
                sort_deal: false
            })
        } else {
            this.setData({
                sort_deal: true
            })
        }

    },
    sort_order() {
        if (this.data.sort_order) {
            this.setData({
                sort_order: false
            })
        } else {
            this.setData({
                sort_order: true
            })
        }
    },
    withdraw() {
        if (this.data.sort_withdraw) {
            this.setData({
                sort_withdraw: false
            })
        } else {
            this.setData({
                sort_withdraw: true
            })
        }
    },
    accruing() {
        if (this.data.sort_accruing) {
            this.setData({
                sort_accruing: false
            })
        } else {
            this.setData({
                sort_accruing: true
            })
        }
    },
    reimburse_order() {
        if (this.data.reimburse_order) {
            this.setData({
                reimburse_order: false
            })
        } else {
            this.setData({
                reimburse_order: true
            })
        }
    },
    reimburse_money() {
        if (this.data.reimburse_money) {
            this.setData({
                reimburse_money: false
            })
        } else {
            this.setData({
                reimburse_money: true
            })
        }
    },
    reimburse_coupon() {
        if (this.data.reimburse_coupon) {
            this.setData({
                reimburse_coupon: false
            })
        } else {
            this.setData({
                reimburse_coupon: true
            })
        }
    }
})
