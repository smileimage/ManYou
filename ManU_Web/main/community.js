var oneLineInputText;
$(document).ready(function(e) {
	$('#insertBtn').live('click',function(event){
		if($('#insertOneLine').val() != ''){
			$.post('../insertOnelineBoard.do',{
				obContext:$('#insertOneLine').val(),
				interestCommunityNo:localStorage.getItem("communityNumber"),
				fbUid:getCookie('cookieFbUid')
			},
			function(data,textStatus,jqXHR){
				if(data.status==200){
					$('#oneLineBoardTable').remove();
					createOneLineBoardTable();
					selectOneLineList();
				}else{
					generateCustomAlert('error','등록을 실패했습니다.');
				}
			},
			'json'
			);
			$('#insertOneLine').val('');
		}else{
			generateCustomAlert('error','본문 내용을 입력하세요');
		}
	});
	
	$('#deleteImg').live('click',(function(event){
		var isCorrect = window.confirm('삭제하시겠습니까?');
		if(isCorrect==true){
			$.getJSON('../deleteOneLineBoard.do',{
				obNo:$(this).parent().parent().find('li:eq(3)').text()
			},
			function(data,textStatus,jqXHR){
				if (data.status == 200) {
					$('#oneLineBoardTable').remove();
					createOneLineBoardTable();
					selectOneLineList();
				} else {
					generateCustomAlert('error','삭제를 실패했습니다.');
					debug(data.message);
				}
			});
		}
		else{
			return null;
		}
	}));
	
	
	$('#updateImg').live('click',function(){
		$(this).addClass('displayNone');
		$(this).prev().addClass('displayNone');
		$(this).parent().parent().find('li:eq(2)').children().removeAttr('readonly');
		$(this).parent().parent().find('li:eq(2)').children().removeAttr('style');
		oneLineInputText = $(this).parent().parent().find('li:eq(2)').children().val();
		$(this).next().css('visibility','visible');
		$(this).next().next().removeClass('displayNone');
		
	});
	$('#updateImg2').live('click',function(){
		$.post('../updateOneLineBoard.do',{
				obNo:$(this).parent().parent().find('li:eq(3)').text(),
				obContext:$(this).parent().parent().find('li:eq(2)').children().val()
			},
			function(data, textStatus, jqXHR){
				if(data.status==200){
					generateCustomAlert('success','수정되었습니다.');
					$('#oneLineBoardTable').remove();
					createOneLineBoardTable();
					selectOneLineList();
				}else {
					alert("서버에서 데이터를 가져오는데 실패했습니다.");
					debug(data.message);
				}
			},
			'json'
		);
		$(this).parent().find('img:eq(0)').removeClass('displayNone');
		$(this).parent().find('img:eq(1)').removeClass('displayNone');
	});
	
	$('.cancelUpdate').live('click',function(){
		$(this).parent().parent().find('li:eq(2)').children().val(oneLineInputText);
		$(this).parent().parent().find('li:eq(2)').children().attr('readonly','readonly');
		$(this).parent().parent().find('li:eq(2)').children().css('border','none');
		$(this).addClass('displayNone');
		$(this).prev().css('visibility','hidden');
		$(this).parent().find('img:eq(0)').removeClass('displayNone');
		$(this).parent().find('img:eq(1)').removeClass('displayNone');
	});
});

function createOnelineBoardInput(){
	$('#onelineBoard').append($('<div></div>').attr('id','onelineBoardInput').append($('<textarea id="insertOneLine"' +
	'placeholder="한줄게시판 입력"></textarea>'))
	.append($('<input id="insertBtn" type="button" value="등록">')));
}
function createOnelineBoard(index,value){
	return $('#oneLineBoardTable').append(createOneLineBoardUl(index,value));
}

function createOneLineBoardUl(index,value){
	return $('<ul></ul>').attr('id', 'OneLineUl')
	.append(imgShow(value))
	.append($('<li class="oneLineLi">'+value.fbName+'  '+'('+new Date(value.obDate).
			format('yy-MM-dd hh:mm')+')</li>'))
	.append($('<li><textarea id="obContextBox" readonly="readonly" '+
			'style="border:none;">'+value.obContext+'</textarea></li>').attr('id','obContext')
			.attr('border','none'))
	.append($('<li>'+value.obNo+'</li>').attr('id','obNo').hide())
	.append($('<li>'+value.interestCommunityNo+'</li>').attr('id','interestCommunityNo').hide());
}

function createOneLineBoardTable(){
	$('#onelineBoard')
	.append($('<div></div>').attr('id', 'oneLineBoardTable'));
	
	if(getCookie('cookieFbUid') == null){
		$('#insertOneLine').hide();
		$('#insertBtn').hide();
	}
}

function selectOneLineList(value){
	if (oneLinePage <= 1) {
		oneLinePage = 1;
		$('#oneHideBtn').css('display', 'none');

	} else 
		$('#oneHideBtn').css('display', '');
	
	$.ajax({
		url:'../onelineBoard.do',
		dataType:'json',
		data : {
			page:oneLinePage,
			fbUid:getCookie('cookieFbUid'),
			interestCommunityNo : localStorage.getItem("communityNumber")},
		success:function(data, textStatus, jqXHR){
			if(data.status==200){
				
				for(var i=0; i < data.result.length; i++){}
				if(i < 9 && i != 0){
					$('#oneMoreBtn').css('display','none');
				}else if(i==0){
					currPage--;
					$('#oneMoreBtn').css('display','none');
				}
				$.each(data.result,createOnelineBoard);
				$('#oneLineBtn').css('width','37%').css('height',(850 - (data.result.length * 63))+'px');
			}else {
				alert("서버에서 데이터를 가져오는데 실패했습니다.");
				debug(data.message);
			}
		}
	});
}

function imgShow(value){
	var li=$('<li></li>');
	if(value.fbUid==getCookie('cookieFbUid')){
		li.append($('<img></img>').addClass('xImg')
				.attr('src','../images/oneX.png').attr('id','deleteImg'));
		li.append(	$('<img></img>').addClass('updateImg')
				.attr('src','../images/pencil.png').attr('id','updateImg'));
		li.append(	$('<img></img>').addClass('updateImg').css('visibility','hidden')
				.attr('src','../images/update2.png').attr('id','updateImg2'));
		li.append($('<label>취소</label>').addClass('cancelUpdate displayNone'));
		return li;
	}
}
