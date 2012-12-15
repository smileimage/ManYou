function moveToPage(pageurl){
	window.location.href=pageurl;
}

function checkNetwork(state){
	var conType;
	try{
		conType=navigator.network.connection.type;
	}catch(err){

	}	
	if(conType=="none" || conType == "unkwown"){
		alert("network. connection.type\n"+ conType);
		state=false;
	} 
	return state;	
}

function facebookInit(){
	try {
		//alert('Device is ready! Make sure you set your app_id below this alert.');
		FB.init({
			appId : "152646421541165",
			nativeInterface : CDV.FB,
			useCachedDialogs : false
		});
	} catch (e) {
		alert(e);
	}
}