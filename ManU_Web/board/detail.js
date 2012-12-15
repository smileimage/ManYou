function addMappingInfoDetail(index, value){
	var openDialog = $('<div></div>').attr('id', 'openDialog')
					.append(detailLeftDiv(value))
					.append(createRightDiv(value));
	return openDialog;
	
}

function detailLeftDiv(value){
	return $('<div></div>').addClass('detailLeftDiv')
			.append(createLeftTopDiv(value))
			.append(createLeftBottomDiv(value));
}

function createLeftTopDiv(value){
	return $('<div></div>').attr('id','detailLeftTopDiv')
						.append(detailUserInfo());
}

function detailUserInfo(value){
	return $('<ul></ul>')
				.append($(createLI('detailPhoto',createImage('fbPhoto','../img/photos/1.jpg'))))
				.append($(createLI('userInfoText','작성자 : '+'value.FbName')))
				.append($(createLI('userInfoText','작성일 : '+'value.MiDate')))
				.append(
						$(createLI('userInfoText',''))
						.append(createInput('goodBtn','좋아요','button'))
						.append(createInput('shareBtn','공유','button'))
						.append(createInput('updataBtn','수정','button'))
						.append(createInput('deleteBtn','삭제','button'))
						);
}

function createLeftBottomDiv(value){
	return $('<div></div>').attr('id','detailLeftBottomDiv')
			.append(detailReplyList())
			.append(detailReplyList())
			.append(detailReplyList());
						
}

function detailReplyList(value){
	return $('<div></div>')
				.attr('id','re_no'+'value.re_no')
				.append($(createLI('register','value.FbName')))
				.append($(createLI('register','value.MiDate')))
				.append(
						$(createLI('detailBtn'))
						.append(createInput('replyBtn','댓글','button'))
						.append(createInput('deleteBtn','삭제','button'))
						)
				.append($(createLI('','value.context')));
}

function createRightDiv(value){
	return $('<div></div>').addClass('detailRightDiv')
						.append(detailContent())
						.append(detailImage());
}

function detailContent(value){
	return $('<ul></ul>')
				.attr('id','investiItem')
				.append($(createLI()).append(createInput('detailTilt','value.mi_title','textarea')))
				.append($(createLI()).append(createInput('detailContext','value.mi_context','textarea')))
				.append(createLI('','value.investi_item_name'));
}
function detailAnsItem(value){
	return createLI('','value.ans_item_name')
				.appendTo('#investiItem');
}
function detailImage(value){
	return createImage('detailImage','../img/photos/2.jpg');
}


function createLI(cName,value){
	return $('<li></li>')
				.addClass(cName)
				.append(value);
}
function createInput(inputId,value,type){
	return $('<input></input>')
				.attr('type',type)
				.attr('id',inputId)
				.attr('name',inputId)
				.attr('value',value);
}
function createImage(cName,path){
	return $('<img></img>')
				.addClass(cName)
				.attr('src',path);
}



















// 기존 코드
/*
function createLTDetailFirstTR(value){
	return $('<tr></tr>')
					.append(createFbPhotoTD(value))
					.append(createFbNameTD(value));
}
function createLTDetailSecondTR(value){
	return $('<tr></tr>').append(createMiDateTD(value));
}
function createLTDetailThirdTR(value){
	return $('<tr></tr>').append(createBtnGrp(value));
}
function createFbPhotoTD(value){
	return $('<td width="60px" height="60px" rowspan="3"></td>')
					.append($('<p align="center"></p>')
					.append($('<img width="60px" height="60px"></img>').addClass('detailPhoto')
											.attr('src','../images/aaa.jpg')));
}
function createFbNameTD(value){
	return $('<td height="20px"></td>').text('작성자 : 홍길동');
}
function createMiDateTD(value){
	return $('<td height="20px"></td>').text('작성일 : 2012 / 07 / 31');
}
function createBtnGrp(value){
	return $('<tr></tr>')
			.append(makeBtn("","좋아요"))
			.append(makeBtn("","공유"))
			.append(makeBtn("","수정"))
			.append(makeBtn("","삭제"));
}
function makeBtn(className,value){
	return $('<input></input>')
			.attr('id',className)
			.attr('type','button')
			.attr('value',value);
}


function createLeftBottomDiv(value){
	return $('<div></div>').addClass('detailLeftBottom')
					.attr('id','replyList')
					.append(createReplyDiv(value));
}

function createReplyDiv(value){
	return $('<div></div>')
			.attr('id','value.RE_NO')
			.addClass('lvl'+'value.RE_LVL')
			.append(
					$('<table border=0></table>')
						.append(createReplyTitle(value))
						.append(createReplyContent(value))
					);
}
function createReplyTitle(value){
	return $('<tr></tr>')
			.append($('<td width=200>' +   'value.MEMBERS_FB_NAME' +'</td>'))
			.append($('<td>' + 'value.RE_DATE' +'</td>'))
			.append($('<td width=50px>' + "<input id="+ 'value.FB_UID' +" type=button value=삭제>" +'</td>'));
}

function createReplyContent(value){
	var size = "380px";
//	value.RE_LVL == 1 ? size="380px" : size = "360px" ;
	return $('<tr></tr>')
			.append($('<td ' + "width=" + size + " colspan=3" + '>' + 'value.RE_CONTEXT' +'</td>'));
}








function detailRightDiv(value){
	return $('<div></div>').addClass('detailRightDiv')
			.append(createRightTopDiv(value))
			.append(createRightBottomDiv(value));
}


function createRightTopDiv(value){
	return $('<div></div>')
			.append(createRightTopTable())
			.append(createRightButtomTable());
}
function createRightTopTable(value){
	return $('<table></table>')
						.append(createRTDetailFirstTR(value));
}

function createLTDetailThirdTR(value){
	return $('<tr vertical-align = "top"></tr>')
			.append(createMiTitleTD(value));
}
function createMiTitleTD(value){
	return $('<td height="20px"></td>').html('<b>엘레베이터가 고장..!!!<b>');
}
function createMiContextTD(value){
	return $('<td width="335px" height=></td>').text('엘리베이터가 작동하지 않아요!!');
}


function createInvestiItemNameTD(value){
	return $('<td width="135px"></td>')
						.append($('<p align="center"></p>)')
						.text('도시철도'));
}






function createRTDetailFirstTR(value){
	return $('<tr></tr>')
						.append(createInvestiTypeTD(value))
						.append(createAnsItemNoTD(value));
}

function createInvestiTypeTD(value){
	return $('<td width="300px"></td>').text('엘리베이터 이용');
}

function createAnsItemNoTD(value){
	return $('<td width="250px"></td>').text('불가능');
}





//-------------------------------rightBottomDiv start---------------------
function createRightBottomDiv(value){
	return $('<div></div>').addClass('detailRightBottom')
						.attr('id','slideshow')
						.append(createPhotosUL(value))
						.append($('<span></span>').addClass('arrow previous'))
						.append($('<span></span>').addClass('arrow next'));
}


function createPhotosUL(value){
	return $('<ul></ul>')
				.append($('<li><img src="../img/photos/1.jpg" width="450px" height="320" alt="Marsa Alam underawter close up"/></li>'))
				.append($('<li><img src="../img/photos/2.jpg" width="450px" height="320" alt="Ancient" /></li>'))
				.append($('<li><img src="../img/photos/3.jpg" width="450px" height="320" alt="Industry" /></li>'));
}
//-------------------------------rightBottomDiv end---------------------
*/