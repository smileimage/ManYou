var authList = ["관리자","방장","회원","불량"];

var currPage = 1;

$(document).ready(function(){
	$('#centerList').append( createMemberListTh() );
	prepareCenterList();
	
	pageControl();
});

function refreshCenterList() {
	$.getJSON('membersList.do', {
		page : currPage
	},
	function(data, textStatus, jqXHR) {
		$('tr.dataTR').remove();
		if(data.status == 200){
			$.each( data.result, addMembersList );
		}else{
			alert("서버에서 데이터를 가져오는데 실패했습니다.");
			debug(data.message);
		}
	});
}

function prepareCenterList() {

	$('#centerList tr.dataTR').live('mouseover', function(event) {
		$(this).css('background-color','white');
	});

	$('#centerList tr.dataTR').live('mouseout', function(event) {
		$(this).css('background-color','');
	});

	$('#delBtn').click(function() {
		deleteRow();
	});

	$('#totalCheck').live('click',function() {
		totalCheck();
	});

	$('#authSearch').live('change',function(){
		memberAuthSearch();
	});

	$('.authSelect').live('change', function(){
		$.post('memberAuthUpdate.do', {
			fbUid: $(this).attr('updateUid'),
			auth: $(this).val()
		}, 
		function(data, textStatus, jqXHR) {
			if(data.status == 200){
				alert("권한 수정 완료");
			}else{
				alert("서버에서 데이터를 가져오는데 실패했습니다.");
				debug(data.message);
			}
		},
		'json'
		);
	});

	refreshCenterList();
}

$(function(){
	$( "#searchName" ).autocomplete({
		minLength:1,
		source:  function( request, response ) {
			console.log($( "#searchName" ).val());
			$.ajax({
				url: "nameSearch.do",
				dataType: "json",
				data: { nameSearch: $( "#searchName" ).val() },
				success: function( data ) {
					response( $.map( data.result, function( item ) {
						return {
							label: request.term,
							value: item
						};
					}));
				}
			});
		},
		select: function( event, ui ) {
			$( "#searchName" ).val( ui.item.value.FB_NAME );
			return false;
		}
	})
	.data( "autocomplete" )._renderItem = function( ul, item ) {
		console.log(item.value.FB_NAME);
		return $( "<li></li>" )
							.data( "item.autocomplete", item )
							.append( "<a>" + item.value.FB_NAME + "</a>" )
							.appendTo( ul );
	};
});

function pageControl(resultLength){
	$("#pageControlBar").paginate({
		count 		: 20,
		start 		: 1,
		display     : 10,
		border					: false,
		text_color  			: '#79B5E3',
		background_color    	: 'none',	
		text_hover_color  		: '#2573AF',
		background_hover_color	: 'none', 
		images		: false,
		mouse		: 'press'
	});
}

function addMembersList(index, value) {
	$('#centerList').append( createMembersListRow(value) );
}

function createMemberListTh() {
	return $('<tr></tr>').addClass('headerTR')
	.append($('<th></th>').append('커뮤니티'))
	.append($('<th></th>').append('회원명'))
	.append($('<th></th>').append('이메일'))
	.append($('<th></th>').append(authSearch()))
	.append($('<th></th>').append('등급'))
	.append($('<th></th>').append('<input type="checkbox" id="totalCheck">삭제'));
}

function authSearch() {
	var selObject = $('<select></select>').attr('id','authSearch');
	selObject.append($('<option></option>').attr('value','0')
			.text('권한'));
	for(var i in authList) {
		selObject.append($('<option></option>').attr('value',authList[i])
				.text(authList[i]));
	}
	return selObject;
}

function memberAuthSearch() {
	$.post('membersList.do', {
		auth: $('#authSearch option:selected').val(),
	}, 
	function(data, textStatus, jqXHR) {
		$('tr.dataTR').remove();
		if(data.status == 200){
			$.each( data.result, addMembersList );
		}else{
			alert("서버에서 데이터를 가져오는데 실패했습니다.");
			debug(data.message);
		}
	},
	'json'
	);
}

function createMembersListRow(value) {
	return $('<tr></tr>').addClass('dataTR')
//	.attr('data-pk', value.mdr_no)
	.append($('<td class="memberCommunity"></td>').text(value.fbUid))
	.append($('<td class="memberName"></td>').text(value.fbName))
	.append($('<td class="memberEmail"></td>').text(value.fbEmail))
	.append($('<td class="memberAuth"></td>').append(authSelect(value)))
	.append($('<td class="memberLevel"></td>').text(value.level))
	.append($('<td></td>').html('<input type="checkbox" name="commission" class="commission" value="'+value.fbUid+'">'));
}

function authSelect(value) {
	var selObject = $('<select></select>').attr('updateUid',value.fbUid).addClass('authSelect');
	for(var i in authList) {
		if(authList[i] == value.auth){
			selObject.append($('<option selected></option>').text(authList[i]));
		} else {
			selObject.append($('<option></option>').text(authList[i]));
		}
	}
	return selObject;
}

function memberAuthSelect(e) {
	$.post('memberAuthUpdate.do', {
		fbUid: $(this).attr('updateUid'),
		auth: $(this).text()
	}, 
	function(data, textStatus, jqXHR) {
		if(data.status == 200){
			alert("권한 수정 완료");
		}else{
			alert("서버에서 데이터를 가져오는데 실패했습니다.");
			debug(data.message);
		}
	},
	'json'
	);
}

function deleteRow(){
	var arr=new Array();
	var k = 0;
	var commission = document.getElementsByName("commission");
	for (var i=0; i<commission.length;i++){
		if(commission[i].checked == true){
			arr[k] = commission[i].value;;
			k++;
		}
	}

	for(var i in arr){
		$.getJSON('memberDelete.do', {
			arr: arr[i]
		},
		function(data, textStatus, jqXHR) {
			if (data.status == 200) {
				refreshCenterList();
				clearForm();
			} else {
				alert("삭제 실패입니다.");
				debug(data.message);
			}
		});
	}
}

function totalCheck() {
	if($('#totalCheck').is(":checked")) {
		$('input:checkbox[name=commission]:not(checked)').attr("checked",true);
	} else {
		$('input:checkbox[name=commission]:checked').attr("checked",false);
	}
}