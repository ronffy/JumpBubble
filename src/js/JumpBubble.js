/*
** JumpBubble.js 原生js实现气泡冒泡效果
** 
** from: https://github.com/wanghairong-i/
** time:2016.12.12
*/

class DrawImg{
	constructor(ctx, imgInfo, { left, top, alpha, speed, cavWidth, cavHeight, effect, isToAlapha, diffWidth }){
		Object.assign(this, {
			whichUnit: null, // 标识气泡在画布中的位置 ，canvan画布分成3个部分，2:中上、1:中、0:中下
			ctx,
			originWidth: imgInfo.width,
			img: imgInfo.el,
			imgWidth: imgInfo.width - diffWidth, //气泡初始大小与指定气泡大小的差值
			imgHeight: imgInfo.height - diffWidth,
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
		this.effectCommon = this.effectCommon.bind(this);
	}
	getSpeed(type = 'default'){
		switch(type){
			case 'slow':
				return 0.6;
			case 'fast':
				return 1.4;
			default:
				return 1;
		}
	}
	addCtx(){
		const p = this, 
				{ ctx } = p;
		ctx.save();
		ctx.globalAlpha = p.alpha;
		ctx.drawImage(p.img, p.x, p.y, p.imgWidth, p.imgHeight);
		ctx.restore();
	}
	setImgWidth(){
		const { originWidth, imgWidth } = this;
		if(imgWidth < originWidth){//差值diffWidth的初始小气泡，逐渐变大为指定气泡的大小
		  this.imgWidth += 1;
		  this.imgHeight += 1;
		}
	}
	setAlapa(){
		const p = this,
					{ y, isToAlapha, whichUnit } = p;
		if(!isToAlapha)return false; //可自行配置，是否逐渐增加透明度
		let diffAlapa = p.diffAlapa;
		if(whichUnit === 2){ //气泡在画布中上部分时
			if(!diffAlapa){
				p.diffAlapa = diffAlapa = p.countDiffAlapa();
			}
		  if(p.alpha <= diffAlapa){
		    p.alpha = 0;
		  }else{
		    p.alpha -= diffAlapa;
		  }
		}
	}
	countDiffAlapa(){
		const { alpha, oneUnit, yPx } = this;
		return (alpha + 0.1)/(oneUnit/yPx);
	}
	setYpx(){
		const p = this,
					{ y, oneUnit } = p;
		let i;
		// 根据态度气泡在容器内到达高度不同，设置不同的速度
		switch(true){ 
			case y < oneUnit: //气泡在画布中上部分时
				i = 2;
				break;
			case y > oneUnit && y < oneUnit*2: //气泡在画布的中部分时
				i = 1;
				break;
			default: //气泡在画布的中下部分
				i = 0;
		}
		if(p.whichUnit !== i){
			p.yPx = p.yPxArr[i];
			p.whichUnit = i;
		}
		p.y -= p.yPxArr[i];
	}
	setYpxArr(){
		if(this.yPxArr)return false;
		this.yPxArr = this.countYpxArr(this.effect, this.getSpeed(this.speed));
	}
	countYpxArr(effect, speedNum = 1){//根据effect不同，设置气泡在y轴上位移距离，数组包含3个值，分别表示在y轴的3个阶段的位移距离
		const basePx = 2;
		const easeArr = [basePx-0.5, basePx, basePx+0.5];
		const linearArr = [basePx, basePx, basePx];
		switch(effect){
			case 'ease':
				return mlt(easeArr);
			case 'linear':
				return mlt(linearArr);
			default:
				return mlt(easeArr);
		}
		function mlt(arr){
			return arr.map(v => v*speedNum);
		}
	}
	pullback(){//在x轴上，触壁反弹效果，晃动的上升，
		const p = this,
					{ y, cavWidth, xPx, originWidth } = p;
		// 控制气泡左右晃动，触壁反弹效果
		switch(true){
			case (p.x + originWidth >= cavWidth): //气泡触右侧壁
				p.toRight = false;
				p.x -= xPx;
				break;
			case p.x <= 2: //气泡触左侧壁
				p.toRight = true;
				p.x += xPx;
				break;
			case p.toRight:
				p.x += xPx;
				break;
			default:
				p.x -= xPx;
		}
		this.effectCommon();
	}
	effectCommon(){
		this.setYpxArr();
		this.setYpx();
		this.setAlapa();
		this.setImgWidth();
	}
	updateCtx(){
		this.pullback();
	}
}

export default class JumpBubble{
	/*
	** @param canvasNode   [必传] <DOM> canvan标签元素
	** @param config       [选传] <Obj> 可选配置项
	**    - effect      <Str> 气泡的y轴浮动效果,可选2个值：linear、ease，默认'ease'
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
		  left : width/2 - 15,  //距离左侧距离
		  top : height - 30, //距离顶部距离
		  alpha : 0.9,  // 透明度设置
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
			bubbleArr.push(new DrawImg(ctx, imgInfo, t.config));
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
		  	  if(val.y < 10){
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
		},25);
	}
}


