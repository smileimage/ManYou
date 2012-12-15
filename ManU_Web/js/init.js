var communityList = new Array();
var investiItemTypeList = new Array();
var investiItemNameList = new Array();
var ansTypeItemList = new Array();

var communityCount = 0;
var investiItemTypeCount = 0;
var investiItemNameCount = 0;
var ansTypeItemCount = 0;

var currPage = 1;

for(var i = 0; i < 50; i++){
	communityList[i] = new Array(3);
	investiItemTypeList[i] = new Array(4);
	investiItemNameList[i] = new Array(4);
	ansTypeItemList[i] = new Array(3);
}

$(document).ready(function(e) {
	selectboxFilter();
	$('#cummunityListTable tr').live('click',function(){
		localStorage.setItem("communityNumber",$(this).attr('data-pk'));
		attachCommunityView();
		allMarkerView(parseInt($(this).attr('data-pk'),10));
		//$('#interest_community_name').val(parseInt($(this).attr('data-pk'),10)).attr({selected:'selected'});
	});
	
});

function selectboxFilter(){
	$.ajax({
		async: false,
		url: '../mainRegSelectItemList.do',
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

function selectFilter(index, value){
		if(index == 0){
			for(var i = 0; i < value.length; i++){
				communityList[i][0] = value[i].interestCommunityNo;
				communityList[i][1] = value[i].interestCommunityName;
				communityList[i][2] = value[i].ownerUid;
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