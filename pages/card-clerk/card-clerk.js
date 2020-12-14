Page({
    data: {},
    // t -> user; o -> scene(场景); e -> data
    onLoad: function(data) {
        getApp().page.onLoad(this, data);
        var user = getApp().getUser();
        this.setData({
            store: getApp().core.getStorageSync(getApp().const.STIRE),
            user_info: user
        });
        var scene = "";
        if ("undefined" == typeof my) scene = decodeURIComponent(data.scene); else if (null !== getApp().query) {
            var n = getApp().query;
            getApp().query = null, scene = n.user_card_id;
        }
        getApp().core.showModal({
            title: "提示",
            content: "是否核销？",
            success: function(res) {
                res.confirm ? (getApp().core.showLoading({
                    title: "核销中"
                }), getApp().request({
                    url: getApp().api.user.card_clerk,
                    data: {
                        user_card_id: scene
                    },
                    success: function(e) {
                        getApp().core.showModal({
                            title: "提示",
                            content: e.msg,
                            showCancel: !1,
                            success: function(e) {
                                e.confirm && getApp().core.redirectTo({
                                    url: "/pages/index/index"
                                });
                            }
                        });
                    },
                    complete: function() {
                        getApp().core.hideLoading();
                    }
                })) : res.cancel && getApp().core.redirectTo({
                    url: "/pages/index/index"
                });
            }
        });
    },
    onShow: function() {
        getApp().page.onShow(this);
    }
});