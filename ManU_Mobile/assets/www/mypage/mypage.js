var id = sessionStorage.getItem('id');
var name = sessionStorage.getItem('name');
var className = sessionStorage.getItem('className');
var currPage = 0;
var myRankNum = 0;

document.addEventListener("deviceready",onDeviceReady, false);

function onDeviceReady(){
	checkNetwork(false);	
	facebookInit();
}

$(document).bind('pageinit',function(){
	document.body.className = className;
	prepareMappingInfoList();
	getUserInfo();
	
});


function prepareMappingInfoList(user){
	refreshMappingInfoList();
}

function refreshMappingInfoList(){
	$.ajax({
		url:surl+'/mypage/monthMappingList.do',
		dataType: 'json',
		data: {
			   fbUid:id,
			   startDate: '2011-01-01',
			   endDate: '2111-01-01',
		   },
		success: function(data, textStatus, jqXHR) {
			if(data.status == 200) {
				var list = data.result;
//				changeMappingList(data.result);
				for(var i=0; i< data.result.length; i++){
				}
//				if(i < 5 && i != 0){
//					$('#moreBtn').css('display','none');
//				}else if(i==0){
//					currPage--;
//					$('#moreBtn').css('display','none');
//				}
				console.log(data.result);
				$.each(list , addMappingInfoList1 );
				$('#mappingInfoList').pajinate({
					items_per_page : 5,
					item_container_id : '.alt_content',
					nav_panel_id : '.alt_page_navigation'
				});
			} else {
				alert("서버에서 데이터를 가져오는데 실패했습니다.");
				debug(data.message);
			}
		}
	});
}

function addMappingInfoList1(index, value){
		$('#mappingListView').append(createContents(value)).listview('refresh');
};
//mappingInfo 출력 폼
function createContents(value){
	return $('<li></li>')
	.append(createMappingInfoListTable(value));	
}
//var slide  = "#listView > li > ul";
function createMappingInfoListTable(value){
	return $('<div id="mainMappingInfoTable"></div>')
	.append(createTitleTR(value))
	.append(createInvestiAnsItemTR(value))
	.append(createLocationTR(value));
	//.append(createOption(value));
}

function createTitleTR(value){
	return $('<div></div>')
	.append(createInvestiItemIconTD(value))
	.append(createPhotoTD(value))
	.append($('<div></div>').text(value.interestCommunityName))
	.append($('<div></div>').text(new Date(value.miDate).format("yyyy.MM.dd")));
}

function createInvestiAnsItemTR(value){
	return $('<div></div>')
	.append($('<div></div>').text(value.investiItemType));
}

function createInvestiItemIconTD(value){
	// height="80px"
	return $('<div width="20px" align="center"></div>')
	.append($('<img id="mypage_interest"></img>')
			.addClass('contentIcon')
			.attr('src', '../images/icons/'+ selectMarker(value) +'.png')); 
			// DB 경로명
}
function createPhotoTD(value){
	// height="80px"
//	alert(value.pathName+value.fileMask);
	if(value.pathName==null){
		return $('<div width="30px" height="10px" align="center"></div>')
		.append($('<img id="mypage_ManUImage"></img>').addClass('contentPhoto')
				.attr('src',surl+'/images/ManU.png')); // DB 경로명
	}else{
		return $('<div width="40px" rowspan="4" align="center"></div>')
		.append($('<img id="mypage_mappingPhoto"></img>').addClass('contentPhoto')
				.attr('src','http://14.63.224.161:8080'+value.pathName+value.fileMask)); // DB 경로명
	}
}

function createLocationTR(value){
	return $('<div></div>')
	.append($('<div></div>').text('주소 : '+value.address));
}

function getUserInfo(user){
	$.ajax({
		url:surl+'/mypage/userInfo.do',
		dataType : 'json',
		data : {fbUid:id},
		success:function(data, textStatus, jqXHR) {
			if(data.status == 200) {
				myInfo(data.result);
				allUserRank(data.result);
				var viewTable=$('#rankingViewTable');
				var rankList=data.result[0];
				if(myRankNum <=10){
					$('#rankingViewTable tr').eq(myRankNum)
					.css('color', 'red').css('font-weight','bold ');
				}else{
					viewTable.append('<tr><td colspan=3>ㆍ</td></tr>');
					viewTable.append('<tr><td colspan=3>ㆍ</td></tr>');
					viewTable.append('<tr><td colspan=3>ㆍ</td></tr>');
					$.each(rankList, function(index, value){
						if(value.fbUid == id){
							viewTable.append(createTableEle(rankList[myRankNum-2]));
							viewTable.append(createTableEle(value));
							viewTable.append(createTableEle(rankList[myRankNum]));
						}
					});
					$('#rankingViewTable tr:nth-child(16)')
					.css('color', 'red').css('font-weight','bold ');
				}
			} else {
				alert("서버에서 데이터를 가져오는데 실패했습니다.");
				debug(data.message);
			}
		}
	});
};

function allUserRank(value){
	$('#userRankList').append(rankingComment(value));
}
//function rankingComment(value){
//	return $('<li class="ui-li-accordion-head" data-role="list-divider"></li>')
//						.text('▼회원님의 기여도 랭킹입니다▼')
//						.css('text-align','center')
//						.append(createRankTable(value));
//}
function rankingComment(value){
	return $('<li id="rankTitle"></li>').attr('data-role', 'list-divider')
				.addClass('ui-li-accordion-head').text('▼회원님의 기여도 랭킹입니다▼')
						.css('text-align','center')
						.append(createRankTable(value));
}
function createRankTable(value){
	var lastRankingNum = 0;
	var viewDiv = $('<div class="ui-li-accordion"></div>')
			.attr('id','viewDiv').css('color','black');
	var viewTable = $('<table></table>')
			.attr('id','rankingViewTable');
		viewTable.append(
				$('<tr></tr>')
				.append($('<th>순위</th>'))
				.append($('<th>이름</th>'))
				.append($('<th>누적공헌도</th>')));
		for(var idx in value[0]){
			if(value[0][idx].fbUid == id){
				myRankNum = value[0][idx].rank;
			}
			lastRankingNum++;
		}
		for(var j=0; j<10;j++){
			viewTable.append(createTableEle(value[0][j]));
		}
		var rankHeight=(++idx)*12+100;
		console.log('high : '+rankHeight);
		if(idx>0 && idx<10){
			$('#userRank').css('height',rankHeight+'px');
		}
		if(idx>10){
			$('#userRank').css('height','450px');
		}
		viewDiv.append(viewTable);
		return viewDiv;
}
function createTableEle(value){
	if(value != undefined){
		return $('<tr></tr>')
		.append($('<td aling="center">'+value.rank+'</td>'))
		.append($('<td aling="center">'+value.fbName+'</td>'))
		.append($('<td aling="center">'+value.point+'</td>'));
	}
}

function myInfo(value){
	return $('#userInfo').append(createTableRow(value));
}
function createTableRow(value){
	var table=$('<table id="myInfo"></table>')
				.addClass('ui-corner-tl ui-corner-tr ui-corner-bl ui-corner-br');
	table.append(createMyInfoRow(value))
	   .append(createUserGradeRow(value))
	   .append(createUserRanking(value))
	   .append(createUserProgressBar(value));
	return table;
}
function createMyInfoRow(value){
	return $('<tr></tr>')
	.append('<td align="center" width="100%"><img src="'
			+value[1][0].fbPhotoPath+'" id="facebookPhoto">회원명: '
			+value[1][0].fbName+',&nbsp &nbsp 공헌도: '+value[1][0].point+'점</td>');
}

function createUserGradeRow(value){
	var lastRankingNum = 0;

	for(var idx in value[0]){
		if(value[0][idx].fbUid == id){
			myRankNum = value[0][idx].rank;
		}
		lastRankingNum++;
	}
	
	return $('<tr></tr>')
	.append('<td align="center">등급 : '+ value[1][0].auth +' ( 레벨 : '
			+value[1][0].level +' ),&nbsp &nbsp 현재 순위: '
			+myRankNum+'위</td>');
}
function createUserRanking(value){
	var lastRankingNum = 0;

	for(var idx in value[0]){
		if(value[0][idx].fbUid == id){
			myRankNum = value[0][idx].rank;
		}
		
		lastRankingNum++;
	}
	return $('<tr></tr>')
	.append('<td align="center">회원님의 랭킹은 전체 인원 [' + lastRankingNum +
			'] 명 중  &nbsp  &nbsp  &nbsp  &nbsp상위 [ '+ ((myRankNum / lastRankingNum) * 100).toFixed(1) + '% ]입니다</td>');
}
function createUserProgressBar(value){
	var proDiv = $('<div></div>');

	proDiv.append(
			$('<div id="progressText"><div>')
			.append('다음 레벨까지 ' + (100 - 
					parseInt( ( progressPercent(value[1][0].point) * 100 ) ) ) + ' %') );
	
	proDiv.append($('<div></div>',{
		style:"width:90%;"

	}).attr('id','prog')
	.progressbar({value: (progressPercent(value[1][0].point)*100)}));
	
	return $('<td align="center"></td>').append(proDiv);	
}
function progressPercent(totalPoint){
	if(totalPoint < 100){
		//알
		return totalPoint/100;
	}else if(totalPoint < 500 && totalPoint >= 100){
		//올챙이
		return totalPoint/500;
	}else if(totalPoint < 1000 && totalPoint >= 500){
		//뒷다리
		return totalPoint/1000;
	}else if(totalPoint < 3000 && totalPoint >= 1000){
		//앞다리
		return totalPoint/3000;
	}else if(totalPoint < 5000 && totalPoint >= 3000){
		//개구리
		return totalPoint/5000;
	}else{
		//망토
		return 1;
	}
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