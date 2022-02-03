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
    wx.showLoading({
      title: '正在加载...',
    })
    wx.cloud.downloadFile({
      fileID: 'cloud://cloud1-8g13piij1a7c00df.636c-cloud1-8g13piij1a7c00df-1309465151/app/app.json',
      success: res => {
        // get temp file path
        console.log(res.tempFilePath)
        let fs = wx.getFileSystemManager()
        let result = fs.readFileSync(res.tempFilePath, "utf-8")
        //console.log(result)
        this.data.app = JSON.parse(result);
        //console.log("-----------------")
        //console.log(this.data.app.name)
        this.setData(this.data)
        getApp().globalData.app = this.data.app

        for (var index in this.data.app.series) {
          var series = this.data.app.series[index]
          if (!getApp().globalData.unlocked.hasOwnProperty(series.name)) {
            getApp().globalData.unlocked[series.name] = 0
          }
        }
        wx.setStorageSync(getApp().globalData.cacheKey, getApp().globalData)
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