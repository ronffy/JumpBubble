/*
** JumpBubble.js 原生js实现气泡冒泡效果
** auth:wanghairong
** time:2016.12.12
*/
class JumpBubble{
	constructor(canvasNode, opt = {}){
		var t = this,
		    canvasW = canvasNode.width,
		    canvasH = canvasNode.height;
		if(!canvasNode){
		  console.warn("jumpBuffle：new 实例时，canvas传参错误");
		  return;
		}
		t.canvasInfo = {
		  canvas : canvasNode,
		  width : canvasW,
		  height : canvasH
		};
		if(!canvasNode.getContext){
		  console.warn("jumpBuffle，启用失败，浏览器不支持canvas");
		  return;
		}
		var config = { //配置气泡冒泡设置
		  left : canvasW/2 - 15,  //距离左侧距离
		  top : canvasH - 30, //距离顶部距离
		  alpha : 0.9  // 透明度设置
		  // width : 30 // 默认使用传入图片的实际宽高，可自定义气泡宽度，高度随宽度变化
		};
		t.callback = opt.callback; //每添加一个气泡触发一次的回调函数
		t.config = Object.assign(config, opt.config);
		t.ctx = canvasNode.getContext("2d");
		t.bubbleArr = []; //用来存储所有的气泡
	}
	create(imgNode){
		var t = this,
		    bubbleArr = t.bubbleArr,
		    ctx = t.ctx,
		    config = t.config,
		    cfgImgWidth = config.width,
		    convasInfo = t.canvasInfo,
		    callback = t.callback;
		if(!ctx){
		  console.warn("jumpBuffle：create时，ctx错误");
		  return;
		}
		var imgInfo = {
		  el : imgNode,
		  width : cfgImgWidth || imgNode.width,
		  height : cfgImgWidth && imgNode.height*(cfgImgWidth/imgNode.width) || imgNode.height
		};
		if(bubbleArr.length>30){
		  return false;
		}
		bubbleArr.push(new drawImg(ctx,imgInfo,t.config,convasInfo));
		//每添加一个气泡触发一次的回调函数,
		// 参数1：canvas元素；参数2：传入的图片元素；参数3：当前存在的气泡数组
		callback && callback(convasInfo.canvas,imgNode,bubbleArr);  
		if(!t.setInter){
		  t.setInterFn();
		}
	}
	setInterFn(){
		var t = this,
		    ctx = t.ctx,
		    convasInfo = t.canvasInfo,
		    canvasW = convasInfo.width,
		    canvasH = convasInfo.height;
		t.setInter = setInterval(function(){
		  ctx.clearRect(0,0,canvasW,canvasH);
		  t.bubbleArr = t.bubbleArr.filter(function(val){
		    val.addCtx();
		    val.updateCtx();
		    if(val.y < 10){
		      return false;
		    }else{
		      return true;
		    }
		  });
		  if(t.bubbleArr.length === 0){
		    clearInterval(t.setInter);
		    t.setInter = null;
		    ctx.clearRect(0,0,canvasW,canvasH);
		  }
		},25);
	}
}

class drawImg{
	constructor(ctx,imgInfo,config ,canvasInfo){
		var p = this;
		p.ctx = ctx;
		p.imgInfo = imgInfo,
		p.img = imgInfo.el;
		p.imgWidth = imgInfo.width - 10;
		p.imgHeight = imgInfo.height - 10;
		p.x = config.left;
		p.y = config.top;
		p.alpha = config.alpha;
		p.canvasInfo = canvasInfo;
		p.ranX = (Math.random()*5 - 2.5)/2;
	}
	addCtx(){
		var p = this,
		    ctx = p.ctx;
		ctx.save();
		ctx.globalAlpha = p.alpha;
		ctx.drawImage(p.img,p.x,p.y,p.imgWidth, p.imgHeight);
		ctx.restore();
	}
	updateCtx(){
		var p = this,
		    canvasInfo = p.canvasInfo,
		    afterRoad = canvasInfo.height/4,
		    ranX = p.ranX;
		if(p.y < afterRoad){
		  if(Math.random() > 0.5){
		    p.x += ranX/2;
		  }
		  p.y -= 2.5;
		  if(p.alpha <= 0.02){
		    p.alpha = 0;
		  }else{
		    p.alpha -= 0.02;
		  }
		}else if(p.y > afterRoad && p.y < afterRoad*2){
		  p.x += ranX/2;
		  p.y -= 3;
		  p.alpha -= 0.01;
		}else{
		  p.x += ranX;
		  p.y -= 4;
		}
		if(p.imgWidth < p.imgInfo.width){
		  p.imgWidth += 1;
		  p.imgHeight += 1;
		}
	}
}


const bubble = new JumpBubble(document.getElementById("canvasIdName"))
bubble.create(document.getElementById("img1"));
bubble.create(document.getElementById("img7"));
bubble.create(document.getElementById("img8"));


