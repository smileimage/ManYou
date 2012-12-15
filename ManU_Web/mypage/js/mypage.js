//JavaScript Document
var myRankNum = 0;
var calStartDate=0;
var calEndDate=0;

$(document).ready(function(e) {
	$("input:button").button();
	$('#addContentBox').bind('focus',function(event){
		$('#addContentBox').attr('style','display:none');
		$('#addMappingInfoForm').append(createAddContent());
		$('#addContentTitle').focus();
	});

	$('#resetBtn').live('click',function(){
		$('#addContentBox').attr('style','width:920px');
		$('#addContent').remove();
		return false;
	});
	$('#map_container').dialog({
		autoOpen:false,
		width: 700,
		height: 600,
		resizeStop: function(event, ui) {google.maps.event.trigger(map, 'resize');  },
		open: function(event, ui) {google.maps.event.trigger(map, 'resize'); },
		modal:true,
		resizable:false
	});
	
	$('#map_containerOnTab').append(makeMapDiv('map_canvas_Tab'));
	
	$('#myRanking span').live('mouseover',function(){
		$('#viewDiv').removeClass('displayNone');
	});
	
	$('#myRanking span').live('mouseout',function(){
		$('#viewDiv').addClass('displayNone');
	});
	
	$('#userinfoList').live('mouseover',function(){
		$('#favorList').removeClass('displayNone');
	});
	
	$('#userinfoList').live('mouseout',function(){
		$('#favorList').addClass('displayNone');
	});
	
	prepareMappingInfoList('removeListTag');

	prepareUserInfo();
	initialize('map_canvas_Tab');
});
//------------------------------------------------------------------------------------------
//**** 상세요소
function prepareUserInfo(){
	$.ajax({
		url:'userInfo.do',
		dataType : 'json',
		data : {fbUid:getCookie('cookieFbUid')},
		success:function(data, textStatus, jqXHR) {
			if(data.status == 200) {
				addInfoRowInTable(data.result);
				$('#tabs-1').append(addUserProgressBar(data.result));
				$('#tabs-1').append(addUserRanking(data.result));
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
						if(value.fbUid == getCookie("cookieFbUid")){
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
function addInfoRowInTable(value) {
	return $('#userinfoList').append(createUserNameRow(value))
	.append(createFavorList())
	.append(createUserPointRow(value) )
	.append(createArticleInfoRow(value));
};

function createFavorList(){
	return $('<div></div>')
				.attr('id','favorList')
				.addClass('displayNone')
				.append(
						$('<ul></ul>')
							.append($('<li><img src="../images/icons/level/0.png"></img> 공용주차장 요금 10% 할인<li>'))
							.append($('<li><img src="../images/icons/level/1.png"></img> 공용주차장 요금 20% 할인<li>'))
							.append($('<li><img src="../images/icons/level/2.png"></img> 공용주차장 요금 30% 할인<li>'))
							.append($('<li><img src="../images/icons/level/3.png"></img> 공용주차장 요금 40% 할인<li>'))
							.append($('<li><img src="../images/icons/level/4.png"></img> 공용주차장 요금 50% 할인<li>'))
							.append($('<li><img src="../images/icons/level/5.png"></img> 공용주차장 요금 60% 할인<li>'))
						);
}

function createUserNameRow(value){
	var resultLevel = percentAndLevel(value[1][0].point);
	return $('<tr></tr>')
	.append('<td rowspan=3><img src="'+value[1][0].fbPhotoPath+'"/>')
	.append('<td>회원명 : '+ value[1][0].fbName +'</td>')
	.append('<td colspan=2>등급 : '+ value[1][0].auth +' [ 레벨 : '+resultLevel[1] +' ]</td>');
};

function createUserPointRow(value){
	return $('<tr></tr>').append('<td colspan=3>공헌도 : 총 '+value[1][0].point+' 점</td>');
};

function createArticleInfoRow(value){
	return $('<tr></tr>').append('<td colspan=2> 등록글 : '+countArticle(value[1])+' 건</td>');
}
 
function countArticle(value){
	var aCount=0;
	if(value[0].point>0){
		$.each(value, function(index, userData){
			aCount++;
		});
	}else{
		aCount=0;
	}
	return aCount;
}

function addUserProgressBar(value){
	var proDiv = $('<div></div>');
	
	var imgNum = setGradeImage(value[1][0].point);
	var resultPercent= percentAndLevel(value[1][0].point);
	proDiv.append($('<div></div>',{
		style:"width:90%;"
	}).attr('id','prog')
			.progressbar({value: (resultPercent[0]*100)}));
	
	proDiv.append($('<img></img>').attr('src',gradeImagesList[imgNum]));
	proDiv.append($('<img></img>',{
		style:"position: relative; left: 73%;"
	}).attr('src',gradeImagesList[imgNum+1]));
	
	proDiv.append(
		$('<div id="progressText"><div>')
			.append('다음 레벨까지 ' + (100 - 
			parseInt( ( resultPercent[0] * 100 ) ) ) + ' %') );
	return proDiv;	
};

function percentAndLevel(totalPoint){
	var result=[];
	if(totalPoint < 100){
		//알
		result.push(totalPoint/100, 1);
		return result;
	}else if(totalPoint < 500 && totalPoint >= 100){
		//올챙이
		result.push(totalPoint/500, 2);
		return result;
	}else if(totalPoint < 1000 && totalPoint >= 500){
		//뒷다리
		result.push(totalPoint/1000, 3);
		return result;
	}else if(totalPoint < 3000 && totalPoint >= 1000){
		//앞다리
		result.push(totalPoint/3000, 4);
		return result;
	}else if(totalPoint < 5000 && totalPoint >= 3000){
		//개구리
		result.push(totalPoint/5000, 5);
		return result;
	}else{
		result.push(1, '만렙');
		return result;
	}
}

function addUserRanking(value){
	var lastRankingNum = 0;
	var viewDiv = $('<div></div>')
					.attr('id','viewDiv');
	var viewTable = $('<table></table>')
					.attr('id','rankingViewTable');
		viewTable.append(
				$('<tr></tr>')
				.append($('<th>순위</th>'))
				.append($('<th>이름</th>'))
				.append($('<th>누적공헌도</th>')));
	
	for(var i=0; i < value[0].length; i++){
		if(value[0][i].fbUid == getCookie("cookieFbUid")){
			myRankNum = value[0][i].rank;
		}
		lastRankingNum++;
	}
	
	for(var j=0; j<10;j++){
		viewTable.append(createTableEle(value[0][j]));
	}
	
	viewDiv.append(viewTable).addClass('displayNone');	
	
	return $('<div id="myRanking"></div>')
	.append(viewDiv)
	.append($('<span></span>').text("현재 순위 : " + myRankNum + "위"))
	.append($('<span></span>').text("전체 인원 [ " + lastRankingNum +
			" ] 명 중 [ "+ ((myRankNum / lastRankingNum) * 100).toFixed(1) + "% ]"));
}

function createTableEle(value){
	if(value != undefined){
		return $('<tr></tr>')
			.append($('<td>'+value.rank+'</td>'))
			.append($('<td>'+value.fbName+'</td>'))
			.append($('<td>'+value.point+'</td>'));
	}
}

//***** 켈린더 *******
function makeCalendar(){
	$('#calendar').fullCalendar({
		theme: true,
		editable: false,
//		서버에서 값을 가져와 글이 있다면 커스터마이징 한 아이콘을
//		이벤트로 넣는다.
		eventSources: [
		               {
		            	   events: function(start, end, callback) {
		            		   calStartDate=new Date(start).format("yyyy-MM-dd");
		            		   calEndDate=new Date(end).format("yyyy-MM-dd");
		            		   $.ajax({
		            			   url: 'monthMappingList.do',
		            			   dataType: 'json',
		            			   data: {
		            				   fbUid:getCookie('cookieFbUid'),
		            				   startDate: calStartDate,
		            				   endDate: calEndDate
		            			   },
		            			   success: function(data, textStatus, jqXHR) {
		            				   if(data.status == 200) {
		            					   divId = "removeListTag";
		            					   changeMappingList(data.result);
		            					   pickAmarkers(data.result);
		            					   showMonthContext(data, callback);
		            				   } else {
		            					   alert("서버에서 데이터를 가져오는데 실패했습니다.");
		            					   debug(data.message);
		            				   }
		            			   }
		            		   });
		            	   },
		            	   color: 'yellow',   
		            	   textColor: 'black'
		               }
		               ],
		               eventClick:function(event, jsEvent,view){
		            	   $.ajax({
		            		   url: 'dayMappingList.do',
		            		   dataType: 'json',
		            		   data: {
		            			   fbUid:getCookie('cookieFbUid'),
		            			   date: (new Date(event.start).format("yyyy-MM-dd"))+'%'
		            		   },
		            		   success: function(data, textStatus, jqXHR) {
		            			   if(data.status == 200) {
		            				   divId = "removeListTag";
		            				   pickAmarkers(data.result);
		            				   currPage=0;
		            				   changeMappingList(data.result);
		            				   
		            			   } else {
		            				   alert("서버에서 데이터를 가져오는데 실패했습니다.");
		            				   debug(data.message);
		            			   }
		            		   }
		            	   });
		               },
		               eventMouseover:function(event, jsEvent, view){
		            	   $(this).css({'border-color':'#ffcccc', 'background-color':'#ffcccc'});
		            	   $(this).children().css({'border-color':'#ffcccc', 'background-color':'#ffcccc'});
		               },
		               eventMouseout:function(event, jsEvent, view){
		            	   $(this).css({'border-color':'yellow', 'background-color':'yellow'});
		            	   $(this).children().css({'border-color':'yellow', 'background-color':'yellow'});
		               }
	});
};
//--------------------------------------------------------------------------------------------------------
function refreshMypageMarkers(){
	 $.ajax({
		   url: 'monthMappingList.do',
		   dataType: 'json',
		   data: {
			   fbUid:getCookie('cookieFbUid'),
			   startDate: calStartDate,
			   endDate: calEndDate
		   },
		   success: function(data, textStatus, jqXHR) {
			   if(data.status == 200) {
				   markerClusterer.clearMarkers();
				   pickAmarkers(data.result);
			   } else {
				   alert("서버에서 데이터를 가져오는데 실패했습니다.");
				   debug(data.message);
			   }
		   }
	   });
}

//**** 켈린더 이벤트 만들기
function showMonthContext(data,callback){
	var events = [];
	var dayCount=1;
	var beforeDay=null;
	var dataArray;
	for(var i = 0; i<data.result.length; i++){
		data.result[i].miDate = new Date(data.result[i].miDate).format('yyyy-MM-dd');
	}
	dataArray = data.result;
	
	$.each( data.result, function(index, mapInfoData){
		if(index == 0){
			beforeDay = mapInfoData.miDate;
			dayCount=0;
			if(dataArray.length == 1){
				events.push(makedayCountObj('1 건', mapInfoData.miDate));
			} 
		}
		if(beforeDay == mapInfoData.miDate){
			dayCount++;
			if(index!=0 && dataArray[dataArray.length-1] == mapInfoData){
				events.push(makedayCountObj(dayCount +' 건', mapInfoData.miDate));
			}
		}else{
			events.push(makedayCountObj(dayCount +' 건', beforeDay));
			dayCount=1;
			if(dataArray[dataArray.length-1] == mapInfoData){
				events.push(makedayCountObj(dayCount +' 건', mapInfoData.miDate));
			}
		}
		beforeDay=mapInfoData.miDate;
	});
	callback(events);
};

function makedayCountObj(contents, Day){
	var dayCountObj = {
		title: contents,
		start: Day	
	};
	return dayCountObj;
}
function changeMappingList(mappingData){
	mappingInfoList = [];
	$('#removeListTag').remove();
	makeRemoveListTag();
	if(mappingData.length<1){
		nothingExist();
	}
	
	$.each( mappingData, function(index, value){
		mappingInfoList.push(value);
	} );
	
	for(var i = 0; i < 5; i++){
		if(mappingInfoList[i] != null){
			addMappingInfoList(i, mappingInfoList[currPage + i]);
		}
	}
	
	if(mappingData.length < 5 ){
		$('#moreBtn').addClass('displayNone');
	}
	
	pageCheck =  mappingInfoList.length / 5;
};

function pickAmarkers(mappingData){
	allMarkersClear();
	clearInfoBubble();
	var markArr=makeMarkerArray(mappingData);
	for (index in markArr) addMarkerOnTab(markArr[index]);
	markerClusterer = new MarkerClusterer(map, arrMarker, {
		gridSize: 70, 
		maxZoom: 15,
		styles: null
	});
};

function makeMarkerArray(mappingList){
	var markers= new Array();
	for (var index=0;index<mappingList.length;index++){
		markers.push({
			investiItemType:mappingList[index].investiItemType,
			name:mappingList[index].miTitle,
			address:mappingList[index].address,
			lat: mappingList[index].lat,
			lng: mappingList[index].lng,
			info: mappingList[index].miTitle+
			"<br>"+mappingList[index].address+
			"<br> 작성일 : "+mappingList[index].miDate
		});
	}
	return markers;
};
//----------------------------------------------------------------
/* 접근상태정보 로그인 폼*/
function makeRemoveListTag(){
	var removeTag = $('<div></div>',{id:"removeListTag"});
	$('#mappingInfoList').append(removeTag);
};
//---------------------------------------------------------------------------------------------

function nothingExist(){
	$('#removeListTag').append(createNothingDiv());
}

function createNothingDiv(){
	return $('<div id="createNothing"></div>')
			.append('<img id=warning src="../images/warning1.png">')
			.append('<h1>등록된 글이 없습니다.</h1>');
}
//**** 구글 멥 출력 DIV
function makeMapDiv(mapId){
	return $('<div></div>',{
		id:mapId,
		style:'width:100%; height:100%;'
	});
};

function viewMapDetail(event){
	$( "#map_container" ).dialog( "open" );
	var latlng={
			lat:$(this).attr('lat'),
			lng:$(this).attr('lng')
	};
	putMarkerInMap(latlng);
	return false;
}
