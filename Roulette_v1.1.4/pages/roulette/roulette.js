//--Defines123
const ccode = "零一二三四五六七八九十";//汉字数字
const colorList = new Array("E9F1F6", "E3F9FD", "FFFBF0", "F3F9F1", "88ADA6", "A1AFC9", "FFF143", "EAFF56", "FF8C31", "FF461F", "EEDEB0", "CA6924", "955539", "02E09E", "1BD1A5", "CCA4E3", "E4C6D0", "725E82", "493131", "023472", "801DAE", "A88462", "424C50", "C93756", "CB3A56", "A98175", "622A1D", "801DAE", "4C221B", "4B5CC4", "2EDFA3", "F9906F", "FF0297", "21A675");//颜色列表
const numArray=new Array();
for(var i=0;i<34;i++){
  numArray[i]=i;
}

//index.js
//获取应用实例

Page({
  data: {
    myTopOne:"亲，想要",//状态栏1
    myTopTwo:"几",//状态栏2
    myTopThree:"选一",//状态栏3
    result:0,//结果
    theSeed:2,//一共分几份
    hRes:667,//屏幕高-像素
    wRes:375,//屏幕宽-像素
    rotAnime: "",//旋转动画
    showRotateBut:false,//“转我” 按钮
    roulettePath:"../../img/images/sheep2.png",//转盘存储路径
    arrowPath:"",//箭头存储路径
    scoreWord:"开启计分模式",//计分模式文字
    sMode:false,//计分模式状态
    curScore:0,//当前计分
    fullScore:0,//计分满分
        
  },

  onLoad: function () {
    wx.getSystemInfo({  //获取屏幕宽和高的像素值，wxml用
      success: res => {
        this.setData({
          hRes: res.windowHeight,
          wRes: res.windowWidth,
        })
      },
      
    })

    var value = wx.getStorageSync('myCurScore');
    if(!value){
      wx.setStorageSync('myCurScore',0);
      wx.setStorageSync('myFullScore',0);
    }
    else{
      this.setData({
        curScore: value,
        fullScore: wx.getStorageSync('myFullScore'),
      })
    }

  },

  scoreMode: function (e) {
    var that = this;
    var sm = !that.data.sMode;
    var sw = (sm ? "关闭计分模式" : "开启计分模式")
    that.setData({
      sMode: sm,
      scoreWord: sw,
    })
  },

  drawCircle: function(n) {
    var that=this;
    const ctx = wx.createCanvasContext('roulettePanel');

    var r=that.data.hRes/4.8;

    ctx.translate(r,r);
    r-=3;

    ctx.setStrokeStyle('#00ff00')
    ctx.setLineWidth(3)
    var step_rad=2*Math.PI/n;

    var arr_num=numArray;

    arr_num=that.randomArray(arr_num);

    for(var i=0;i<n;i++){
      var dota1=r*Math.cos(i*step_rad);
      var dota2=-r*Math.sin(i*step_rad);
      var dotb1=r*Math.cos((i+1)*step_rad);
      var dotb2=-r*Math.sin((i+1)*step_rad);
      ctx.beginPath()
      ctx.moveTo(0, 0)
      ctx.lineTo(dota1,dota2);
      ctx.setStrokeStyle(that.colorConvert(arr_num, 33));
      ctx.arc(0,0,r,-i*step_rad,-(i+1)*step_rad,true);
      ctx.lineTo(0,0);
      ctx.stroke();//画扇形，给边缘上色
    
      var mycolor = that.colorConvert(arr_num,i);  
      ctx.setFillStyle(mycolor)
      ctx.fill();
      ctx.stroke();//填充扇形颜色

    }

    ctx.beginPath();
    ctx.setStrokeStyle(that.colorConvert(arr_num, 32));
    ctx.arc(0, 0, r, 0, 2*Math.PI, true);
    ctx.stroke();//给外围轮廓一个新的颜色

    ctx.rotate(0.5*Math.PI-Math.PI/n);
    ctx.setFontSize(r/5);
    
    for(var i=0;i<n;i++){
      if (arr_num[i] < 17) {
        ctx.setFillStyle('#003452');
      }
      else {
        ctx.setFillStyle('#A1AF89');
      }
      ctx.fillText(ccode[i+1], -r/12, -r/4*3);
      ctx.rotate(-step_rad);
    }//写字

    ctx.draw(false,()=>{
      setTimeout(()=>{
        that.saveToRoulettePath();
        that.drawArrow(r,arr_num);//完成轮盘之后画箭头，传递轮盘半径和颜色序号列表
      },20);
    });

  },

  saveToRoulettePath: function(){ //储存轮盘画布信息
    wx.canvasToTempFilePath({
      canvasId:'roulettePanel',
      success:(res)=>{
        let tempFilePath=res.tempFilePath;
        this.setData({
          roulettePath: tempFilePath,
        });
      }
    },this);
  },

  drawArrow:function(r,arr){
    var that = this;
    const ctx=wx.createCanvasContext('pointArrow');

    ctx.translate(that.data.wRes / 2, r);
    
    //画箭头三角，填充
    ctx.setStrokeStyle(that.colorConvert(arr, 30));
    ctx.setLineWidth(3);
    
    ctx.beginPath();
    ctx.moveTo(r/20,0);
    
    ctx.lineTo(0,-r*2/3);
    ctx.lineTo(-r/20,0);
    ctx.lineTo(r/20,0); 
    ctx.setFillStyle("#"+("00000"+(parseInt(colorList[parseInt(arr[30])], 16) - 131586).toString(16)).slice(-6));
    //填充颜色为轮廓-0x020202
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, 0, r / 20, 0, Math.PI * 2, true);
    ctx.setFillStyle(that.colorConvert(arr, 28));
    ctx.fill();
    ctx.stroke();

    ctx.draw(false, () => {
      setTimeout(() => {
        that.saveToArrowPath();
      }, 20);
    });


  },

  saveToArrowPath: function(){ //储存箭头画布信息
    wx.canvasToTempFilePath({
      canvasId: 'pointArrow',
      success: (res) => {
        let tempFilePath = res.tempFilePath;
        this.setData({
          arrowPath: tempFilePath,
        });
      }
    }, this);
  },



  myRotate: function(e){
    var that=this;
    var option={ //主动画
      duration:6000,
      timingFunction:'ease-in-out', 
      transformOrigin:'50% 50% 0',
    };

    var option2={ //完成动画之后去除多余圈数
      duration:1,
      timingFunction:'step-start',
      transformOrigin:'50% 50% 0',
    }//finishing anime

    var rAnime=wx.createAnimation(option);

    var remainder=new Date().getMilliseconds()*1080/1000+1800;
    var rr=remainder%360;

    //保证箭头和区域边缘之间至少4°
    if((rr+90)%(360/that.data.theSeed)<4){
      rr+=4;
      remainder+=4;
      rr%=360;
    }
    else if((rr+94)%(360/that.data.theSeed)<4){
      rr-=4;
      remainder-=4;
    }

    

    //更新提示区信息
    rAnime.rotate(remainder).step();
    that.setData({
      rotAnime:rAnime.export(),
      myTopOne:"结果是",
      myTopTwo:"几呢？",
      myTopThree:"",
      showRotateBut:false,
    })


    //旋转完成后去除多余圈数并更新提示信息
    var rresult = 1 + Math.floor((rr + 90) % 360 / (360 / that.data.theSeed));

    setTimeout(function(){
      rAnime=wx.createAnimation(option2);
      rAnime.rotate(rr).step();
      
      that.setData({
        rotAnime:rAnime.export(),
        result: rresult,
        //myTopOne: "结果是",
        myTopTwo: ccode[rresult],
        //myTopThree: "",
        showRotateBut:true,
      })

      if(that.data.sMode) {
        if(that.data.curScore==0){
          that.setData({
            curScore:rresult,
            fullScore:parseInt(that.data.theSeed),
          })
        }
        else{
          that.setData({
            curScore:that.data.curScore+rresult,
            fullScore:parseInt(that.data.fullScore)+parseInt(that.data.theSeed),
          })
        }
        wx.setStorageSync('myCurScore', that.data.curScore);
        wx.setStorageSync('myFullScore', that.data.fullScore);

      }
    }.bind(that),6200)
  },

  //按2-10的按钮
  cubeClick: function(e){
    var that=this;
    var num = e.currentTarget.dataset['value'];
    if(num==1){
      num=that.data.theSeed;
    }
    
    that.setData({
      myTopOne:"我们来",
      myTopTwo: ccode[num],
      myTopThree:"选一",
      theSeed:num,
      showRotateBut:true,
    })

    that.drawCircle(num);
    
  },

  resetScore: function(e){
    var that=this;
    wx.showModal({ //使用模态框提示用户进行操作
      title: '请问',
      content: '你确定要重置分数吗？',
      success: function (res) {
        if (res.confirm) { //判断用户是否点击了确定
          wx.setStorageSync('myCurScore', 0);
          wx.setStorageSync('myFullScore', 0);
          that.setData({
            curScore:0,
            fullScore:0,
          })
        }
      }
    })
  },

  //随机排列序号列表，方式为每个数依次与随机序列号的数对调
  randomArray: function(arr){
    var len=arr.length;
    var temp=0;
    var rnd=0;
    for(var i=0;i<len;i++){
      temp=arr[i];
      rnd=(i+Math.floor(Math.random()*34))%34;
       arr[i]=arr[rnd];
      arr[rnd]=temp;
    }

    return arr;
  },

  //把序号列表的 arr 的第 n 项转换成对应的颜色
  colorConvert: function (arr, n = 0) {
    return "#" + colorList[parseInt(arr[n])];
  },

})



