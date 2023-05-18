Page({
    data: {
        region: '',
        consignee: '',
        phone: '',
        address: '',
        distinguish:''
    },
    onLoad() {
        wx.showShareMenu({
            withShareTicket: true,
            menus: ['shareAppMessage', 'shareTimeline']
        })
    },
    bindRegionChange: function (e) {
        this.setData({region: e.detail.value})
    },
    saveAddress() {
    },
    identification(e) {
        var that = this;
        var text = that.data.distinguish;
        var text = text.replace(/(^\s*)|(\s*$)/g, ""); //清除文本前后空格
        if (text === '') {
            that.setData({
                u_name: '',
                u_phone: '',
                u_address: ''
            })
            return;
        }
        var regx = /(1[3|4|5|7|8][\d]{9}|0[\d]{2,3}-[\d]{7,8}|400[-]?[\d]{3}[-]?[\d]{4})/g;
        var phone_num = text.match(regx);
        if (phone_num != null) {
            var phone = text.indexOf(phone_num[0]);
        }
        var name = text.indexOf("姓名：");
        if (name >= 0) {
            var phone = text.indexOf("电话："),
                address = text.indexOf("地址：");
            var u_name = text.substring(name + 3, phone),
                u_phone = text.substring(phone + 3, address),
                u_address = text.substring(address + 3, text.length);
            that.setData({
                u_name: u_name,
                u_phone: u_phone,
                u_address: u_address
            })
        } else if (phone >= 0) {
            var u_name = text.substring(0, phone),
                u_phone = text.substring(phone, phone + 11),
                u_address = text.substring(phone + 11, text.length);
            that.setData({
                u_name: u_name,
                u_phone: u_phone,
                u_address: u_address
            })
        } else {
            that.setData({
                u_name: '',
                u_phone: '',
                u_address: ''
            })
            return;
        }
        that.setData({
            consignee: u_name, //收货人
            phone: u_phone, //联系方式
            address: u_address, //详细地址
        })
    },
})
