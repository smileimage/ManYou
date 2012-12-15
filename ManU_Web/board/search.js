function prepareSearch(){

	$('#namesearch').keypress(function(event){
		
		
		var namesearch = $('#namesearch').val().split(" ");
		console.log(namesearch);
		
		if(event.keyCode==13){
			console.log(boardTypeNo);
			$(this).addClass('thinking');   //검색중이라는 css 그림이미지로 백그라운드 설정  
			$.ajax({
				url: 'search.do',
				data : {searchObj:$('#namesearch').val(),
						boardTypeNo:boardTypeNo,
						searchType:$('#searchType').val()},
				dataType: 'json',
				success: function(data, textStatus, jqXHR) {
				
					if(data.status ==200){
						$('ul.listUL').detach();
						$('ul.firstChar').detach();
						
						countsearch = data.result.length;
						if(countsearch>0){
							boardCount = countsearch; 
						}
						$('#searchtext').find('label').text(countsearch+"개 발견");
						$.each( data.result, addBoardRowInTable );
						$('#layer1').removeClass('hidden');
						
					}else{
						alert('서버로부터 데이터를 가져오는데 실패 하였습니다.');
						debug(data.message);
					}
					$('#paging_container').pajinate();
				}
			});
		}
	});

$('#cenclesmallbtn').bind('click', function(event){
		clearForm();
		refreshCenterList();
	});

};

function clearForm(){
	$('#namesearch').val("");
	$('#layer1').addClass('hidden');
	boardcount=0;
}
