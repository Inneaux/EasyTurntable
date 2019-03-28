//--Defines123
const ccode = "♈♉♊♋♌♍♎♏♐♑♒♓";//汉字数字
const hcode = new Array("白羊座","金牛座","双子座","巨蟹座","狮子座","处女座","天秤座","天蝎座","射手座","摩羯座","水瓶座","双鱼座");
const colorList = new Array("E9F1F6", "E3F9FD", "FFFBF0", "F3F9F1", "88ADA6", "A1AFC9", "FFF143", "EAFF56", "FF8C31", "FF461F", "EEDEB0", "CA6924", "955539", "02E09E", "1BD1A5", "CCA4E3", "E4C6D0", "725E82", "493131", "023472", "801DAE", "A88462", "424C50", "C93756", "CB3A56", "A98175", "622A1D", "801DAE", "4C221B", "4B5CC4", "2EDFA3", "F9906F", "FF0297", "21A675");//颜色列表
const numArray=new Array();
for(var i=0;i<34;i++){
  numArray[i]=i;
}

//index.js
//获取应用实例

Page({
  data: {
    myTopOne:"结果是",//状态栏1
    myTopTwo:"什么呢？",//状态栏2
    result:0,//结果
    theSeed:12,//一共分几份
    hRes:667,//屏幕高-像素
    wRes:375,//屏幕宽-像素
    rotAnime: "",//旋转动画
    showRotateBut:false,//“转我” 按钮
    roulettePath:"../../img/images/sheep2.png",//转盘存储路径
    arrowPath:"",//箭头存储路径
    pairWord: "前往今日速配", //速配模式文字
    rotateWord:"转我",//旋转按钮文字
    pmode: false, //速配模式状态
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

    var dayday=new Date();
    var localKey=dayday.getDate()+dayday.getMonth()*35;
    var savedKey=wx.getStorageSync('myAstroKey');

    if(localKey!=savedKey){
      wx.setStorageSync('myAstroPwd',-1);
      wx.setStorageSync('myAstroKey',localKey);
    }


    this.drawCircle();

  },

  pairMode: function(e){
    var that=this;
    var pm=!that.data.pmode;
    var pw=(pm?"返回随机星座":"前往今日速配")
    var rw=(pm?"速配":"转我")
    that.setData({
      pmode:pm,
      pairWord:pw,
      rotateWord:rw,
    })
  },

  drawCircle: function(e) {
    var n=12;
    var that=this;
    const ctx = wx.createCanvasContext('roulettePanel');

    var r=that.data.hRes/4.8;

    ctx.translate(r,r);
    r-=3;

    ctx.setStrokeStyle('#00ff00')
    ctx.setLineWidth(3)
    var step_rad=2*Math.PI/12;

    var arr_num=numArray;

    arr_num=that.randomArray(arr_num);

    for(var i=0;i<12;i++){
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

    ctx.rotate(0.5*Math.PI-Math.PI/12);
    ctx.setFontSize(r/5);
    
    for(var i=0;i<12;i++){
      if (arr_num[i] < 17) {
        ctx.setFillStyle('#003452');
      }
      else {
        ctx.setFillStyle('#A1AF89');
      }
      ctx.fillText(ccode[i], -r/8, -r/4*3);

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
        that.setData({
          showRotateBut: true,
        })
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

    if (that.data.pmode) {
      if (wx.getStorageSync('myAstroPwd') < 0) {
        wx.setStorageSync('myAstroPwd', remainder);
      }
      else{
        remainder=wx.getStorageSync('myAstroPwd');
        rr=remainder%360;
      }
    }

    //更新提示区信息
    rAnime.rotate(remainder).step();
    that.setData({
      rotAnime:rAnime.export(),
      myTopTwo:"什么呢？",
      showRotateBut:false,
    })


    //旋转完成后去除多余圈数并更新提示信息
    var rresult = Math.floor((rr + 90) % 360 / 30);

    setTimeout(function(){
      rAnime=wx.createAnimation(option2);
      rAnime.rotate(rr).step();
      
      that.setData({
        rotAnime:rAnime.export(),
        result: rresult,
        myTopTwo: hcode[rresult],
        showRotateBut:true,
      })
    }.bind(that),6200)
  },

  //按2-10的按钮
  

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



