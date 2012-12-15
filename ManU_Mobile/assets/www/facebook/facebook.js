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
//        clearAction();
      });
    }
  }
  else if (session === undefined) {
    document.body.className = 'not_connected';  
//    clearAction();
  }
  else if (session && (session.status == 'not_authorized' || session.status == 'notConnected')) {
    document.body.className = 'not_connected';    
//    clearAction();
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
	 removeFacebookUserInfo();
    window.location.href="../index.html";
  });
}

//////////////////////////
//
// News Feed
// See the "News Feed" section on https://developers.facebook.com/mobile
//
//////////////////////////

//Publish a story to the user's own wall
function publishStory() {
  FB.ui({
    method: 'feed',
    name: 'Community Mapping for new',
    caption: 'ManU for Mobile Web.',
    description: 'Your 1 second makes new world!!',
    link: 'http://apps.facebook.com/mobile-start/',
    picture: 'http://www.facebookmobileweb.com/hackbook/img/facebook_icon_large.png',
    actions: [{ name: 'Get Started', link: 'http://apps.facebook.com/mobile-start/' }],
  }, 
  function(response) {
    console.log('publishStory UI response: ', response);
  });
}


//////////////////////////
//
// UI assist functions
//
//////////////////////////

//show a loading screen when launched, until we get the user's session back
//setAction("Loading Hackbook", true);

//Swaps the pages out when the user taps on a choice
//function openPage(pageName, ignoreHistoryPush) {
//  window.scrollTo(0,1);
//
//  var els = document.getElementsByClassName('page');
//  
//  for (var i = 0 ; i < els.length ; ++i) {
//    els[i].style.display = 'none';
//  }
//  
//  var page = document.getElementById('page-' + pageName);
//  
//  page.style.display = "block";
//  
//  title = (pageName == 'root') ? 'Hackbook' : pageName.replace(/-/g, ' ');
//  document.getElementById('title').innerHTML = title;
//  
//  if (ignoreHistoryPush != true) {
//    window.history.pushState({page: pageName}, '', document.location.origin + document.location.pathname + "#" + pageName);
//  }
//
//  document.getElementById('back').style.display = (pageName == 'root') ? 'none' : 'block';
//}

window.onpopstate = function(e) {
  if (e.state != null) {
    console.log(e.state);
//    openPage(e.state.page);
  }
  else {
//    openPage('root', true);
  }
}

//openPage('root', true);

//Shows a modal dialog when fetcing data from Facebook
//function setAction(msg, hideBackground) {
//  document.getElementById('action').style.display = 'block';
//  
//  if (hideBackground) {
//    document.getElementById('action').style.opacity = '100';
//  }
//  else {
//    document.getElementById('action').style.opacity = '.9';
//  }
//  
//  FB.$('msg').innerHTML = FB.String.escapeHTML(msg);
//  
//  window.scrollTo(0, 1);
//}

//Clears the modal dialog
//function clearAction() {
////  FB.$('msg').innerHTML = '';  
//  document.getElementById('action').style.display = 'none';
//}

//Automatically scroll away the address bar
addEventListener("load", function() { setTimeout(hideURLbar, 0); }, false);

function hideURLbar() {
  window.scrollTo(0,1);
}

function hideButton(button) {
  button.style.display = 'none';
}