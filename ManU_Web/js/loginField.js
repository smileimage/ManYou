var loginImagePath=null;
var gradeImagesList = 
	['../images/icons/level/0.png',
	 '../images/icons/level/1.png',
	 '../images/icons/level/2.png',
	 '../images/icons/level/3.png',
	 '../images/icons/level/4.png',
	 '../images/icons/level/5.png',
	 '../images/icons/level/c_0.png',
	 '../images/icons/level/c_1.png',
	 '../images/icons/level/c_2.png',
	 '../images/icons/level/c_3.png',
	 '../images/icons/level/c_4.png',
	 '../images/icons/level/c_5.png',];



$(document).ready(function(e) {
	
	$('#loginField').append(createUl());
	$('#userInfoUL li:gt(0)').addClass('loginFieldGroup');
	
	$('#interest_community_name').live('change',function(){
		
		var href = location.href;
		href = href.substring(href.lastIndexOf("/"));
		localStorage.setItem('href',href);
		
		localStorage.setItem("communityNumber",$('#interest_community_name option:selected').val());
		
		$('#mappinginfoList div').remove();
		
		if($('#interest_community_name option:selected').val() == '커뮤니티목록'){
			   $('section').children().remove();
			   $('section').load('../main/communityList.html');
		}else if($('#interest_community_name option:selected').val() == 0){
			   document.location.href = '../community/communityManager.html';
		}else if($('#interest_community_name option:selected').val() == '===== 커뮤니티 ====='){
			document.location.href = '../main/index.html';
		}else{
			currPage = 0;

			if(href == "/index.html"){
				attachCommunityView();
			}else if(href == "/community.html"){
				attachCommunityView();
			}else if(href == "/board.html"){
				$('#boardList').addClass('displayNone');
				attachCommunityView();
			}else if(href == "/mypage.html"){
				attachCommunityView();
			}else if(href == "/communityManager.html"){
				attachCommunityView();
			}else if(href == "/intro.html"){
				attachCommunityView();
			}
		}
	});
	
	$('#index').live('click', function(){
		localStorage.setItem("boardTypeNo",1);
		localStorage.setItem("boardTitle","신규제안");
		document.location.href =("../board/board.html");
	});

	$('#index2').live('click', function(){
		localStorage.setItem("boardTypeNo",2);
		localStorage.setItem("boardTitle","공지사항");
		document.location.href =("../board/board.html");
	});

	$('#index3').live('click', function(){
		localStorage.setItem("boardTypeNo",3);
		localStorage.setItem("boardTitle","Q&A");
		document.location.href =("../board/board.html");
	});
});

/* 접근상태정보 로그인 폼*/
function createUl(){
	var img = '<img class ="levelIcon" id="levelIcon" name="" src="">';
	return $('<ul></ul>').attr('id', 'userInfoUL') 
	.append($('<li>'+img+'</li>').addClass('levelIconPosition hide'))
	.append($('<li><a href ="../mypage/mypage.html"></a></li>').addClass('hide'))
	.append($('<li><a href = "../mypage/mypage.html"></a></li>').addClass('hide'))
	.append($('<li><div id="index2">'+"게시판"+'</a></li>').addClass('sizeLi hide'))
	.append($('<li><input type="button" id="loginBtn" name="loginBtn" value="페이스북 ID 로그인"/></li>'));
};

function gradeImages(){
	$.ajax({
		async:false,
		url:'../calUserPoint.do',
		dataType : 'json',
		data : {fbUid:getCookie('cookieFbUid')},
		success:function(data, textStatus, jqXHR) {
			if(data.status == 200) {
				loginImagePath = setGradeImage(data.result);
			} else {
				alert("서버에서 데이터를 가져오는데 실패했습니다.");
				debug(data.message);
			}
		}
	});
	
}

function setGradeImage(totalPoint){
	var imgPath;
	totalPoint *= 0.01;
	
	if(totalPoint < 1){
		//알
		imgPath = 0;
	}else if(totalPoint < 5 && totalPoint >= 1){
		//올챙이
		imgPath = 1;
	}else if(totalPoint < 10 && totalPoint >= 5){
		//뒷다리
		imgPath = 2;
	}else if(totalPoint < 30 && totalPoint >= 10){
		//앞다리
		imgPath = 3;
	}else if(totalPoint < 50 && totalPoint >= 30){
		//개구리
		imgPath = 4;
	}else{
		//망토
		imgPath = 5;
	}
	
	for(var i = 0; i < communityList.length; i++){
		if(communityList[i][2] == getCookie('cookieFbUid')){
			imgPath += 6;
		}
	}
	return imgPath;
}

//----------------------------------------------------------------
//메인페이지 간단 사용자 정보 
function doAfterLogin(){
	$('#interest_community_name').removeClass('hide');
	$('#userInfoUL li').removeClass('hide');
	$('#regContentBox').attr('style','width:900px; margin-left:10px;');
	button.value = '페이스북 로그아웃';
};

function doAfterLogout(){
	$('#userInfoUL li:lt(4)').addClass('hide');
	$('#interest_community_name').addClass('hide');
	button.value = '페이스북 ID 로그인';
	resetCookie('cookieFbUid');
	resetCookie('cookieFbName');
	resetCookie('cookieMemberLevel');
	localStorage.removeItem('memberAuth');
	$('#interest_community_name option').remove();
};

function attachCommunityView(){
	$('section').load('../main/community.html',function(){
		createOnelineBoardInput();		
		createOneLineBoardTable();
		selectOneLineList();
		$('#regContentBox').attr('style','width:900px; margin-left:10px;');
		buttonUi();
		
		$('#communityMappingInfoList div table').removeClass('mappingInfoTable');
		$("input:button").button();
			initialize('map_canvas_Load');
			allMarkerView(localStorage.getItem('communityNumber'));
	});
}

