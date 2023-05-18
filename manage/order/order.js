const app = getApp()
let access_token = wx.getStorageSync("ACCESS_TOKEN")
Page({
    data: {
        active: 0,
        actives: 0,
        date: '',
        phone: '',
        search_text: '',
        search_show: false,
        date_show: false,
        phone_show: false,
        order_amount: 1,
        value1: 0,
        option1: [
            {text: '全部商品', value: 0},
            {text: '新款商品', value: 1},
            {text: '活动商品', value: 2},
        ],
        common_all_list: [],
        common_wait_receiving: [], //待收货
        common_obligation_list: [], //代付款
        common_drop_shipping_list: [],  //代发货
        protect_all_list: [],
        protect_audit_list: [],
        protect_buyer_list: [],
        protect_seller_list: []
    },
    onShow() {
        wx.showShareMenu({
            withShareTicket: true,
            menus: ['shareAppMessage', 'shareTimeline']
        })
        let active = app.globalData.active
        let actives = app.globalData.actives
        this.setData({actives: actives, active: active})
        this.request(-1)

    },

    request(event) {
        let that = this
        let index = event - 1
        getApp().request({
            url: getApp().api.order.list,
            data: {
                status: index
            },
            success(res) {
                if (index === 0) {
                    that.setData({
                        common_obligation_list: res.data.list
                    })
                } else if (index === 1) {
                    that.setData({
                        common_drop_shipping_list: res.data.list
                    })
                } else if (index === 2) {
                    that.setData({
                        common_wait_receiving: res.data.list
                    })
                }
                that.setData({
                    common_all_list: res.data.list
                })
            }
        })
    },

    screen() {
        this.setData({search_show: true})
    },
    onConfirm() {

    },
    changeOrder() {

    },
    change_order(event) {
        this.request(event.detail.index)
    },
    //拨打电话
    cell_up(phone) {
        this.setData({phone_show: true, phone: phone.currentTarget.dataset.phone})
    },
    phone_dial(event) {
        wx.makePhoneCall({
            phoneNumber: this.data.phone
        })
    },

    search_all() {
    },
    search_day() {
    },
    search_yesterday() {
    },
    search_7day() {
    },
    search_custom() {
        this.setData({date_show: true, search_show: false})
    },
    onClose() {
        this.setData({date_show: false});
    },
    formatDate(date) {
        date = new Date(date);
        return `${date.getMonth() + 1}-${date.getDate()}`;
    },
    calendar_confirm(event) {
        const [start, end] = event.detail;
        this.setData({
            date_show: false,
            date: `${this.formatDate(start)} - ${this.formatDate(end)}`,
        });
        console.log(this.data.date)
    }
})
