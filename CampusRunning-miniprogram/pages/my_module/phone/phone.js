Page({
  data: {
    isRelease: true,
    list: [{
      id: "view",
      name: "紧急电话",
      open: !1,
      subName: ["火警", "盗警", "急救", "报时", "电力抢修", "管道液化气抢修", "市话障碍", "交通事故", "天气预报", "号码查询", "自来水抢修"],
      phone: ["119", "110", "120", "117", "95598", "87221599", "112", "122", "121", "114", "87011670"]
    }, {
      id: "form",
      name: "银行电话",
      open: !1,
      subName: ["工商银行", "建设银行", "农业银行", "中国银行", "交通银行", "浦发银行", "民生银行", "兴业银行", "中信银行", "深圳发展银行", "华夏银行", "招商银行", "广发银行", "广东农信", "光大银行"],
      phone: ["95588", "95533", "95599", "95566", "95559", "95528", "95568", "95561", "95558", "95501", "95577", "95555", "95508", "96138", "95595"]
    }, {
      id: "feedback",
      name: "快递电话",
      open: !1,
      subName: ["申通快递", "EMS", "顺丰速运", "圆通速递", "中通速递", "韵达快运", "百世快递", "天天快递", "德邦快递", "速尔快递", "中铁快运", "UPS"],
      phone: ["95543", "11183", "95338", "95554", "95311", "95546", "95320", "4001888888", "95353", "4008822168", "95572", "4008208388"]
    }, {
      id: "baoxian",
      name: "保险电话",
      open: !1,
      subName: ["中国人保", "中国人寿", "中国平安", "太平洋保险", "泰康人寿", "新华人寿"],
      phone: ["95518", "95519", "95511", "95500", "95522", "95567"]
    }, {
      id: "nav",
      name: "通讯客服",
      open: !1,
      subName: ["中国移动", "中国联通", "中国电信", "中国网通", "中国铁通", "中国邮政"],
      phone: ["10086", "10010", "10000", "10060", "10050", "11185"]
    }, {
      id: "media",
      name: "投诉举报",
      open: !1,
      subName: ["消费者投诉热线", "价格投诉热线", "质量投诉", "环保投诉", "税务投诉", "公共卫生监督", "电信投诉", "市长热线", "法律援助", "妇女维权", "民工维权"],
      phone: ["12315", "12358", "12365", "12369", "12366", "12320", "12300", "12366", "12351", "12338", "12333"]
    }, {
      id: "map",
      name: "铁路航空",
      subName: ["铁路", "国航", "海航", "南航", "东航", "深航", "厦航", "山航"],
      phone: ["12306", "4008100999", "950718", "4006695539", "95530", "4008895080", "95557", "4006096777"]
    }, {
      id: "canvas",
      name: "售后服务",
      subName: ["苹果", "诺基亚", "三星", "联想", "戴尔", "索尼", "飞利浦", "松下", "东芝", "TCL"],
      phone: ["4006272273", "4008800123", "8008108888", "8008580888", "8008209000", "8008201201", "8008100781", "8008108208", "4008123456", "400-812-3456"]
    }, {
      id: "canvas1",
      name: "其他常用电话",
      subName: ["工资拖欠举报电话", "经济犯罪举报中心", "打拐买举报电话", "土地矿产法律热线", "水利工程建设举报", "扫黄打非举报电话", "农业安全生产事故", "消费者申诉举报电话", "税务违法举报"],
      phone: ["010-68304532", "010-65204333", "010-84039250", "16829999", "010-63205050", "010-65254722", "010-64192512", "12315", "010-63417425"]
    }]
  },
  onLoad(){
    this.setData({
      isRelease: getApp().globalData.isRelease
    })
  },
  widgetsToggle: function (e) {
    for (var n = e.currentTarget.id, a = this.data.list, o = 0, p = a.length; o < p; ++o) a[o].id == n ? a[o].open = !a[o].open : a[o].open = !1;
    this.setData({
      list: a
    });
  },
  callPhone: function (e) {
    wx.makePhoneCall({
      phoneNumber: e.target.dataset.phone
    });
  },
  onShareAppMessage: function () {
    return {
      title: "常用电话大全",
      path: "/pages/my_module/phone/phone"
    };
  },
  onShareTimeline: function (e) {
    return {
      title: "常用电话大全",
      path: "/pages/my_module/phone/phone"
    };
  }
});