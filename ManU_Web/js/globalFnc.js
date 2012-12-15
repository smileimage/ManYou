var divId = "";
var currPage = 0;
var mappingInfoList = new Array();
var pageCheck = 0;

var oneLinePage = 0;
var commPage = 0 ;

$(document).ready(function(e) {
	
	var href = location.href;
	href = href.substring(href.lastIndexOf("/"));
	if(getCookie('cookieFbUid') == undefined && href != "/index.html"){
		document.location.href = '../main/index.html';
	}
	
	$('#investiItemType ul li select').live('change', function(){
		$('#investiAnsItemType ul').remove();
		$('#investiAnsItemListUl ul').remove();
		$('#investiAnsItemType')
		.append(createInterestInvestiItemType($('#investiItemType ul li select option:selected').val()));
	});

	$('#investiAnsItemType ul li select').live('change',function(){
		$('#investiAnsItemListUl ul').remove();
		createInvestiAnsItemList($('#investiAnsItemType ul li select option:selected').text(),'investiAnsItemListUl');
	});
	$('#resetBtn').live('click',function(){
		resetForm();
	});
	buttonUi();
	prepareCommMappingInfoList();
});

function buttonUi(){ 
	$('#regContentBox').button({
		icons: {
	        primary: "ui-icon-pencil"
	    },
	}).bind('click',function(event){
		count=0;
		$('#regForm').children().remove();
		$('#regContentBox').attr('style','display:none');
		createRegFormDiv();
		$('#miTitle').focus();
		$( "#regFormDiv" ).show( 'drop', {}, 500 ).addClass('regFormDivCss');
		return false;
	});
}
 
function resetForm(){
	count=0;
	fileCountRest();
	$('#regContentBox').attr('style','width:900px; margin-left:10px;');
	$( "#regFormDiv" ).hide( 'drop', {}, 500 );
	return false;
}

/* 접근상태정보 등록 폼*/
function createRegFormDiv(){
	return $('#regFormDiv')
	.append(createRegForm())
	.appendTo('#regMappingInfoForm');
}

function createRegForm(){
	return $('#regForm')
	.append($(createInput('miTitle','','text')).attr('placeholder','제목'))
	.append($('<span>').append(createInput('miPropose',1,'checkbox'))
			.append($('<label for="miPropose"></lable>').append(
					createImage('spanFacebookImg', '../images/facebook_logo.jpg')))
			)
	.append($('<span>').append(createInput('twitter',2,'checkbox'))
			.append($('<label for="twitter"></lable>').append(
					createImage('spanTwitterImg', '../images/twitter_logo.png')))
			)
	.append(attachInvestiItemDiv())
	.append($(createInput('address','','text')).attr('placeholder','지도를 클릭해주세요.'))
	.append(createRegFormTextarea())
	.append(createDivEle('').append($('<ul></ul>').attr('id','uploader')))
	.append($('<span></span>').attr('id','attachfile')
			.addClass('button_small button').html('파일 첨부하기'))
			.append(createDivEle('poplayer').addClass('displayNone'))
	.append(btnGrp());
}

function attachInvestiItemDiv(){
	return $('<div></div>').attr('id','investiItemDiv')
						.append(createInvestiItemType())
						.append(createInvestiAnsItemDiv())
						.append(createInvestiItemTypeDiv());
}

function createInvestiItemType(){
	return $('<div></div').attr('id','investiItemType')
	.append(createInterestCommunityName());
}

function createInterestCommunityName(){
	return $('<ul></ul>').append($(createLI()).append( createInterestCommunityNameSelectBox() ));
}

function createInterestInvestiItemType(value){
	return $('<ul></ul>').append($(createLI()).append( createInvestiItemTypeSelectBox(value) ));
}

function createRegFormTextarea(){
	return $('<textarea></textarea>',{
		id:'miContext',
		name:'miContext',
		style: 'resize:initial;',
		placeholder:'자세한 내용은 여기 써주세요.'
	});
}

function btnGrp(){
	return $('<div id="btnGrp"></div>')
	.append($('<input></input>').attr('id', 'addBtn').attr('type','submit').attr('value','등록'))
	.append($('<input></input>').attr('type','reset').attr('value','취소').attr('id','resetBtn'));			
}
//interestCommunityName Select Box 생성
function createInterestCommunityNameSelectBox(){
	var interestCommunityNameSelectBox = $('<select id="interestCommunityName" name="interestCommunityName"></select>')
						.addClass('interestCommunityName');
	interestCommunityNameSelectBox.append($('<option></option>').append('커뮤니티목록'));

	for(var i in communityList){
		if(communityList[i][1] != undefined){
			interestCommunityNameSelectBox.append( $('<option>'+communityList[i][1]+'</option>')
					.attr('name','')
					.attr('value', communityList[i][0]));
		}
	}
	return interestCommunityNameSelectBox;
}

function createInvestiAnsItemDiv(){
	return $('<div></div>').attr('id','investiAnsItemType')
	.addClass('investiAnsItemType');
}


//investiItemType Select Box 생성
function createInvestiItemTypeSelectBox(value){
	var investiItemTypeSelectBox = $('<select id="investiItemType" name="investiItemType" ></select>')
													.addClass('investiItemType');
	if(value.miNo == undefined){
		investiItemTypeSelectBox.append($('<option></option>').append('구분'));
	
		for(var i in investiItemTypeList){
			if(investiItemTypeList[i][0] != undefined && investiItemTypeList[i][0] == value){
				investiItemTypeSelectBox.append( $('<option>'+investiItemTypeList[i][1]+'</option>')
						.attr('value', investiItemTypeList[i][0]) );
			}
		}
		return investiItemTypeSelectBox;
	}else{
		for(var i in investiItemTypeList){
			if(investiItemTypeList[i][0] != undefined && investiItemTypeList[i][0] == value.interestCommunityNo){
				investiItemTypeSelectBox.append( $('<option>'+investiItemTypeList[i][1]+'</option>')
						.attr('name','investiItemType')
						.attr('value', investiItemTypeList[i][2]) );
			}
		}
		return investiItemTypeSelectBox;
	}
};

function createInvestiItemTypeDiv(){
	return $('<div></div>').attr('id','investiAnsItemListUl');

}

//investiItemTypeName 생성
function createInvestiAnsItemList(value,appendId){
	var count = 0;
	if(appendId != undefined){// 입력, 수정
		for( var i in investiItemNameList){
			if(value == investiItemNameList[i][0]){
				var ul = $('<ul></ul>');
				ul.append($('<label></label>').append(investiItemNameList[i][1])
															.attr('investiItem-pk', investiItemNameList[i][3]));
				ul.append($('<li></li>').append($(createAnsSelectBox(i, investiItemNameList[i][3],investiItemNameList[i][2]))));
				ul.appendTo('#' + appendId);
				count++;
			}
		}
	}else{
		for( var i in investiItemNameList){ // 상세
			if(value.investiItemType == investiItemNameList[i][0]){
				var ul = $('<ul></ul>');
					ul.append($('<label></label>').append(investiItemNameList[i][1]));
					ul.append($('<li></li>').append($(createAnsSelectBox(i, investiItemNameList[i][3], investiItemNameList[i][2]))));
					ul.appendTo('#detailInvestiAnsItemList');
					count++;
				ul.children('li').children();
			}
		}
		
	}
	count > 0 ? count*=26 : count=28;
	$('#removeRightTopDiv #investiItemType').css('height',count + 'px');
	$('#removeRightTopDiv #investiAnsItemType').css('height',(count + 10) + 'px');
}

//ansItemName Select Box 생성
function createAnsSelectBox(index, investiItemNo ,ansTypeItemNo){
	var ansItemNameSelectBox = $('<select></select>')
	.css('width','70px')
	.addClass('investiItemValue')
	.attr('name','investiItemValue');
	for(var i in ansTypeItemList){
		if(ansTypeItemList[i][0] != undefined && ansTypeItemList[i][0] == ansTypeItemNo){
			ansItemNameSelectBox.append( $('<option>'+ansTypeItemList[i][1]+'</option>')
					.attr('value',investiItemNo + "=" + ansTypeItemList[i][2]));
		}
	}
	return ansItemNameSelectBox;
}

//********************good & reply*************************************
function goodCount(value){
	var result = 0;
	$.ajax({
		async: false,
		url: '../goodCount.do',
		dataType: 'json',
		data: {miNo:value.miNo},
		success: function(data, textStatus, jqXHR) {
			if(data.status == 200) {
				result = data.result;
			} else {
				alert("서버에서 데이터를 가져오는데 실패했습니다.");
				debug(data.message);
			}
		}
	});
	return result;
}

function replyCount(value){
	var result = 0;
	$.ajax({
		async: false,
		url: '../replyCount.do',
		dataType: 'json',
		data: {miNo:value.miNo},
		success: function(data, textStatus, jqXHR) {
			if(data.status == 200) {
				result =  data.result;
			} else {
				alert("서버에서 데이터를 가져오는데 실패했습니다.");
				debug(data.message);
			}
		}
	});
	return result;
}


//***************커뮤니티 화면 페이징 처리****************************
function prepareCommMappingInfoList(){
	$('#oneHideBtn').live('click', function() {
		oneLinePage--;
		$('#oneLineBoardTable').remove();

		$('#oneMoreBtn').css('display', '');
		createOneLineBoardTable();
		selectOneLineList();
	});

	$('#oneMoreBtn').live('click', function() {
		++oneLinePage;
		$('#oneLineBoardTable').remove();

		createOneLineBoardTable();
		selectOneLineList();
	});
	
}

function communityMappingInfoList(){
	$('#' + localStorage.getItem('divId') + ' div').remove();
	
	if (currPage <= 1) {
		currPage = 1;
		$('#hideBtn').css('display', 'none');

	} else 
		$('#hideBtn').css('display', '');

	$.ajax({
		async:false,
		url: '../communityContextList.do',
		dataType: 'json',
		data: {page:currPage,
				interestCommunityNo : localStorage.getItem("communityNumber")},
		success: function(data, textStatus, jqXHR) {
			if(data.status == 200) {
				for(var i=0; i < data.result.length; i++){}
				if(i < 5 && i != 0){
					$('#moreBtn').css('display','none');
				}else if(i==0){
					currPage--;
					$('#moreBtn').css('display','none');
				}

				$.each( data.result, addMappingInfoList );
			} else {
				alert("서버에서 데이터를 가져오는데 실패했습니다.");
				debug(data.message);
			}
		}
	});
}

function prepareMappingInfoList(){
	
	pageCheck =  mappingInfoList.length / 5;
	
	$('#hideBtn').live('click',function() {
		$('#moreBtn').css('display', '');
		
		if(localStorage.getItem('divId') == 'removeListTag'){
			currPage=currPage-5;
			pageCheck++;
			if(currPage == 0){
				$('#hideBtn').addClass('displayNone');
				$('#moreBtn').removeClass('displayNone');
				}
			refreshMypageMappingInfoList(0);
		}else if((localStorage.getItem('divId') == 'mappingInfoList') && 
				(sessionStorage.getItem('categoryPk') == 0)){
			currPage--;
			refreshMappingInfoList();
		}else if((localStorage.getItem('divId') == 'communityMappingInfoList') && 
				(sessionStorage.getItem('categoryPk') == 0)){
			currPage--;
			communityMappingInfoList();
			
		}else if(sessionStorage.getItem('categoryPk').length > 0){
			currPage--;
			chooseCateroyList();
		}
	});

	$('#moreBtn').live('click',function() {
		$('#hideBtn').removeClass('displayNone');
		
		if(localStorage.getItem('divId') == 'removeListTag'){
			currPage=currPage+5;
			pageCheck--;
			$('#hideBtn').removeClass('displayNone');
			
			if(pageCheck <= 1){
				$('#moreBtn').addClass('displayNone');
			}
			
			refreshMypageMappingInfoList(0);
		}else if((localStorage.getItem('divId') == 'mappingInfoList') && 
				(sessionStorage.getItem('categoryPk') == 0)){
			++currPage;
			refreshMappingInfoList();
		}else if((localStorage.getItem('divId') == 'communityMappingInfoList') && 
				(sessionStorage.getItem('categoryPk') == 0)){
			++currPage;
			communityMappingInfoList();
		}else if(sessionStorage.getItem('categoryPk').length > 0){
			++currPage;
			chooseCateroyList();
		}
	});
	
	if(localStorage.getItem('divId') == 'removeListTag'){
		makeCalendar();
	}else if((localStorage.getItem('divId') == 'mappingInfoList') && 
			(sessionStorage.getItem('categoryPk') == 0)){
		refreshMappingInfoList();
	}else if(sessionStorage.getItem('categoryPk').length > 1){
		chooseCateroyList();
	}
}

function refreshMypageMappingInfoList(miNo){
	$('#removeListTag div').remove();
	var pageSize=5;
	for(var i = 0 ; i < mappingInfoList.length; i++){
		if(mappingInfoList[i].miNo == miNo){
			mappingInfoList.remove(i);
		}
	}

	for(var i = 0; i < pageSize; i++){
		addMappingInfoList(i, mappingInfoList[currPage + i]);
	}
}

function refreshMappingInfoList(){
	$('#' + localStorage.getItem('divId') + ' div').remove();
	
	if (currPage <= 1) {
		currPage = 1;
		$('#hideBtn').css('display', 'none');

	} else 
		$('#hideBtn').css('display', '');

	$.ajax({
		url: '../main/mainContextList.do',
		dataType: 'json',
		data: {page:currPage},
		success: function(data, textStatus, jqXHR) {
			if(data.status == 200) {
				
				for(var i=0; i< data.result.length; i++){}
				
				if(i < 5 && i != 0){
					$('#moreBtn').css('display','none');
				}else if(i==0){
					currPage--;
					$('#moreBtn').css('display','none');
				}

				$.each( data.result, addMappingInfoList );
			} else {
				alert("서버에서 데이터를 가져오는데 실패했습니다.");
				debug(data.message);
			}
		}
	});
}

Array.prototype.remove = function(from, to) {
	var rest = this.slice((to || from) + 1 || this.length);
	this.length = from < 0 ? this.length + from : from;
	return this.push.apply(this, rest);
};

// noty Plugin
function generate(type, text) {
  	var n = noty({
  		text: text,
  		type: type,
  		dismissQueue: true,
  		layout: 'center',
  		theme: 'default'
  	});
  	console.log('html: '+n.options.id);
}

function generateCustomAlert(type, text){
	generate(type, text);
	
	setTimeout(function() {
		$.noty.closeAll();
	}, 1500);
}

