const app = getApp()

Page({
    data: {
        sizeValueList: [],
        id: app.globalData.id,
        sizeValue:''
    },

    onLoad() {
        wx.showShareMenu({
            withShareTicket: true,
            menus: ['shareAppMessage', 'shareTimeline']
        })

    },
    addSizeValue() {
        this.data.id += 1
        let content = this.data.sizeValueList.concat({show: true, id: this.data.id})
        this.setData({
            sizeValueList: content
        })
    },

    deleteSizeValue(event) {
        let id = event.currentTarget.dataset.id
        this.data.id -= 1
        let sizeValueList= this.data.sizeValueList;
        sizeValueList.splice(id - 1 ,1)
        this.setData({
            sizeValueList: sizeValueList
        })
    },
    sizeValue(event) {
        let id = event.currentTarget.dataset.id
        let content = `sizeValueList[${id - 1}].sizeValue`
        this.setData({
            [content]:event.detail
        })
    },
    save () {
        let that = this
        let sizeValueList = JSON.stringify(that.data.sizeValueList)
        wx.redirectTo({
            url:`/manage/goods/specification/index?sizeValueList=${sizeValueList}`
        })
    }

})
