Page({
    data: {
        search: '',
        address_list: [
            {
                id: "1",
                name: "小龙",
                mobile: "19994646994",
                address: "广西壮族自治区鱼峰区古亭山深林公园"
            },
            {
                id: "2",
                name: "小龙",
                mobile: "19994646994",
                address: "广西壮族自治区鱼峰区古亭山深林公园"
            }
        ],
        add_info: {
            name: '',
            mobile: '',
            address: '',
        }
    },
    onLoad() {
        wx.showShareMenu({
            withShareTicket: true,
            menus: ['shareAppMessage', 'shareTimeline']
        })
    },
    deleteAddress(e) {
    },
    getUserAddress() {
        let that = this
        wx.getSetting({
            success(res) {
                if (res.authSetting['scope.address']) {
                    wx.chooseAddress({
                        success(res) {
                            that.data.add_info.name = res.userName
                            that.data.add_info.mobile = res.telNumber
                            that.data.add_info.address = res.provinceName + res.cityName + res.countyName + res.detailInfo

                            that.data.address_list.push(that.data.add_info)
                            console.log(that.data.address_list)
                        }
                    })
                }
            }
        })
    },
    Add_Address() {
        wx.navigateTo({
            url: "/manage/address_edit/address_edit"
        })
    }

})
