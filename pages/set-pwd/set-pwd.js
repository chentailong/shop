var app = getApp(), api = getApp().api, longitude = "", latitude = "";

let password1 = '';
let password2 = '';
let code = false;
let olds = ''; //旧密码
let news = ''; //新密码
let affirm = ''; //确认密码
Page({
    data: {
        mch_offline: !0,
        showPayPwdInput: true,  //是否展示密码输入层
        showPayPwdInput2: false, //是否展示密码输入层
        pwdVal: '',  //输入的密码
        pwdVal2: '',  //确认密码
        payFocus: true, //文本框焦点
        focus: false,   // 文本框焦点
        code: false, // 是否已经输入过密码
        oldPasswords: '',
        newPasswords: '',
        affirmPasswords: '',
    },

    onLoad: function () {
        this.code = wx.getStorageSync('code')
        if (this.code) {
            this.setData({showPayPwdInput: false, showPayPwdInput2: false, code: true}, function () {
            });
        } else {
        }
    },

    /**
     * 显示支付密码输入层
     */
    showInputLayer: function () {
        this.setData({payFocus: true, focus: true});
    },
    /**
     * 隐藏支付密码输入层
     */
    hidePayLayer: function () {
        this.setData({
            showPayPwdInput: false,
            showPayPwdInput2: true,
            payFocus: false,
            focus: true,
            pwdVal: ''
        }, function () {
        });
    },
    // 密码匹配既提交，失败就返回
    hideLayer: function () {
        if (password1 != password2) {
            wx.showToast({
                icon: "none",
                title: '密码不一致，请重新输入!'
            })
            this.setData({showPayPwdInput: true, showPayPwdInput2: false, pwdVal2: ''}, function () {
            });
            return
        }
        this.setData({pwdVal2: ''}, function () {
        });
        getApp().core.showLoading({
            title: "正在提交",
            mask: !0
        }), getApp().request({
            url: getApp().api.user.set_pay_pwd,
            method: "POST",
            data: {
                pay_password1: password1,
                pay_password2: password2
            },
            success(res) {
                this.code = true
                wx.setStorageSync('code', this.code)
                getApp().core.hideLoading();
                wx.showToast({
                    title: res.msg
                })
                getApp().core.redirectTo({
                    url: "/pages/user/user"
                });
            }
        })
    },

    /**
     * 获取焦点
     */
    getFocus: function () {
        this.setData({payFocus: true});
    },
    getFocal: function () {
        this.setData({focus: true})
    },
    /**
     * 输入密码监听
     */
    inputPwd1: function (e) {
        this.setData({pwdVal: e.detail.value});
        if (e.detail.value.length >= 6) {
            password1 = this.data.pwdVal;
            this.hidePayLayer();
        }
    },

    inputPwd2: function (e) {
        this.setData({pwdVal2: e.detail.value});
        if (e.detail.value.length >= 6) {
            password2 = this.data.pwdVal2;
            this.hideLayer();
        }
    },

    /**
     * 修改密码
     */

    oldPassword: function (e) {
        this.setData({oldPasswords: e.detail.value});
        if (e.detail.value.length >= 6) {
            olds = this.data.oldPasswords;
        }
    },
    newPassword: function (e) {
        this.setData({newPasswords: e.detail.value});
        if (e.detail.value.length >= 6) {
            news = this.data.newPasswords;
        }
    },
    affirmPassword: function (e) {
        this.setData({affirmPasswords: e.detail.value});
        if (e.detail.value.length >= 6) {
            affirm = this.data.affirmPasswords;
        }
    },

    /**
     * 发起修改请求
     */

    amend: function () {
        console.log(olds)
        console.log(affirm)
        console.log(news)
        if (affirm != news) {
            wx.showToast({
                icon: "none",
                title: "密码不一致,请重新输入"
            }),
                this.setData({oldPasswords: '',affirmPasswords:'',newPasswords:''});
            return
        }
        getApp().core.showLoading({
            title: "正在提交",
            mask: !0
        }), getApp().request({
            url: getApp().api.user.edit_pay_pwd,
            method: "POST",
            data: {
                pay_password: olds,
                new_pay_password: affirm
            },
            success(res) {
                console.log(olds)
                console.log(news)
                console.log(affirm)
                console.log(res)
                getApp().core.hideLoading();
                if (res.code == 1) {
                    wx.showToast({
                        icon:"none",
                        title: res.msg
                    })
                } else {
                    wx.showToast({
                        title: res.msg
                    })
                    getApp().core.redirectTo({
                        url: "/pages/user/user"
                    });
                }

            }
        })
    }
})

