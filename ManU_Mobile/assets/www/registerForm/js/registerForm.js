var id = sessionStorage.getItem('id');
var className = sessionStorage.getItem('className');
var sendTwitter = false;
var sendFacebook = 0;

document.addEventListener("deviceready",onDeviceReady, false);

function onDeviceReady(){
	checkNetwork(false);	
	facebookInit();
}

$(document).ready(function(){
	$('#content').append(createRegisterForm());
	screenInit();
	$('#getPictureBtn').live('click', function(){
		capturePhoto();
		$('.ui-dialog').dialog('close');
	});
	
	$('#getGalleryBtn').live('click', function(){
		getPhoto(pictureSource.PHOTOLIBRARY);
		$('.ui-dialog').dialog('close');
	});
	
	$('#registerForm').submit(function (){
		if( !regFormCheckValidate() ){
			return false;
		}
		$(this).ajaxSubmit({
			success:       showResponse,  // post-submit callback 
			url: surl+'/main/addMappingInfo.do',
			data :{ 
				interestCommunityNo : $('#interestCommunityName option:selected').val(),
				lng : dbLng, 
				lat : dbLat,
				Reason : "글쓰기",
				Point : 10,
				fbUid : id,
				checkUpload : 0,
				miPropose : sendFacebook

			} ,
			dataType:'json'
		});
		
		return false;
	});
	
	$('#regResetBtn').live('click', function(){
		console.log('sdsdfsd');
		$('#registerForm').children().remove();
		createRegisterForm();
		window.location.href="../index.html";
		$.mobile.silentScroll(0);
	});
	
	$('#twitterBtn').toggle(function(){
		$('#twitterBtn').attr('value','tweet');
		sendTwitter = true;
		twitterLogin();
		
	},function(){
		$('#twitterBtn').attr('value','트윗');
		sendTwitter = false;
	});

	$('#facebookBtn').toggle(function(){
		$('#facebookBtn').attr('value','fabo');
		sendFacebook = 1;
	},function(){
		$('#facebookBtn').attr('value','페북');
		sendFacebook = 0;
	});	
});

function regFormCheckValidate(){
	if($('#miTitle').val() == "" ||  $('#miTitle').val() == null) {
		alert("제목을 입력하여주세요!");
		return false;
	}
	
	if($('#address').val() == "" ||  $('#address').val() == null) {
		alert("지도를 클릭하여 주세요!");
		return false;
	}
	
	if($('#interestCommunityName').val() == "커뮤니티목록" ||  $('#interestCommunityName').val() == null) {
		alert("커뮤니티 목록을 선택해주세요!");
		return false;
	}
	
	if( $('#investiAnsItemType ul li #investiItemType').val() == "구분" ||  $('#investiAnsItemType ul li #investiItemType').val() == null) {
		alert("구분 목록을 선택해주세요!");
		return false;
	}
	
	if($('#miContext').val() == "" ||  $('#miContext').val() == null) {
		alert("내용을 입력하여 주세요!");
		return false;
	}
	
	if( $('#photo').attr('src') == "" ||  $('#photo').attr('src') == null || $('#photo').attr('src') == undefined) {
		alert("사진을 선택하여 주세요!");
		return false;
	}
	
	return true;
}

var header 		= $("div[data-role='header']");
var footer 		= $("div[data-role='footer']");
var content		= $("div[data-role='content']");
var search = $("div[id='search']:visible");

function screenResize(){
	var searchHeight = search.outerHeight();
	var viewport_height = $(window).height();
	var content_height = viewport_height - header.outerHeight() - footer.outerHeight();
	content_height -= (content.outerHeight() - content.height());
	$("#map_canvas").css('height',(content_height - (searchHeight*3) ) );
}

function screenInit(){
	var registerForm = $('#registerForm');
	var registerFormHeight = registerForm.outerHeight();
	var searchHeight = search.outerHeight();
	var viewport_height = $(window).height();
	var content_height = viewport_height - header.outerHeight() - footer.outerHeight();
	content_height -= (content.outerHeight() - content.height());
	$("#map_canvas").css('height',(content_height - searchHeight - (registerFormHeight*1.2) ) );
}

function showResponse(responseText, statusText, xhr, $form)  { 
	console.log('글 입력 성공');	
	console.log("결과"+responseText.result[0]);
	var getMappingData = responseText.result[0];	
	sendImage(getMappingData);
} 

function sendSNS(getMappingData,getImagePath){
	if(getImagePath !="error"){
//		alert('mipropose '+getMappingData.miPropose);
//		alert('image '+ getImagePath);
		var sendData = {
				title: getMappingData.miTitle,
				address: getMappingData.address,
				url: ipUrl+getImagePath,
				msg: surl+ '/main',
				lat: getMappingData.lat,
				lng: getMappingData.lng
		};
		if(sendTwitter==true){
			sendTweet(sendData);
		}
		
		if(getMappingData.miPropose > 0){
			uploadPhotoWall(sendData);
//			postToWallUsingFeed(sendData);
		}else{
			changeMobile();
		}
	}
}

function changeMobile(){
	progressFlag();
	$.mobile.changePage($(document.location.href="../list/list.html"), 'slideup');
}

function createRegisterForm(){
	return $('#registerForm').append( createInput('miTitle','', 'text').attr('placeholder', '제목') )
						.append( createAddressDiv() )
						.append( attachInvestiItemDiv() )
						.append( createTextarea('miContext', '')
									.attr('placeholder','자세한 내용은 여기 써주세요.') )
						.append( createAddPhotoDiv() )
						.append( createBtnGrpDiv() );
}

function createAddressDiv(){
	return $('<div></div').attr('id','addressDiv')
						.append( createInput('address','', 'text')
									.attr('placeholder','지도를 눌러 주세요.') );
}
function createInput(inputId, value, type){
	return $('<input></input>').attr('id', inputId)
							.attr('name', inputId)
							.attr('type', type)
							.insertAfter( "#registerForm" )
							.textinput();
}

function createTextarea(inputId, value){
	return $('<textarea></textarea>').attr('id', inputId)
									.attr('name', inputId)
									.addClass('ui-input-text ui-body-d ui-corner-all ui-shadow-inset')
									.insertAfter( "#registerForm" );
}
function createAddPhotoDiv(){
	return $('<div></div>').attr('id', 'addPhotoDiv')
						.append( createDialog('dialogBtn', '사진 선택').attr('data-rel', 'dialog') )
						.append( createPhotoSection() );
}


function createDialog(inputId, txt){
	return $('<a href="#dialogPage" data-role="button" data-inline ="true" data-theme="a">'+txt+'</a>').attr('id', inputId)
																			.button();
	
}
function createPhotoSection(){
	return $('<img></img>').attr('id', 'photo').attr('name', 'photo');
}
function createBtnGrpDiv(){
	return $('<div></div>').attr('id', 'btnGrpDiv')
						.append( createButton('regResetBtn', 'reset', '취소') )
						.append( createButton('regAddBtn', 'submit', '완료') )
						.append( createButton('twitterBtn', 'button', '트위터') )
						.append( createButton('facebookBtn', 'button', '페이스북') );
}

function createButton(inputId, type, text){
	return $('<input></input>').attr('id', inputId).attr('type', type).attr('value', text)
			.addClass('ui-btn ui-btn-inline ui-shadow ui-btn-corner-all ui-btn-up-a');
}
