const app = getApp()
let store = wx.getStorageSync("STORE")

Page({
    data: {
        project_img: store.service,
        project_name: store.name,
        project_names: "",
        edit_name_show: false,
        delete_order_show: false,
        confirm_receipt_show: false,
        after_sale_show: false,
        integral_show: false,
        integral_use_show: false,
        shipments_way_show: false,
        pay_way_show: false,
        switch_note: false,
        binding_time: '10',     //限时
        binding_times: '',
        receipt_time: '15',    //确认收货时间
        receipt_times: '',
        after_time: '0',   //售后时间
        after_times: '',
        integral: '5',    //积分抵扣
        integrals: '',
        integral_use: '',  //积分规则
        integral_bl: false,
        pay_list: [],
        pay_on_list: ['线上支付','账户余额支付'],
        shipments: ['快递配送', '到店自提', '同城配送'],
        shipments_on_list: ['快递配送']
    },
    onLoad() {
        wx.showShareMenu({
            withShareTicket: true,
            menus: ['shareAppMessage', 'shareTimeline']
        })
        let that = this
        getApp().request({
            url: getApp().api.order.list,
            data: {status: -1},
            success(res) {
                that.setData({
                    pay_list: res.data.pay_type_list,
                })
            }
        })
    },

    pay_on(event) {
        this.setData({
            pay_on_list: event.detail
        });
    },
    shipments_on(event) {
        this.setData({
            shipments_on_list: event.detail
        });
    },
    pay_toggle(event) {
        const {index} = event.currentTarget.dataset;
        const checkbox = this.selectComponent(`.checkboxes-${index}`);
        checkbox.toggle();
    },
    shipments_toggle(event) {
        const {index} = event.currentTarget.dataset;
        const checkbox = this.selectComponent(`.checkboxes-${index}`);
        checkbox.toggle();
    },
    address() {
        wx.navigateTo({
            url: "/manage/address/address"
        })
    },
    picture() {
        let that = this
        wx.chooseImage({
            count: 1,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success(res) {
                that.setData({
                    project_img: res.tempFilePaths
                })
            }
        })
    },

    shipments() {
        this.setData({shipments_way_show: true})
    },
    pay_way() {
        this.setData({pay_way_show: true})
    },
    switch_note(event) {
        this.setData({switch_note: event.detail});
    },
    edit_name() {
        if (this.data.edit_name_show) {
            this.setData({edit_name_show: false})
        } else {
            this.setData({edit_name_show: true})
        }
    },

    edit_affirm() {
        if (this.data.project_names === "") {
            this.setData({project_name: this.data.project_name})
        } else {
            this.setData({project_name: this.data.project_names})
        }
    },
    delete_affirm() {
        if (this.data.binding_times === "") {
            this.setData({binding_time: this.data.binding_time})
        } else {
            this.setData({binding_time: this.data.binding_times})
        }
    },
    receipt_affirm() {
        if (this.data.receipt_times === "") {
            this.setData({receipt_time: this.data.receipt_time})
        } else {
            this.setData({receipt_time: this.data.receipt_times})
        }
    },
    after_affirm() {
        if (this.data.after_times === "") {
            this.setData({after_time: this.data.after_time})
        } else {
            this.setData({after_time: this.data.after_times})
        }
    },
    integral_affirm() {
        if (this.data.integrals === "") {
            this.setData({integral: this.data.integral})
        } else {
            this.setData({integral: this.data.integrals})
        }
    },
    integral_use_affirm() {
        if (this.data.integral_use === '') {
            this.setData({integral_bl: false})
        } else {
            this.setData({integral_bl: true})
        }
        this.setData({integral_use: this.data.integral_use})
    },

    delete_order() {
        this.setData({delete_order_show: true})
    },
    receipt() {
        this.setData({confirm_receipt_show: true})
    },
    after() {
        this.setData({after_sale_show: true})
    },
    integrals() {
        this.setData({integral_show: true})
    },
    integral_use() {
        this.setData({integral_use_show: true})
    },

    name_change(event) {
        this.setData({project_names: event.detail})
    },
    delete_order_change(event) {
        this.setData({binding_times: event.detail})
    },
    receipt_change(event) {
        this.setData({receipt_times: event.detail})
    },
    after_change(event) {
        this.setData({after_times: event.detail})
    },
    integral_change(event) {
        this.setData({integrals: event.detail})
    },
    integral_use_change(event) {
        this.setData({integral_use: event.detail})
    },
})
