//component.js
const select = require('../components/select.js');
const upload = require('../components/upload.js');
 
class component{
 
 constructor(com, that) {
 
  this.com = com;
  this.that = that;
 }
 
 //绑定下拉框选择事件
 bindSelect(data){
 
  let self = this;
 
  let mode = data.currentTarget.dataset.mode;
 
  let name = data.currentTarget.dataset.name;
 
  let picker = new select({
   that: self.that,
   mode: mode,
   name: name
  });
 
  picker.change(data.detail.value);
 }
 
 //点击事件，传递参数为e.currentTarget.dataset
 bindImageChoose(data){
 
  //图片上传
  this.uploader = new upload({
   that: that,
   name: data.name,
   mode: data.mode,
   count: data.count || 9
  });
 
  this.uploader.choose();
 }
 
 bindImageDel(data){
 
  //图片上传
  this.uploader = new upload({
   that: that,
   name: data.name,
   mode: data.mode,
   count: data.count || 9
  });
 
  this.uploader.del(data.index);
 }
 
}
module.exports = component;