// pages/agreement/agreement.js
Page({

  /**
   * Page initial data
   */
  data: {
    hidem:0,
    cb:0,
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad:function(e){
    console.log(wx.getStorageSync('agreement'));
    if(wx.getStorageSync('agreement') != ''){
      wx.navigateTo({
        url: '/pages/login/login',
      })
    }
  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady() {

  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow() {

  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide() {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload() {

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh() {

  },

  /**
   * Called when page reach bottom
   */
  onReachBottom() {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage() {

  },
  handleMove(e){
    //不做任何处理
    },
    qx:function(e){
      this.setData({
          hidem:1
      });
    },
    qx2:function(e){
      this.setData({
        hidem:1
      })
    },
    qr:function(e){
      let that = this;
      if(that.data.cb==0){
        wx.showToast({
          title: '请点击确认框',
          icon:'none'
        })
        return;
      }else{
          wx.setStorageSync('agreement',"yes");
          wx.navigateTo({
            url: '/pages/login/login',
          }) 
      }
    },
    cb:function(e){
      let that = this;
      if(that.data.cb==0){
        that.setData({
          cb:1
        })
      }else{
        that.setData({
          cb:0
        })
      }
    }
})