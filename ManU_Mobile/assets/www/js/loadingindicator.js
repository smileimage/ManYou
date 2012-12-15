if(!window.plugins) {
  window.plugins = {};
}

window.plugins.loadingIndicator = {
		
		show: function(options, callback){
			PhoneGap.exec(
				callback, 
				null, 
				'LoadingIndicator', 
				'showLoading', 
				[options]
			);
		},

		hide: function(callback){
			
			PhoneGap.exec(
				callback, 
				null, 
				'LoadingIndicator', 
				'hideLoading', 
				[]
			);
			
		}
		
	};