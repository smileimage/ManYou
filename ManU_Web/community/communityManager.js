var deleteList = [];
var memberList=[];
var memberDeleteList = new Array();
var currMemPage=0;
var check = true;

$(document).ready(function(e) {
	$("input:button").button();
	prepareManagerMappingInfoList();
	
	$('.delBtnGrp input:first-child').toggle(
			function(){
				$(this).parentsUntil('.customTableCSS').find('input:checkbox').attr('checked','checked');
				check = true;
			},
			function(){
				$(this).parentsUntil('.customTableCSS').find('input:checkbox').removeAttr('checked');
				check = false;
			}
	);
	
	$('#multiMappingDelBtn').live('click',function(){
		confirmBox('center', '삭제하시겠습니까?', 0); // 0이면 삭제, 1이면 권한변경
	});
	
	$('#multiMemberDelBtn').live('click',function(){
		confirmBox('center', '변경 하시겠습니까?', 1);
	});
});

function delectMappingInfoByManager(){
	deleteList = [];
	
	$('#managerMappingDelete:checked').each(function(){
		deleteList.push($(this).val());
	});
	
	$.ajax({
		url: 'communityMappingInfoDeleteList.do',
		dataType: 'json',
		data : {deleteList : deleteList.toString()},
		success: function(data, textStatus, jqXHR) {
			if(data.status == 200) {
				
				for(var i = 0 ; i < 5; i++){
					$('#communityMappingInfoListTable tr').eq(1).remove();
					$('#communityMemberListTable tr').eq(2).remove();
				}
				communityMappingList();
				communityMemberList();
				if(check){$('#multiSelectorBtn').trigger('click');}
			} else {
				alert("서버에서 데이터를 가져오는데 실패했습니다.");
				debug(data.message);
			}
		}
	});
}

function changeMemberAuth(){
	var commission = document.getElementsByName("managerMemberDelete");
	var auth = document.getElementsByName("authSelected");
	var changeSuccess = true; 
	
	for (var i=0; i<commission.length;i++){
		if(commission[i].checked == true){
			$.getJSON('../members/memberDelete.do', {
				fbUid: commission[i].value,
				auth: auth[i].value
			},
			function(data, textStatus, jqXHR) {
				if (data.status == 200) {
					changeSuccess=true;
				} else {
					changeSuccess=false;
					debug(data.message);
				}
			});
		}
	};
	
	for(var i = 0 ; i < 5; i++){
		$('#communityMappingInfoListTable tr').eq(1).remove();
		$('#communityMemberListTable tr:nth-child(3)').remove();
	};
	communityMappingList();
	communityMemberList();
	
	if(changeSuccess == true){
		generateCustomAlert('success','성공적으로 변경 되었습니다.');
	}else{
		generateCustomAlert('error', '변경을 실패 하였습니다.');
	}
}

function confirmBox(layout, text, command) {
    var n = noty({
      text: text,
      type: 'alert',
      dismissQueue: true,
      layout: layout,
      theme: 'default',
      buttons: [
        {addClass: 'btn btn-primary', text: 'Ok', onClick: function($noty) {
            $noty.close();
            if(command > 0 ){
            	changeMemberAuth();
            }else{
            	delectMappingInfoByManager();
            }
//            noty({dismissQueue: true, force: true, layout: layout, theme: 'default', text: 'You clicked "Ok" button', type: 'success'});
          }
        },
        {addClass: 'btn btn-danger', text: 'Cancel', onClick: function($noty) {
            noty({dismissQueue: true, force: true, layout: layout, theme: 'default', text: '취소 하셨습니다.', type: 'error'});
            setTimeout(function() {
				$.noty.closeAll();
			}, 1500);
          }
        }
      ]
    });
    console.log('html: '+n.options.id);
}

function communityMappingList(){
	$.ajax({
		url: 'communityMappingInfoList.do',
		dataType: 'json',
		data : {interestCommunityNo : localStorage.getItem("communityManagerNumber")},
		success: function(data, textStatus, jqXHR) {
			if(data.status == 200) {
				changeManagerMappingInfoList(data.result);
			} else {
				alert("서버에서 데이터를 가져오는데 실패했습니다.");
				debug(data.message);
			}
		}
	});
}

function communityMemberList(){
	$.ajax({
		url: 'communityMemberList.do',
		dataType: 'json',
		data : {interestCommunityNo : localStorage.getItem("communityManagerNumber")},
		success: function(data, textStatus, jqXHR) {
			if(data.status == 200) {
				changeManagerMemberList(data.result);
			} else {
				alert("서버에서 데이터를 가져오는데 실패했습니다.");
				debug(data.message);
			}
		}
	});
}

function addcommunityMemberTable(value){
	if(value != undefined){
		var command = localStorage.getItem("memberAuth");
		
		switch(command){
		case '관리자' : $('#communityMemberListTable').append(memberListTR(value)); 
			break;
		
		default : if(value.auth == '회원' || value.auth == '불량'){
					$('#communityMemberListTable').append(memberListTR(value));
					}
			break;
		}
	}
}

function memberListTR(value){

	var userSex = "";
	
	value.fbSex == 1 ? userSex = "여" : userSex = "남";
	
	return $('<tr></tr>')
	.append($('<td>'+ value.fbName +'</td>'))
	.append($('<td>'+ value.fbEmail +'</td>'))
	.append($('<td>'+ userSex +'</td>'))
	.append($('<td>'+ new Date(value.signUpDate).format("yyyy년  MM월 dd일 ") +'</td>'))
	.append($('<td>'+ value.count +'</td>'))
	.append($('<td></td>').append(createAuthSelectBox(value.auth)))
	.append($('<td><input name="managerMemberDelete" type="checkbox" value="'+ value.fbUid +'"></td>'));
}

function addManagerMappingInfoList(value){
	if(value != undefined){
		$('#communityMappingInfoListTable').append(createManagerContents(value));
	}
}

function createAuthSelectBox(memberAuth){
	var authSelectBox = $('<select></select>')
		.attr('name','authSelected')
		.attr('id', 'authSelected');
	
	if(localStorage.getItem("memberAuth") == '관리자'){
		authSelectBox.append($('<option>관리자</option>').val('관리자'));
		authSelectBox.append($('<option>회원</option>').val('회원'));
		authSelectBox.append($('<option>방장</option>').val('방장'));
		authSelectBox.append($('<option>불량</option>').val('불량'));
	}else{
		authSelectBox.append($('<option>회원</option>').val('회원'));
		authSelectBox.append($('<option>불량</option>').val('불량'));
	}
	authSelectBox.val(memberAuth).attr({selected:'selected'});
	return authSelectBox;
};

/* 접근상태정보 출력 폼*/
function createManagerContents(value){
	return $('<tr></tr>').append(
			$('<td></td>').append(
					$('<div></div>').mouseover(function() {
											$(this).find('.detailImg').removeClass('displayNone');
									}).mouseout(function() {
											$(this).find('.detailImg').addClass('displayNone');
									})
					.append(createManagerMappingInfoListTable(value))));	
}

function createManagerMappingInfoListTable(value){
	return $('<table class="managerMappingInfoTable"></table>')
	.append(createManagerTitleTR(value))
	.append(createManagerInvestiAnsItemTR(value))
	.append(createManagerLocationTR(value))
	.append(createManagerOption(value));
}

function createManagerTitleTR(value){
	return $('<tr></tr>')
	.append(createManagerInvestiItemIconTD(value))
	.append(createManagerPhotoTD(value))
	.append($('<td colspan="2"></td>').text(value.miTitle))
	.append($('<td rowspan="4"></td>').append(createInput('managerMappingDelete',value.miNo+':'+new Date(value.miDate).format("yyyy-MM-dd")+'%:'+value.fbUid,'checkbox')));
}

function createManagerInvestiAnsItemTR(value){
	return $('<tr></tr>')
	.append($('<td></td>').text(new Date(value.miDate).format("yyyy년  MM월 dd일 a\/p hh:mm")))
	.append($('<td width="100px" ></td>').text(value.fbName));
}

function createManagerInvestiItemIconTD(value){
	return $('<td width="40px" rowspan="2" align="center"></td>')
	.append($('<img></img>')
			.addClass('contentIcon')
			.attr('src','../images/icons/'+ selectMarker(value.investiItemType) +'.png')); // DB 경로명
}

function createManagerPhotoTD(value){
	if(value.pathName==null){
		return $('<td width="250px" height="80px" rowspan="4" align="center"></td>')
		.append($('<img></img>').addClass('contentPhoto')
				.attr('src','../images/ManU.png')); // DB 경로명
	}else{
		return $('<td width="250px" height="80px" rowspan="4" align="center"></td>')
		.append($('<img></img>').addClass('contentPhoto')
				.attr('src',value.pathName+value.fileMask)); // DB 경로명
	}
}

function createManagerLocationTR(value){
	return $('<tr></tr>')
	.append($('<td rowspan="2" align="center"></td>').text(value.investiItemType))
	.append($('<td colspan="2"></td>').text(value.address));
}

function createManagerOption(value){
	return $('<tr></tr>').append($('<td>' + "좋아요 ( " + goodCount(value) + " )&nbsp" +
							"댓글 ( " + replyCount(value) + " )" + '</td>').addClass('ImgTd'))
					.append($('<td></td>').append($('<img src="../images/detail_img.png">')
							.attr('data-pk', value.miNo)
							.addClass('detailImg')
							.addClass('displayNone')
							.bind('click',function(){
								getDetailDataAndRefresh($(this).attr('data-pk'));
								$('#openDialog').dialog('open');
							})));
}

function prepareManagerMappingInfoList(){
	$('#mBeforeBtn').click(function() {
		currPage = currPage - 4;
		pageCheck++;
		$('#mNextBtn').css('display', '');
		
		if(currPage == 0){
			$('#mBeforeBtn').addClass('displayNone');
		}
		
		$('#mNextBtn').removeClass('displayNone');		
		
		refreshManagerMappingInfoList('mapping');
	});

	$('#mNextBtn').click(function() {
		currPage = currPage + 4;
		pageCheck--;
		
		$('#mBeforeBtn').removeClass('displayNone');
		
		if(pageCheck <= 1){
			$('#mNextBtn').addClass('displayNone');
		}
		
		refreshManagerMappingInfoList('mapping');
	});
	
	$('#beforeBtn').click(function() {
		currMemPage = currMemPage - 5;
		pageMemCheck++;
		$('#nextBtn').css('display', '');
		
		if(currMemPage == 0){
			$('#beforeBtn').addClass('displayNone');
		}
		
		$('#nextBtn').removeClass('displayNone');		
		
		refreshManagerMappingInfoList('member');
	});

	$('#nextBtn').click(function() {
		currMemPage = currMemPage + 5;
		pageMemCheck--;
		
		$('#beforeBtn').removeClass('displayNone');
		
		if(pageCheck <= 1){
			$('#nextBtn').addClass('displayNone');
		}
		
		refreshManagerMappingInfoList('member');
	});
	
	communityMappingList();
	communityMemberList();
}


function refreshManagerMappingInfoList(value){
	if(value == 'member'){
		for(var i = 0; i < 5; i++){
			$('#communityMemberListTable tr').eq(2).remove();
		}
		for(var i = 0; i < 5; i++){
			addcommunityMemberTable(memberList[currMemPage + i]);
		}
	}else{
		for(var i = 0; i < 4; i++){
			$('#communityMappingInfoListTable tr').eq(1).remove();
		}
		for(var i = 0; i < 4; i++){
			addManagerMappingInfoList(mappingInfoList[currPage + i]);
		}

	}
}

function changeManagerMemberList(memberData){
	memberList=[];
	$.each( memberData, function(index, value){
		if(localStorage.getItem("memberAuth") == '관리자'){
			memberList.push(value);
		}else{
			if(value.auth == '회원' || value.auth == '불량'){
				memberList.push(value);
			}
		}
	});
	
	if(memberList.length < 5 ){
		$('#nextBtn').addClass('displayNone');
	}
	
	for(var i = 0; i < 5; i++){
		if(memberList[i] != null){
			addcommunityMemberTable(memberList[currMemPage + i]);
		}
	}
	pageMemCheck =  memberList.length / 5;
};

function changeManagerMappingInfoList(mappingData){		
	mappingInfoList=[];
	
	$.each( mappingData, function(index, value){
		mappingInfoList.push(value);
	} );
	
	if(mappingInfoList.length <4 ){
		$('#mNextBtn').addClass('displayNone');
	}
	
	for(var i = 0; i < 4; i++){
		if(mappingInfoList[i] != null){
			addManagerMappingInfoList(mappingInfoList[currPage + i]);
		}
	}
	pageCheck =  mappingInfoList.length / 4;
};
	
	
