// pages/home/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 轮播图版数据
    swiperList:[],
    //九宫格数据
    gridList:{}

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {    
    this.getSwiperList();
    this.getGridListData();
  },

  getSwiperList(){
    wx.request({
      url: 'https://www.easyolap.cn/api/v1/data/slides',
      method:"GET",
      success:(res)=>{
        console.log(res)
        this.setData({
          swiperList: res.data
        })
      }
    })
  },
//获取九宫格数据
  getGridListData(){
      wx.request({
        url: 'https://www.easyolap.cn/api/v1/data/categories',
        method:"GET",
        success:(res)=>{
          console.log(res)
          this.setData({
            gridList: res.data
          })
        }
      })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})