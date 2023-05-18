const app = getApp()
import Dialog from '../../../miniprogram_npm/@vant/weapp/dialog/dialog'

Page({
    data: {
        search_show: false,
        function_show: false,
        popup_show: false,
        active: 0,
        goods_list: [],
        edit_id: '',
        page: 1
    },
    onLoad() {
        let that = this
        that.load()
        wx.showShareMenu({
            withShareTicket: true,
            menus: ['shareAppMessage', 'shareTimeline']
        })
    },

    load() {
        let that = this
        getApp().request({
            url: getApp().api.default.goods_list,
            data: {
                page: that.data.page
            },
            success(res) {
                let arr1 = that.data.goods_list
                let arr2 = res.data.list
                arr1 = arr1.concat(arr2)
                that.setData({
                    data: res.data,
                    goods_list: arr1
                })
            }
        })
    },

    onReachBottom() {
        if (this.data.data.page_count >= this.data.page) {
            this.setData({
                page: this.data.page += 1
            })
            this.load()
        }
    },

    screen() {
        wx.navigateTo({
            url: "/manage/goods/add/add"
        })
    },
    onChange_tab() {

    },
    showPopup(event) {
        console.log(event)
        this.setData({
            // function_show: true,
            edit_id: event.currentTarget.dataset.id
        })
    },
    XJia(event) {
        console.log(event)
        this.setData({function_show: false})
        Dialog.confirm({
            title: '提示',
            message: '是否下架该商品',
        })
            .then(() => {
            })
            .catch(() => {
            });
    },
    deletes(event) {
        this.setData({function_show: false})
        Dialog.confirm({
            title: '提示',
            message: '是否删除该商品',
        })
            .then(() => {
            })
            .catch(() => {
            });
    },
    onClose() {
        this.setData({function_show: false});
    },
})
