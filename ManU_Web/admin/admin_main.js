var currPage = 1;

$(document).ready(function(){
	prepareCenterList();
});

function refreshCenterList() {
	if (currPage <= 1) {
		currPage = 1;
		$('#prevPage').attr('disabled', '');
	} else 
		$('#prevPage').removeAttr('disabled');

	$.ajax({
		url: 'memberDeleteList.do',
		dataType: 'json',
		success: function(data, textStatus, jqXHR) {
			$('tr.dataTR').remove();
			console.log(data.result);
			if(data.status == 200){
				$.each( data.result, addDeleteRequestList );
			}else{
				alert("서버에서 데이터를 가져오는데 실패했습니다.");
				debug(data.message);
			}
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

	$('#totalCheck').click(function() {
		totalCheck();
	});

	refreshCenterList();
}

function addDeleteRequestList(index, value) {
	$('#centerList').append( createDeleteRequestRow(value) );
}

function createDeleteRequestRow(value) {
	return $('<tr></tr>').addClass('dataTR')
//	.attr('data-pk', value.mdr_no)
	.append('<td class="requestCommunity">' + value.interest_community_name + '</td>')
	.append('<td class="reqeustName">' + value.fb_name + '</td>')
	.append('<td class="reqeustEmail">' + value.fb_email + '</td>')
	.append('<td class="reqeustReason">' + value.mdr_reason + '</td>')
	.append('<td class="reqeustDate">' + value.mdr_date + '</td>')
	.append('<td><input type="checkbox" name="commission" class="commission" value="'+value.fb_uid+'"></td>');
}



function deleteRow(){
	console.log($('.commission:checked').length);
	$('.commission:checked').each(function(){
		$.getJSON('memberDelete.do', {
			arr: $('.commission:checked').val()
		},
		function(data, textStatus, jqXHR) {
			if (data.status == 200) {
				alert("변경 완료");
			} else {
				alert("삭제 실패입니다.");
				debug(data.message);
			}
		});
	});
}

function totalCheck() {
	if($('#totalCheck').is(":checked")) {
		$('input:checkbox[name=commission]:not(checked)').attr("checked",true);
	} else {
		$('input:checkbox[name=commission]:checked').attr("checked",false);
	}
}