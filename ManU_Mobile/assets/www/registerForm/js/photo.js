var pictureSource;   // picture source
var destinationType; // sets the format of returned value 
var cameraImageSrc;
var indicatorFlag = false;
var imagePath;


//Wait for Cordova to connect with the device
document.addEventListener("deviceready",onDeviceReady,false);
//Cordova is ready to be used!

function onDeviceReady() {
	pictureSource = navigator.camera.PictureSourceType;
	destinationType = navigator.camera.DestinationType;
}

function onPhotoDataSuccess(imageData) {
	cameraImageSrc = imageData;
	$('#photo').attr('src', cameraImageSrc);
}

function onPhotoURISuccess(imageURI) {
	cameraImageSrc = imageURI;
	$('#photo').attr('src', cameraImageSrc);
}

//A button will call this function
function capturePhoto() {
	navigator.camera.getPicture(onPhotoDataSuccess, onFail, { 
		quality: 50 
	});
}

//A button will call this function
function getPhoto(source) {
	navigator.camera.getPicture(onPhotoURISuccess, onFail, { quality: 50, 
		destinationType: destinationType.FILE_URI,
		sourceType: source });
}

//Called if something bad happens.
function onFail(message) {
	alert('Failed because: ' + message);
}

function sendImage(getMappingData){
	if (!indicatorFlag){
		indicatorFlag = true;
		progressDialog(indicatorFlag);
		$("body").find("*").attr("disabled", "disabled");
		$("body").find("a").click(function (e) { e.preventDefault(); });
	}
	var imageURI = cameraImageSrc;

	var params = new Object();
	var mediaFile = new FileUploadOptions();


	if(imageURI.substr(imageURI.lastIndexOf('.')+1) == 'jpg' ){

		mediaFile.fileName = imageURI.substr(imageURI.lastIndexOf('?')+1);
	}else
		mediaFile.fileName = imageURI.substr(imageURI.lastIndexOf('/')+1)+'.jpg';

	mediaFile.mimeType="image/jpeg";

	mediaFile.fileKey = "mediaFile";

	mediaFile.params=params;

	var fileTransfer = new FileTransfer();
	fileTransfer.upload(imageURI, surl+'/main/addPhoto.do', 
			function(r){
		console.log("사진 입력이 성공적으로 등록되었습니다");
		imagePath=JSON.parse(r.response);
		console.log(imagePath);
		console.log(getMappingData);
		sendSNS(getMappingData, imagePath.result);

	},
	function(error){
		alert("Error code"+error.code);
		imagePath="error";
		sendSNS(getMappingData, imagePath);
	}, 
	mediaFile);

}


function progressDialog(check){

	if(check){
		window.plugins.loadingIndicator.show(null,null);
	}else{
		window.plugins.loadingIndicator.hide(null,null);
	}
}

function progressFlag(){
	if (indicatorFlag){
		indicatorFlag = false;
		progressDialog(indicatorFlag);
		$("body").find("*").removeAttr("disabled");
		$("body").find("a").unbind("click");
	}
}
