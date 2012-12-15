$(document).ready(function(){
	$.mobile.showPageLoadingMsg();
	setTimeout("hide()",3000);
});

function hide(){
	$.mobile.hidePageLoadingMsg();
	$.mobile.changePage($(document.location.href="../index.html"), 'slideup');
}