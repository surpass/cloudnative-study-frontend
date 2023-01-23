/*
* 下拉框对象
*/
class picker{
 
  constructor(data){
  
   this.that = data.that;
   this.name = data.name || 'date';
   this.mode = data.mode || 'selector';
  }
  
  show(name,data){
  
   let view = {};
   view[name] = data;
  
   this.that.setData(view);
  }
  
  change(data){
  
   let self = this;
  
   self.show(self.name, data);
  }
 }
 module.exports = picker;