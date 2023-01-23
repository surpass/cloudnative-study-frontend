// app.js
//const component = require('../components/component.js');
//https://mp.weixin.qq.com/
App({

  /**
   * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
   */
  onLaunch: function () {
    var that = this;
    that.checkUpdateVersion();
    this.globalData = {
      //全局变量
    userInfo: {"id":1,"mobile":"","realName":"","openId":"","studentCode":"","isBindingMobile":0},
    phoneNumber: "",
    globalReqUrl: "https://www.easyolap.cn/api/v1/",        //请求数据时的URL
      "version": "1.0.0",
      "cacheFileDir": wx.env.USER_DATA_PATH + "/cacheFile",
      "isRelease": false,//可以网络控制 用于上架屏蔽某些页面不显示
      bannerUnitId: "adunit-1", //banner广告id
      videoUnitId: "adunit-2", //视频广告id
      adUnitId: "adunit-3" //激励广告id
    }
  },

  /**
   * 当小程序启动，或从后台进入前台显示，会触发 onShow
   */
  onShow: function (options) {
    
  },

  /**
   * 当小程序从前台进入后台，会触发 onHide
   */
  onHide: function () {
    
  },

  /**
   * 当小程序发生脚本错误，或者 api 调用失败时，会触发 onError 并带上错误信息
   */
  onError: function (msg) {
    
  },
  data:{
    rankLoaded:false
  },

  globalData: {
    //全局变量
    userInfo: {"id":1,"mobile":"","realName":"","openId":"","studentCode":"","isBindingMobile":0},
    phoneNumber: "",
    globalReqUrl: "https://www.easyolap.cn/api/v1/"         //请求数据时的URL
  },

  checkSession:function(){
    var that = this;
    var refreshToken = wx.getStorageSync("refreshToken");
    console.log("checkSession:"+refreshToken)
    if(refreshToken==""){
      that.autoLoginByOpenId();
      return ;
    }
    wx.request({
      url: 'https://www.easyolap.cn/api/v1/oauth/refreshToken?refreshToken='+refreshToken,
      method:"GET",
      header: { 
        'content-type': 'application/json'
      },    
      success: function (res) {
        console.log("refreshToken res:"+res.data)
        if (res.data.code == 200) {
          console.log("response data:"+ JSON.stringify(res.data))           
          let token = res.data.datas.access_token;
          let refreshToken = res.data.datas.refresh_token;          
          wx.setStorageSync('token', token)//由于进入小程序后所有的接口都需要用
          wx.setStorageSync('refreshToken', refreshToken)        
          console.log("checkSession success")           
        } else {
          console.log("checkSession faild")  
          that.autoLoginByOpenId();     
        }
      },
      fail(err) {
        setTimeout(() => {
          wx.showToast({
            title: '服务器繁忙，请重试',
            icon: 'error'
          })
        }, 1000)
      }
    })
  },

  autoLoginByOpenId:function(){
    var that = this;
    var openId = wx.getStorageSync("openId");
    console.log("app openId:"+openId)
    if(openId == ""){
      console.log("app openId is empty ,stop auto login")
      return;
    }
    wx.request({
      url: 'https://www.easyolap.cn/api/v1/wx/autoLoginwxByOpenid',
      method: 'Post',
      data: {
        openId: openId,
      },
      dataType: 'json',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log("login res code:"+res.data.code)
        if (res.data.code == 200) {
          console.log("udata:"+ JSON.stringify(res.data.udata))
          console.log("openId ===:"+res.data.openId)
          that.globalData.userInfo.mobile=res.data.udata.phone
          that.globalData.userInfo.studentCode =res.data.udata.studentId
          that.globalData.userInfo.openId=res.data.openId
          that.globalData.userInfo.isBindingMobile=1
          let token = res.data.udata.JwtToken.access_token;
          let refreshToken = res.data.udata.JwtToken.refresh_token;
          let udata = res.data.udata;                    
          wx.setStorageSync('token', token)//由于进入小程序后所有的接口都需要用
          wx.setStorageSync('refreshToken', refreshToken)
          wx.setStorageSync('udata', udata)
          console.log("auo login store success")           
        } else {
          console.log("auo login store faild")       
        }
      },
      fail(err) {
        setTimeout(() => {
          wx.showToast({
            title: '服务器繁忙，请重试',
            icon: 'error'
          })
        }, 1000)
      }
    })
  },
  /**
    * 检测当前的小程序
    * 是否是最新版本，是否需要下载、更新
    */

  checkUpdateVersion:function(){
      //判断微信版本是否 兼容小程序更新机制API的使用
      if (wx.canIUse('getUpdateManager')) {
        const updateManager = wx.getUpdateManager();
        //检测版本更新
        updateManager.onCheckForUpdate(function (res) {
          if (res.hasUpdate) {
            updateManager.onUpdateReady(function () {
              wx.showModal({
                title: '温馨提示',
                content: '检测到新版本，是否重启小程序？',
                showCancel: false,
                success: function (res) {
                  if (res.confirm) {
                    // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                    updateManager.applyUpdate()
                  }
                }
              })
            })
            updateManager.onUpdateFailed(function () {
              // 新版本下载失败
              wx.showModal({
                title: '已有新版本',
                content: '请您删除小程序，重新搜索进入',
              })
            })
          }
        })
      } else {
        wx.showModal({
          title: '溫馨提示',
          content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
        })
      }
    }
})

