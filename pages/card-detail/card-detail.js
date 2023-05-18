Page({
    data: {},
    // e -> data（传输数据）; t -> that; a -> cardId(卡券id)

    onLoad: function(data) {
        wx.showShareMenu({
            withShareTicket: true,
            menus: ['shareAppMessage', 'shareTimeline']
        })
        getApp().page.onLoad(this, data);
        var that = this, cardId = data.user_card_id;
        cardId && (getApp().core.showLoading({
            title: "加载中"
        }), getApp().request({
            url: getApp().api.user.card_detail,
            data: {
                user_card_id: cardId
            },
            success: function(res) {
                0 == res.code && (0 === res.data.list.is_use && that.getQrcode(cardId), that.setData({
                    use: res.data.list.is_use,
                    list: res.data.list
                }));
            },
            complete: function() {
                getApp().core.hideLoading();
            }
        }));
    },
    // e -> data; t -> that
    //生成二维码
    getQrcode: function(data) {
        var that = this;
        getApp().request({
            url: getApp().api.user.card_qrcode,
            data: {
                user_card_id: data
            },
            success: function(res) {
                0 == res.code ? that.setData({
                    qrcode: res.data.url
                }) : getApp().core.showModal({
                    title: "提示",
                    content: res.msg,
                    showCancel: !1
                });
            }
        });
    },
    // t -> url; e -> data
    goodsQrcodeClick: function(data) {
        var url = data.currentTarget.dataset.src;
        getApp().core.previewImage({
            urls: [ url ]
        });
    }
});