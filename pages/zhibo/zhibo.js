/*
 * @Author: nks
 * @Date: 2020-10-23 13:53:59
 * @name: 
 * @LastEditTime: 2020-10-28 10:59:22
 */
// pages/zhibo/zhibo.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    start: 0, // 起始拉取房间，start = 0 表示从第 1 个房间开始拉取
    limit: 10, // 每次拉取的个数上限，不要设置过大，建议 100 以内
    zhiboList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    getApp().page.onLoad(this, e);
   
  },
  dakai: function(e){
    var id = e.currentTarget.dataset.id;
    let roomId = [id]; // 填写具体的房间号，可通过下面【获取直播房间列表】 API 获取
    console.log(roomId);
    wx.navigateTo({
      url: `plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=${roomId}`
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var o = this;
    getApp().request({
        url: getApp().api.zhibo.list,
        method: "post",
        data:{
            start: o.data.start, // 起始拉取房间，start = 0 表示从第 1 个房间开始拉取
            limit: o.data.limit // 每次拉取的个数上限，不要设置过大，建议 100 以内
        },
        success: function(res) {
          if(res.errcode == 0){
            o.setData({
              zhiboList: res.room_info
            });
          }
        }
    });
  },    

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    var o = this;
    getApp().request({
      url: getApp().api.zhibo.list,
      method: "post",
      data:{
          start: o.data.start, // 起始拉取房间，start = 0 表示从第 1 个房间开始拉取
          limit: o.data.limit // 每次拉取的个数上限，不要设置过大，建议 100 以内
      },
      success: function(res) {
        if(res.errcode == 0){
          o.setData({
            zhiboList: res.room_info
          });
          if(res.total==0){
            wx.showToast({
              title: '没有主播在直播',  // 标题
              icon: 'none',   // 图标类型，默认success
              duration: 1500   // 提示窗停留时间，默认1500ms
            })
          }
        }
      }
    });
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var o = this;
    getApp().request({
        url: getApp().api.zhibo.list,
        method: "post",
        data:{
            start: o.data.start+o.data.limit, // 起始拉取房间，start = 0 表示从第 1 个房间开始拉取
            limit: o.data.limit // 每次拉取的个数上限，不要设置过大，建议 100 以内
        },
        success: function(res) {
          if(res.errcode == 0){
            o.setData({
              start: o.data.start+o.data.limit,
              zhiboList: o.data.zhiboList.concat(res.room_info)
            });
          }else{
            wx.showToast({
              title: '没有了',  // 标题
              icon: 'none',   // 图标类型，默认success
              duration: 1500   // 提示窗停留时间，默认1500ms
            })
          }
        }
    });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})