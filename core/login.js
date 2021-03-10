module.exports = function(e) {
    var that = this, route = that.page.currentPage;
    that.page.currentPageOptions;
    route && "pages/index/index" === route.route && "my" === that.platform || this.request({
        url: this.api.share.index,
        success: function(e) {
            0 == e.code && (that.page.setPhone(), that.trigger.run(that.trigger.events.login));
        }
    });
};