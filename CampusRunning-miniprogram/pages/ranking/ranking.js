var app = getApp();
Page({

  /**
   * Page initial data
   */
  /**
   * 页面的初始数据
   */
  /**
   * 页面的初始数据
   */
  data: {
    date:'2010-10-10',
    type:['班级','院系','学校'],
    timeCycle:['天','周','月'],
    index:0,
    dataList: []
   },
   
   
   bindViewEvent:function(e){ 
     var that = this;  
      //app.process(this,e);
      console.log(e)
      var dindex = e.detail.value;
      console.log(dindex)
      that.setData({
        index:dindex,        
      })
      this.get_rank_list();
   },
   //绑定下拉框选择事件
   bindcolumnchange:function(data){ 
     console.log("bindcolumnchange:"+data)
 },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad(options) {
    app.checkSession();
    // var openId = wx.getStorageSync('openId') ;
    // if(openId!= '' && wx.getStorageSync('token') != ''){
    //   app.autoLoginByOpenId();
    // }
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
    if (!app.data.rankLoaded) {//未加载数据则加载
      this.get_rank_list();
    }
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
    wx.stopPullDownRefresh();
    this.get_rank_list();
  },

  get_rank_list: function(){
    var that = this;
    wx.showNavigationBarLoading();
    var udata = wx.getStorageSync('udata')
    var studentId = udata.studentId
    var cId = udata.cId
    var ccId = udata.ccId
    var token = wx.getStorageSync('token')
    console.log("rank:sid"+studentId);
    wx.request({
        url: 'https://www.easyolap.cn/api/v1/location/rank',
        data:{
          "type": "1",
          "timeCycle":"1",
          "ccid": ccId,
          "sid": studentId,
          "cid": cId
        },
        method: 'POST',
        header: { 
          'content-type': 'application/json',
          'Authorization': 'Bearer '+ token,
        }, 
        complete: function () {
            wx.hideNavigationBarLoading();
        },
        success: function (res) {
          console.log("rank res :"+JSON.stringify(res.data))
            that.setData({
                dataList: res.data.ranks
            });
            app.data.rankLoaded = true;//加载完成
        },
        fail: function (res) {
            app.showInfo(res.errMsg);
        }
    });
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
    return {
      title: '排行榜',
      desc: '点滴支持,是我继续坚持的动力',
      path: '/pages/ranking/ranking'
    }
  }
})