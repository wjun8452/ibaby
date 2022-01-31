// pages/fruits/fruits.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    level : 0, // 0-10以内, 1-20以内， 2-100以内， 3-100以内巧算
    fruits: ["banana", "apple", "waterm"],
    labels: ["10以内加减法", "20以内加减法", "100以内加减法"],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.level != null && options.level != undefined) {
      this.data.level = options.level
    } else {

    }
    console.log(options)
    this.setData(this.data)
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