module.exports = {
    currentPage: null,
    init: function(e) {
        var that = this;
        void 0 === (that.currentPage = e).onGoodsImageClick && (e.onGoodsImageClick = function(e) {
            that.onGoodsImageClick(e);
        }), void 0 === e.hide && (e.hide = function(e) {
            that.hide(e);
        }), void 0 === e.play && (e.play = function(e) {
            that.play(e);
        }), void 0 === e.close && (e.close = function(e) {
            that.close(e);
        });
    },
    onGoodsImageClick: function(e) {
        var currentPage = this.currentPage, urls = [], index = e.currentTarget.dataset.index;
        for (var pic_index in currentPage.data.goods.pic_list) urls.push(currentPage.data.goods.pic_list[pic_index]);
        getApp().core.previewImage({
            urls: urls,
            current: urls[index]
        });
    },
    hide: function(e) {
        var currentPage = this.currentPage;
        0 == e.detail.current ? currentPage.setData({
            img_hide: ""
        }) : currentPage.setData({
            img_hide: "hide"
        });
    },
    play: function(e) {
        var currentPage = this.currentPage, url = e.target.dataset.url;
        currentPage.setData({
            url: url,
            hide: "",
            show: !0
        }), getApp().core.createVideoContext("video").play();
    },
    close: function(e) {
        var currentPage = this.currentPage;
        if ("video" == e.target.id) return !0;
        currentPage.setData({
            hide: "hide",
            show: !1
        }), getApp().core.createVideoContext("video").pause();
    }
};