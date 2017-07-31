import JumpBubble from './JumpBubble'

const initList = ['http://p8.qhimg.com/t01053ab4d4d6510abd.png'];

const list = [
	'http://p4.cdn.btime.com/t01e430315c854b44d2.png',
	'http://p5.qhimg.com/t017f9904d4be818a87.png',
	'http://p5.qhimg.com/t015ec16e404a442dd4.png',
	'http://p6.qhimg.com/t017895dcd6312beacb.png',
	'http://p2.qhimg.com/t01f70bccf10e16addd.png',
	'./src/img/fish.png', //注：路径是相对html的路径，因为该路径最终会放到img标签的src上
];

const bubble = new JumpBubble(document.getElementById("cavs"));
let i = 0;
setInterval(() => {
	if(i > initList.length - 1){
		i = 0;
	}
	bubble.create(initList[i]);
	i++
},150);

document.getElementById('btn').onclick = () => {
	if(!list.length)return false;
	initList.push(list.shift());
}

