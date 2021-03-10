module.exports = function(e) {
    getApp().api;
    var core = getApp().core, get = getApp();
    if (e && "function" == typeof e) {
        var config = core.getStorageSync(get.const.STORE_CONFIG);
        config && e(config), get.config ? config = get.config : (getApp().trigger.add(getApp().trigger.events.callConfig, "call", function(t) {
            e(t);
        }), getApp().configReadyCall && "function" == typeof getApp().configReadyCall || (getApp().configReadyCall = function(t) {
            getApp().trigger.run(getApp().trigger.events.callConfig, function() {}, t);
        }));
    }
};