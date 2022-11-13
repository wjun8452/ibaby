// miniprogram/pages/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    app: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
    onLoad: function (options) {
      console.log("index.onLoad starts")
      wx.showLoading({
      title: '正在加载...',
    })

    var that = this;

    getApp().getCloud(function(cloud) {
      cloud.downloadFile({
        fileID: 'cloud://ilovevolleyball-d1813b.696c-ilovevolleyball-d1813b-1253572757/ibaby/app.json',
        success: res => {
          // get temp file path
          console.log(res)
          let fs = wx.getFileSystemManager()
          let result = fs.readFileSync(res.tempFilePath, "utf-8")
          that.data.app = JSON.parse(result);
          console.log("-----------------")
          console.log(that.data.app)
          that.setData(that.data)
          getApp().globalData.app = that.data.app
  
          for (var index in that.data.app.series) {
            var series = that.data.app.series[index]
            if (!getApp().globalData.unlocked.hasOwnProperty(series.name)) {
              getApp().globalData.unlocked[series.name] = 0
            }
          }
          wx.setStorageSync(getApp().cacheKey, getApp().globalData)
          wx.hideLoading({
            success: (res) => {},
          })
          //console.log("unlocked", getApp().globalData.unlocked)
        },
        fail: err => {
          // handle error
          console.log(err)
        }
      })
    })
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

  }
})