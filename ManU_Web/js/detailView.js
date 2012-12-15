var updateCheckList = [];

$(document).ready(function(){
	$('#updateBtn').live('click', function(){
		createInvestiAnsItemList($('#detailInvestiItemType option:selected').text(),'detailInvestiAnsItemList');
		$('#detailInvestiAnsItemList').each(checkInvestiAnsItem);
		$('#detailInvestiItemType').removeClass('detailSelectBoxCss');
		$('#detailInvestiAnsItemList ul li select').removeClass('detailSelectBoxCss');
		clickAfterUpdateBtn(this);
	});

	$('#shareBtn').live('click',function(){
		twitterInsert();
	});

	$('#miDeleteBtn').live('click',function(){
		var href = location.href;
		href = href.substring(href.lastIndexOf("/"));

		$.ajax({
			url: '../main/deleteMappingInfo.do',
			dataType: 'json',
			data: {miNo : sessionStorage.getItem('miNo'),
				fbUid: getCookie('cookieFbUid'),
				date: ($(this).attr('miDate')+"%")},
				success: function(data, textStatus, jqXHR) {
					if(data.status == 200) {
						$('#openDialog').dialog('close');
						if(href == '/mypage.html'){
							refreshMypageMappingInfoList($('#miNo').val());
							refreshMypageMarkers();
						}else if(href == '/communityManager.html'){
							for(var i = 0 ; i < 5; i++){
								$('#communityMappingInfoListTable tr').eq(1).remove();
								$('#communityMemberListTable tr').eq(2).remove();
							}
							communityManagerList();
							refreshAllMarkerView(localStorage.getItem('communityNumber'));
						}else{
							refreshMappingInfoList();
							refreshAllMarkerView(0);
						}
					} else {
						alert("서버에서 데이터를 가져오는데 실패했습니다.");
						debug(data.message);
					}
				}
		});


	});

	$('#detailInvestiItemType').live('change',function(){
		$('#detailInvestiAnsItemList').remove();
		$('#removeRightTopDiv').append(createInvestiItemTypeDiv().attr('id','detailInvestiAnsItemList'));
		createInvestiAnsItemList($('#detailInvestiItemType option:selected').text(),'detailInvestiAnsItemList');
		$('.detailContentIcon')
		.attr('src','../images/icons/'+ selectMarker($('#detailInvestiItemType option:selected').text()) +'.png');
	});

	$('#detailReplyDiv #reContext').live('keydown',function(event){
		if(getCookie('cookieFbUid') == null){
			$('#loginBtn').click();
		}else if(event.keyCode == '13'){
			$.ajax({
				url: '../main/addReply.do',
				dataType: 'json',
				data: {miNo : $('#goodBtn').attr('miNo'),
					fbUid : getCookie('cookieFbUid'),
					reContext : $('#reContext').val()
				},
				success: function(data, textStatus, jqXHR) {
					if(data.status == 200) {
						$('#reContext').val('');
						$('#detailLeftBotDiv #reply').remove();
						detailReplyList($('#goodBtn').attr('miNo'));
						refreshMappingInfoList();
					} else {
						alert("서버에서 데이터를 가져오는데 실패했습니다.");
						debug(data.message);
					}
				}
			});
		}
	});

	$('#replyDeleteBtn').live('click',function(){
		$.ajax({
			url: '../main/deleteReply.do',
			dataType: 'json',
			data: {reNo : $(this).attr('reNo')},
			success: function(data, textStatus, jqXHR) {
				if(data.status == 200) {
					$('#detailLeftBotDiv #reply').remove();
					detailReplyList($('#goodBtn').attr('miNo'));
					refreshMappingInfoList();
				} else {
					alert("서버에서 데이터를 가져오는데 실패했습니다.");
					debug(data.message);
				}
			}
		});
	});
});

function twitterInsert(){
	var url = "http://14.63.224.161:8080/ManU/main/index.html";
	var title = $('#miTitle').val();
	var context = $('#miContext').val();

	window.open("../twitter/signin.jsp?title=" + title + 
			"&context=" + context + "&url=" + url, "_blank", "width:500px, height:300px");
}

function checkInvestiAnsItem(index, labelData){
	var currData = $(labelData).children();
	for(var i=0; i< currData.length;i++){
		for(var j=i+1; j< currData.length;j++){
			if($(currData[i]).text() == $(currData[j]).text()){
				$(currData[j]).remove();
			}
		}
	}
};

function updateCheckLists(contextData,investiList){
	updateCheckList = [];
	updateCheckList.push(contextData.miTitle);
	updateCheckList.push(contextData.miContext);
	updateCheckList.push(contextData.address);
	updateCheckList.push(investiList[0].investiItemType);

	$.each(investiList,function(index,value){
		updateCheckList.push(value.ansTypeItemName);
	});
}

function updateCheck(){
	var check = true;
	if(updateCheckList[0] != $('#miTitle').val()){check = false;}
	if(updateCheckList[1] != $('#miContext').val()){check = false;}
	if(updateCheckList[2] != $('#address').val()){check = false;}
	if(updateCheckList[3] != $('#detailInvestiItemType').val()){check = false;}

	$.each($('#detailInvestiAnsItemList ul li select option:selected'),function(index,value){
		if(updateCheckList[index + 4] != $(value).text()){
			check = false;
		}
	});

	if(!check){
		var x = window.confirm("변경 된 내용이 있습니다. 종료하시겠습니까?");
		if(x){
			clickAfterApporve();
		}
		return x;
	}
	if(check){
		clickAfterApporve();
		return true;
	}
}

function createOpenDialogDiv(){
	$('footer').append(createMappingInfoDetail());

	$('#openDialog').dialog({
		autoOpen:false,
		maxWidth:900,
		minWidth:900,
		height: 630,
		show: "blind",
		hide: "explode",
		resizeStop: function(event, ui) {google.maps.event.trigger(mapDialog, 'resize');  },
		open: function(event, ui) {google.maps.event.trigger(mapDialog, 'resize'); },
		resizable:false,
		modal:true,
		beforeClose:function(event, ui){
			return updateCheck();
		}
	});
};

function clickAfterApporve(){
	$('#removeLeftTopDiv').remove();
	$('#removeRightTopDiv').remove();
	$('#detailLeftBotDiv .reply').remove();
	$('#reContext').val('');
	clickAfterConfirmBtn();
	fileCountRest();
	count=0;
}

function createFormTag(){
	return $('<form></form>',{
		id:"updateForm",
		enctype:"multipart/form-data",
		method:"post",
	});
}
function createMappingInfoDetail(){
	var openDialog = $('<div></div>').attr('id', 'openDialog')
	.append(createDivEle('detailLeftDiv').append(
			createDivEle('detailLeftTopDiv').append(
					createDivEle('removeLeftTopDiv') ) ).append(
							createDivEle('detailLeftBotDiv').append(
									createDetailReplyDiv())))
									.append(createDivEle('detailRightDiv').append(createFormTag().append(
											createDivEle('detailRightTopDiv').append(
													createDivEle('removeRightTopDiv')))
													.append(createRightBottomDiv().append(
															createDivEle('removeRightBotDiv')).append(
																	createDivEle('mapContainerOnDialog').addClass('hidePlugin').append(
																			createDivEle('map_canvasOnDialog'))))
																			.append($(createDivEle('updateBtnGrp').addClass('hide')).append(
																					createInput('confirmBtn','완료','button')) 
																					.append(
																							createInput('cancelBtn','취소','button').bind('click', function(){
																								sessionStorage.setItem('checkUpdating', 0);
																								count=0;
																								fileCountRest();
																								photoArray=[];
																								getDetailDataAndRefresh(sessionStorage.getItem('miNo'));
																								clickAfterCancelBtn();
																							})))
									)
									);
	return openDialog;
};

function clickAfterConfirmBtn(){
	$('#updateBtnGrp').addClass('hide');
	$('#removeRightBotDiv').removeClass('hidePlugin');
	$('#mapContainerOnDialog').addClass('hidePlugin');

};

function clickAfterCancelBtn(){
	$('#detailMiContents li').children('input').attr('disabled','true');
	$('#updateBtnGrp').addClass('hide');
	$('#updateBtn').removeAttr('disabled');
	$('#detailMiContents #miContext').attr('disabled','true');
	$('#removeRightBotDiv').removeClass('hidePlugin');
	$('#mapContainerOnDialog').addClass('hidePlugin');
	$('#goodBtn').removeAttr('disabled');
}

function clickAfterUpdateBtn(btnElement){
	$(btnElement).attr('disabled','true');
	$('#updateBtnGrp').removeClass('hide');
	$('#detailMiContents li').children('input').removeAttr('disabled');
	$('#detailMiContents #miContext').removeAttr('disabled');
	$('.fluid_container').addClass('hidePlugin');
	$('#mapContainerOnDialog').removeClass('hidePlugin');
	$('#detailInvestiItemType').removeAttr('disabled');
	$('.investiItemValue').removeAttr('disabled');
	$('#goodBtn').attr('disabled','disabled');

	$('#fileList .fileDelBtn').removeClass("hidden");
	$('#editAttachfile').removeClass("displayNone");
	$('#fileListDiv').removeClass("displayNone");
}
//-------------------------------createDiv method ---------------------
function createDivEle(divId){
	return $('<div></div>').addClass(divId).attr('id',divId);
};
//-------------------------------rightBotDiv start---------------------
function createRightBottomDiv(){
	return $('<div></div>').addClass('detailRightBottom');
};
//-------------------------------End Dialog--------------------------------

function prepareMappingInfoDetail(contextData, investiList, photoList){
	photoArray=[];
	$.each(photoList, function(index, photoData){
		var data={
				miNo: contextData.miNo,
				photoName: photoData.fileName,
				photoPath: photoData.pathName+photoData.fileMask,
				photoThumbnailPath: photoData.pathName+'thumbnail/'+photoData.fileMask,
				fileMask: photoData.fileMask,
				seq: photoData.fileSeq,
				registerDate: photoData.fileregisterDate,
				comment: photoData.fileComment
		};
		photoArray.push(data);
	});
	$('#removeRightBotDiv').load('../main/imagePluginSlide.html', photoArray, function(){
		createPhotoDiv(photoArray);
		$('#camera_wrap_1').camera({
			thumbnails: true
		});

		$('#removeRightBotDiv').append(createDivEle('attachmentList').append(createDivEle('attachment'))
				.append($('<div id="fileListDiv" class="displayNone"><ul id="fileList"></ul><div id="edituploader"></div><span id="editAttachfile" class="button_small button displayNone" >파일 첨부 하기</span></div>')));

		$.each(photoArray, addFileListRowInDetailTable );
		checkAttach(photoArray);
	});

	$('#cancelBtn').attr('mino',contextData.miNo);
	sessionStorage.setItem("miNo", contextData.miNo);
	dbLng=contextData.lng; 
	dbLat=contextData.lat;

	detailUserInfo(contextData);
	detailContent(contextData, investiList);
	detailReplyList(contextData.miNo);
	addMarkerOnDialog(contextData);
	return false;
};


function createPhotoDiv(photoArrayData){
	var cameraDiv = $('#camera_wrap_1');
	$.each(photoArrayData, function(index, data){
		var photoDiv = $('<div></div>').attr('data-thumb',data.photoThumbnailPath)
		.attr('data-src',data.photoPath);

		if(data.comment != null){
			$(photoDiv).append(
					$('<div class="camera_caption fadeFromBottom">Comment&nbsp:&nbsp'+data.comment+'</div>'));
		}
		photoDiv.appendTo(cameraDiv);
	});
}

function detailUserInfo(value){
	$('#removeLeftTopDiv').append($('<ul></ul>')
			.append($(createLI('detailPhoto',createImage('fbPhoto',value.fbPhotoPath))))
			.append($(createLI('userInfoName',value.fbName)))
			.append($(createLI('userInfoDate',value.miDate)))
			.append(
					$(createLI('userInfoBtnGrp',''))
					.append(createGoodBtn(value))
					.append(createInput('shareBtn','트위터','button'))
					.append(createUpdateBtn(value))
					.append(createDeleteBtn(value))
			));
};

function detailContent(contextData,investiList){
	updateCheckLists(contextData,investiList);
	console.log(investiList);
	$('#removeRightTopDiv').append($('<ul></ul>')
			.attr('id','detailMiContents')
			.append(createLI('','제목 : ').append(createInput('miTitle','','text').val(contextData.miTitle)))
			.append(createLI('','내용 : ').attr('style','vertical-align:top;').append(createTextArea('miContext').val(contextData.miContext).attr('disabled','true')))
			.append(createLI('','주소 : ').append(createInput('address','','text').val(contextData.address))))
			.append(createInvestiAnsItemDiv().append(createInvestiItemTypeSelectBox(contextData).attr('id','detailInvestiItemType')))
			.append($('<img></img>')
					.addClass('detailContentIcon')
					.attr('src','../images/icons/'+ selectMarker(investiList[0].investiItemType) +'.png'))
			.append(createInvestiItemTypeDiv().attr('id','detailInvestiAnsItemList'))
			.append(createInput('miNo', contextData.miNo, 'hidden'))
			.append(createInput('interestCommunityNo', contextData.interestCommunityNo, 'hidden'));
	$('#detailInvestiItemType').addClass('detailSelectBoxCss');
	$('#detailInvestiItemType').val(investiList[0].investiItemType).attr({selected:'selected',disabled:'true'});
	createInvestiAnsItemList(investiList[0]);
	$('#detailInvestiAnsItemList ul li select').each(function(index, selectBox){
		$(selectBox).val(investiList[index].investiItemNo+"="+investiList[index].ansTypeItemNo).attr({selected:'selected', disabled:'true'});
	});
	$('#detailInvestiAnsItemList ul li select').addClass('detailSelectBoxCss');
	$('#detailMiContents li').children('input').attr('disabled','true');
};

function createDetailReplyDiv(){
	return $('<div></div>').attr('id','detailReplyDiv')
	.append(createInput('reContext','','textarea').attr('placeholder','댓글을 입력하세요...'));
};

function detailReplyList(value){
	$.ajax({
		url: '../main/getReplyList.do',
		dataType: 'json',
		data: {miNo : value},
		success: function(data, textStatus, jqXHR) {
			if(data.status == 200) {
				$('.reply').remove();
				$.each(data.result,createDetailReplyUL);
			} else {
				alert("서버에서 데이터를 가져오는데 실패했습니다.");
				debug(data.message);
			}
		}
	});
};

function createDetailReplyUL(index, value){
	return  $('<div></div>').attr('class','reply')
	.append($('<ul></ul>')
			.append(createReplyDeleteBtn(value))
			.append($(createLI('registerName',value.fbName)))
			.append($(createLI('registerDate',new Date(value.reDate).format("yyyy년  MM월 dd일 a\/p hh:mm"))))
			.append($(createLI('replyContext',value.reContext))))
			.appendTo('#detailLeftBotDiv');
};

function createGoodBtn(value){

	if(getCookie('cookieFbUid') == null){
		return false;
	}

	var btn = $(createInput('goodBtn', '좋아요( '+ goodCount(value) + ' )','button'))
	.attr('goodNo','')
	.attr('miNo',value.miNo);

	$.ajax({
		url: '../main/goodCheck.do',
		dataType: 'json',
		data: {miNo : value.miNo,
			fbUid : getCookie('cookieFbUid')},
			success: function(data, textStatus, jqXHR) {
				if(data.status == 200) {
					if(data.result.count > 0){

						btn.attr('value','좋아요 취소').attr('goodNo',data.result.goodNo);

						btn.toggle(
								function(){
									$.ajax({
										url: '../main/deleteGood.do',
										dataType: 'json',
										data: {goodNo : $(this).attr('goodNo')},
										success: function(data, textStatus, jqXHR) {
											if(data.status == 200) {
												if(localStorage.getItem('divId') == 'removeListTag'){
													refreshMypageMappingInfoList(0);
												}else{
													refreshMappingInfoList(localStorage.getItem('divId'));
												}
												btn.attr('value','좋아요( '+ goodCount(value) + ' )');
											}
										}
									});
								},function(){
									$.ajax({
										async: false,
										url: '../main/addGood.do',
										dataType: 'json',
										data: {miNo : $(this).attr('miNo'),
											fbUid : getCookie('cookieFbUid')},
											success: function(data, textStatus, jqXHR) {
												if(data.status == 200) {
													if(localStorage.getItem('divId') == 'removeListTag'){
														refreshMypageMappingInfoList(0);
													}else{
														refreshMappingInfoList(localStorage.getItem('divId'));
													}
													btn.attr('value','좋아요 취소').attr('goodNo',data.result);
												} else {
													alert("서버에서 데이터를 가져오는데 실패했습니다.");
													debug(data.message);
												}
											}
									});
								});
					}else{
						btn.attr('value','좋아요( '+ goodCount(value) + ' )');

						btn.toggle(
								function(){
									$.ajax({
										async: false,
										url: '../main/addGood.do',
										dataType: 'json',
										data: {miNo : $(this).attr('miNo'),
											fbUid : getCookie('cookieFbUid')},
											success: function(data, textStatus, jqXHR) {
												if(data.status == 200) {
													if(localStorage.getItem('divId') == 'removeListTag'){
														refreshMypageMappingInfoList(0);
													}else{
														refreshMappingInfoList(localStorage.getItem('divId'));
													}
													btn.attr('value','좋아요 취소').attr('goodNo',data.result);
												} else {
													alert("서버에서 데이터를 가져오는데 실패했습니다.");
													debug(data.message);
												}
											}
									});
								},function(){
									$.ajax({
										url: '../main/deleteGood.do',
										dataType: 'json',
										data: {goodNo : $(this).attr('goodNo')},
										success: function(data, textStatus, jqXHR) {
											if(data.status == 200) {
												if(localStorage.getItem('divId') == 'removeListTag'){
													refreshMypageMappingInfoList(0);
												}else{
													refreshMappingInfoList(localStorage.getItem('divId'));
												}
												btn.attr('value','좋아요( '+ goodCount(value) + ' )');
											}
										}
									});
								});
					}
				}else {
					alert("서버에서 데이터를 가져오는데 실패했습니다.");
					debug(data.message);
				}
			}
	});
	return btn;
}


function detailAnsItem(value){
	return createLI('',value.ans_item_name)
	.appendTo('#detailMiContents');
}
function createLI(clsName,value){
	return $('<li></li>')
	.attr('id',clsName)
	.addClass(clsName)
	.append(value);
}
function createInput(inputId,value,type){
	return $('<input></input>')
	.attr('type',type)
	.attr('id',inputId)
	.attr('name',inputId)
	.attr('value',value);
}
function createImage(cName,path){
	return $('<img></img>')
	.addClass(cName)
	.attr('src',path);
}
function createTextArea(inputId, value){
	return $('<textarea></textarea>')
	.attr('id',inputId)
	.attr('name',inputId)
	.attr('value',value);

}
function createReplyDeleteBtn(value){
	if(value.fbUid == getCookie('cookieFbUid')){ 
		return $('<img id="replyDeleteBtn" src="../images/del.png"></img>').attr('reNo',value.reNo);
	}	
}

function createDeleteBtn(value){
	if(value.fbUid == getCookie('cookieFbUid')){ 
		return $(createInput('miDeleteBtn','삭제','button')).attr('miDate',value.miDate);
	}
}

function createUpdateBtn(value){
	if(value.fbUid == getCookie('cookieFbUid')){ 
		return createInput('updateBtn','수정','button');
	}
}
