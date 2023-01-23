var app = getApp();

Page({
  
  /**
   * 页面的初始数据
   */
  data: {
    longitude: 123.44168,
    latitude: 41.82465,
    lastPoi:{},
    startAdd:"",
    endAdd:"",
    speed: 0,
    runDistance:0,
    runtime:0, //时长
    startTimestamp:0,//开始时间
    endTimestamp:0,//结束时间
    maxSpeed:0,
    avgeSpeed:0,
    // 地图缩放等级
    scale: 16,
    // 路径数据
    //polyline: [],
    polyline: [{ //路线
      points: [],
      color: "#7b7af8",
      width: 5,
      //borderWidth: 2,
      borderColor: '#7b7af8',
      level: 'abovebuildings',      //压盖关系
      arrowLine: true               //带箭头的线
    }], 
    markers: [],     // 记录轨迹起、终点坐标
    startPoi: null,
    endPoi: null,
    positionArr: [],
    timer:null,
    time:0,
    timeStr:'0秒',
    startHidden:true,
    endHidden:true,
    userGPS: false,
    tripData: "",
    datakey:"a",
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
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {    
    var that = this
    var openId = app.globalData.userInfo.openId;
    if(openId!= '' && wx.getStorageSync('token') != ''){
      app.autoLoginByOpenId();
    }
    wx.getLocation({
      type:'gcj02',
      isHighAccuracy: true,//开启高精度定位
      success:res=>{
          console.log(res)
          var startHidden = false;
          var longitude = res.longitude;
          var  latitude = res.latitude;
          var  speed = res.speed; // m/s
          var  startPoi = res;
          this.setData({
            longitude,
            latitude,
            speed,
            startPoi,
            startHidden,
          })
          this.setMaxSpeed(res.speed)
          this.addMark(res)
          wx.showToast({
            title: '开始获取位置',
            icon: 'none',
            duration: 1500
          })
      }
    });
    wx.enableAlertBeforeUnload({
      message: "退出跑步？",
      success: function (res) {
          console.log("成功：", res);
          that.endTrip();
          wx.disableAlertBeforeUnload();
      },
      fail: function (err) {
          console.log("失败：", err);
      },
  });
  },

  drawLine(req){
    this.setData({
       polyline : [{
          points : this.data.positionArr,
           color : '#99FF00',
           width : 4,
           dottedLine : false
       }]
    });
  },
  fushTime(){
    console.log("fush time info:"+this.data.time)
    this.setData({
      time : this.data.time + 10*1000,
      timeStr: this.data.time/1000 +'秒'
    })
  },

  getCurLocation(){
    var currentTime =  new Date().getTime()
    wx.getLocation({
      type:'gcj02',
      isHighAccuracy: true,//开启高精度定位
      success:res=>{
        console.log(res)
        this.setData({
         longitude: res.longitude,
         latitude: res.latitude,
         speed: res.speed,
        //  if(speed > maxSpeed){
        //   maxSpeed: speed 
        //  }     
        })
        this.data.positionArr.push({"lon":res.longitude,"lat":res.latitude,"speed":res.speed,"curTime:":currentTime})
        this.uploadData(res)
        wx.showToast({
          title: '定时获取位置'+res.speed+"lon:"+res.longitude,
          icon: 'none',
          duration: 1500
        })
      },
      fail:res=>{
        console.log('fush location fail...')
        console.log(res)
      }
     
    })
  },
  //活动轨迹渲染
  getPolyline() {
    console.log("getPolyline start");
    try{    
      var that = this;
      const polyline = that.data.polyline;
      const points = [];//polyline[0].points;
      that.data.positionArr.forEach(item => {
        points.push({"longitude":item.longitude,"latitude":item.latitude,gpsBearing:244})
      })   
      polyline[0].points = points;
      that.setData({
        polyline,
      })
    }catch(e){
      console.log(e)
    }
    console.log("getPolyline end");
  },
  uploadData(res){
    console.log("=================lon:"+res.longitude+",lat:"+res.latitude)
    var currentTime =  new Date().getTime();
    var lon = res.longitude
    var lat = res.latitude
    var speed = res.speed
    var tripId = this.data.tripData
    var token = wx.getStorageSync('token')
    console.log("=======2=====tripId:"+tripId+"=====lon:"+lon+",lat:"+lat)   
    wx.request({
      url: 'https://www.easyolap.cn/api/v1/location',
      method:"POST",
      data: {
        tid: tripId,
        stime: parseInt(currentTime/1000),
        lon: lon, 
        lat: lat,
        speed: speed
      }, 
      header: { 
        'content-type': 'application/json',
        'Authorization': 'Bearer '+ token,
      }, 
      success: function(res) { 
        console.log(res) 
      },
      fail: function(res){
        console.log("upload location fail...")
        console.log(res)
      }
    })  
  },
  startTrip1(){
    var _that = this
    var lon = ""
    var lat = ""
    wx.getLocation({
      type:'gcj02',
      isHighAccuracy: true,//开启高精度定位
      success:res=>{
        lon = res.longitude
        lat = res.latitude
        var longitude = _that.data.longitude;
        var latitude = _that.data.latitude;
        latitude = lat;
        longitude =  lat;
        var startTimestamp = new Date().getTime();
        _that.setData({
          latitude,
          longitude,
          startTimestamp,
        })
        _that.initData();
        console.log("开始位置收集")
        _that.mapWeizhi();
      },
      fail:res=>{
        console.log('start trip location fail...')
        console.log(res)
        lon = this.data.longitude+""
        lat = this.data.latitude+""
      }
     
    })   
  },


  startTrip(){
    var _that = this
    var lat = _that.data.latitude;
    var lon = _that.data.longitude;
    var markers = _that.data.markers;
    markers[0].latitude = lat
    markers[0].longitude = lon
    _that.reportStartTrip(lon,lat,_that)
    var points={};
    var polyline = _that.data.polyline;
    polyline.points = points;
    var startTimestamp = new Date().getTime();
    _that.setData({      
      markers,
      polyline,
      startTimestamp,
    })
    console.log("开始位置收集")
    _that.initData();

  },

  reportStartTrip(lon,lat,_that){
    console.log("====reportStartTrip=====startTrip========lon:"+lon+",lat:"+lat)
    var currentTime =  new Date().getTime();
    var udata = wx.getStorageSync('udata')
    var tId = udata.tId
    var studentId = udata.studentId
    var cId = udata.cId;
    var ccId = udata.ccId;
    console.log("tId:"+tId+",studentId:"+studentId+",cId"+cId+"ccId:"+ccId)
    var token = wx.getStorageSync('token')

    wx.request({
      url: 'https://www.easyolap.cn/api/v1/location/trip',
      method:"POST",
      data: {
        tid: tId,
        sid: studentId,
        ccid: ccId,//班级id
        cid: cId,
        flon: lon+"", 
        flat: lat+"",
        fromDate: parseInt(currentTime/1000)  //时间戳，秒
      }, 
      header: { 
        'content-type': 'application/json',
        'Authorization': 'Bearer '+ token,
      }, 
      success: function(result) { 
        console.log("create trip success...")
        console.log(result)
        console.log(result.data)
        console.log(result.data.id)
        _that.setData({
          tripData:result.data.id,
          datakey:result.data.dkey
        });
        _that.mapWeizhi();    
        console.log("create trip success end..."+_that.data.tripData)
      },
      fail: function(result){
        console.log("create trip fail...")
        console.log(result)
      }
    })  
  },

  endTrip(){
    var _that = this
    var lon = ""
    var lat = ""
    var tripId = this.data.tripData
    console.log("==2=end trip tripId:======="+tripId)
    wx.getLocation({
      type:'gcj02',
      isHighAccuracy: true,//开启高精度定位
      success:res=>{
        lon = res.longitude+""
        lat = res.latitude+""
        console.log("==3=end trip tripId:======="+tripId)      
        _that.reportEndTrip(lon,lat,tripId,_that)
        var endPoi = res;
        _that.setData({
          endPoi,
        })
      },
      fail:res=>{
        console.log('end trip location fail...') 
      }     
    })  
  },

  reportEndTrip(lon,lat,tripId,_that){
    console.log("=========endTrip========lon:"+lon+",lat:"+lat+"tripId:"+tripId)
    var currentTime =  new Date().getTime();
    var udata = wx.getStorageSync('udata')
    var tId = udata.tId
    var studentId = udata.studentId
    var cId = udata.cId
    var ccId = udata.ccId
    var token = wx.getStorageSync('token')
    var uid = wx.getStorageSync('uid')
    wx.request({
      url: 'https://www.easyolap.cn/api/v1/location/closetrip',
      method:"POST",
      data: {
        id: tripId,
        sid: studentId,
        ccid: ccId,
        cid: cId,
        tlon: lon+"", 
        tlat: lat+"",
        thruDate: parseInt(currentTime/1000),
        distance: _that.data.runDistance,
        runtime: _that.data.runtime,
        avgeSpeed: _that.data.avgeSpeed,
        maxSpeed: _that.data.maxSpeed,
      }, 
      header: { 
        'content-type': 'application/json',
        'Authorization': 'Bearer '+ token,
      }, 
      success: function(result) { 
        console.log(result)
        _that.setData({
          //tripData.tripId: result.id
        })
      },
      fail: function(result){
        console.log("end trip fail...")
        console.log(result)
      }
    }) 
  },

  start(res){
    this.startTrip()
    var _this = this;     
    this.setData({
         startHidden:true,
         endHidden:false,       
    })
  },
  end(res) {
    var that = this;
    console.log("stop sport")
    clearInterval(that.timer)
    this.endTrip()
    this.setData({
      startHidden:false,
      endHidden:true,
    })
  },

  addMark(res){
    var marker=[]
    marker.push({
      id:1, //标记点 id
      width:50,
      longitude: res.longitude,
      latitude: res.latitude,
      label:{
        content:'我的位置',
        color:'#f00',
        fontSize:20
      },
      callout:{
        content:'气泡',
        color:"#f00",
        fontSize:30
      },
      //iconPath:'/images/map/center.png'
    })
    this.setData({
      markers:marker
    })
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    var that = this;
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    var that = this; 
    wx.startLocationUpdateBackground({
      success(res) {
        console.log('开启后台定位', res);
      },
      fail(res) {
        console.log('开启后台定位失败', res);
        //授权失败后引导用户打开定位信息
        wx.getSetting({
          success: function (res) {
            var statu = res.authSetting;
            console.log(statu)
            if (!statu["scope.userLocationBackground"]) {
              wx.showModal({
                title: "是否授权使用期间和离开后！",
                content: "需要获取您的地理位置，请确认授权，否则地图功能将无法使用",
                success: function (tip) {
                  if (tip.confirm) {
                    wx.openSetting({
                      success: function (data) {
                        if (data.authSetting["scope.userLocationBackground"] === true) {
 
                        }
                      }
                    });
                  } else {
                    //console.log('用户拒绝打开设置界面')
                  }
                }
              });
            }
          }
        });
 
      }
    });
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {
    var that = this;
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '是否退出跑步？',
      success: function(res) {
        if (res.confirm) {
         that.endTrip();
         clearInterval(that.timer)
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    var that = this;
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    var that = this;
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
    var that = this;
  },
  // 获取本机设备的GPS信息
  getDeviceGPS() {
    let system = wx.getSystemInfoSync();
    //如果设备的GPS未开启，locationEnabled这里会返回false，以此判断
    if (system.locationEnabled == false) {
      //GPS未开启，返回false
      this.userGPS = false
      return wx.showModal({
        content: '请在系统设置中开启GPS定位权限',
        showCancel: false,
        confirmText: '确认',
        success: (res) => {
            console('res:',res)
        },
      })
    } else {
      //已开启，返回true
      this.userGPS = true
    }
  },
  //监听地理位置变化
  mapWeizhi: function () {
    console.log("=======mapWeizhi===1====")
    var that = this;
    const _locationChangeFn = function (res) {
      try{    
          console.log("=======mapWeizhi====2==="+res)
          var markers = that.data.markers;
          var longitude = res.longitude;
          var latitude = res.latitude;
          var speed = res.speed;
          markers[1] = {longitude:longitude,latitude:latitude};
          var currentTime =  new Date().getTime();
          var positionArr = that.data.positionArr;
          positionArr.push({"longitude":res.longitude,"latitude":res.latitude,"speed":res.speed,"curTime:":currentTime})
          that.setData({
            markers,
            positionArr,
            longitude,
            latitude,
            speed,
          })
          that.setMaxSpeed(res.speed)
          //that.calculationDistance();
          wx.offLocationChange(_locationChangeFn)
          that.uploadData(res)
          that.updateLastPoi()
        }catch(err){
          console.log("位置一fun error"+err.message)
        }
      that.mapWeizhi2()
    }
    console.log("=======mapWeizhi====11===")
    wx.onLocationChange(_locationChangeFn)
    console.log("=======mapWeizhi====111===")
  },
 
 
  //监听地理位置变化
  mapWeizhi2: function () {
    console.log("=======mapWeizhi2===1====")
    var that = this;
    //定时执行
    that.timer = setInterval(function () { //这里把setInterval赋值给变量名为timer的变量
      const _locationChangeFn = function (res) {
        console.log("=======mapWeizhi2===2===="+res)
        //const { latitude, longitude } = res
        console.log("更新位置")
        wx.showToast({
          title: '定时获取位置'+res.speed+"lon:"+res.longitude+"lat:"+res.latitude,
          icon: 'none',
          duration: 1500
        })      
        var markers = that.data.markers;
        const longitude = res.longitude;
        const latitude = res.latitude;
        markers[1].latitude = res.latitude;
        markers[1].longitude = res.longitude;
        var currentTime =  new Date().getTime();
        var positionArr = that.data.positionArr;
        positionArr.push({"longitude":res.longitude,"latitude":res.latitude,"speed":res.speed,"curTime:":currentTime})
        var endTimestamp = new Date().getTime();
        var startTimestamp = that.data.startTimestamp;
        var runtime = endTimestamp - startTimestamp;
        that.setData({
          markers,
          positionArr,
          longitude: res.longitude,
          latitude: res.latitude,
          speed: res.speed,
          endTimestamp,
          runtime,
        })
        that.setMaxSpeed(res.speed)
        that.calculationDistance();
        wx.offLocationChange(_locationChangeFn)
        that.getPolyline()
        that.uploadData(res)
        that.updateLastPoi()
      }
      console.log("=======mapWeizhi2===11====")
      wx.onLocationChange(_locationChangeFn)
      console.log("=======mapWeizhi2===111====")
    }, 10000)
  },

  // 计算距离函数
  Rad(d) { 
    // console.log(d,'这里是D');
    //根据经纬度判断距离
    return d * Math.PI / 180.0;
  },
  getLocation(weidu1, jingdu1, weidu2, jingdu2) {
    var that = this;
    console.log(weidu1, jingdu1 ,'我是当前定位', weidu2, jingdu2,'我是目标的');
      // weidu1当前的纬度
      // jingdu1当前的经度
      // weidu2目标的纬度
      // jingdu2目标的经度
      var radweidu1 = that.Rad(weidu1);
      var radweidu2 = that.Rad(weidu2);
      var a = radweidu1 - radweidu2;
      // console.log(a);
      var b = that.Rad(jingdu1) - that.Rad(jingdu2);
      // console.log(b);
      var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radweidu1) * Math.cos(radweidu2) * Math.pow(Math.sin(b / 2), 2)));
      // console.log(s);
      s = s * 6378.137;
      s = Math.round(s * 10000) / 10000 *1000;
      //s = s.toFixed(1) //+ 'm' //保留两位小数
      console.log('经纬度计算的距离:' + s)
      return s
  },
  // 方法定义 lat,lng 
  GetDistance( lat1,  lng1,  lat2,  lng2){
    var radLat1 = lat1*Math.PI / 180.0;
    var radLat2 = lat2*Math.PI / 180.0;
    var a = radLat1 - radLat2;
    var  b = lng1*Math.PI / 180.0 - lng2*Math.PI / 180.0;
    var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a/2),2) +
    Math.cos(radLat1)*Math.cos(radLat2)*Math.pow(Math.sin(b/2),2)));
    s = s *6378.137 ;// EARTH_RADIUS;
    s = Math.round(s * 10000) / 10000;
    return s;
  },
  //计算两点之家的距离
  calculationDistance: function (e) {
    var that = this;
    try{
      var markers = that.data.markers;
      var lastPoi = that.data.lastPoi;
      var destance = that.getLocation(lastPoi.latitude, lastPoi.longitude, that.data.latitude,that.data.longitude);
      var sumDestance = that.data.runDistance;
      var runDistance = sumDestance + destance;
      that.setData({
        runDistance,
      })
    }catch(err){
      console.log("calculationDistance 错误信息：" + err.message);
    }
  },
  
  setMaxSpeed:function(speed){
    var that = this;
    try{    
        var maxSpeed = that.data.maxSpeed;
        maxSpeed = maxSpeed>speed?maxSpeed:speed;
        var distance = that.data.distance;
        var runtime = that.data.runtime;
        var avgeSpeed = that.data.avgeSpeed;
        if(runtime>0){
          avgeSpeed = distance/runtime;  // M/秒
        }
        that.setData({
          maxSpeed, // m/s
          avgeSpeed,
        })
    }catch(err){
      console.log("max speed 错误信息：" + err.message);
    }
  },
  
  updateLastPoi: function (e) {
    var that = this;
    try{
      var lat = that.data.latitude;
      var lon = that.data.longitude
      var lastPoi = that.data.lastPoi;
      lastPoi = {"latitude":lat,"longitude":lon};
      that.setData({
        lastPoi,
      })
    }catch(err){
      console.log("updateLastPoi 错误信息：" + err.message);
    }
  },
  initData: function (e) {
    var that = this;
    try{
      var lat = that.data.latitude;
      var lon = that.data.longitude
      var lastPoi = that.data.lastPoi;
      lastPoi = {};
      var markers = _that.data.markers;
      markers[0].latitude = that.data.latitude;
      markers[0].longitude = that.data.longitude;
      var points = {};
      var polyline = _that.data.polyline;
      polyline.points = points;
      that.setData({
          startPoi:res,
          markers,
          polyline, 
          lastPoi,
          startAdd:"",
          endAdd:"",
          speed: 0,
          runDistance:0,
          runtime:0, //时长
          startTimestamp:0,//开始时间
          endTimestamp:0,//结束时间
          maxSpeed:0,
          avgeSpeed:0,      
          startPoi: null,
          endPoi: null,
          positionArr: [],
          timer:null,
          time:0,
          timeStr:'0秒',
          startHidden:true,
          endHidden:true,
          userGPS: false,
          tripData: "",
          datakey:"",
      })
    }catch(err){
      console.log("updateLastPoi 错误信息：" + err.message);
    }
  }
})