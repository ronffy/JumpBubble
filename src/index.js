import JumpBubble from './js/JumpBubble'
import styles from './index.less'

console.log(styles)

let list1 = [
	'http://p4.cdn.btime.com/t01e430315c854b44d2.png',
	'http://p5.qhimg.com/t017f9904d4be818a87.png',
	'http://p5.qhimg.com/t015ec16e404a442dd4.png',
	'/img/fish.png', //注：路径是相对html的路径，因为该路径最终会放到img标签的src上
];
let list2 = [
	'http://p8.qhimg.com/t01053ab4d4d6510abd.png',
	'http://p6.qhimg.com/t017895dcd6312beacb.png',
	'http://p2.qhimg.com/t01f70bccf10e16addd.png',
];

const effects = ['ease', 'linear'];
for(let [i, v] of effects.entries()){
	const bubble = new JumpBubble(document.getElementById(`cavs${i}`),{
		effect: v,
		speed: i === 1 ? 'fast' : 'slow',
		width: i === 0 ? 25 : 35,
		isToAlapha: i === 0 ? false : true, //演示，第二个设置不进行透明度变化
	});
	let s = 0;
	setInterval(() => {
		if(s > list1.length - 1){
			s = 0;
		}
		bubble.create(list1[s]);
		s++
	},250);
}


document.getElementById('btn-add').onclick = () => {
	move(list1, list2);
	return false;
}
document.getElementById('btn-del').onclick = () => {
	move(list2, list1);
	return false;
}

function move(target, source){
	if(!(source.length - 1))return;
	target.push(source.shift());
}
