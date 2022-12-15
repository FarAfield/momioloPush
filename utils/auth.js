const Request = require('./request')
// 检查微信登录态是否过期
async function checkSession() {
  return new Promise(resolve => {
    wx.checkSession({
      success() {
        return resolve(true)
      },
      fail() {
        return resolve(false)
      }
    })
  })
}

// 检查是否登录（1.自定义登录态是否存在2.微信登录态是否过期3.自定义登录态是否合法）
async function checkHasLogined() {
  const token = wx.getStorageSync('token')
  if (!token) {
    return false
  }
  const logined = await checkSession()
  if (!logined) {
    wx.removeStorageSync('token')
    return false
  }
  const { isValid } = await Request({
    url: '/user/checkToken',
    method: 'POST',
    data: {
      token
    }
  })
  if (!isValid) {
    wx.removeStorageSync('token')
    return false
  }
  return true
}

// 注册
async function register() {
  return new Promise(resolve => {
    // 授权获取用户信息
    wx.getUserProfile({
      desc: '完善信息',
      success: function (res) {
        const rawData = res.rawData
        const signature = res.signature
        const encryptedData = res.encryptedData
        const iv = res.iv
        const userInfo = res.userInfo
        Request({
          url: '/user/register',
          method: 'POST',
          data: {
            rawData,
            signature,
            encryptedData,
            iv,
            userInfo
          },
          success: data => {
            // 注册成功,保存token以及用户信息
            wx.setStorageSync('token', data.token)
            wx.setStorageSync('userInfo', JSON.stringify(userInfo))
            resolve(data)
          }
        })
      }
    })
  })
}

// 登陆(首次打开小程序、登陆失效时需要调用)
async function login() {
  return new Promise(resolve => {
    wx.login({
      success: function (res) {
        Request({
          url: '/user/login',
          method: 'POST',
          data: {
            code: res.code
          },
          success: data => {
            //存取token以及用户信息
            wx.setStorageSync('token', data.token)
            wx.setStorageSync('userInfo', JSON.stringify(data.userInfo))
            resolve(data)
          }
        })
      }
    })
  })
}

module.exports = {
  checkHasLogined,
  login,
  register
}
