module.exports = function() {
    var userInfo = this.core.getStorageSync(this.const.USER_INFO);
    return userInfo || "";
};