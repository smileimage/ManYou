//**** DB에사용자 UID값이 있는지 확인
function checkFbUid(uid){
	var url = surl+'/checkFbUid.do?fbUid='+uid;
	$.getJSON(url,function(data, textStatus, jqXHR){
		if(data.status == 200) {
			if(data.result > 0){
			}else{
				alert('가입을 환영합니다.');
				insertDBmemInfo(uid);
			}
		} else {
			alert("서버에서 데이터를 가져오는데 실패했습니다.");
			alert(data.message);
		}		
	});
}
function getFacebookUserInfo(user,className){
	sessionStorage.setItem('id',user.id);
	sessionStorage.setItem('name',user.name);	
	sessionStorage.setItem('className',className);	

}

function removeFacebookUserInfo(){
	sessionStorage.removeItem('id',user.id);
	sessionStorage.removeItem('name',user.name);	
	sessionStorage.removeItem('className',className);	

}
//-------------------------------------------------------------------------------------------
//* DB에 회원정보 입력
function insertDBmemInfo(uid) {
//FB API 를 이용한 FQL 쿼리 사용	
	FB.api({
			method: 'fql.query',
			query: 'SELECT uid, name, sex, pic_square, email FROM user WHERE uid=' + uid  
     }, function(response) {
		$.post(surl+'/addFbInfo.do', {
			fbName: response[0].name,
			fbUid: response[0].uid,
			fbSex : setGender(response[0].sex),
			fbPhotoPath: response[0].pic_square,
			fbEmail: response[0].email,
			auth: '회원',
			level:'1'
		}, function(data, textStatus, jqXHR) {
			if (data.status == 200) {
				alert(fbName + "님 가입을 환영합니다.");
			} else {
				alert(data.message);
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
				// Just show error message if there's an error
				if (response) {
					if (response.id) {
						console.log("성공");
						changeMobile();
					} else {
						alert("Error");
					}
				}
				// user cancelled
			});
		}
	});
};
//사진첩에만 사진을 올리고 싶다면, /me/photos 로 바꾸고, picture 파라미터 만
//이용하여 업로드 한다. picture -> url
