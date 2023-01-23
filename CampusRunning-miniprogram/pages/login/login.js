/*
*js页面
*/
var app = getApp();
Page({
  data:{
    mobile: '',
    studentCode:'',
    openid: '',
    realName: '',
    openid: '',
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    isHide: true
  },

  /**
   * 监听真实姓名的输入
   */
  inputRealName: function (e) {
    var realName = e.detail.value
    this.setData({
      realName: realName
    })
  },

  inputStudentCode: function (e) {
    var studentCode = e.detail.value
    this.setData({
      studentCode: studentCode
    })
  },
  /**
   * 监听手机号码的输入
   */
  inputMobile: function (e) {
    var mobile = e.detail.value
    this.setData({
      mobile: mobile
    })
  },
   login(e){
    var that = this
    wx.getUserProfile({
      desc: 'desc',
      success(res){
        console.log(res.userInfo) //用户的信息
        let UserInfo = res.userInfo
        wx.login({
          success(res){
            if (res.code) {
              //解密手机号
              //console.log(e)
              //console.log(e.detail.errMsg);//
              //console.log(e.detail.iv);//加密算法的初始向量
              //console.log(e.detail.encryptedData);//包括敏感数据在内的完整用户信息的加密数据

              //var msg = e.detail.errMsg;
               
              //var encryptedData=e.detail.encryptedData;
              //var iv=e.detail.iv;
              //if (msg == 'getPhoneNumber:ok') {//这里表示获取授权成功
              //  wx.checkSession({
              //   success:function(){
                        //这里进行请求服务端解密手机号
                    //that.deciyption(sessionID,encryptedData,iv);
              //    },
              //    fail:function(){
                    // that.userlogin()
              //    }
               // })
              //}else{
              //  console.log("getPhoneNumber: error"+msg);
              //}
              console.log("start send login ...")
              //发起网络请求
              wx.request({
                url: 'https://www.easyolap.cn/api/v1/wx/login',
                method: 'Post',
                data: {
                  code: res.code,
                  userInfo: UserInfo,
                  mobile: that.data.mobile,
                  studentCode: that.data.studentCode,
                  realName: that.data.realName,
                  //encryptedData:encryptedData,
                  //iv: iv,
                  userId: app.globalData.userInfo.id //传递用户id、根据id去绑定真实姓名和手机号
                },
                dataType: 'json',
                header: {
                  'content-type': 'application/json'
                },
                success: function (res) {
                  console.log("login res code:"+res.data.code)
                  if (res.data.code == 200) {
                    console.log("udata:"+ JSON.stringify(res.data.udata))
                    console.log("ErrorMsg:"+res.data.udata.errorMsg)
                    console.log("openId:"+res.data.openId)
                    app.globalData.userInfo = UserInfo;
                    app.globalData.userInfo.mobile=that.data.mobile
                    app.globalData.userInfo.realName=that.data.realName
                    app.globalData.userInfo.openId=res.data.openId
                    app.globalData.userInfo.isBindingMobile=1
                    let token = res.data.udata.JwtToken.access_token;
                    let refreshToken = res.data.udata.JwtToken.refresh_token;
                    let udata = res.data.udata;                    
                    wx.setStorageSync('token', token)//由于进入小程序后所有的接口都需要用
                    wx.setStorageSync('refreshToken', refreshToken)
                    wx.setStorageSync('udata', udata)
                    wx.setStorageSync('openId', res.data.openId)
                    console.log("login store success")
                    wx.showLoading({
                      title: '加载中',
                    })
                    setTimeout(()=>{
                      wx.hideLoading({
                        success: (res) => {
                          wx.showToast({
                            title: '登录成功',
                            duration: 1500,
                            icon: 'success',
                            success() {
                              setTimeout(() => {
                                wx.switchTab({
                                  //url: '登录成功后跳转的页面',
                                  url: '/pages/home/index',
                                })
                              }, 1000)
                            }
                          })
                        },
                      })
                    },500)
                  } else {
                    setTimeout(() => {
                      wx.showToast({
                        title: res.data.message,
                        icon: 'none'
                      })
                    }, 1000)
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
            }
          }
        })
      }
    })
  },
  isEmptyObj(obj) {
    return Object.getOwnPropertyNames(obj).length === 0
  },

  deciyption(sessionID,encryptedData,iv){
    var that = this;     
    console.log("根据秘钥解密手机号码sessionID：",sessionID);
    wx.request({
      url: 'https://www.easyolap.cn/api/v1/wx/getPhonenumber',
      data: {
        sessionID: sessionID,
        encryptedData:encryptedData,
        iv: iv
      },
      header: {'content-type': 'application/json'},
      success: function(res) {
        console.log("79",(res));
        if(res.code==200){ 
          console.log("line 79", JSON.parse(res.data));
          var json= JSON.parse(res.data);
          wx.setStorageSync('userphone', res.data.phoneNumber);
          console.log("步骤5解密成功",res.data.data);
          app.globalData.phoneNumber=wx.getStorageSync('userphone')  
        }        
      },fail:function(res){
          console.log("fail",res);
      }
    })
  },
  onLoad:function(e){
    var that = this;
    var openId = wx.getStorageSync("openId");
    console.log("openId:"+openId+" token:"+wx.getStorageSync('token'));
    if(openId != '' && wx.getStorageSync('token') != ''){
      app.autoLoginByOpenId();
      wx.switchTab({
        url: '/pages/home/index',//判断存储中有没有token,有的话跳过登录直接进入小程序
      })
      return ;
    }
    //获取用户信息，若存在则初始化填充页面中的姓名和手机号
    var userInfo = app.globalData.userInfo 
    console.log(userInfo)
    if(userInfo){
      this.setData({
        mobile:userInfo.mobile,
        realName:userInfo.realName,
        studentCode:userInfo.studentCode,
      })
    }
  },
  
})
