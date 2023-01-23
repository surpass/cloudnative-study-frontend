//upload.js
class picUploader {
 
  constructor(data) {
  
   this.that = data.that;
   this.name = data.name;
   this.mode = data.mode || 1;
   this.count = this.model == 1 ? 1 : data.count || 9;
  }
  
  /*
  * 选择图片
  */
  choose() {
  
   const self = this;
  
   wx.chooseImage({
    count: (self.count - self.that.data[self.name].length),
    sizeType: ['original', 'compressed'],
    sourceType: ['album', 'camera'],
    success: function (res) {
     var tempFilePaths = res.tempFilePaths;
  
     self.append(tempFilePaths);
    }
   })
  }
  
  /*
  * 显示图片
  */
  
  show() {
  
   let self = this;
   let view = {};
   view[self.name] = self.that.data[self.name];
  
   self.that.setData(view);
  
  }
  
  /*
  * 追加图片
  */
  append(data) {
  
   const self = this;
   for (let i = 0; i < data.length; i++) {
  
    self.that.data[self.name].push(data[i]);
   }
  
   self.show();
  }
  
  /*
  * 删除图片
  */
  del(index) {
  
   let self = this;
  
   self.that.data[self.name].splice(index, 1);
  
   self.show();
  }
  
  
 }
 module.exports = picUploader;