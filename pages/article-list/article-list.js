Page({
    data: {
        article_list: []
    },
    // a > that
    onLoad: function(e) {
        getApp().page.onLoad(this, e);
        var that = this;
        getApp().core.showLoading(), getApp().request({
            url: getApp().api.default.article_list,
            data: {
                cat_id: 2
            },
            success: function(t) {
                getApp().core.hideLoading(), that.setData({
                    article_list: t.data.list
                });
            }
        });
    }
});