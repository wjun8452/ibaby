// pages/fruit/fruit.js
var max_harvest = 10
const recorderManager = wx.getRecorderManager()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    app: {},
    round_idx: 0, //
    series_idx: 0, //
    harvest: 0, //已经答对的题目计数
    question: {}, // 当前的题目
    questions: [], //当前关卡所有的题目
    correct: true, //答对了吗？
    question_idx: 0, //可来自option,自动递增更新
    question_count: 0, //从questions_idx开始，显示几道题目，可以通过options指定，默认等于app配置中的target_count
    //状态
    state: 0, //0-显示题面， 1-显示答案， 2-奖励和鼓励的动画（不在使用，1直接跳到3）, 3-闯关成功的画面, 4-闯关失败
    //屏幕
    height: 0,
    width: 0,
    user_answer: "",
    question_font_size: 0,
    answer_font_size: 0,
    favorite_idx: -1, //在globalData.favorites中的index，-1表示本题目未被收藏，否则表示收藏过
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var res = wx.getSystemInfoSync()
    console.log("[wx.getSystemInfoSync]", res)
    this.data.height = res.windowHeight
    this.data.width = res.windowWidth

    this.data.question_font_size = this.data.height / 8 * 1.6 //默认8个字
    this.data.answer_font_size = this.data.height / 8 * 1.6

    if (options.series_idx != null && options.series_idx != undefined) {
      this.data.series_idx = parseInt(options.series_idx)
    }

    if (options.round_idx != null && options.round_idx != undefined) {
      this.data.round_idx = parseInt(options.round_idx)
    }

    if (options.question_idx != null && options.question_idx != undefined) {
      this.data.question_idx = parseInt(options.question_idx)
    }

    this.data.app = Object.assign(this.data.app, getApp().globalData.app)

    if (options.question_count != null && options.question_count != undefined) {
      this.data.question_count = parseInt(options.question_count)
    } else {
      this.data.question_count = this.data.app.series[this.data.series_idx].rounds[this.data.round_idx].target_count
    }

    console.log(this.data)

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

  generateQuestion: function () {
    var source = this.data.app.series[this.data.series_idx].rounds[this.data.round_idx].question_source

    var that = this

    getApp().getCloud(function (cloud) {
      const db = cloud.database();

      if (source == "from_database_by_category") {
        if (that.data.questions.length == 0) { //第一次，去数据库取
          wx.showLoading({
            title: '正在加载...',
          })
          var question_series = that.data.app.series[that.data.series_idx].rounds[that.data.round_idx].question_series
          var question_name = that.data.app.series[that.data.series_idx].rounds[that.data.round_idx].name

          db.collection('questions').where({
            series: question_series,
            name: question_name
          }).get({
            success(res) {
              console.log("[db.questions.get]", question_series, question_name,  res)
              var data = res.data
              that.data.questions = Object.assign(that.data.questions, data)
              that.data.question = that.data.questions[that.data.question_idx]
              that.data.question_font_size = that.calculate_font_size(that.data.height, that.data.width,that.data.question.body.length)
              that.data.answer_font_size = that.calculate_font_size(that.data.height, that.data.width, that.data.question.answer.length)
              that.setData(that.data)
              console.log(that.data)
              console.log(that.data.question_font_size)
              wx.hideLoading({
                success: (res) => {},
              })
            },
            fail(res) {
              wx.hideLoading({
                success: (res) => {},
              })
              console.log("[db.questions.get]", id, res)
            }
          })
        } else {
          that.data.question = that.data.questions[that.data.question_idx]
          that.data.question_font_size = that.calculate_font_size(that.data.height, that.data.width,that.data.question.body.length)
          that.data.answer_font_size = that.calculate_font_size(that.data.height, that.data.width,that.data.question.answer.length)
          console.log(that.data.question_font_size)
          that.setData(that.data)
        }
      }

      if (source == "from_database") {
        wx.showLoading({
          title: '正在加载',
        })

        var id = that.data.app.series[that.data.series_idx].rounds[that.data.round_idx].question_ids[that.data.question_idx]

        db.collection('questions').where({
          _id: id,
        }).get({
          success(res) {
            console.log("[db.questions.get]", id, res)
            var data = res.data[0]
            that.data.question = Object.assign(that.data.question, data)
            that.setData(that.data)
            console.log(that.data)
            wx.hideLoading({
              success: (res) => {},
            })
          },
          fail(res) {
            wx.hideLoading({
              success: (res) => {},
            })
            console.log("[db.questions.get]", id, res)
          }
        })
      }
    })

  },

  onShowAnswer: function () {
    this.data.state = 1
    this.setData(this.data)
  },

  onResult: function (e) {
    var correct = e.currentTarget.dataset.correct == "true"
    this.onResult1(correct)
  },

  onResult1: function (correct) {
    this.data.correct = correct

    if (this.data.correct) {
      this.data.harvest = this.data.harvest + 1
      this.data.question_idx = this.data.question_idx + 1
    }

    if (this.data.harvest >= this.data.question_count) {
      this.data.state = 3
    } else {
      this.onNextQuestion()
    }

    this.setData(this.data)
  },

  onNextQuestion: function () {
    this.data.state = 0
    this.generateQuestion()
    this.updateIsFavorite()
    this.setData(this.data)
  },

  onNextLevel: function () {
    var series = getApp().globalData.app.series
    var nextRound = parseInt(this.data.round_idx) + 1
    if (getApp().globalData.unlocked[series[this.data.series_idx].name] < nextRound) {
      getApp().globalData.unlocked[series[this.data.series_idx].name] = nextRound
      wx.setStorageSync(getApp().cacheKey, getApp().globalData)
      console.log("**********", getApp().globalData)
    }

    wx.navigateBack({
      delta: 0,
    })
  },

  onReset: function () {
    this.data.harvest = 0
    this.data.state = 0
    this.updateIsFavorite()
    this.generateQuestion()
    this.setData(this.data)
  },

  // 55是上方bar的高度
  calculate_font_size: function (screen_height, screen_width, text_length) {
      var font_size = Math.sqrt(screen_width * (screen_height - 55) / (text_length * 2))
      return font_size;
  },

  updateIsFavorite: function () {
    this.data.favorite_idx = -1
    var favorites = getApp().globalData.favorites
    for (var index in favorites) {
      var favorite = favorites[index]
      if (favorite.series_idx == this.data.series_idx &&
        favorite.round_idx == this.data.round_idx &&
        favorite.question_idx == this.data.question_idx) {
        this.data.favorite_idx = index
      }
    }
  },

  addFavorite: function () {
    var favorite = {
      series_idx: this.data.series_idx,
      round_idx: this.data.round_idx,
      question_idx: this.data.question_idx,
    }

    var favorites = getApp().globalData.favorites
    favorites.push(favorite)

    wx.setStorageSync(getApp().cacheKey, getApp().globalData);

    this.data.favorite_idx = this.data.question_idx
    this.setData(this.data)
  },

  removeFavorite: function () {
    var favorites = getApp().globalData.favorites
    favorites.splice(this.data.favorite_idx, 1)
    wx.setStorageSync(getApp().cacheKey, getApp().globalData);

    this.data.favorite_idx = -1
    this.setData(this.data)
  }

})