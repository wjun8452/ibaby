App({
  globalData:{
    app: {},
    env: 'cloud1-8g13piij1a7c00df',
    cacheKey: "key0",
    unlocked: {},
    baiduyuyin:{
      apiKey: 'ZHtXgTH1V9rtg1wC6y9u6F99',
      secretKey: 'FtyFZ798AFfmuCdU1YOpVlGdIS3ubVv5',
      url: 'https://openapi.baidu.com/oauth/2.0/token',
      baiduAccessToken: '',
      baiduTime: null
    }
  },
  
  onLaunch: function () {
    var saved = wx.getStorageSync(this.globalData.cacheKey)
    this.globalData = Object.assign(this.globalData, saved)
    console.log("global data", this.globalData)
    //初始化云
    if (wx.cloud) {
      wx.cloud.init({
        env: this.globalData.env,
        traceUser: true
      })
    } else {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
      wx.showToast({
        title: '云初始化失败，可能您的微信基础库版本太低哦',
      })
    }

    //
    // this.initBaiduYuyinAccessToken();
  },

  //初始化语音识别 baiduAccessToken
  initBaiduYuyinAccessToken: function () {
    var baiduAccessToken = this.globalData.baiduyuyin.baiduAccessToken
    if (baiduAccessToken == undefined || baiduAccessToken == '') {
      this.getBaiduYuyinAccessToken()
    } else {
      var baiduTime = this.globalData.baiduyuyin.baiduTime
      var timeNum = new Date(parseInt(new Date().getTime() - baiduTime) * 1000).getDay()
      if (timeNum > 28) {
        this.getBaiduAccessToken();
      }
    }
  },

  getBaiduYuyinAccessToken: function () {
    var that = this;
    var baiduyuyin = that.globalData.baiduyuyin;
    wx.request({
      url: baiduyuyin.url,
      data: {
        grant_type: 'client_credentials',
        client_id: baiduyuyin.apiKey,
        client_secret: baiduyuyin.secretKey
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        console.log(res)
        that.globalData.baiduyuyin.baiduTime = new Date().getTime()
        that.globalData.baiduyuyin.baiduAccessToken = res.data.access_token
        wx.setStorageSync(that.globalData.cacheKey, that.globalData);
        console.log(that.globalData);
      }
    })
  },
})