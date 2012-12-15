$(document).ready(function(){
	$('#map_invetigation input').bind('keyup', {index: $(this).parent().find('class')},makeTypeInput);
	prepareCommunityList();
	prepareBtnForm();
//	$('#investiItemList').selectbox();
});


function prepareCommunityList() {
	
	$('#communityList tr.dataTR').live('click', function(event) {
		
		//$("#communiName").text($(this).children('.community_name').text());
		refreshinvestiList($(this).attr('data-pk'));	
//		$("#jqxListBox").jqxListBox({ width: '200px', height: '250px'});
//		$("#jqxListBox").jqxListBox('loadFromSelect', 'select');
		
	});
	
	
$('#investiItemList').live('click', function(event) {
		console.log($('#investiItemList option:selected').attr('ansTypeNo'));
		$('#investiItemNo').val($('#investiItemList option:selected').val());
		$('#investiItemType').val($('#investiItemList option:selected').attr('investiItemType'));
		$('#investiItemName').val($('#investiItemList option:selected').attr('investiItemName'));
		$('#ansTypeNo').val($('#investiItemList option:selected').attr('ansTypeNo'));				
	});
	
	$('#btnTargetItems').live('click',function(event){
		$("#investiDiv").toggle("slow");
	});
	
	$("#addressBtn").bind('click',function(event){
		codeAddress();
	});
	
	$('#communityList tr.dataTR').live('mouseover', function(event) {
		$(this).css('background-color','yellow');
	});
	
	$('#communityList tr.dataTR').live('mouseout', function(event) {
		$(this).css('background-color','');
	});
	
//	$('tr[data-investi-pk=' + cno + ']').
//	$('interestCommunityEditBtn')
	refreshCommunityList();
}

function refreshCommunityList() {

	$.ajax({
		url: 'list.do',
		dataType: 'json',
		success: function(data, textStatus, jqXHR) {
			$('tr.dataTR').detach();
	
			if(data.status == 200){
				
				$.each( data.result, addCommunityRowInTable );
				$.each( data.resultList, addTagetPeopleRowInOption);
				$.each( data.result, targetPeopleInTable );
				//console.log(data.result.interestCommunityNo(0));
				refreshinvestiList(1);
			}else{
				alert("서버에서 데이터를 가져오는데 실패했습니다.");
				debug(data.message);
			}
//			$('#paging_container').pajinate();
		}
	});
}


function targetPeopleInTable(index,value){
	$('tr[data-pk=' + value.interestCommunityNo + ']').find('.selectbox').val(value.targetPeopleNo);
//	$('tr[data-pk=' + value.interest_communityNo + ']').find('.sel').text();
	
}

function addTagetPeopleRowInOption(index, value){
	return $('.selectbox').append(createTagetPeopleRow(index, value));
}

function createTagetPeopleRow(index, value) {
	 var $options = $('<option></option>')
				.val(value.targetPeopleNo)
				.text(value.targetPeopleName);
//				.attr("selected", "true")
//	if ($options.parent('.selectbox').attr("selno").is(0)){
//		$options.css("background", "#00FFFF");
//	};
	 return $options;
}

function addCommunityRowInTable(index, value) {
	$('#communityList').append( createCommunityRow(value) );
}

function createCommunityRow(value) {
	
	var dataTR =  $('<tr></tr>').addClass('dataTR')
				.attr('data-pk', value.interestCommunityNo)
				.append('<td >' + value.interestCommunityNo + '</td>')
				.append('<td class="community_name" >' + value.interestCommunityName + '</td>')
				.append('<td >' + value.interestArea + '</td>')
				.append('<td >' + value.interestDomain + '</td>')
				.attr('tagetno',value.targetPeopleNo)
				.append('<td class="sel">'+ value.targetPeopleName + '</td>')
//				.append('<td class="sel"><select class="selectbox" readOnly></select></td>')
				.append('<td >' + value.ownerUid + '</td>')
				.append('<td class="content hidden">' + value.interestCommunityContent + '</td>')
				.append('<td >' + value.createDate + '</td>');
			//	.append('<td ><input type="button" class="interestCommunityEditBtn" value="수정"></td>');
	return dataTR;
}


function deleteCommunityRow(cno) {
	$('tr[data-pk=' + cno + ']').remove();
}



function prepareBtnForm() {
	
	//분류 옵션 입력 
	
	$('#addInvestiItemBtn').bind('click', function(event) {
		$.post('addInvestiItem.do', {
			investiItemName: $('#investiItemName').val(),
			investiItemType: $('#investiItemType').val(),
			ansTypeNo: $('#ansTypeNo').val()
			}, 
			function(data, textStatus, jqXHR) {
				if(data.status=200){
					refreshinvestiList($('td.investiListDataTR').attr('data-pk'));
					clearInvestiItemForm(); 
				}else{
					alert('서버로부터 데이터를 가져오는데 실패 하였습니다.');
					debug(data.message);
				}
				
			},
			'json'
		);
	});
	
	
	$('#modifyInvestiItemBtn').bind('click', function(event) {
		$.post('modifyInvestiItem.do', {
			investiItemNo: $('#investiItemNo').val(),
			investiItemName: $('#investiItemName').val(),
			investiItemType: $('#investiItemType').val(),
			ansTypeNo: $('#ansTypeNo').val()
			}, 
			function(data, textStatus, jqXHR) {
				if(data.status=200){
					refreshinvestiList($('td.investiListDataTR').attr('data-pk'));
					clearInvestiItemForm(); 
				}else{
					alert('서버로부터 데이터를 가져오는데 실패 하였습니다.');
					debug(data.message);
				}
				
			},
			'json'
		);
	});
	
	$('#deleteInvestiItemBtn').live('click', function() {
			var temp = $('#investiItemNo').val();
			$.getJSON('deleteInvestiItem.do', {
				investiItemNo: $('#investiItemNo').val()
			},
				function(data, textStatus, jqXHR) {
					if (data.status == 200) {
						deleteInvestiItemRow(temp);
						clearInvestiItemForm(); 
					} else {
						alert('서버로부터 삭제 하는데 실패 하였습니다.');
						debug(data.message);
					}
				});

	});
	
	
	//커뮤니티 입력 
	$('#addBtn').bind('click', function(event) {
		$.post('add.do', {
			interestCommunityName: $('#interestCommunityName').val(),
			interestArea: $('#interestArea').val(),
			interestDomain: $('#interestDomain').val(),
			targetPeopleNo: $('#targetPeopleNo').val(),
			ownerUid: $('#ownerUid').val(),
			interestCommunityContent: $('#interestCommunityContent').val()
			}, 
			function(data, textStatus, jqXHR) {
				if(data.status=200){
					prepareCommunityList();
					clearForm(); 
				}else{
					alert('서버로부터 데이터를 가져오는데 실패 하였습니다.');
					debug(data.message);
				}
				
			},
			'json'
		);
	});
	
	
	$('#modifyBtn').bind('click', function(event) {
		$.post('modify.do', {
			interestCommunityNo: $('#interestCommunityNo').val(),
			interestCommunityName: $('#interestCommunityName').val(),
			interestArea: $('#interestArea').val(),
			interestDomain: $('#interestDomain').val(),
			targetPeopleNo: $('#targetPeopleNo').val(),
			ownerUid: $('#ownerUid').val(),
			interestCommunityContent: $('#interestCommunityContent').val()
			}, 
			function(data, textStatus, jqXHR) {
				if(data.status=200){
					prepareCommunityList();
					clearForm(); 
				}else{
					alert('서버로부터 데이터를 가져오는데 실패 하였습니다.');
					debug(data.message);
				}
				
			},
			'json'
		);
	});
	
//	$('#updateBtn').click(function() {
//		$.post('update.do', {
//				interestCommunityNo: $('#interestCommunityNo').val(),
//				interestCommunityName: $('#interestCommunityName').val(),
//				interestArea: $('#interestArea').val(),
//				interestDomain: $('#interestDomain').val(),
//				targetPeopleNo: $('#targetPeopleNo').val(),
//				ownerUid: $('#ownerUid').val(),
//				interestCommunityContent: $('#interestCommunityContent').val()
//			}, 
//			function(data, textStatus, jqXHR) {
//				if (data.status == 200) {
////					updateCenterRow($('#interestCommunityNo').val());
//					refreshCommunityList();
//					clearForm();
//				} else {
//					alert('서버로부터 업데이트 하는데 실패 하였습니다.');
//					debug(data.message);
//				}
//			},
//			'json'
//		);
//	});
	
	$('#targetInvestiDelBtn').live('click', function() {
		var checkedList = '';
		$('.checkdel:checked').each(function(index, obj){
			if (index > 0) {
				checkedList += ',';
			}
			checkedList += $(obj).val();
			deleteInvestiDataRow($('.checkdel:checked').val());
		});
			$.getJSON('deleteTargetInvesti.do', {
				investiItemNo: checkedList,
				interestCommunityNo: $('#investiItem .investiListDataTR').attr("data-pk")
			},
				function(data, textStatus, jqXHR) {
					if (data.status == 200) {
						console.log($('tr.investiDataTR').attr('data-investi-pk'));
					} else {
						alert('서버로부터 삭제 하는데 실패 하였습니다.');
						debug(data.message);
					}
				});

	});
	
	function deleteInvestiDataRow(value) {
		$('tr[data-investi-pk=' + value + ']').remove();
	}
	
	function deleteInvestiItemRow(value) {
		$('#investiItemList').val(value);
		$('#investiItemList').children("option:selected").remove();
		$('#selectInvestiItem').val(value);
		$('#selectInvestiItem').children("option:selected").remove();
	}
	
	
	$('#cancleBtn').click(function() {
		clearForm();
	});

	$('#targetInvestiAddBtn').live('click', function(event) {
		$.post('targetInvestiAdd.do', {
			investiItemNo: $('#selectInvestiItem').val(),
			interestCommunityNo: $('td.investiListDataTR').attr('data-pk')
			}, 
			function(data, textStatus, jqXHR) {
				if(data.status=200){
					refreshinvestiList($('td.investiListDataTR').attr('data-pk'));
//					clearForm(); 
				}else{
					alert('서버로부터 데이터를 가져오는데 실패 하였습니다.');
					debug(data.message);
				}
				
			},
			'json'
		);
	});
	
	
}


function refreshinvestiList(value){ 
	
	$.ajax({
		url : 'detail.do', 
		data : {interestCommunityNo: value },
		success : function(data, textStatus, jqXHR){
			//console.log(value);
		
			if (data.status==200){
				$('td.investiListDataTR').remove();
				$('tr.investiDataTR').remove();
				$('#investiItemList').children("option").remove();
				$('#targetInvestiItemSelectList').children('option').remove();
				displayDetail(data.resultListType1);
				InvestiItemRowInTable(value);
				$.each(data.resultList, selectInvestiItemRowInOption );  //selectInvestiItem comboBox 생성  
				$.each(data.result, TargetInvestiItemRowInTable ); // TargetInvestiItemList Header 생성 
				$.each(data.resultList, selectInvestiListRowInOption ); //investiItemList Create 
				$('#ansTypeNo').children("option").remove();
				$.each(data.resultListType2, ansTypeListRowInOption ); 
				
				
			}else{
				alert('서버로부터 데이터를 가져오는데 실패 하였습니다.');
				debug(data.message);
			}
		}
	});
}

function ansTypeListRowInOption(index, value){
	return $('#ansTypeNo').append(createAnsTypeListRow(index, value));
}

function selectInvestiListRowInOption(index, value){
	return $('#investiItemList').append(createInvestiListRow(index, value));
}

function selectInvestiItemRowInOption(index, value){
	return $('#selectInvestiItem').append(createInvestiListRow(index, value));
}
function targetInvestiListRowInOption(index, value){
	return $('#targetInvestiItemSelectList').append(createInvestiListRow(index, value));
}

function createAnsTypeListRow(index, value){
	 var $options = $('<option></option>')
		.val(value.ansTypeNo)
		.text(value.ansTypeName);
return $options;
}


function createInvestiListRow(index, value) {
	 var $options = $('<option></option>')
				.val(value.investiItemNo)
				.attr('investiItemType',value.investiItemType)
				.attr('investiItemName',value.investiItemName)
				.attr('ansTypeNo',value.ansTypeNo)
				.text(value.investiItemType+"  |  "+ value.investiItemName +" | "+value.ansTypeName);
	 return $options;
}


function InvestiItemRowInTable(value) {
	$('#investiItem').append(createInvestiItemRow(value) );
}

function createInvestiItemRow(value) {
	var dataTR =  $('<td></td>').addClass('investiListDataTR')
				.attr('data-pk',value)
				.attr('colspan', '3')
				.append('<select id="selectInvestiItem" class="selectInvestiItem"></select>')
				.append('<input type="button" id="targetInvestiAddBtn" value="추가"> ')
				.append('<input type="button" id="btnTargetItems" value="분류 입력">');
	return dataTR;
}

function TargetInvestiItemRowInTable(index, value) {
	var tr = $('tr[data-pk=' + value.interestCommunityNo + ']');
	
	$("#communiName").text(tr.find('.community_name').text());
	$("#communiContent").text(tr.find('.content').text());
	$('#investiItemListTable').append(createTargetInvestiItemRow(value) );
}

function createTargetInvestiItemRow(value) {

	var dataTR =  $('<tr></tr>').addClass('investiDataTR')
				.attr('data-investi-pk', value.investiItemNo)
				.append('<td >' + value.investiItemType + '</td>')
				.append('<td >' + value.investiItemName + '</td>')
				.append('<td >' + value.ansTypeName + '</td>')
				.append('<td class ="targetDel"><input type="checkbox" name="checkdel" class="checkdel" value='+value.investiItemNo+'></td>');
	return dataTR;
}

function displayDetail(value) {
	$('#interestCommunityNo').val(value.interestCommunityNo);
	$('#interestCommunityName').val(value.interestCommunityName);
	$('#interestArea').val(value.interestArea);
	$('#interestDomain').val(value.interestDomain);
	$('#targetPeopleNo').val(value.targetPeopleNo);
	$('#ownerUid').val(value.ownerUid);
	$('#interestCommunityContent').val(value.interestCommunityContent);
};

function clearForm() { 
	$('#map_options')[0].reset();
	$('#modifyBtn').addClass('hidden');
	$('#addBtn').removeClass('hidden');
//	$('#addBtn').removeClass('hide');
//	
//	$('#name').attr('class', '');
//	$('#addBtn').attr('disabled', '');
}


function clearInvestiItemForm() { 
	$('#investiItemName').val("");
	$('#investiItemType').val("");
	$('#ansTypeNo').val(0);
}

function makeTypeInput(event){
	var AddFieldClass = event.data.index;
	console.log(AddFieldClass);
//	var lastItemNo = $("#map_invetigation tr:last").attr("class").replace("item", "");
}




