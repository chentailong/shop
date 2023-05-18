var app = getApp(), api = app.api, is_loading_more = !1, is_no_more = !1;

Page({
    data: {
        page: 1,
        video_list: [],
        url: "",
        hide: "hide",
        show: !1,
        animationData: {}
    },
    onLoad: function(o) {
        wx.showShareMenu({
            withShareTicket: true,
            menus: ['shareAppMessage', 'shareTimeline']
        })
        app.page.onLoad(this, o);
        this.loadMoreGoodsList(), is_no_more = is_loading_more = !1;
    },
    onReady: function() {},
    onShow: function() {
        app.page.onShow(this);
    },
    onHide: function() {
        app.page.onHide(this);
    },
    onUnload: function() {
        app.page.onUnload(this);
    },
    onPullDownRefresh: function() {},
    loadMoreGoodsList: function() {
        var that = this;
        if (!is_loading_more) {
            that.setData({
                show_loading_bar: !0
            }), is_loading_more = !0;
            var page = that.data.page;
            app.request({
                url: api.default.video_list,
                data: {
                    page: page
                },
                success: function(res) {
                    0 === res.data.list.length && (is_no_more = !0);
                    var video_list = that.data.video_list.concat(res.data.list);
                    that.setData({
                        video_list: video_list,
                        page: page + 1
                    });
                },
                complete: function() {
                    is_loading_more = !1, that.setData({
                        show_loading_bar: !1
                    });
                }
            });
        }
    },
    play: function(o) {
        var index = o.currentTarget.dataset.index;
        getApp().core.createVideoContext("video_" + this.data.show_video).pause(), this.setData({
            show_video: index,
            show: !0
        });
    },
    onReachBottom: function() {
        is_no_more || this.loadMoreGoodsList();
    },
    more: function(o) {
        var that = this, index = o.target.dataset.index, video_list = that.data.video_list, animation = getApp().core.createAnimation({
            duration: 1e3,
            timingFunction: "ease"
        });
        this.animation = animation, -1 !== video_list[index].show ? (animation.rotate(0).step(), video_list[index].show = -1) : (animation.rotate(0).step(),
            video_list[index].show = 0), that.setData({
            video_list: video_list,
            animationData: this.animation.export()
        });
    }
});