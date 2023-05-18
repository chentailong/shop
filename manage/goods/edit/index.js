const app = getApp()
const citys = {
    浙江: ['杭州', '宁波', '温州', '嘉兴', '湖州'],
    福建: ['福州', '厦门', '莆田', '三明', '泉州'],
};

Page({
    data: {
        columns: [
            {
                values: Object.keys(citys),
                className: 'column1',
            },
            {
                values: citys['浙江'],
                className: 'column2',
                defaultIndex: 2,
            },
        ],
        selection_sort: false,
    },

    onChange(event) {
        const { picker, value, index } = event.detail;
        picker.setColumnValues(1, citys[value[0]]);
    },


    onLoad() {
        wx.showShareMenu({
            withShareTicket: true,
            menus: ['shareAppMessage', 'shareTimeline']
        })

    },
    selection() {
        if (this.data.selection_sort) {
            this.setData({selection_sort: false})
        }else {
            this.setData({selection_sort: true})
        }
    }
})
