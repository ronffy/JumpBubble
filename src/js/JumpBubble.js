/**
 * JumpBubble.js 原生js实现气泡冒泡效果
 * from: https://github.com/wanghairong-i/JumpBubble
 * author: wanghairong
 * time: 2016.12.12
 */

import styles from './jumpBubble.less'

/*
** @param canvasNode   [必传] <DOM> canvan标签元素
** @param config       [选传] <Obj> 可选配置项
**    - speed       <Str> 气泡的Y轴移动速度，可选3个值 slow default fast, 默认'default'
**    - isToAlapha  <Boo> 气泡是否逐渐增加透明度 默认true
**    - alpha       <Num> 初始气泡的透明度， 默认0.9
**    - max					<Num> //画布上最多同时存在多少气泡，默认30，请根据气泡出现频道调整此值，已达到最优的视觉效果
**    - diffWidth   <Num> 初始冒泡时气泡宽度与指定宽度（width属性值）的差值，默认15，差值越大，冒泡时气泡从小变大的效果越明显
**    - left        <Num> 冒泡位置，距离画布左侧像素数，默认在画布中间靠左15像素位置
**    - top         <Num> 冒泡位置，距离画布顶部像素数，默认距离画布顶部为画布高度减30像素
**    - width       <Num> 气泡的宽度， 默认30，为保证气泡不变形，高度随宽度改变
** @param  callback    [选传] <Func> 态度气泡实例初始化后的回调
*/
export default class JumpBubble{
	constructor(canvasNode, config = {}, callback ){
		if(!canvasNode || !canvasNode.getContext){
		  console.warn("jumpBuffle，启用失败，canvas传参错误 或 浏览器不支持canvas");
		  this.error = true;
		  return false;
		}
		const t = this,
		    { width, height } = canvasNode;
		const _config = { //配置气泡冒泡设置
		  width: 30, //可自定义气泡宽度，高度随宽度变化
		  alpha : 1,  // 透明度设置
		  effect: 'ease',
		  speed: 'default',
		  max: 30, //画布上最多同时存在多少气泡， 默认30
		  isToAlapha: true,
		  diffWidth: 15, // 初始冒泡时气泡宽度与正常宽度的差值，默认15
		  cavHeight: height,  // [非配置项] canvan标签的高度，设置气泡在不同高度有不同的浮动速度时会用到
		  cavWidth: width,  	// [非配置项] canvan标签的高度，设置气泡在左右晃动，触壁反弹时会用到
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
	/*
	** 冒泡的生命周期
	** before: 气泡开始冒泡前
	** after: 单个气泡消失后
	*/
	create(imgsrc, before, after){
		const t = this,
					{ctx, error} = t;
		if(!ctx || error){
		  console.warn("jumpBuffle：create时，ctx错误");
		  return false;
		}
		const { bubbleArr, canvasInfo } = t,
		    	{ width: imgwidth, max } = t.config;
		t.createImg(imgsrc).then(imgNode => {
			const imgInfo = {
			  el : imgNode,
			  width : imgwidth || imgNode.width,
			  height : imgwidth && imgNode.height*(imgwidth/imgNode.width) || imgNode.height
			};
			if(bubbleArr.length > max){
			  return;
			}
			Object.assign(t.config, {
				left: t.config.cavWidth - Math.max(Math.random() * t.config.cavWidth * 0.9, 30),
				top: t.config.cavHeight - Math.max(Math.random() * t.config.cavHeight * 0.9, 30),
			});
			bubbleArr.push(new DrawImg(ctx, imgInfo, t.config)),
			//每添加一个气泡触发一次的回调函数, 生命周期为气泡开始冒泡前
			before && before(canvasInfo.canvas, imgNode, bubbleArr);  
			if(!t.setInter){
			  t.setInterFn(after);
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
	setInterFn(after){
		const t = this, 
					{ ctx, canvasInfo } = t,
		    	{ width, height } = canvasInfo;
		t.setInter = setInterval(function(){
		  try{
		  	ctx.clearRect(0, 0, width, height);
		  	t.bubbleArr = t.bubbleArr.filter(function(val){
		  	  val.addCtx();
		  	  val.updateCtx();
					if (val.alpha < 0.01){
		  	  	after && after();
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
		}, 400);
	}
}

class DrawImg{
	constructor(ctx, imgInfo, { left, top, alpha, speed, cavWidth, cavHeight, effect, isToAlapha, diffWidth }){
		Object.assign(this, {
			whichUnit: null, // 标识气泡在画布中的位置 ，canvan画布分成3个部分，2:中上、1:中、0:中下
			ctx,
			originWidth: imgInfo.width,
			img: imgInfo.el,
			imgWidth: imgInfo.width, //气泡初始大小与指定气泡大小的差值
			imgHeight: imgInfo.height,
			x: left, //气泡在x轴的位置 相对左侧
			y: top, //气泡在y轴位置 相对顶部
			alpha,
			speed,
			effect,
			isToAlapha,
			cavWidth,
			oneUnit: cavHeight/4, //将canvan画布分成3个部分，中上、中、中下（中下占2/4,其他各占1/4）
			toRight: (Math.random() > 0.5 ? false : true), //在气泡左右晃动效果时，该属性标识气泡是向左晃动还是向右晃动。
			xPx: Math.random()*2.5, //x轴气泡每次位移像素数
			yPx: null, //缓存气泡在画布y轴上每次位移的距离
			yPxArr: null, //缓存y轴每次位移像素数的3个阶段的值的数组
			diffAlapa: null, //缓存气泡在变为透明时每次增加的透明度
		});
		this.updateCtx = this.updateCtx.bind(this);
	}
	addCtx(){
		const p = this, 
				{ ctx } = p;
		ctx.save();
		ctx.globalAlpha = p.alpha;
		ctx.drawImage(p.img, p.x, p.y, p.imgWidth, p.imgHeight);
		ctx.restore();
	}
	updateCtx(){
		if(this.alpha > 0.9){
			this.alpha -= 0.01;
		}else{
			this.alpha = 0;
		}
	}
}
