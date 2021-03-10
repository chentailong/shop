var time = {
    page: null,
    time_list: {
        hour: "00",
        minute: "00",
        second: "00"
    },
    init: function(res) {
        var that = this;
        (this.page = res).setData({
            time_list: that.time_list,
            intval: []
        }), res.setTimeOver = function() {
            var page = that.page, s = setInterval(function() {
                if (page.data.reset_time <= 0) clearInterval(s); else {
                    var reset_time = page.data.reset_time - 1, time_list = page.setTimeList(reset_time);
                    page.setData({
                        reset_time: reset_time,
                        time_list: time_list
                    });
                }
            }, 1e3);
        };
    }
};

module.exports = time;