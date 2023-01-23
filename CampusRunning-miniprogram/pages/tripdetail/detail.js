var app = getApp();
Page({

  /**
   * Page initial data
   */
  data: {
    query:{},
    tripId:"",
    polyline: [{ //路线
      points: [],
      color: "#7b7af8",
      width: 5,
      //borderWidth: 2,
      borderColor: '#7b7af8',
      level: 'abovebuildings',      //压盖关系
      arrowLine: true               //带箭头的线
    }], 
    positionArr: [],
    scale: 16,
    runDistance:0,
    runtime:0, //时长
    maxSpeed:0,
    avgeSpeed:0,
    markers: [],     // 记录轨迹起、终点坐标
    mapSettings: {               //统一设置地图配置
      skew: 0,                  //倾斜角度
      rotate: 0,                //旋转角度
      showScale: false,         //显示比例尺，工具暂不支持
      subKey: '',               //个性化地图使用的key
      layerStyle: 1,            //个性化地图配置的 style
      enableZoom: true,         //缩放
      enableScroll: true,       //拖动
      enableRotate: false,      //旋转
      showCompass: false,         //指南针
      enable3D: false,            //展示3D楼块(工具暂不支持）
      enableOverlooking: false,   //俯视
      enableSatellite: false,     //卫星图
      enableTraffic: false,       //实时路况
    }
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad(options) {
    var that = this;
    try{    
      var openId = app.globalData.userInfo.openId;
      if(openId!= '' && wx.getStorageSync('token') != ''){
        app.autoLoginByOpenId();
      }
      var longitude = options.lon;// 123.44168,
      var latitude = options.lat;//: 41.82465,
      var tripId = options.tripId;
      var query = options;
      console.log("=====options:"+ JSON.stringify(options))
      this.setData({
        query,
        longitude,
        latitude,
        tripId,
      })
      that.getTripDetail();
    }catch(e){
      console.log(e)
    }
  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady() {
    wx.setNavigationBarTitle({
      title: '运动轨迹'
    })
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
  getTripDetail(){
    var that = this;
    try{
      var token = wx.getStorageSync('token')
      //console.log("====token:"+token)
      //console.log("=====that.query:"+ JSON.stringify(that.data.query))
      var tripId = that.data.query.tripId;
      
      console.log("====tripId:"+tripId)
      wx.request({
        url: 'https://www.easyolap.cn/api/v1/location/getLocationByTid?tid='+tripId,
        method:"GET",
        header: { 
          'content-type': 'application/json',
          'Authorization': 'Bearer '+ token,
        }, 
        success: function(res) { 
          //console.log(res) 
          console.log("=====res.data:"+ JSON.stringify(res.data))
          var trip = res.data.trip;
          var location = res.data.locations;
          console.log("=====location:"+ JSON.stringify(location))
          var positionArr = that.data.positionArr;
          if(location != null){
            location.forEach(item => {
              positionArr.push({"longitude":item.lon,"latitude":item.lat,"speed":item.speed,"curTime":item.stime})
            });
          }          
          var runDistance = trip.distance;
          var runtime=trip.runTime;
          var maxSpeed=trip.maxSpeed;
          var avgeSpeed=trip.avgeSpeed;
          var markers = that.data.markers; 
          markers.push({"longitude":trip.flon,"latitude":trip.flat}) ;
          markers.push({"longitude":trip.tlon,"latitude":trip.tlat}) ;
          that.setData({
            markers,
            avgeSpeed,
            maxSpeed,
            runtime,
            runDistance,
            positionArr,
          })
          that.getPolyline();
        },
        fail: function(res){
          console.log("upload location fail...")
          console.log(res)
        }
      })  
    }catch(e){
      console.log(e)
    }
    
  },
  //活动轨迹渲染
  getPolyline() {
    var that = this;
    console.log("getPolyline start");
    try{    
    
      const polyline = that.data.polyline;
      const points = [];
      that.data.positionArr.forEach(item => {
        points.push({"longitude":item.longitude,"latitude":item.latitude,gpsBearing:244})
      })
      console.log("=====points:"+ JSON.stringify(points))
      polyline[0].points = points;
      that.setData({
        polyline,
      })
    }catch(e){
      console.log(e)
    }
    console.log("getPolyline end");
  }
})