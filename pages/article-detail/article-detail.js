var WxParse = require("../../wxParse/wxParse.js");

Page({
    data: {
        version: getApp()._version
    },
    // t > that
    onLoad: function(e) {
        wx.showShareMenu({
            withShareTicket: true,
            menus: ['shareAppMessage', 'shareTimeline']
        })
        getApp().page.onLoad(this, e);
        var that = this;
        getApp().request({
            url: getApp().api.default.article_detail,
            data: {
                id: e.id
            },
            success: function(e) {
                0 == e.code && (getApp().core.setNavigationBarTitle({
                    title: e.data.title
                }), WxParse.wxParse("content", "html", e.data.content, that)), 1 == e.code && getApp().core.showModal({
                    title: "提示",
                    content: e.msg,
                    showCancel: !1,
                    confirm: function(e) {
                        e.confirm && getApp().core.navigateBack();
                    }
                });
            }
        });
    },
      setUserInfoShowFalse: function() {
        console.log(517)
        this.setData({
            user_info_show: !1
        });
    },
});