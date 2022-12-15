// index.js
const Auth = require('../../utils/auth')
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false
  },

  async onLoad() {
    // 校验是否已登陆
    const hasLogined = await Auth.checkHasLogined()
    if (!hasLogined) {
      const data = await Auth.login()
      this.setData({
        userInfo: data.userInfo,
        hasUserInfo: true
      })
    } else {
      this.setData({
        userInfo: JSON.parse(wx.getStorageSync('userInfo')),
        hasUserInfo: true
      })
    }
  },
  // 事件处理函数
  async bindViewTap() {
    const data = await Auth.register()
    this.setData({
      userInfo: data.userInfo,
      hasUserInfo: true
    })
  }
})
