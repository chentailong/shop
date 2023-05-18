const app = getApp()

Page({
    data: {
        fileList: [],
        specification: false,
        restriction: false,
        services: true,
        carriage_show:false,
        goods_list:{
            goods_name: '',
            cost_price: '',
            original_cost: '',
            selling_price: '',
            inventory: '',
            article: '',
            weights: '',
            pinkage:'',   //包邮数
            pinkage_money:'', //包邮金额
            restriction_number: '',
            integral: '0',
            discount: '0',
        },
        items:[
            {
                text: '默认运费',
                children: [],
            },
        ],
        mainActiveIndex: 0,
        activeId: [],
        max: 2,
    },

    onClickNav({ detail = {} }) {
        this.setData({
            mainActiveIndex: detail.index || 0,
        });
    },

    onClickItem({ detail = {} }) {
        const { activeId } = this.data;

        const index = activeId.indexOf(detail.id);
        if (index > -1) {
            activeId.splice(index, 1);
        } else {
            activeId.push(detail.id);
        }

        this.setData({ activeId });
    },


    onLoad(options) {
        wx.showShareMenu({
            withShareTicket: true,
            menus: ['shareAppMessage', 'shareTimeline']
        })
        console.log(options)
    },
    afterRead(event) {
        const {file} = event.detail;
        wx.uploadFile({
            url: 'https://example.weixin.qq.com/upload',
            filePath: file.url,
            name: 'file',
            formData: {user: 'test'},
            success(res) {
                const {fileList = []} = this.data;
                fileList.push({...file, url: res.data});
                this.setData({fileList});
            },
        });
    },
    goods_value(event) {
    },
    switch(event) {
        this.setData({specification: event.detail})
    },
    restriction(event) {
        this.setData({restriction: event.detail})
    },
    services(event) {
        this.setData({services: event.detail})
    },
    up_shelf() {
    },
    save() {
    },
    addClass() {
        wx.navigateTo({
            url:"/manage/goods/edit_goodsClass/edit"
        })
    },
    specification() {
        wx.navigateTo({
            url:"/manage/goods/specification/index"
        })
    },
    carriage_show() {this.setData({carriage_show:true})},
    onClose() {this.setData({ carriage_show: false })},
})
