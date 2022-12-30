// pages/fruits/fruits.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    app: getApp().globalData.app,
    series_idx: 0, //本系列对应的ID
    unlocked_round: 0, //解锁了那一关？
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.series_idx != null && options.series_idx != undefined) {
      this.data.series_idx = parseInt(options.series_idx)
    } 
    
    this.data.app = Object.assign(this.data.app, getApp().globalData.app)
    this.setData(this.data)
    console.log(this.data)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.data.unlocked_round = getApp().globalData.unlocked[this.data.app.series[this.data.series_idx].name]
    // this.data.unlocked_round = 12;
    this.setData(this.data)
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

})