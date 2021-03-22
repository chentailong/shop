function time() {
    var time = Math.round(new Date().getTime() / 1e3);
    return parseInt(time);
}

function formatTime(time) {
    var FullYear = time.getFullYear(), Month = time.getMonth() + 1, Date = time.getDate(), Hours = time.getHours(), Minutes = time.getMinutes(), Seconds = time.getSeconds();
    return [ FullYear, Month, Date ].map(formatNumber).join("/") + " " + [ Hours, Minutes, Seconds ].map(formatNumber).join(":");
}

function formatData(time) {
    var FullYear = time.getFullYear(), Month = time.getMonth() + 1, Date = time.getDate();
    time.getHours(), time.getMinutes(), time.getSeconds();
    return [ FullYear, Month, Date ].map(formatNumber).join("-");
}

function formatNumber(t) {
    return (t = t.toString())[1] ? t : "0" + t;
}

module.exports = {
    formatTime: formatTime,
    formatData: formatData,
    scene_decode: function(t) {
        var e = (t + "").split(","), list = {};
        for (var n in e) {
            var a = e[n].split(":");
            0 < a.length && a[0] && (list[a[0]] = a[1] || null);
        }
        return list;
    },
    time: time,
    objectToUrlParams: function(time, res) {
        var r = "";
        for (var index in time) r += "&" + index + "=" + (res ? encodeURIComponent(time[index]) : time[index]);
        return r.substr(1);
    },
    inArray: function(res, time) {
        return time.some(function(time) {
            return res === time;
        });
    },
    min: function(time, res) {
        return time = parseFloat(time), (res = parseFloat(res)) < time ? res : time;
    },
    max: function(time, res) {
        return (time = parseFloat(time)) < (res = parseFloat(res)) ? res : time;
    }
};