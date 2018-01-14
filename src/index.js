import JumpBubble from './js/JumpBubble'
import styles from './index.less'

let list1 = [
	'http://p4.cdn.btime.com/t01e430315c854b44d2.png',
	'http://p5.qhimg.com/t017f9904d4be818a87.png',
	'http://p5.qhimg.com/t015ec16e404a442dd4.png',
	'/img/fish.png', //注：路径是相对html的路径，因为该路径最终会放到img标签的src上
];

const bubble = new JumpBubble(document.getElementById(`cavs1`));
console.log(bubble)
let s = 0;
setInterval(() => {
	if (s > list1.length - 1) {
		s = 0;
	}
	bubble.create(list1[s]);
	s++
}, 800);

