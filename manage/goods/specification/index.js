const app = getApp()
let value = []

Page({
    data: {
        sizeValue: "",
        id: app.globalData.id,
        size_list: []
    },

    onLoad(options) {
        wx.showShareMenu({
            withShareTicket: true,
            menus: ['shareAppMessage', 'shareTimeline']
        })
        if (options.sizeValueList !== undefined) {
            let list = JSON.parse(options.sizeValueList)
            console.log(list)
            let cont = `size_list[0].sizeValue`
            let contShow = `size_list[0].show`
            for (let i = 0; i < list.length; i++) {
                value.push(list[i].sizeValue)
                this.setData({
                    [cont]: value,
                    [contShow]: list[i].show
                })
            }
            console.log(this.data.size_list)
        }
    }
    ,
    addSize() {
        this.data.id += 1
        let content = this.data.size_list.concat({show: true, id: this.data.id})
        this.setData({
            size_list: content
        })
    },
    deleteSize(event) {
        let id = event.currentTarget.dataset.id
        this.data.id -= 1
        let size_list = this.data.size_list;
        size_list.splice(id - 1, 1)
        this.setData({
            size_list: size_list
        })
    },
    size_edit() {
        wx.navigateTo({
            url: '/manage/goods/edit_size/index'
        })
    },
    sizeName(event) {
        let id = event.currentTarget.dataset.id
        let content = `size_list[${id - 1}].name`
        this.setData({
            [content]: event.detail
        })
    },
    detail() {
        if (this.data.size_list.length === 0) {
            wx.showToast({
                icon:"none",
                title:'请完善规格信息'
            })
        }else {
            wx.navigateTo({
                url:"/manage/goods/size_detail/index"
            })
        }
    }
})
