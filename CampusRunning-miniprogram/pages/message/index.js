var app = getApp();
Page({

  data: {
		showIndex: 0,
		dataList: [1, 2, 3, 4, 5]
	},
	/**
	 * 列表数据点击时
	 */
	listDataClick(e) {
		if (e.currentTarget.dataset.index != this.data.showIndex) {
			this.setData({
				showIndex: e.currentTarget.dataset.index
			})
		} else {
			this.setData({
				showIndex: 0
			})
		}
	},
/**
   * Lifecycle function--Called when page load
   */
  onLoad(options) {
    var openId = wx.getStorageSync('openId');
    if(openId!= '' && wx.getStorageSync('token') != ''){
      app.autoLoginByOpenId();
    }
  },


})
