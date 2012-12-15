//////////////////////////
//
// Authentication
// See "Logging the user in" on https://developers.facebook.com/mobile
//
//////////////////////////

var user = [];

//Detect when Facebook tells us that the user's session has been returned
FB.Event.monitor('auth.statusChange', function(session) {
  console.log('Got the user\'s session: ', session);
  
  if (session && session.status != 'not_authorized' && session.status != 'notConnected') {
    if (session.authResponse['accessToken']) {
      document.body.className = 'connected';
      
      //Fetch user's id, name, and picture
      FB.api('/me', {
        fields: 'id, name, picture'
      },
      function(response) {
        if (!response.error) {
        	user = response;
        	checkFbUid(user.id);   
        	getFacebookUserInfo(user,document.body.className );
       }
        clearAction();
      });
    }
  }
  else if (session === undefined) {
    document.body.className = 'not_connected';
  
    clearAction();
  }
  else if (session && (session.status == 'not_authorized' || session.status == 'notConnected')) {
    document.body.className = 'not_connected';
    
    clearAction();
  }
});

//Prompt the user to login and ask for the 'email' permission
function promptLogin() {
  FB.login(null, {scope: 'email'});
}


//See https://developers.facebook.com/docs/reference/rest/auth.revokeAuthorization/
function uninstallApp() {
  FB.api({method: 'auth.revokeAuthorization'},
    function(response) {
      window.location.reload();
    });
}

//See https://developers.facebook.com/docs/reference/javascript/FB.logout/
function logout() {
  FB.logout(function(response) {
    window.location.reload();
  });
}