// pages/fruit/fruit.js
var max_harvest = 10

Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: "",
    level : 0, // 0-10以内, 1-20以内， 2-100以内， 3-100以内巧算
    max_harvest: max_harvest, //
    harvest: 0, //10 then victory
    num1: 0, //
    num2: 0, //
    plus_flag: true, //加法
    ref_answer: 0, //参考答案
    correct: true, //答对了吗？
    // player_answer: 0, //玩家答案
    //状态
    state: 0, //0-显示题面， 1-显示答案， 2-奖励和鼓励的动画, 3-闯关成功的画面, 4-闯关失败
    //屏幕
    height: 0,
    width: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var res = wx.getSystemInfoSync()
    console.log("[wx.getSystemInfoSync]", res)
    this.data.height = res.windowHeight
    this.data.width = res.windowWidth

    if (options.level != null && options.level != undefined) {
      this.data.level = options.level
    } else {
    }

    if (options.name != null && options.name != undefined) {
      this.data.name = options.name
    } else {
    }

    this.onReset();
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

  generateQuestion: function() {
      var level = this.data.level
      var mid = 0
      if (level == 0) {
        mid = 5
      } else if (level == 1) {
        mid = 10
      } else if (level == 2) {
        mid = 50
      }

      var old_flag = this.data.plus_flag
      var old_num1 = this.data.num1
      var old_num2 = this.data.num2

      while (true) {
        this.data.plus_flag = Math.random() >= 0.5
        if (this.data.plus_flag) {
          this.data.num1 = Math.floor(mid/2) + Math.floor(Math.random() * mid/2+1)
          this.data.num2 = Math.floor(mid/2) +  Math.floor(Math.random() * mid/2+1)
          this.data.ref_answer = this.data.num1 + this.data.num2
        } else {
          // num1 - mid <= num2 < mid
          this.data.num1 = mid + Math.floor(Math.random() * mid)
          this.data.num2 = Math.floor(Math.random() * (mid + mid - this.data.num1)) + this.data.num1 - mid
          this.data.ref_answer = this.data.num1 - this.data.num2
        }
        if (old_flag != this.data.plus_flag ||
          old_num1 != this.data.num1 ||
          old_num2 != this.data.num2) {
              break;
          }
    }
  },

  onShowAnswer: function () {
    this.data.state = 1
    this.setData(this.data)
  },

  onResult: function (e) {
    this.data.correct = e.currentTarget.dataset.correct=="true"
    if (this.data.correct) {
        this.data.harvest = this.data.harvest + 1
    }

    if (this.data.harvest >= this.data.max_harvest) {
      this.data.state = 3
    }  else {
      this.data.state = 2
    }

    this.setData(this.data)
  },

  onNextQuestion: function() {
    this.data.state = 0
    this.generateQuestion()
    this.setData(this.data)
  },

  onNextLevel: function() {
    this.data.level = parseInt(this.data.level) + 1
    //为减少栈深度，不用navigateTo
    wx.redirectTo({
      url: '../fruits/fruits?level='+this.data.level,
    })
  },

  onReset: function() {
    this.data.harvest = 0
    this.data.state = 0
    this.generateQuestion()
    this.setData(this.data)
  }

})