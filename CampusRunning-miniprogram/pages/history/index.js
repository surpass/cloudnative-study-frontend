var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    query:{},
    dataLists:[],
    page: 1,
    pageSize: 10,
    total: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log("onLoad...")
   this.setData({
     query:options
   })
   console.log("onLoad.2..")
   this.getDataList()
   console.log("onLoad.4..")
  },

  getDataList(){
    var that = this;
    that.setData({
      isLoading:true
    })

    console.log("getDataList...")
    wx.showLoading({
      title: '数据加载中...',
    })
    console.log("getDataList.2..")
    var udata = wx.getStorageSync('udata')
    console.log("udata:"+ JSON.stringify(udata))
    var studentId = udata.studentId
    var cId = udata.cId
    var ccId = udata.ccId
    console.log("studentId:"+studentId+",cId:"+cId)
    var token = wx.getStorageSync('token')
    wx.request({
      url: `https://www.easyolap.cn/api/v1/location/getTrip`,
      method: 'GET',
      data: {
        _page: this.data.page,
        _limit: this.data.pageSize,
        "sid": studentId
      },      
      header: { 
        'content-type': 'application/json',
        'Authorization': 'Bearer '+ token,
      },
      success: (res)=>{
        console.log("res:"+ JSON.stringify(res))
        this.setData({
          dataLists: [...that.data.dataLists,...res.data.datas],
          total: res.data.total - 0
        })
      },
      fail: (err)=>{
        console.log(err)
      },
      complete: ()=>{
        wx.hideLoading({
          success: (res) => {},
        })
        that.setData({
          isLoading:false
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    wx.setNavigationBarTitle({
      title: '运动历史记录'
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    var that = this;
    console.log("监听用户下拉动作")
      // 1. 重置关键数据 
      that.setData({
        page:1,
        total :0,
        isloading : false,
        dataLists : []
      })
    // 2. 重新发起请求 并关闭下拉窗口
    that.getDataList(() => wx.stopPullDownRefresh()) 
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    var that = this;
    console.log("页面上拉触底事件的处理函数")
    // 判断是否还有下一页数据
    if (that.data.page * this.data.pageSize >= this.total) {
      console.log("没有数据了")
      wx.showLoading({
          title: '数据加载完毕！',
        })
        wx.hideLoading() // 关闭loading
        return 
    }
  // 判断是否正在请求其它数据，如果是，则不发起额外的请求
  	if(that.data.isLoading) return 
  	
  	var page = that.data.page;
    this.setData({
      page: page += 1// 让页码值自增 +1
    })
    that.getDataList()// 重新获取列表数据 
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})