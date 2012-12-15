if ((typeof cordova == 'undefined') && (typeof Cordova == 'undefined')) alert('Cordova variable does not exist. Check that you have included cordova.js correctly');
if (typeof CDV == 'undefined') alert('CDV variable does not exist. Check that you have included pg-plugin-fb-connect.js correctly');
if (typeof FB == 'undefined') alert('FB variable does not exist. Check that you have included the Facebook JS SDK file.');

document.addEventListener("deviceready",onDeviceReady, false);

function onDeviceReady(){
	checkNetwork(false);	
	facebookInit();	
	
	$('#loginBtn_main').bind('click',promptLogin);
}



