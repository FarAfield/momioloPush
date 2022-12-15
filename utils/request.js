const prefix = 'http://localhost:7001'
const timeout = 60000 // 超时时间60s

// 封装wx.request为promise写法
const request = options => {
  const { url, method, data, showLoading = false, showError = true, success, fail, complete } = options
  const token = wx.getStorageSync('token')
  return new Promise((resolve, reject) => {
    if (showLoading) {
      wx.showLoading({
        title: ''
      })
    }
    wx.request({
      url: prefix + url,
      method,
      data,
      timeout,
      header: {
        Authorization: token
      },
      success: ({ data: res }) => {
        if (res.statusCode === '0') {
          success?.(res.data)
          return resolve(res.data)
        } else {
          if (showError) {
            wx.showToast({
              title: '哎呀，出错啦！',
              icon: 'error',
              duration: 2000
            })
          }
          fail?.()
          return reject()
        }
      },
      fail: () => {
        wx.showToast({
          title: '服务器开小差啦！',
          icon: 'error',
          duration: 2000
        })
        fail?.()
        return reject()
      },
      complete: () => {
        complete?.()
        if (showLoading) {
          wx.hideLoading()
        }
      }
    })
  })
}

module.exports = request
