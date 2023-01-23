var app = getApp();
var userInfo = app.globalData.userInfo;
console.log("=========="+ JSON.stringify(userInfo));
Page({
   
  data: {
    piece: [{
        name: "我的信息",
        url: "./detail/deliver/deliver"
      },
      {
        name: "简历上传",
        url: "./detail/uploadDoc/uploadDoc"
      },
      {
        name: "发布信息",
        url: "./detail/pub/pub"
      },
      {
        name: "我的投递",
        url: "./detail/myPub/myPub"
      },
      {
        name: "联系我们",
        url: "./detail/contact/contact"
      }
    ],
    during: 0,
    userInfo: {
      realName: userInfo.nickName,
      avatarUrl: userInfo.avatarUrl,
    },
    show: true
  },
  logout(){     
      wx.removeStorage({
        key: 'token',
      })
      wx.removeStorage({
        key: 'udata',
      })
      wx.removeStorage({
        key: 'agreement',
      })
      wx.showLoading({
        title: '加载中',
      })
      setTimeout(()=>{
        wx.hideLoading({
          success: (res) => {
            wx.showToast({
              title: '登出成功',
              duration: 1500,
              icon: 'success',
              success() {
                setTimeout(() => {
                  wx.navigateTo({
                    url: '/pages/login/login',
                  })
                }, 1000)
              }
            })
          },
        })
      },500)      
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    var that = this;
    console.log("监听用户下拉动作")
      // 1. 重置关键数据 
      that.setData({
        userInfo,
      }) 
  },


  onLoad(){
    var that = this;
    console.log("==========onLoad===========")
    this.setData({
      userInfo,
    })
    if(wx.getStorageSync('token') == ''){
      wx.switchTab({
        url: '/pages/login/login',
      })
      return;
    }
  }
})
