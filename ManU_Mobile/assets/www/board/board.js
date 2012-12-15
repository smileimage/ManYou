

//$(document).bind('pageinit',function(){
$(document).ready(function(){
	$.ajaxSetup({cache:false});
	prepareBoardList();
	$('#scrollList .ui-listview-filter').hide();	
	
});

if(sessionStorage.getItem('id')!= null){
	var id = sessionStorage.getItem('id');
	var name = sessionStorage.getItem('name');
	var className = sessionStorage.getItem('className');
	}else{
		var id = "100001775987524";
		var name = "오세욱";
		
	};	

function prepareBoardList() {	
	console.log('id:'+id);
	console.log('name :'+ name);
	
	$('#replyAdd').bind('click',function(event){
		$('#gbcontext').remove();
		$('#addBtn').remove();
		$("#firstLine").append(addTextareaCreate())
					   .append(addBtnCreate());
	});

	function addTextareaCreate(){
		return $('<textarea id="gbcontext" name="gbcontext" placeholder="덧글 입력" ></textarea>')
			  .textinput({inline:true});
	}

	function addBtnCreate(){
		return $('<a id="addBtn">등록</a>')
			.button({ 
				create: function(event){
					console.log("button Create");
				}
			});
	};

	$('#listNo').live('click',function(event) {
		console.log($(this).attr('gbno'));
		console.log($(this).attr('gbgrp'));
		$.ajax({
				url: surl + '/board/detail.do', 
				data:{gbNo:$(this).attr('gbno'),gbGrp:$(this).attr('gbgrp')},
//				cache: false,
				success: function(data, textStatus, jqXHR){
						if(data.status ==200){
							
									$('li.replyListUL').remove();
										$.mobile.changePage("#pageView",{ transition: "slidedown"});
											$.each( data.result, replyBoardRowInTable );
						}else{
								alert("서버에서 데이터를 가져오는데 실패했습니다.");
									alert(data.message);
						}
				}
		});
	});

	$('#searchBtn').toggle(
			function(){
				$('#scrollList .ui-listview-filter').show();
			},function(){
				$('#scrollList .ui-listview-filter').hide();
			});


	$('#addBtn').live('click', function(){
		if($('#gbcontext').val() == "") {
			alert("덧글의 내용을 입력해주세요!");
			return false;
		}
		addReply();
	});
	refreshBoardList();
}

function refreshBoardList() {
//	alert("beforejson");
	$.ajax({
		url: surl + '/board/list.do',
		dataType: 'json',
		data: {boardTypeNo:1},
//		cache: false,
		success: function(data, textStatus, jqXHR) {
			if(data.status == 200){
//				alert('here');
				boardCount= data.result.length;
//				alert(boardCount);
				$.each( data.result, addBoardRowInTable );

			}else{
				alert("서버에서 데이터를 가져오는데 실패했습니다.");
				debug(data.message);
			}
		}
	});
}


function addBoardRowInTable(index,value){
	$('#boardlist').append(createBoardRow(index,value)).listview('refresh');
}

function createBoardRow(index,value){
	diffdate = Date.now()-value.gbDate;	
	console.log(diffdate);
	var litype= $('<li></li>').addClass('listLi')
	.attr("id","listNo")
	.addClass("listNo")
	.attr("gbno",value.gbNo)
	.attr("gbgrp",value.gbGrp)
	//.append(' '+(diffdate)<(60*60*72*1000)?'<img src="../images/icon_new.gif" class="blankbox">':"")
	.append('<a id="gbtitleid" class="gbtitleUi">' + ((diffdate) < (60*60*72*1000)?'<img src="../images/icon_new.gif" class="blankbox">':"")+  value.gbTitle  +'</a>')
	.appendTo('#boardlist');	
	if (value.countGRP  > 1 ){
		litype.append('<span class="ui-li-count">'+ (value.countGRP-1) + '</span>');		
	};
	return litype;
}

function replyBoardRowInTable(index,value){
	$('#pageViewDetail').append(createReplyBoardRow(value));
	if(value.gbLvl==0){
		gbContextAppend(value.gbContext); //덧글 입력  
		}
};

function createReplyBoardRow(value){
	var writedate = new Date(value.gbDate).format("yyyy.MM.dd hh:mm");
	console.log(value.gbDate);
	var listitem =  $('<li></li>').addClass('replyListUL');
	if(value.gbLvl==1){
		listitem.addClass('replylevel1');
	}  else if (value.gbLvl>1) {
		listitem.addClass('replylevel2');
	}
	if(value.gbSeq==1){
		listitem.append("<h3 id='title_view' >" + value.gbTitle + "</h3>")
		.attr('id','firstLine')
		.attr('gbNo',value.gbNo)
		.attr('gbGrp',value.gbGrp)
		.append('<span class="detailcount">조회수 : ' +value.gbClickCount  + '</span>')
		.append('<span class="writedate_view">' + writedate  + '</span>')
		.append('<p class="gbName_view" id="gbName_view"><strong> ['+ value.gbName +']</strong></p>')
		.append('<p id="gbContext_viewLi"></p>');

	}else{
		listitem.append('<span class="writedate_view">' + writedate  + '</span>')
		.append('<p class="gbName_view" ><strong>글쓴이 : ['+ value.gbName +']</strong></p>')
		.append('<p class="gbContext_viewLi">'+ value.gbContext + '</p>');
	}
	listitem.appendTo('#pageViewDetail');	
	return listitem;

}			

function gbContextAppend(value){
	$('#gbContext_viewLi').html(value);
}


function addReply(){
	$.ajax ({
		url : surl+'/board/addReply.do', 
		dataType:'json',
		type: 'POST',
//		cache: false,
		data:{
			gbName: name,
			gbTitle: $('#title_view').text(),
			gbContext: $('#gbcontext').val(),
			boardTypeNo: 1,//
			fbUid:id,
			gbGrp:$('#firstLine').attr("gbGrp"),
			gbSeq:1,
			gbLvl:0
		}, 
		success: function(data){
			if(data.status == 200){
				replyAppendRefresh($('#firstLine').attr("gbGrp"));
			} else {
				alert("Reply 등록에 실패하였습니다.");
			}
		}

	});
}


function replyAppendRefresh(value){
	$.getJSON(surl + '/board/detail.do', {
		gbGrp:value,
		gbNo:0
	}, 
	function(data, textStatus, jqXHR){
			if(data.status ==200){
				console.log("complete");
				$('li.replyListUL').remove();
				$.mobile.changePage("#pageView",{ transition: "slidedown"});
				$.each( data.result, replyBoardRowInTable );
			}else{
				alert("서버에서 데이터를 가져오는데 실패했습니다.");
				debug(data.message);
			}
	});

}

