var currPage=1;
var className = sessionStorage.getItem('className');

$('#list').live('pageinit', function(event){
	if(className=='undefined'||className==null){
		className ="not_connected";
	}
	document.body.className = className;
	
	getList();
	
	//----------------- accordion set ------------------------//
	var lastEvent = null;
	var slide  = "#nav > ul";
	var alink  = "#nav > li";
	
	function listViewAccordion(){
		var detailId = $(this).attr('title-pk');
		
		if (this == lastEvent) return false;
		lastEvent = this;
		setTimeout(function() {lastEvent = null;}, 200);

		if ($(this).attr('class') != 'active') {
			$(slide).slideUp();
			$(this).next(slide).slideDown();
			$(alink).removeClass('active');
			$(this).addClass('active');
		} else if ($(this).next(slide).is(':hidden')) {
			$(slide).slideUp();
			$(this).next(slide).slideDown();
		} else {
			$(this).next(slide).slideUp();
		}
		
		$.ajax({
			async : false,
			url: surl+'/main/mainInfoListDetail.do',
			dataType: 'json',
			data: {miNo:detailId},
			success: function(data, textStatus, jqXHR) {
				if(data.status == 200) {
					createListViewContent(data.result, data.resultList);
				} else {
					alert("서버에서 데이터를 가져오는데 실패했습니다.");
					debug(data.message);
				}
			}
		});
	}
	
	$(alink).live('click',listViewAccordion).focus(listViewAccordion);
	
	$('#listViewAddBtn').live('click',function(){
		currPage++;
		getList();
	});
});

function createListViewContent(value, valueList){
	$('.listViewContent').html('');
	$('.listViewContent').append(createPhotoDiv(valueList[1]))
						.append(createListAddress(value))
						.append(createListContext(value))
						.append(createInvestiItems(valueList[0]));
}

function createListAddress(value){
	return $('<li></li>').html("<span class='contentSubTitle'>주소</span><br><p class='contentSubContent'>"+value.address+"</p><br>");
}
function createListContext(value) {
	return $('<li></li>').html("<span class='contentSubTitle'>내용</span><br><p class='contentSubContent'>"+value.miContext+"</p><br>");
}
function createInvestiItems(investiItems) {
	$('.listViewContent').append($('<div></div>').addClass('investiItems').html("<span class='contentSubTitle'>조사항목</span><br>"));
	for(var i in investiItems){
		$('.investiItems').append("<span class='contentSubContent'>"+investiItems[i].investiItemName+"&nbsp;:&nbsp;&nbsp;&nbsp;<span style='font-size:14px; color:Red; weight:bold;'>"+investiItems[i].ansTypeItemName+"</span></span><br>");
	}
}
function createPhotoDiv(photos){
	if(photos[0]==undefined){
		return $('<img></img>').attr('id','listViewPhoto')
		.attr('src',surl+'/images/ManU.png'); 
	}else{
		return $('<img></img>').attr('id','listViewPhoto')
		.attr('src','http://14.63.224.161:8080'+photos[0].pathName+photos[0].fileMask);
	}
}

//AJAX nav
function getList() {
	$.ajax({
		url: surl+'/main/mainContextList.do',
		dataType: 'json',
		data: {page:currPage},
		success: function(data, textStatus, jqXHR) {
			if(data.status == 200) {
				$.each(data.result,createListView);
			} else {
				alert("서버에서 데이터를 가져오는데 실패했습니다.");
				debug(data.message);
			}
		}
	});
}

function createListView(index,value){
	$('#nav').append($('<li></li>').attr('id','listViewTitleBar').attr('title-pk',value.miNo).append( createListViewInvestiTypeIcon(value) )
																							.append( createListViewFirstRow(value) )
																							.append( createListViewSecondRow(value) )
																							.append('<hr color="gray" width="97%" size="2" noshade>'))
			.append($('<ul></ul>').addClass('listViewContent'));	
}

function createListViewInvestiTypeIcon(value){
	return $('<div></div>').attr('id','listViewCommunityIcon').append($('<img></img>').attr('src','../images/icons/'+selectMarker(value)+'.png'));
}
function createListViewFirstRow(value){
	return $('<div></div>').attr('id','listViewFirstRow').append( $('<div></div>').attr('id','listViewTitle').html(value.miTitle) )
														.append( $('<div></div>').attr('id','listViewMiDate').html( new Date(value.miDate).format("yyyy.MM.dd") ));
}
function createListViewSecondRow(value){
	return $('<div></div>').attr('id','listViewSecondRow').append( $('<div></div>').attr('id','listViewCreatorName').html('- '+value.fbName+' -') );
}

function selectMarker(value){
	var iconNum = 0;
	for(var i=0;i<investiItemTypeList.length;i++){
		if(investiItemTypeList[i][1] == value.investiItemType){
			iconNum = i;
			break;
		}
	}
	return iconNum;
}