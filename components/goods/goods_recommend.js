module.exports = {
    currentPage: null,
    init: function(init) {
        var that = this;
        void 0 === (that.currentPage = init).goods_recommend && (init.goods_recommend = function(o) {
            that.goods_recommend(o);
        });
    },
    goods_recommend: function(res) {
        var currentPage = this.currentPage;
        currentPage.setData({
            is_loading: !0
        });
        var page = currentPage.data.page || 2;
        getApp().request({
            url: getApp().api.default.goods_recommend,
            data: {
                goods_id: res.goods_id,
                page: page
            },
            success: function(res) {
                if (0 == res.code) {
                    if (res.reload) var list = res.data.list;
                    if (res.loadmore) list = currentPage.data.goods_list.concat(res.data.list);
                    currentPage.data.drop = !0, currentPage.setData({
                        goods_list: list
                    }), currentPage.setData({
                        page: page + 1
                    });
                }
            },
            complete: function() {
                currentPage.setData({
                    is_loading: !1
                });
            }
        });
    }
};