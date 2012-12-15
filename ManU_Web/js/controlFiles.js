var fileCount= new Array(5);
var count = 0;
var fileExt = '';
var tiwtterCheck = false;

$(document).ready(function(){
	$('#attachment').live("click",function(event){
		$('#attachment').toggle(function() {
	        $("#fileListDiv").animate({"marginLeft": "+=0px"},200);
	        $("#fileListDiv").fadeIn(200);
	    },function(){
	        $("#fileListDiv").animate({"marginLeft": "-=0px"}, 200);
	        $("#fileListDiv").fadeOut(200);
	    }).trigger('click');
	});
	
	$('#attachfile').live('click',function(event){
		for (var i=0 ; i<fileCount.length; i++){
			if (fileCount[i] == null && count<5) {
				fileCount[i] = i+1;
				uploaderAppend(fileCount[i]);
				$('#doc'+fileCount[i]).click();
				break;
			}else if(count >= 5){
				generateCustomAlert('error','첨부파일은 5개까지 가능합니다.');
				break;
			};
		}
	});
	
	$('#editAttachfile').live('click',function(event){
		for (var i=0 ; i<fileCount.length; i++){
			if (fileCount[i] == null && count<5) {
				fileCount[i] = i+1;
				editUploaderAppend(fileCount[i]);
				$('#doc'+fileCount[i]).click();
				break;
			}else if(count >= 5){
				generateCustomAlert('error','첨부파일은 5개까지 가능합니다.');
				break;
			};
		}
	});
	
	$('#addBtn').live('click', function(){
		count=0;
		fileCountRest();
		insertMappingInfoList();
	});
	
	$('#confirmBtn').live('click', function(){
		count=0;
		insertUpdateMethod();
	});
});

function insertMappingInfoList(){
	var options ={
			beforeSubmit: validate,
			success: showRegResponse,
			url:'../main/addMappingInfo.do',
			data:{ 
				interestCommunityNo : $('#interestCommunityName option:selected').val(),
    			lng : dbLng, 
    			lat : dbLat,
    			Reason : "글쓰기",
    			Point : 10,
    			fbUid : getCookie('cookieFbUid'),
    			checkUpload : 1
			},
			dataType:'json'
	};
	$('#regForm').ajaxForm(options);
}

function validate(formData, jqForm, options) { 
	var form = jqForm[0]; 
	if (!form.miTitle.value || (form.miTitle.value.trim() == '')) {
		generateCustomAlert('error','제목을 입력해 주세요.');
		twitterCheck = false;
		return false; 
	}else{
		twitterCheck = true;
	}
	
	if (form.interestCommunityName.value == '커뮤니티목록') { 
		generateCustomAlert('error','커뮤니티를 선택해 주세요.');
		twitterCheck = false;
		return false; 
	}
	else{
		twitterCheck = true;
	}
	
	if (form.investiItemType.value == '구분') {
		generateCustomAlert('error','구분을 선택해 주세요.');
		twitterCheck = false;
		return false; 
	}else{
		twitterCheck = true;
	}
	
	if (!form.address.value || (form.address.value.trim() == '')) {
		generateCustomAlert('error','지도를 클릭하여 주소를 입력해 주세요.');
		twitterCheck = false;
		return false; 
	}else{
		twitterCheck = true;
	}
	
	if (!form.miContext.value || (form.miContext.value.trim() == '')) { 
		generateCustomAlert('error','내용을 입력해 주세요.');
		twitterCheck = false;
		return false; 
	}else{
		twitterCheck = true;
	}
	
	if (!($('#doc1').hasClass('hidden'))) {
		var isSaved = confirm('기본 이미지로 글을 작성합니다. 진행 하시겠습니까?');
		twitterCheck = isSaved;
		if($('#twitter:checked').length > 0 && twitterCheck){
			twitterInsert();
		}
		return isSaved;
	}else{
		twitterCheck = true;
	}
	
	if($('#twitter:checked').length > 0 && twitterCheck){
		twitterInsert();
	}
}

function showRegResponse(responseText, statusText, xhr, $form)  {
	var getMappingData = responseText.result[0];
	var getImagePath = "http://14.63.224.161:8080"+responseText.result[1];
	var sendData = {
			title: getMappingData.miTitle,
			address: getMappingData.address,
			url: getImagePath,
			msg: '홈페이지 : http://14.63.224.161:8080/ManU42/main'
	};
	if(getMappingData.miPropose > 0){
		uploadPhotoWall(sendData);
	}
	
	count=0;
	fileCountRest();
	resetForm();
	allMarkerView(0);
} 
function insertUpdateMethod(){
	var options ={
			success: showDetailResponse,
			url:'../main/updateMappingInfoData.do',
			data:{ 
				lng : dbLng, 
    			lat : dbLat,
    			miNo: sessionStorage.getItem('miNo')
			},
			dataType:'json'
	};
	$('#updateForm').ajaxSubmit(options);
}

function showDetailResponse(responseText, statusText, xhr, $form){
	fileCountRest();
	photoArray=[];
	count=0;
	getDetailDataAndRefresh($('#miNo').val());
	refreshMappingInfoList();
	clickAfterConfirmBtn();
} 

function uploaderAppend(listNo){

	$("#uploader").append(attachFileListAdd(listNo));

	$('#SelectDelBtn'+listNo).live('click',function(){
		$('#li'+listNo).remove();
		fileCount[listNo-1]=null;
		count=listNo-1;
	});

	$('#doc'+listNo).change(function(click) {
		var fileName = this.value;
		var lastPointIndex = fileName.lastIndexOf("\\");
		fileExt = fileName.substring(lastPointIndex+1);
		$('#addfilename'+listNo).html(fileExt);
	});
};

function attachFileListAdd(listNo){
	if(fileExt == ''){
		$('#li'+(listNo-1)).remove();
		count--;
	}
	count++;
	fileExt = '';
	return ('<li id="li'+ listNo + '"><input type="file" name="doc" id="doc'+ 
			listNo+'" class="hidden" /><div id="addfilename'+ 
			listNo+'" style="float:left;"></div><div><img id="SelectDelBtn'+
			listNo+'" src="../images/del.png" width="15px" class="addfileDelBtn"></div>');
};

function editUploaderAppend(listNo){
	$("#edituploader").append(attachFileList(listNo));

	$('#SelectDelBtn'+listNo).live('click',function(){
		$('#li'+listNo).remove();
		fileCount[listNo-1]=null;
		count=listNo-1;
	});

	$('#doc'+listNo).change(function(click) {
		var fileName = this.value;
		var lastPointIndex = fileName.lastIndexOf("\\");
		var fileExt = fileName.substring(lastPointIndex+1);
		$('#fname'+listNo).html(fileExt);
	});
};

function attachFileList(listNo){
	return ('<li  id="li'+ listNo + '"><input type="file" name="doc" id="doc'+ 
			listNo+'" class="hidden"/><div id="fname'+ 
			listNo+'"></div><div><img id="SelectDelBtn'+
			listNo+'" src="../images/del.png" width="15px" class="fileDelBtn"></li>');
};

function addFileListRowInDetailTable(index, photoData){
	count++;
	$('#fileList').append(createLI('li'+index).append($('<a href="download.do?fileMask=' 
			+ photoData.fileMask + '&fileName=' 
			+ photoData.photoName +' ">' 
			+ photoData.photoName +'</a>')).append(
					$('<img></img>',{
						id:'fileDelBtn'+index,
						src:'../images/del.png',
						width:'15px',
					}).addClass('fileDelBtn hidden')));

	$('#fileDelBtn'+index).on('click', {value:photoData, idx:index}, fileDeleteRequest);

}
function fileDeleteRequest(event){
	var photoInfo= event.data.value;
	var index = event.data.idx;
	$.getJSON('../board/fileDelete.do', {
		gbNo: photoInfo.miNo,
		fileMask: photoInfo.fileMask
	}, 
	function(data, textStatus, jqXHR){
		if(data.status ==200){
			$('#li'+index).detach();
		}else{
			alert("서버에서 삭제하는데 실패했습니다.");
		}
	});
}

function checkAttach(value){
	if (value.length> 0){
		$('#attachment').html("첨부파일 ["+value.length+"]").addClass('hide');
	}
}

function fileCountRest(){
	for(var i=0;i<fileCount.length;i++){
		fileCount[i]=null;
	};
}
