
var app = getApp(), api = getApp().api, longitude = "", latitude = "";

Page({
    data: {
        mch_offline: !0,
        showPayPwdInput: true,  //是否展示密码输入层
        pwdVal: '',  //输入的密码
        pwdVal2: '',
        payFocus: true, //文本框焦点
    },

    /**
     * 显示支付密码输入层
     */
    showInputLayer: function () {
        this.setData({payFocus: true});
    },
    /**
     * 隐藏支付密码输入层
     */
    hidePayLayer: function () {
        this.setData({showPayPwdInput: false, payFocus: false, pwdVal: ''}, function () {
        });
    },
    /**
     * 获取焦点
     */
    getFocus: function () {
        this.setData({payFocus: true});
    },
    /**
     * 输入密码监听
     */
    inputPwd: function (e) {
        this.setData({pwdVal: e.detail.value});
        if (e.detail.value.length >= 6) {
            this.hidePayLayer();
            console.log(e.detail.value)
        }
    }
})