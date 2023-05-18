var app = getApp(), api = getApp().api;

Page({
    data: {
        is_show: !1
    },
    onLoad: function(options) {
        wx.showShareMenu({
            withShareTicket: true,
            menus: ['shareAppMessage', 'shareTimeline']
        })
        getApp().page.onLoad(this, options);
        var that = this;
        getApp().core.showLoading({
            title: "加载中"
        }), getApp().request({
            url: getApp().api.mch.user.myshop,
            success: function(t) {
                getApp().core.hideLoading(), 0 == t.code && (0 === t.data.mch.is_open && getApp().core.showModal({
                    title: "提示",
                    content: "\b店铺已被关闭！请联系管理员",
                    showCancel: !1,
                    success: function(t) {
                        t.confirm && getApp().core.navigateBack();
                    }
                }), that.setData(t.data), that.setData({
                    is_show: !0
                })), 1 == t.code && getApp().core.redirectTo({
                    url: "/mch/apply/apply"
                });
            }
        });
    },
    onReady: function() {
        getApp().page.onReady(this);
    },
    onShow: function() {
        getApp().page.onShow(this);
    },
    onHide: function() {
        getApp().page.onHide(this);
    },
    onUnload: function() {
        getApp().page.onUnload(this);
    },
    navigatorSubmit: function(t) {
        getApp().request({
            url: getApp().api.user.save_form_id + "&form_id=" + t.detail.formId
        }), getApp().core.navigateTo({
            url: t.detail.value.url
        });
    },
    showPcUrl: function() {
        this.setData({
            show_pc_url: !0
        });
    },
    hidePcUrl: function() {
        this.setData({
            show_pc_url: !1
        });
    },
    copyPcUrl: function() {
        var that = this;
        getApp().core.setClipboardData({
            data: that.data.pc_url,
            success: function(t) {
                that.showToast({
                    title: "内容已复制"
                });
            }
        });
    }
});