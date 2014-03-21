$(function(){
	setInterval(function(){
		$.get('/check').then(function(res){
			var r = parseInt(res);
			if(r > parseInt($('#current').val())){
				location.reload();
			}
		})
	}, 100000);
});