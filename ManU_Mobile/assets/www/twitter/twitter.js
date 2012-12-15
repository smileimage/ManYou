var requestParams;
var options = { 
		consumerKey: 's8HkeNC1AJ87yRZbRbXpw',
		consumerSecret: '4NpkmvIpeGOJRHhkTk8Yuk38hVit29VBoH0rZBQE8',
		callbackUrl: 'http://www.naver.com' };
var mentionsId = 0;
var oauth = OAuth(options);
var localStoreKey = "manu";

function twitterLogin() {
	// Check for access token key/secret in localStorage
	var storedAccessData, rawData = localStorage.getItem(localStoreKey);
	if (rawData !== null) {
		storedAccessData = JSON.parse(rawData);                 
		options.accessTokenKey = storedAccessData.accessTokenKey;
		options.accessTokenSecret = storedAccessData.accessTokenSecret;

//		console.log("AppLaudLog: Attemping oauth with stored token key/secret");           
		oauth = OAuth(options);
		oauth.get('https://api.twitter.com/1/account/verify_credentials.json?skip_status=true',
				function(data) {
			var entry = JSON.parse(data.text);
			console.log("AppLaudLog: Success getting credentials. screen_name: " + entry.screen_name);

			$('#confirm-user').live('click', function() {
				$.mobile.changePage($('#registerFormPage'), { reverse : true, changeHash: false });
				return false;
			});
			$('#cancel-user').live('click', function() {
//				$('#cancel').trigger('click');
				cancelSession();
				$.mobile.changePage($('#registerFormPage'), { reverse : true, changeHash: false });
				return false;
			});

			$('#dialog-confirm-text').html('<p>Twitter user: <strong>'
					+ entry.screen_name + '</strong><br> already authorized.<br>Continue as <strong>' 
					+ entry.screen_name + '</strong>?</p><p>Cancel to log in a different user.</p><hr>');
			$.mobile.changePage($('#page-dialog-confirm'), { role: 'dialog', changeHash: false });
		},
		function(data) { 
			alert('Error with stored user data. Re-start authorization.');
			options.accessTokenKey = '';
			options.accessTokenSecret = '';
			localStorage.removeItem(localStoreKey);
			console.log("AppLaudLog: No Authorization from localStorage data"); 
		}
		);
	} else {
		console.log("AppLaudLog: No localStorage data");
		startOauth();
	}//if (rawData !== null)

//	$('#cancel').live('click',cancelSession);
}	

function startOauth() { 

	// Set childBrowser callback to detect our oauth_callback_url
	if (typeof window.plugins.childBrowser.onLocationChange !== "function") {
		window.plugins.childBrowser.onLocationChange = function(loc){
			console.log("AppLaudLog: onLocationChange : " + loc);

			// If user hit "No, thanks" when asked to authorize access
			if (loc.indexOf("http://www.naver.com/?denied") >= 0) {
				window.plugins.childBrowser.close();
				return;
			}//(loc.indexOf("http://www.naver.com/?denied") >= 0)

			// Same as above, but user went to app's homepage instead
			// of back to app. Don't close the browser in this case.
			if (loc === "http://www.twitter.com/plus_banans") {
				return;
			}

			// The supplied oauth_callback_url for this session is being loaded
			if (loc.indexOf("http://www.naver.com/?") >= 0) {
				var index, verifier = '';            
				var params = loc.substr(loc.indexOf('?') + 1);

				params = params.split('&');
				for (var i = 0; i < params.length; i++) {
					var y = params[i].split('=');
					if(y[0] === 'oauth_verifier') {
						verifier = y[1];
					}
				}

				// Exchange request token for access token
				oauth.get('https://api.twitter.com/oauth/access_token?oauth_verifier='+verifier+'&'+requestParams,
						function(data) {    
					var accessParams = {};
					var qvars_tmp = data.text.split('&');
					for (var i = 0; i < qvars_tmp.length; i++) {
						var y = qvars_tmp[i].split('=');
						accessParams[y[0]] = decodeURIComponent(y[1]);
					}
					console.log('AppLaudLog: ' + accessParams.oauth_token + ' : ' + accessParams.oauth_token_secret);
					oauth.setAccessToken([accessParams.oauth_token, accessParams.oauth_token_secret]);

					// Save access token/key in localStorage
					var accessData = {};
					accessData.accessTokenKey = accessParams.oauth_token;
					accessData.accessTokenSecret = accessParams.oauth_token_secret;
					console.log("AppLaudLog: Storing token key/secret in localStorage");
					localStorage.setItem(localStoreKey, JSON.stringify(accessData));

					oauth.get('https://api.twitter.com/1/account/verify_credentials.json?skip_status=true',
							function(data) {
						var entry = JSON.parse(data.text);
						console.log("AppLaudLog: screen_name: " + entry.screen_name);
					},
					function(data) { 
						alert('Error getting user credentials'); 
						console.log("AppLaudLog: Error " + data); 
					}
					);                                         
					window.plugins.childBrowser.close();
				},
				function(data) { 
					alert('Error : No Authorization'); 
					console.log("AppLaudLog: 1 Error " + data); 
				}
				);//oauth.get(https://api.twitter.com/oauth/access_token?oauth_verifier=)
			}//loc.indexOf("http://www.naver.com/?") >= 0) {
		};//window.plugins.childBrowser.onLocationChange = function(loc)  
	} // end if(typeof window.plugins.childBrowser.onLocationChange !== "function


//	oauth = OAuth(options);
	oauth.get('https://api.twitter.com/oauth/request_token',
			function(data) {
		requestParams = data.text;
		console.log("AppLaudLog: requestParams: " + data.text);
		window.plugins.childBrowser.showWebPage('https://api.twitter.com/oauth/authorize?'+data.text, 
				{ showLocationBar : false });     
//		alert('after');
	},
	function(data) { 
		alert('Error : No Authorization'); 
		console.log("AppLaudLog: 2 Error " + data); 
	}
	);
	mentionsId = 0;
}// startOauth()


function  cancelSession() {
	localStorage.removeItem(localStoreKey);
	options.accessTokenKey = '';
	options.accessTokenSecret = '';
	oauth.post('http://api.twitter.com/1/account/end_session.json',
			{}, function(data) {
				console.log("AppLaudLog: User ended session");
			}, function(data) {
				console.log("AppLaudLog: Error: End session");
			});
}


function sendTweet(receivedData) {
	var msg = receivedData.title+" "+receivedData.address+" "+receivedData.msg;
	oauth.post('https://api.twitter.com/1/statuses/update.json',
			{ 'status' : msg,  // jsOAuth encodes for us        		  
		'trim_user' : 'true'},
//		'lat': receivedData.lat,
//		'lng': receivedData.lng},
		function(data) {
			var entry = JSON.parse(data.text);   
			console.log("AppLaudLog: Tweet id: " + entry.id_str + " text: " + entry.text);
		},
		function(data) { 
			console.log("AppLaudLog: Error during tweet " + data.text);
		}
	);  
	sendTwitter = false;
} 



function sentImageTweet(receivedData){
	var msg = receivedData.title+" "+receivedData.address+" "+receivedData.msg;
//	txt,image,lat,lng
	oauth.post('https://upload.twitter.com/1/statuses/update_with_media.json',
			{'media[]': receivedData.url,
		'status' : msg,
		'lat': receivedData.lat,
		'lng': receivedData.lng},
		function(data) {
			var entry = JSON.parse(data.text);   
			console.log("AppLaudLog: Tweet id: " + entry.id_str + " text: " + entry.text);
			alert('tweet photo success!!');
//			$.mobile.changePage($('#page-home'), { reverse : true, changeHash: false });
		},
		function(data) { 
			alert('Error Tweeting.'); 
			console.log("AppLaudLog: Error during tweet " + data.text);
//			$.mobile.changePage($('#page-home'), { reverse : true, changeHash: false });
		}
	);
}

function removeSession(){
	sessionStorage.removeItem(1);
	sessionStorage.removeItem(2);
	sessionStorage.removeItem(3);
	sessionStorage.removeItem(4);
}


