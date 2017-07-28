import $ from './common/jquery'
import '../css/reset'
import '../css/common'
import '../css/index'

$(function(){
	$('#v-main').show();
	const $modelbox = $('#v-modelbox');
	$('#v-btn-login').click(() => {
		toggleModel('login');
	})
	$('#v-btn-signup').click(() => {
		toggleModel('signup');
	})

	function toggleModel(state){
		state = state || 'login';
		let relati = 'signup';
		state === 'signup' ? relati = 'login' : '';
		$modelbox
		.addClass(`overup-${state}`)
		.removeClass(`overup-${relati}`)
		.find('.modelBox-info').hide().css('opacity', 0);
		$(`.modelBox-${state}`).show(function(){
			setTimeout(() => {
				$(this).css('opacity','1');
			},100)
		})
	}
})
















































function clog(...args){
	console.log(...args);
}