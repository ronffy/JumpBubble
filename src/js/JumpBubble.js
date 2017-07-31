/*
** JumpBubble.js 原生js实现气泡冒泡效果
** 
** from: https://github.com/wanghairong-i/
** time:2016.12.12
*/

class DrawImg{
	constructor(ctx, imgInfo, { left, top, alpha, cavHeight }){
		Object.assign(this, {
			ctx,
			originWidth: imgInfo.width,
			img: imgInfo.el,
			imgWidth: imgInfo.width - 10,
			imgHeight: imgInfo.height - 10,
			x: left,
			y: top,
			alpha,
			cavHeight,
			ranX: (Math.random()*5 - 2.5)/2
		});
	}
	addCtx(){
		const p = this, 
				{ ctx } = p;
		ctx.save();
		ctx.globalAlpha = p.alpha;
		ctx.drawImage(p.img,p.x,p.y,p.imgWidth, p.imgHeight);
		ctx.restore();
	}
	updateCtx(){
		const p = this,
		    	afterRoad = p.cavHeight/4,
		    	ranX = p.ranX;
		// 根据态度气泡在容器内到达高度不同，设置不同的速度
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
		if(p.imgWidth < p.originWidth){
		  p.imgWidth += 1;
		  p.imgHeight += 1;
		}
	}
}

export default class JumpBubble{
	/*
	** @param canvasNode   [必传] <DOM> canvan标签元素
	** @param config       [选传] <Obj> 可选配置项
	**    - left   <Num> 气泡距离画布左侧距离，默认在画布中间靠左15像素位置
	**    - top    <Num> 气泡距离画布顶部距离，默认距离画布顶部为画布高度减30像素
	**    - alpha  <Num> 气泡的透明度， 默认0.9
	**    - width  <Num> 气泡的宽度， 默认30，为保证气泡不变形，高度随宽度改变
	**    - effect <Str> 气泡的浮动效果（待添加）
	** @param  callback    [选传] <Func> 态度气泡实例初始化后的回调
	*/
	constructor(canvasNode, config = {}, callback ){
		const t = this,
		    { width, height } = canvasNode;
		if(!canvasNode || !canvasNode.getContext){
		  console.warn("jumpBuffle，启用失败，canvas传参错误 或 浏览器不支持canvas");
		  return;
		}
		const _config = { //配置气泡冒泡设置
		  left : width/2 - 15,  //距离左侧距离
		  top : height - 30, //距离顶部距离
		  alpha : 0.9,  // 透明度设置
		  cavHeight: height,  //canvan标签的高度，设置气泡在不同高度有不同的浮动速度时会用到
		  width: 30, //可自定义气泡宽度，高度随宽度变化
		};
		Object.assign(t, {
			canvasInfo: {
				canvas : canvasNode,
				width,
				height
			},
			config: Object.assign(_config, config),
			ctx: canvasNode.getContext("2d"),
			bubbleArr: [],//用来存储所有的气泡
			allImg: { //缓存创建的img标签
				lists: [], //src的列表
				doms: [], //缓存list对应的创建的dom
				loadState: [], //是否img标签已经加载完毕，如果完毕再直接返回img标签的dom，如果没有加载完毕则放到img.load函数内返回imgdom
			}
		});
		callback && callback(t);
	}
	create(imgsrc, callback){
		const t = this,
				{ bubbleArr, ctx, canvasInfo } = t,
		    { width: imgwidth } = t.config;
		if(!ctx){
		  console.warn("jumpBuffle：create时，ctx错误");
		  return;
		}
		t.createImg(imgsrc).then(imgNode => {
			const imgInfo = {
			  el : imgNode,
			  width : imgwidth || imgNode.width,
			  height : imgwidth && imgNode.height*(imgwidth/imgNode.width) || imgNode.height
			};
			if(bubbleArr.length>30){
			  return false;
			}
			bubbleArr.push(new DrawImg(ctx, imgInfo, t.config));
			//每添加一个气泡触发一次的回调函数,
			// 参数1：canvas元素；参数2：传入的图片元素；参数3：当前存在的气泡数组
			callback && callback(canvasInfo.canvas,imgNode,bubbleArr);  
			if(!t.setInter){
			  t.setInterFn();
			}
		});
		return this;
	}
	createImg(imgsrc){
		return new Promise(res => {
			const { lists, doms, loadState } = this.allImg;
			const i = lists.indexOf(imgsrc);
			if(i > -1 && loadState[i]){
				res(doms[i]);
				return ;
			}
			const img = document.createElement('img');
			img.src = imgsrc;
			img.setAttribute('style', 'display:none;');
			document.body.appendChild(img);
			lists.push(imgsrc);
			doms.push(img);
			img.onload = () => {
				loadState.push(true);
				res(img);
			}
		})
	}
	setInterFn(){
		const t = this, 
					{ ctx, canvasInfo } = t,
		    	{ width, height } = canvasInfo;
		t.setInter = setInterval(function(){
		  try{
		  	ctx.clearRect(0, 0, width, height);
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
		  	  ctx.clearRect(0, 0, width, height);
		  	}
		  }catch(e){
		  	console.warn('创建态度气泡出错',e);
		  	clearInterval(t.setInter);
		  }
		},25);
	}
}


