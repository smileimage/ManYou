//var boardType =1;
var boardCount=0;
var countsearch=0;
var filecount= new Array(5);

if (localStorage.getItem("boardTypeNo")){
	var boardTypeNo = localStorage.getItem("boardTypeNo");
	var boardTitle = localStorage.getItem("boardTitle");
};


$(document).ready(function(){
		$('#boardList').removeClass('displayNone');
		$('#boardTitle').text(boardTitle);
		$('#replyForm').submit(function() { 
	        $(this).ajaxSubmit({ 
				 type:"POST",
				 dataType:"json",
				 beforeSubmit: beforeshowRequestreply,   
				 success: successshowResponsereply   
			   }); 
	        return false; 
		});
	//$("textarea").cleditor()[0].focus();
	//	$("textarea").cleditor({
	$("#gbContext").cleditor({
			width:       691, // width not including margins, borders or padding
	         height:       220 // height not including margins, borders or padding
	});
	//$("#content_view").cleditor();
	$("#registerForm").validate({
		rules: {
			gbName: "required",
			gbTitle: "required",
		    gbContext: "required"
		},
		 messages: {
		 	gbName: "이름을 입력해 주세요",
		 	gbTitle: "제목을  입력해 주세요",
		    gbContext : "내용을 입력해 주세요."
		      }
		
	});

	$('#registerForm').submit(function() { 
        $(this).ajaxSubmit({ 
			 type:"POST",
			 dataType:"json",
			 beforeSubmit:  showRequest,   
			 success: showResponse   
		   }); 
        return false; 
    }); 
	
	prepareCenterList();
	prepareRegister();
	prepareSearch();

//	document.body.scrollIntoView(true); 
//	parent.document.all.innerframe.height = document.body.scrollHeight; 
});

function permissionlevel(value){
	console.log(value);
	console.log(getCookie('cookieMemberLevel'));
	$('#formBtn').addClass('displayNone');
	if(getCookie('cookieMemberLevel') >= value){	
	$('#formBtn').removeClass('displayNone');
	};
}

function prepareRegister(){
	$('#addBtn').bind('click',function(event){

		if($("#registerForm").valid()){
		}else{
			msgbox ("필수 항목을 입력해 주세요.");
			return false;
			}
			
	});
}

function showRequest(formData, jqForm, options) { 
    var queryString = $.param(formData); 
     console.log('About to submit: \n\n' + queryString); 
    return true; 
} 
 
function showResponse(responseText, statusText, xhr, $form)  { 
	$('#pageView').attr('class',"hidden");
	$('#addBtn').attr('class',"hidden");
	$('#formBtn').attr('class','');
	$("#uploader").find('li').remove();
	fileCountRest();
	$("#registerForm").clearForm();
	var editor = $("#gbContext").cleditor()[0];
	  editor.clear();
//      editor.execCommand('inserthtml',"");
//      editor.updateTextArea();
//      editor.focus();
	refreshCenterList();
	msgbox("새로운 글을 등록하였습니다.");
	
} 

function fileCountRest(){
			for(var i=0;i<filecount.length;i++){
			filecount[i]=null;
		};
	
}

	function beforeshowRequestreply(formData, jqForm, options) { 
	    var queryString = $.param(formData); 
	     console.log('About to submit: \n\n' + queryString); 
	    return true; 
	} 
	
	function successshowResponsereply(responseText, statusText, xhr, $form)  { 
		refreshCenterList();
		msgbox("수정을 완료 하였습니다.");
		$('#replyList #gbContext_view').css("background","#FFFFFF");
		$('#replyList .editGrp .button').detach();
		refreshReplyList();
	} 

function refreshCenterList() {

	$.ajax({
		url: 'list.do',
		dataType: 'json',
		data: {boardTypeNo:boardTypeNo},
		success: function(data, textStatus, jqXHR) {
			$('ul.listUL').remove();
			if(data.status == 200){
				boardCount= data.result.length;
				$('ul.listUL').detach();
				$('ul.firstChar').detach();
				$.each( data.result, addBoardRowInTable );
				permissionlevel(data.resultList);
			}else{
				alert("서버에서 데이터를 가져오는데 실패했습니다.");
				debug(data.message);
			}
			$('#paging_container').pajinate();
		}
	});
}

function prepareCenterList() {

	$('#prevPage').click(function() {
		--currPage;
		refreshCenterList();
	});
	
	$('#nextPage').click(function() {
		++currPage;
		refreshCenterList();
	});
	
	$('#scrollList ul.listUL').live('click', function(event) {
		$('#pageView').attr('class','hidden');
		$('#pageDetail').attr('class','');
		$.getJSON('detail.do', {
			gbNo:$(this).attr('gbno'),
			gbGrp: $(this).attr('gbgrp')
		}, 
		function(data, textStatus, jqXHR){
			if(data.status ==200){
				$('ul.replyListUL').remove();
				$.each( data.result, replyBoardRowInTable );
				$('#replyList ul.replyListUL:first').addClass('firstLine');
				$.each( data.resultList, addFileListRowInTable );  //첨부 파일 리스트 생성
				boardCheckAttach(data.resultList);
				$('#pageDetail_view').attr("class",'');
				$('#formBtn').attr('disabled','disabled');
			}else{
				alert("서버에서 데이터를 가져오는데 실패했습니다.");
				debug(data.message);
			}
		});
	});

	$('#cancleBtn').bind('click', function(event){
		$('#registerForm').clearForm();
		$('#formBtn').attr('class','');
		$('#pageView').attr('class',"hidden");
		$('#addBtn').attr('class',"hidden");
	});

	$('#formBtn').bind('click',function(event){
		$('#pageView').attr('class',"");
		$('#addBtn').attr('class',"");
		$('#formBtn').attr('class','hidden');
		$('#registerForm').clearForm();
		$('#gbName').val(getCookie('cookieFbName'));
		$('#fbUid').val(getCookie('cookieFbUid'));
		$('#boardTypeNo').val(boardTypeNo);
	});

	$('#cancleEdit').bind('click',function(event){
		$('#btngrpView').removeAttr('class','');
		$('#btngrpEdit').attr('class','hidden');
	});
	
	$('#closeview').bind('click',function(event){
		$('#formBtn').removeAttr('disabled');
		$('#pageDetail').attr('class','hidden');
		$('ul.replyListUL').detach();
		$('#fileList li').detach();
		fileCountRest();
		// 리스트 목록 refresh
		if ($('#namesearch').val()==""){
			refreshCenterList();	
		}else{
			
		};
		
	});

	$('#replyAction').live('click',function(event){
		$("#gbno_view").val($(this).attr('gbno'));
		$("#gbseq_view").val($(this).attr('gbseq'));
		$("#gblvl_view").val($(this).attr('gblvl'));
		$('#replyEditbox').detach();
		$(this).parent(".replyListUL").append(createEditbox());
	});
	
	$('#replyCancle').live('click',function(event){
		$('#replyEditbox').remove();
	});
	
	$('#replyBtn').live('click', function(event) {
		replyAdd();
	});
	
	$('.replyActionDelete').live('click',function(event){
		$("#gbno_view").val($(this).attr('gbno'));
		$("#gbgrp_view").val($(this).attr('gbgrp'));
		$("#gbseq_view").val($(this).attr('gbseq'));
		$("#gblvl_view").val($(this).attr('gblvl'));
		
		$.getJSON('delete.do', {
			
			gbNo: $(this).attr('gbno'),
			gbSeq : $('#gbseq_view').val(),
			gbGrp : $('#gbgrp_view').val(),
			gbLvl : $('#gblvl_view').val()
		}, 
		function(data, textStatus, jqXHR){
			if(data.status ==200){
				refreshCenterList();
				refreshReplyList();
				msgbox("삭제를 완료 하였습니다.");
			}else{
				alert("서버에서 데이터를 가져오는데 실패했습니다.");
				debug(data.message);
			}
		});
		
	});
	
	$('.replyActionEdit').live('click',function(event){
		
		$("#gbno_view").val($(this).attr('gbno'));
		$("#gbseq_view").val($(this).attr('gbseq'));
		$("#gblvl_view").val($(this).attr('gblvl'));
		$('#replyList .gbContext_viewLi').css("background","#FFFFFF");
		replyActionGrpRemove();
		$("#replyList .replyListUL").removeClass('select');
		$(this).parent(".replyListUL").addClass('select');
		var gbContext = $('#replyList .select .gbContext_viewLi').html();
		$('#replyList .select .gbContext_viewLi').detach();
		var gbno = $('#replyList .select .replyActionEdit').attr('gbno');
		$(this).parent(".replyListUL:last")
													.append('<li id="replyActionEditComplete" class="button" gbno='+gbno+'>수정 완료</li>')
													.append('<li id="replyActionCancle" class="button" gbno='+gbno+'>수정 취소</li>')
													.append('<li  class="gbContext_viewLi" ><textarea id="gbContext_view" name="gbContext" >' + gbContext+ '</textarea></li>')
													.append('<li><input type="hidden" name="gbNo" value="' +gbno+ '"/></li>');
		$('#replyList .select .gbContext_viewLi').css("background","#C0C0C0");
		$(this).addClass('hidden');
		if ($(this).parent().is(".firstLine")){
			$('#fileList .fileDelBtn').removeClass("hidden");
			$('#editAttachfile').removeClass("hidden");
			$('#fileListDiv').removeClass("hidden");
		};
		$('#replyList .select #replyAction').addClass("hidden");
		$('#replyList .select .replyActionDelete').addClass("hidden");
		$("#replyList .firstLine #gbContext_view").cleditor();
	});
	
			 
			 
//	$('#attachment').live("click",function(event){
//		$('#attachment').toggle(function() {
//	        $("#fileListDiv").animate({"marginLeft": "+=0px"},200);
//	        $("#fileListDiv").fadeIn(200);
//	    },function(){
//	        $("#fileListDiv").animate({"marginLeft": "-=0px"}, 200);
//	        $("#fileListDiv").fadeOut(200);
//	    }).trigger('click');
//	});
//	
//	$('#editAttachfile').live('click',function(event){
//		var count = 0;
//		for (var i=0 ; i<filecount.length; i++){
//			if (filecount[i] == null && count<5) {
//				filecount[i] = i+1;
//				editUploaderAppend(filecount[i]);
//				$('#doc'+filecount[i]).click();
//				count++;
//				break;
//			}else{
//				msgbox("첨부파일은 5개 까지 가능합니다. ");
//			};
//		}
//	});
//
//	function editUploaderAppend(listNo){
//	
//		$("#edituploader").append(attachFileList(listNo));
//		
//		$('#doc'+listNo).change(function(click) {
//			var fileName = this.value;
//			var lastPointIndex = fileName.lastIndexOf("\\");
//			var fileExt = fileName.substring(lastPointIndex+1);
//			  $('#fname'+listNo).html(fileExt);
//			});
//		
//	};
//
//	function attachFileList(listNo){
//		return ('<li  id="li'+ listNo + '"><input type="file" name="doc" id="doc'+ 
//				listNo+'" class="hidden"/><div id="fname'+ 
//				listNo+'"></div><div><img id="SelectDelBtn'+
//				listNo+'" src="images/del.png" width="15px" class="fileDelBtn"></li>');
//	}
	
	function replyActionGrpRemove(){
		$('#replyActionEditComplete').detach();
		$('#replyActionCancle').detach();
		$('#replyActionDelete').detach();
		var gbContext =$('#gbContext_view').val();
		$('#replyList .select .gbContext_viewLi').append(gbContext);
		$('#gbContext_view').remove();
		$('#replyList .cleditorMain').remove();
		$('#replyList  #replyAction').removeClass("hidden");
		$('#replyList  .replyActionDelete').removeClass('hidden','').addClass('button');
		$('#replyList  .replyActionEdit').removeClass('hidden','').addClass('button');
		$('#fileListDiv').addClass("hidden");
	};
	
	$('#replyActionCancle').live('click',function(event){
		$('#replyList .select .gbContext_viewLi').css("background","#FFFFFF");
		replyActionGrpRemove();
		$('#fileList .fileDelBtn').addClass("hidden");
		$('#editAttachfile').addClass("hidden");
		$('#replyList .select #replyAction').removeClass("hidden");
		$('#replyList .select .replyActionEdit').removeClass('hidden','').addClass('button');
		$('#replyList .select .replyActionDelete').removeClass('hidden','').addClass('button');
		$('#fileListDiv').addClass("hidden");
	});
	
	
	$('#replyActionEditComplete').live('click',function(event){
		var gbno = $(this).attr("gbno");
		$('#replyForm').submit();  //파일 업로드 관련 form
		replyUpdate(gbno);
	});
	
		function replyUpdate(gbno){
			$.getJSON('updatereply.do', {
				gbNo: gbno,
				gbContext: $('#replyList .select #gbContext_view').val(),
			}, 
			function(data, textStatus, jqXHR){
				if(data.status ==200){
					refreshCenterList();
					msgbox("수정을 완료 하였습니다.");
					$('#replyList #gbContext_view').css("background","#FFFFFF");
					$('#replyList .editGrp .button').detach();
					refreshReplyList();
					
				}else{
					alert("서버에서 데이터를 가져오는데 실패했습니다.");
					debug(data.message);
				}
			});
			
		};	
	
	$('#scrollList ul.listUL').live('mouseover', function(event) {
		$(this).css('background-color','white');
		$(this).css('cursor','pointer');
	});

	$('#scrollList ul.listUL').live('mouseout', function(event) {
		$(this).css('background-color','');
	});

	
//	$('#attachfile').bind('click',function(event){
//		var count = 0;
//		for (var i=0 ; i<filecount.length; i++){
//			if (filecount[i] == null && count<5) {
//				filecount[i] = i+1;
//				uploaderAppend(filecount[i]);
//				$('#doc'+filecount[i]).click();
//				count++;
//				break;
//			}else{
//				msgbox("첨부파일은 5개 까지 가능합니다. ");
//			};
//		}
//		});

	refreshCenterList();
}

//function uploaderAppend(listNo){
//	
//	$("#uploader").append(attachFileListAdd(listNo));
//	
//	$('#SelectDelBtn'+listNo).live('click',function(){
//		$('#li'+listNo).remove();
//		filecount[listNo-1]=null;
//	});
//	
//	$('#doc'+listNo).change(function(click) {
//		var fileName = this.value;
//		var lastPointIndex = fileName.lastIndexOf("\\");
//		var fileExt = fileName.substring(lastPointIndex+1);
//		  $('#addfilename'+listNo).html(fileExt);
//		});
//};
//
//function attachFileListAdd(listNo){
//	return ('<li id="li'+ listNo + '"><input type="file" name="doc" id="doc'+ 
//			listNo+'" class="hidden" /><div id="addfilename'+ 
//			listNo+'"></div><div><img id="SelectDelBtn'+
//			listNo+'" src="images/del.png" width="15px" class="addfileDelBtn"></div>');
//}


function addFileListRowInTable(index, value){
	
	$('#fileDelBtn'+index).live('click',function(){
			
			$.getJSON('fileDelete.do', {
				gbNo: value.gbNo,
				fileMask: value.fileMask
			}, 
			function(data, textStatus, jqXHR){
				if(data.status ==200){
					console.log(data.result);
					$('#li'+index).detach();
				}else{
					alert("서버에서 삭제하는데 실패했습니다.");
				}
			});
			
		});

	
	$('#fileList').append( '<li id="li'
			+ index + '"><a href="download.do?fileMask=' 
			+ value.fileMask + '&fileName=' 
			+ value.fileName +' ">' 
			+ value.fileName 
			+'</a><img id="fileDelBtn' 
			+ index+ '" src="images/del.png" width="15px" class="fileDelBtn hidden"></li>');
}	
	


function createEditbox(){
	return $('<div id= "replyEditbox" ></div>').addClass("replybox")
		//login base시 아래줄 삭제 예정 
				.append('<li><input type="text" name="gbName_reply" id="gbName_reply" value='+getCookie('cookieFbName')+'  readOnly /></li>')
				.append('<li id="replyBtn" class ="button">덧글 입력</li>')
				.append('<li id="replyCancle" class ="button">덧글 취소</li>')
				.append('<li><textarea name="gbContext_reply" id="gbContext_reply" placeholder="답글 작성하기 " ></textarea></li>')
				.append('<li ><input type="text" name="boardTypeNo_reply" id="boardTypeNo_reply" value='+boardTypeNo+' class="hidden"></li>')
				.append('<li ><input type="text" name="fbUid_reply" id="fbUid_reply" value='+getCookie("cookieFbUid")+' class="hidden></li>');
};


function createBoardRow(index,value){
	
	
	var writedate = new Date(value.gbDate).format("yyyy.MM.dd");
	var currentTime = Date.now(); 
	var writedate1 = new Date(value.gbDate);
	var currentTime1 = new Date(currentTime);
	diffdate = currentTime1-writedate1;
		return  $('<ul></ul>').addClass('listUL')
		.attr("gbno",value.gbNo)
		.attr("gbgrp",value.gbGrp)
		.append('<li class="listNo">' + boardCount-- + '</li>')
		.append('<li class="listTitle">' + value.gbTitle  +'</li>')
		.find('.listTitle')
		.append(''+(value.countGRP-1)>0?'<span class="listcount">[' + (value.countGRP-1)+ ']</span>':"")
		.append(' '+(value.countAttach)>0?'<img src="images/icon_file.gif" class="blankbox">':"")
		.append(' '+(diffdate)<(60*60*72*1000)?'<img src="images/icon_new.gif" class="blankbox">':"")
		.end()
		.append('<li class="listDate">' +writedate  + '</li>')
		.append('<li class="listName">' + value.gbName + '</li>')
		.append('<li class="viewCount">' + value.gbClickCount + '</li>')
		.appendTo('#scrollList');		
}



	function addBoardRowInTable(index,value){
		$('#scrollList').append(createBoardRow(index,value));
		
	}

	function replyAdd(){
		$.post('addReply.do', {
			gbName: $('#gbName_reply').val(),
			gbTitle: $('ul.replyListUL.firstLine li.title_view').text(),
			gbContext: $('#gbContext_reply').val(),
			boardTypeNo: $('#boardTypeNo_reply').val(),
			fbUid: getCookie("cookieFbUid"),
			gbGrp:$('#gbgrp_view').val(),
			gbSeq:$('#gbseq_view').val(),
			gbLvl:$('#gblvl_view').val(),
			gbNotice:$('#gbNotice').attr('checked')
		}, 
		function(data, textStatus, jqXHR) {
			if (data.status == 200) {
				formclear();
				msgbox("Reply을 등록 하였습니다.");
				refreshReplyList();
				refreshCenterList();
				
			} else {
				alert("등록에 실패하였습니다.");
			}
		},
		'json'
		);
		
	}

	function formclear(){
		$('#gbName').val("");
		$('#gbTitle').val("");
		$('#gbContext').html("");
		$('#gbName_reply').val("");
		$('#gbContext_reply').val("");
		$('#gbNotice').attr('checked',false);
	}

	function refreshReplyList(){
		$.getJSON('detail.do', {
			gbGrp: $("#gbgrp_view").val(),
			gbNo: $("#gbno_view").val()
		}, 
		function(data, textStatus, jqXHR){
			if(data.status ==200){
				$('ul.replyListUL').remove();
				if(data.result.lenth>0){
					$.each( data.result, replyBoardRowInTable );
					$('#replyList ul.replyListUL:first').addClass('firstLine');
					$.each( data.resultList, addFileListRowInTable );
					boardCheckAttach(data.resultList);
					$('#btngrpView').attr('class','');
					$('#btngrpEdit').attr('class','hidden');
				}else{
					$('#formBtn').removeAttr('disabled');
					$('#pageDetail').attr('class','hidden');
				}
			}else{
				alert("서버에서 데이터를 가져오는데 실패했습니다.");
				debug(data.message);
			}
		});
	}



		function createReplyBoardRow(value){
		var writedate = new Date(value.gbDate).format("yyyy.MM.dd hh:mm");
		$('#gbgrp_view').val(value.gbGrp);
		$('#gbseq_view').val(1);
		$('#gblvl_view').val(0);
		var listitem =  $('<ul></ul>').addClass('replyListUL');
		if(value.gbLvl==1){
			listitem.addClass('replylevel1');
		}  else if (value.gbLvl>1) {
			listitem.addClass('replylevel2');
		}
		if(value.gbSeq==1){
		listitem.append("<li class='title_view' >" + value.gbTitle + "</li>")
		.append('<li class="detailcount">조회수 : ' +value.gbClickCount  + '</li>');
			}
		
			listitem.append('<li class="gbName_view" id="gbName_view">'+ value.gbName +'</li>');
			listitem.append('<li class="writedate_view">' +writedate  + '</li>');
			listitem.append(createItemLi(value));
		if(value.fbUid==getCookie('cookieFbUid')){
			listitem.append(createItemLiModify(value));
			listitem.append(createItemLiDelete(value));
		}
		
		if(value.gbSeq==1){
			listitem.append(createItemLiAttach());
		}
		listitem.append('<li class="gbContext_viewLi" >' + value.gbContext + '</li>');
		if(value.gbSeq==1){
//			<div id="attachFileListDIV">
//			
//			</div>
			listitem.append('<div id="fileListDiv" class="hidden"><ul id="fileList"></ul><div id="edituploader"></div><span id="editAttachfile" class="button_small button hidden" >파일 첨부 하기</span></div>');
		}
		listitem.appendTo('#replyList');	
		return listitem;
	}			

	function createItemLiModify(value){
		return $('<li class="replyActionEdit button">수정</li>')
					.attr("gbno",value.gbNo)
					.attr("gbgrp",value.gbGrp)
					.attr("gbseq",value.gbSeq)
					.attr("gblvl",value.gbLvl);
	}

	function createItemLi(value){
		return $('<li id="replyAction" class="button">덧글</li>')
					.attr("gbno",value.gbNo)
					.attr("gbgrp",value.gbGrp)
					.attr("gbseq",value.gbSeq)
					.attr("gblvl",value.gbLvl);

	}

	function createItemLiDelete(value){
		return $('<li class="replyActionDelete button">삭제</li>')
					.attr("gbno",value.gbNo)
					.attr("gbgrp",value.gbGrp)
					.attr("gbseq",value.gbSeq)
					.attr("gblvl",value.gbLvl);

	};			

	function createItemLiAttach(value){
		return $('<li id="attachment"></li>');
	};			
	
	
	function replyBoardRowInTable(index,value){
		$('#replyList').append(createReplyBoardRow(value));
	};

	function msgbox(text){
		var label = document.getElementById("txtLabel");
		label.innerHTML=text;
		$("#msgbox").attr("class","");
		setTimeout(function(){
			$("#msgbox").attr("class","hidden");
		}, 600);
	
	};
		
	function boardCheckAttach(value){
		if (value.length> 0){
		 $('#attachment').html("첨부파일 ["+value.length+"]");
		}
	}


	

