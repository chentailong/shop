Page({
    data: {
        address_list: []
    },
    onLoad: function(e) {
        getApp().page.onLoad(this, e);
    },
    // t > that
    onShow: function() {
        getApp().page.onShow(this);
        var that = this;
        getApp().core.showNavigationBarLoading(), getApp().request({
            url: getApp().api.user.address_list,
            success: function(e) {
                getApp().core.hideNavigationBarLoading(), 0 == e.code && that.setData({
                    address_list: e.data.list
                }), that.setData({
                    show_no_data_tip: 0 == that.data.address_list.length
                });
            }
        });
    },
    // a > that, d > pages(当前页数) t > address(地址)  s > site(地点)
    setDefaultAddress: function(e) {
        var that = this, pages = e.currentTarget.dataset.index, address = that.data.address_list[pages];
        getApp().core.showLoading({
            title: "正在保存",
            mask: !0
        }), getApp().request({
            url: getApp().api.user.address_set_default,
            data: {
                address_id: address.id
            },
            success: function(e) {
                if (getApp().core.hideLoading(), 0 == e.code) {
                    var address = that.data.address_list;
                    for (var site in address) address[site].is_default = site == pages ? 1 : 0;
                    that.setData({
                        address_list: address
                    });
                }
            }
        });
    },
    // t > id(数据id)
    deleteAddress: function(e) {
        var id = e.currentTarget.dataset.id;
        e.currentTarget.dataset.index;
        getApp().core.showModal({
            title: "提示",
            content: "确认删除改收货地址？",
            success: function(e) {
                e.confirm && (getApp().core.showLoading({
                    title: "正在删除",
                    mask: !0
                }), getApp().request({
                    url: getApp().api.user.address_delete,
                    data: {
                        address_id: id
                    },
                    success: function(e) {
                        0 == e.code && getApp().core.redirectTo({
                            url: "/pages/address/address"
                        }), 1 == e.code && (getApp().core.hideLoading(), getApp().core.showToast({
                            title: e.msg
                        }));
                    }
                }));
            }
        });
    }
});