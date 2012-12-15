$('#namesearch').keypress(function(event){
		if(event.keyCode==13){
			$(this).addClass('thinking');   //검색중이라는 css 그림이미지로 백그라운드 설정  
			$.ajax({
				url: 'search.do',
				data : {searchObj:$('#namesearch').val()},
				dataType: 'json',
				success: function(data, textStatus, jqXHR) {
				
					if(data.status ==200){
						$('ul.listUL').detach();
						$('ul.firstChar').detach();
						$.each( data.result, addBoardRowInTable );

						var countsearch = data.result.length;
						$('#searchtext').find('label').text(countsearch+"개 발견");

						$('#layer1').removeClass('hidden');
					}else{
						alert('서버로부터 데이터를 가져오는데 실패 하였습니다.');
						debug(data.message);
					}
				}
			});
		}
	});

	$('#cenclesmallbtn').bind('click', function(event){
		$('#namesearch').val("");
		refreshCenterList();
	});