$(document).ready(function(e) {
	createOpenDialogDiv();
	
});

function getDetailDataAndRefresh(miNo){
	createRemoveDiv();
	$.getJSON('../main/mainInfoListDetail.do', {
		miNo: miNo
	}, 
	function(data, textStatus, jqXHR){
		if (data.status == 200) {
			var dialogData= data.result;
			prepareMappingInfoDetail(dialogData, data.resultList[0], data.resultList[1]);
			$('#openDialog').dialog('option','title', dialogData.interestCommunityName);
		} else {
			debug(data.message);
		}
	});
};

function createRemoveDiv(){
	$('#removeLeftTopDiv').remove();
	$('#removeRightTopDiv').remove();
	$('#detailLeftTopDiv').append(createDivEle('removeLeftTopDiv'));
	$('#detailRightTopDiv').append(createDivEle('removeRightTopDiv'));
};

function addMappingInfoList(index, value){
	$('#' + localStorage.getItem('divId')).append(createContents(value));
}

/* 접근상태정보 출력 폼*/
function createContents(value){
	return $('<div></div>').mouseover(function() {
		  $(this).find('.detailImg').removeClass('displayNone');
	}).mouseout(function() {
		  $(this).find('.detailImg').addClass('displayNone');
	})
	.append(createMappingInfoListTable(value));	
}

function createMappingInfoListTable(value){
	return $('<table></table>').addClass('mappingInfoTable')
	.append($('<colgroup></colgroup>').append(
			$('<col>').addClass('colCssHead')).append(
			$('<col>').addClass('colCssImg')).append(
			$('<col>').addClass('colCssDate')).append(
			$('<col>').addClass('colCssName')))
	.append(createTitleTR(value))
	.append(createInvestiAnsItemTR(value))
	.append(createLocationTR(value))
	.append(createOption(value));
}

function createTitleTR(value){
	return $('<tr></tr>')
	.append(createInvestiItemIconTD(value))
	.append(createPhotoTD(value))
	.append($('<td colspan="2" ></td>').text(value.miTitle));
}

function createInvestiAnsItemTR(value){
	return $('<tr></tr>')
	.append($('<td></td>').text(new Date(value.miDate).format("yyyy년  MM월 dd일 a\/p hh:mm")))
	.append($('<td align="center" ></td>').text(value.fbName));
}

function createInvestiItemIconTD(value){
	return $('<td rowspan="2" align="center"></td>')
	.append($('<img></img>')
			.addClass('contentIcon')
			.attr('src','../images/icons/'+ selectMarker(value.investiItemType) +'.png')); // DB 경로명
}
function createPhotoTD(value){
	if(value.pathName==null){
		return $('<td rowspan="4" align="center"></td>')
		.append($('<img></img>').addClass('contentPhoto')
				.attr('src','../images/ManU.png')); // DB 경로명
	}else{
		return $('<td rowspan="4" align="center"></td>')
		.append($('<img></img>').addClass('contentPhoto')
				.attr('src',value.pathName+value.fileMask)); // DB 경로명
	}
}

function createLocationTR(value){
	return $('<tr></tr>')
	.append($('<td rowspan="2" align="center"></td>').text(value.investiItemType))
	.append($('<td colspan="2"></td>').text(value.address));
}

function createOption(value){
	return $('<tr></tr>')
		.append($('<td>' + "좋아요 ( " + goodCount(value) + " )&nbsp;&nbsp;" +
							"댓글 ( " + replyCount(value) + " )" + '</td>'))
					.append($('<td></td>').append($('<img src="../images/detail_img.png">')
							.attr('miNo', value.miNo)
							.addClass('detailImg')
							.addClass('displayNone')
							.bind('click',function(){
								getDetailDataAndRefresh($(this).attr('miNo'));
								sessionStorage.setItem('miNo', value.miNo);
								$('#openDialog').dialog('open');
								$('#detailMiContents #miTitle').attr("disabled", "disabled");
							})));
}