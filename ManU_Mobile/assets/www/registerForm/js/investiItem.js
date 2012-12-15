var communityList = new Array(2);
var investiItemTypeList = new Array(50);
var investiItemNameList = new Array(25);
var ansTypeItemList = new Array(10);

var communityCount = 0;
var investiItemTypeCount = 0;
var investiItemNameCount = 0;
var ansTypeItemCount = 0;

for(var i = 0; i < 50; i++){
	communityList[i] = new Array(2);
	investiItemTypeList[i] = new Array(4);
	investiItemNameList[i] = new Array(4);
	ansTypeItemList[i] = new Array(3);
}

$(document).ready(function(){
	
	selectboxFilter();
	
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

});

function selectboxFilter(){
	$.ajax({
		async: false,
		url: surl+'/mainRegSelectItemList.do',
//		url: 'http://192.168.0.58:9999/ManU36/mainRegSelectItemList.do',
		dataType: 'json',
		success: function(data, textStatus, jqXHR) {
			if(data.status == 200) {
				$.each(data.result,selectFilter);
			} else {
				alert("서버에서 데이터를 가져오는데 실패했습니다.");
				debug(data.message);
			}
		}
	});
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
	
//	interestCommunityNameSelectBox.insertAfter( "#miTitle" ).selectmenu({
//														corners: true,
//														disabled: false,
//														hidePlaceholderMenuItems: true,
//														icon: "plus",
//														iconpos: "right",
//														iconshadow: true,
//														inline: true,
//														nativeMenu: false,
//														shadow: false,
//														theme: "b"
//													});
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
	if(appendId != undefined){// 입력, 수정
		for( var i in investiItemNameList){
			if(value == investiItemNameList[i][0]){
				var ul = $('<ul></ul>');
				ul.append($('<label></label>').append(investiItemNameList[i][1])
															.attr('investiItem-pk', investiItemNameList[i][3]));
				ul.append($('<li></li>').append($(createAnsSelectBox(i, investiItemNameList[i][3],investiItemNameList[i][2]))));
				ul.appendTo('#' + appendId);
			}
		}
	}else{
		for( var i in investiItemNameList){ // 상세
			if(value.investiItemType == investiItemNameList[i][0]){
				var ul = $('<ul></ul>');
//				if(investiItemNameList[i][1] == value.investiItemName){
					ul.append($('<label></label>').append(investiItemNameList[i][1]));
					ul.append($('<li></li>').append($(createAnsSelectBox(i, investiItemNameList[i][3], investiItemNameList[i][2]))));
					ul.appendTo('#detailInvestiAnsItemList');
//				}
				ul.children('li').children().attr('id','detailAnsTypeItemName');
			}
		}
		
	}
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

/* 접근상태정보 등록 폼*/
function selectFilter(index, value){
		if(index == 0){
			for(var i = 0; i < value.length; i++){
				communityList[i][0] = value[i].interestCommunityNo;
				communityList[i][1] = value[i].interestCommunityName;
			}
		}
		
		if(index == 1){
			for(var i = 0; i < value.length; i++){
				investiItemTypeList[i][0] = value[i].interestCommunityNo;
				investiItemTypeList[i][1] = value[i].investiItemType;
			}
		}
		
		if(index == 2){
			for(var i = 0; i < value.length; i++){
				investiItemNameList[i][0] = value[i].investiItemType;
				investiItemNameList[i][1] = value[i].investiItemName;
				investiItemNameList[i][2] = value[i].ansTypeNo;
				investiItemNameList[i][3] = value[i].investiItemNo;	
			}
		}

		if(index == 3){
			for(var i = 0; i < value.length; i++){
				ansTypeItemList[i][0] = value[i].ansTypeNo;
				ansTypeItemList[i][1] = value[i].ansTypeItemName;
				ansTypeItemList[i][2] = value[i].ansTypeItemNo;
			}
		}
}

function createLI(cName,value){
	return $('<li></li>')
				.addClass(cName)
				.append(value);
}