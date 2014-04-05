$(function(){
	if(false){ //typeof WebSocket !== 'undefined'){
		var host = location.origin.replace(/^http/, 'ws')
		  , ws = new WebSocket(host);
		ws.onmessage = function (event) {
			var data = JSON.parse(event.data)
			  , $caption = $('#caption');

			$('#profile_picture').attr('src', data.user.profile_picture);
			$('#main').attr('src', data.images.standard_resolution.url);

			if(data.caption !== null){
				$caption.text(data.caption.text);
				if(data.caption.text.length < 25){
					$caption.addClass('short');
				}
				else{
					$caption.removeClass('short');
				}
			}
			else{
				$caption.removeClass('short');
				$caption.text('Posted on ' + (""+new Date(data.created_time*1000)).split(' ').slice(0,5).join(' '));
			}
		};
	}
	else{
		setInterval(function(){
			$.get('/check').then(function(res){
				var r = parseInt(res);
				if(r > parseInt($('#current').val())){
					location.reload();
				}
			})
		}, 500000);
	}
});
