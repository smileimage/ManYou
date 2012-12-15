var checkCount=0;
window.fbAsyncInit = function() {
	initFaceBookApi();
};
//------------------------------------------------------------------------------------
//methods!!
function initFaceBookApi(){
	FB.init({
		appId : '448330791854592', // localhost
									//'266721533428111', // localhost
									//'448330791854592', // server
		//      	channelUrl : '//WWW.YOUR_DOMAIN.COM/channel.html', // Channel File
		status : true, // check login status
		cookie : true, // enable cookies to allow the server to access the session
		xfbml : true,  // parse XFBML
		oauth: true

	});
	// run it once with the current status and also whenever the status changes
	FB.getLoginStatus(loginButton, true);
	FB.Event.subscribe('auth.statusChange', loginButton);
	
	FB.getLoginStatus(function(response){
		if (response.status === 'connected') {
			setTimeout(function() {
				getUserFbInfo();
				attachCommSelector();
			}, 500);
		}else if (response.status === 'not_authorized') {
			generateCustomAlert('information','차단된 팝업창을 허용해 주십시오.');
			loginMethod(response);
		}
	}, true);
}
//-------------------------------------------------------------------------------------------
//* 로그인 메소드	
function loginButton(response) {
	button = document.getElementById('loginBtn');
	
	if (response.status === 'connected') {
		var accessToken = response.authResponse.accessToken;
		
		button.onclick = function() {
			logoutMethod(response);
			generateCustomAlert('success','로그아웃 되었습니다.');
		};
		setCookie('cookieFbUid', response.authResponse.userID);
		doAfterLogin();
	} else {
		button.onclick = function() {
			loginMethod(response);
		};
		//로그인 전 페이지로 보내버림
		doAfterLogout();
	}
};
function loginMethod(response){
	FB.login(function(response) {
		var loginUid = response.authResponse.userID;
		setCookie('cookieFbUid',loginUid);
		setTimeout(function() {
			getUserFbInfo();
			checkFbUid(loginUid);//db 저장여부 확인
			attachCommSelector();
		}, 500);
	}, { scope: 'publish_actions, user_photos, publish_stream' });
}

function logoutMethod(respose){
	FB.logout(function(response) {
		resetCookie('cookieFbUid');
		resetCookie('cookieFbName');
		resetCookie('cookieMemberLevel');
		localStorage.removeItem('memberAuth');
		$(location).attr('href', '../main/index.html');
		//로그인 전 페이지로 보내버림
	});
}
// Load the SDK Asynchronously
(function(d) {
	var js, id = 'facebook-jssdk', ref = d
	.getElementsByTagName('script')[0];
	if (d.getElementById(id)) {
		return;
	}
	js = d.createElement('script');
	js.id = id;
	js.async = true;
	js.src = "//connect.facebook.net/en_US/all.js";
	ref.parentNode.insertBefore(js, ref);
}(document));

//**** DB에사용자 UID값이 있는지 확인
function checkFbUid(uid){
	$.ajax({
		async:false,
		url:'../checkFbUid.do',
		dataType:'json',
		data:{
			fbUid:uid
		},
		success:function(data, textStatus, jqXHR) {
			if(data.status == 200) {
				if(data.result > 0){
					if(localStorage.getItem('memberAuth') == '불량'){
						logoutMethod();
						generateCustomAlert('error','회원등급이 불량으로 이용이 제한됩니다.');
						doAfterLogout();
						return false;
					}
					generateCustomAlert('success','모든 기능을 이용하실 수 있습니다.');
				}else{
					insertDBmemInfo(uid);
					setTimeout(function() {
						getUserFbInfo();
						attachCommSelector();
					}, 500);
				}
			} else {
				alert("서버에서 데이터를 가져오는데 실패했습니다.");
				debug(data.message);
			}
		}
	});
};
//-------------------------------------------------------------------------------------------
//* DB에 회원정보 입력
function insertDBmemInfo(uid) {
// FB.api('/me', function(response) {
// FB API 를 이용한 FQL 쿼리 사용
	FB.api({
			method: 'fql.query',
			query: 'SELECT uid, name, sex, pic_square, email FROM user WHERE uid=' + uid  
       }, function(response) {
		$.post('../addFbInfo.do', {
			fbName: response[0].name,
			fbUid: response[0].uid,
			fbSex : setGender(response[0].sex),
			fbPhotoPath: response[0].pic_square,
			fbEmail: response[0].email,
			auth: '회원',
			level:'1'
		}, function(data, textStatus, jqXHR) {
			if (data.status == 200) {
				generateCustomAlert('success','가입을 환영합니다.');
			} else {
				debug(data.message);
			}
		}, 'json');
	});
};

function setGender(sex){
	if ( sex == 'male'){
		sex=0;
	}
	else{
		sex=1;
	}
	return sex;
};

//---------------------------------------------------------------------------------------
//* localDB에서 회원 정보 가져옴
function getUserFbInfo(){
	gradeImages(getCookie("cookieFbUid"));
	$.ajax({
		async:false,
		url:'../mypage/selectFbInfo.do',
		dataType:'json',
		data:{
			fbUid:getCookie("cookieFbUid")
		},
		success:function(data, textStatus, jqXHR) {
			if(data.status == 200) {
				if(data.result.length > 0){
					localStorage.setItem('memberAuth', data.result[0].auth);
					changeInfoFbData(data.result);
				}
			} else {
				alert("서버에서 데이터를 가져오는데 실패했습니다.");
				debug(data.message);
			}
		}
	});
};

//-------------------------------------------------------------------------------------------
//*** 사용자 정보 값 HTML에 뿌리기

function changeInfoFbData(membersValue){
	var pointResult = calculateMyPoint(membersValue);
	gradeImages();
	$('#userInfoUL li:first-child img').attr('src',gradeImagesList[loginImagePath]);
	$('#userInfoUL li:nth-child(2) a').html(membersValue[0].fbName);
	$('#userInfoUL li:nth-child(3) a').html('공헌도 : '+ pointResult);
	setCookie('cookieFbName', membersValue[0].fbName);
	setCookie('cookieMemberLevel', membersValue[0].level);
};

function calculateMyPoint(memberValue){
	var total=0;
	$.each(memberValue, function(index, memberValue){
		total+=memberValue.point;
	});
	return total;
};
//-------------------------------------------------------------------------------------------
//* 담벼락에 사진 올리기 *
//* 참조 URL : http://permadi.com/blog/2011/04/javascript-facebook-graph-api-posting-feed-with-picture-to-walls/
//* 기타 data 파리미터값 * 
//display: 'iframe',
//caption: "Caption",
//name: "Name",
//link: "http://www.permadi.com/",  // Go here if user click the picture
//description: "Description field",
//actions: [{ name: 'action_links text!', link: 'http://www.permadi.com' }],

function uploadPhotoWall(receivedData) {
	FB.getLoginStatus(function(response){
		if (response.status === 'connected') {
			var msg = receivedData.title+" "+receivedData.address+" "+receivedData.msg;
			var data = {
					message : msg,
					url : receivedData.url
			};
			FB.api('/me/photos', 'post', data, function(response) {
				if (response) {
					if (response.id) {
						generateCustomAlert('success','업로드에 성공 하였습니다.');
					} else {
						generateCustomAlert('error','업로드에 실패 하였습니다.');
					}
				}
			});
		}
	});
};
//사진첩에만 사진을 올리고 싶다면, /me/photos 로 바꾸고, picture 파라미터 만
//이용하여 업로드 한다. picture -> url

//---------------------------------------------------------------------------------------------------------------

//* 유저 퍼미션 확인 매소드	
function checkPermission(){
	FB.api({ method: 'fql.query', 
	query: 'SELECT publish_actions,user_photos,publish_stream FROM permissions WHERE uid=me()' }, function(resp) {
		for(var key in resp[0]) {
			if(resp[0][key] === "1")
				console.log(key+' is granted');
			else
				console.log(key+' is not granted');
		}
	});
};
//--------------------------------------------------------------------------------------------------
//***** 쿠키 설정******
function setCookie(key, value){
	$.cookie(key, value, {expires:1, path:'/', secure:0});
};
function resetCookie(key){
	$.cookie(key, null, {expires:-1, path:'/', secure:0});
};

function getCookie(key){
	return $.cookie(key);
};

//커뮤니티 리스트 목록 
function createCommunityListOption(index, value){
	$('<option></option>')
	.attr('id', 'interest_community_name_option')
	.attr('name', 'interest_community_name_option')
	.attr('value', value.interestCommunityNo)
		.append(value.interestCommunityName)
		.appendTo('#interest_community_name');
} 

function createCommunityList(){
	return $('<select></select>').attr('id', 'interest_community_name')
	.attr('name', 'interest_community_name')
	.append($('<option></option>').append('===== 커뮤니티 ====='));
}

function attachCommSelector(){
	if(checkCount == 0){
		$.ajax({
			async:false,
			url: '../getUserCommunityList.do',
			dataType: 'json',
			data: {fbUid : getCookie('cookieFbUid')},
			success: function(data, textStatus, jqXHR) {
				if(data.status == 200) {
					$('#title').append(createCommunityList());
					if(data.result != ''){ 
						$.each(data.result,createCommunityListOption);
					}
				} else {
					alert("서버에서 데이터를 가져오는데 실패했습니다.");
					debug(data.message);
				}
			}
		});
		managerBtn();
		checkCount++;
	}
}

function managerBtn(){
	for(var i = 0; i < communityList.length; i++){
		if(localStorage.getItem("memberAuth") == '방장' || localStorage.getItem("memberAuth") == '관리자'){
			if(communityList[i][2] == '1212993272'){// 관리자 fbUid 직접 입력
				localStorage.setItem("communityManagerNumber",communityList[i][0]);
				var value = {
						interestCommunityNo:0,
						interestCommunityName : communityList[i][1]+'관리'
						};
				createCommunityListOption(0,value);
			}
		}
	}
}
