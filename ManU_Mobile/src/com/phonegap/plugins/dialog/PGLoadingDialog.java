package com.phonegap.plugins.dialog; /*or just use your own namespace*/

import org.json.JSONArray;

import android.app.ProgressDialog;
import android.util.Log;

import org.apache.cordova.DroidGap;
import com.phonegap.api.Plugin;
import com.phonegap.api.PluginResult;
import org.apache.cordova.api.PluginResult.Status;

public class PGLoadingDialog extends Plugin {

	final static String TAG = PGLoadingDialog.class.getSimpleName();

	static PGLoadingDialog instance = null;
	static ProgressDialog dialog = null;
	
	
	public static final String LOADING = "showLoading";
	public static final String FINISHEDLOADING = "hideLoading";

	public PGLoadingDialog() {
		instance = this;
	}

	public static PGLoadingDialog getInstance() {
		return instance;
	}
	
	private Thread t;
	
	@Override
	public PluginResult execute(String action, JSONArray data, String callbackId) {
		
		PluginResult result = new PluginResult(Status.INVALID_ACTION);
		final DroidGap droidGap = (DroidGap)this.cordova.getActivity();

		if(LOADING.contains(action)){
			Log.i(TAG, "------ Spin ON");

			t = new Thread(new Runnable() { 
			    public void run() { 
			    	cordova.getActivity().runOnUiThread(new Runnable() { 
			            public void run() { 
			            	droidGap.spinnerStart("", "wait..."); 
			            } 
			        }); 
			    } 
			}); 
			t.start(); 
			result = new PluginResult(Status.OK);
		}
		else if(FINISHEDLOADING.contains(action)){
	
			Log.i(TAG, "------ Spin OFF");
			droidGap.spinnerStop();
			t.stop();
			result = new PluginResult(Status.OK);
		}
		return  new PluginResult(Status.OK);
	}

}
