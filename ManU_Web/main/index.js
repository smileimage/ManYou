//JavaScript Document
var fileCount= new Array(5);

$(document).ready(function(e) {
	$("input:button").button();
	sessionStorage.setItem('categoryPk', 0);
	localStorage.setItem("communityNumber",0);
	prepareMappingInfoList();
	
	var href = location.href;
	href = href.substring(href.lastIndexOf("/"));
	if(href != "/intro.html"){
		allMarkerView(localStorage.getItem("communityNumber"));
	}
	createIntroDialog();
	openIntro();
	if(localStorage.getItem('intorRepresent') != "1"){
		setTimeout(function (){
			$('#introduceDialog').dialog('open');
		},300);
	}
}); // ready()

function createIntroDialog(){
	$('footer').append( $('<div></div>')
						.attr('id', 'introduceDialog')
						.append( createIntroImg() )
						.append(createInput('intorRepresent',1,'checkbox'))
						.append($('<span>').text('그만보기'))
					);
}
function createIntroImg(){
	return $('<img></img>').attr('src', '../images/intro.png');
}
function openIntro(){
	$('#introduceDialog').dialog({
		autoOpen:false,
		maxWidth:950,
		minWidth:950,
		show: "blind",
		hide: "explode",
		resizable:false,
		modal:true,
		beforeClose:function(event, ui){
			if($('#intorRepresent:checked').length > 0){
				localStorage.setItem('intorRepresent',"1");
			}
			return true;
		}
	});
}

