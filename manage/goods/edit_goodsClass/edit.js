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
        goods_class: [
            {id:'1',name: "手持式三维扫描仪", 1: true},
            {id:'2',name: "全局摄影测量系统", 2: true}
        ]
    },

    onClose(event) {
        this.setData({
            // [`goods_class.${event.target.id}`]: false,
        });
    },

    onChange(event) {
        const {picker, value, index} = event.detail;
        picker.setColumnValues(1, citys[value[0]]);
    },

    selection() {
        if (this.data.selection_sort) {
            this.setData({selection_sort: false})
        } else {
            this.setData({selection_sort: true})
        }
    },
    addClass(event) {
        // console.log(event.detail.value[1])
        const {value, index} = event.detail;
        console.log(`${value[1]}`)
    },


    onLoad() {

        wx.showShareMenu({
            withShareTicket: true,
            menus: ['shareAppMessage', 'shareTimeline']
        })
    },
})
