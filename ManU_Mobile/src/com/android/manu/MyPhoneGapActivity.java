package com.android.manu;

import org.apache.cordova.DroidGap;
import org.apache.cordova.api.LOG;

import android.content.Context;
import android.os.Bundle;
import android.os.StrictMode;

public class MyPhoneGapActivity extends DroidGap {
	@Override
	public void onCreate(Bundle savedInstanceState) {		
		
		//4.0.3버전에 입력시켜줘야함
    	boolean DEVELOPER_MODE = true;
    	if (DEVELOPER_MODE) {
            StrictMode.setThreadPolicy(new StrictMode.ThreadPolicy.Builder()
                    .detectDiskReads()
                    .detectDiskWrites()
                    .detectNetwork()
                    .penaltyLog()
                    .build());
        }
		super.onCreate(savedInstanceState);
		super.setIntegerProperty("loadUrlTimeoutValue", 30000);
		super.loadUrl("file:///android_asset/www/loading/loading.html");
	}
		
	
	@Override
	public Context getContext() {
	    LOG.d(TAG, "This will be deprecated December 2012");
	    return this;
	}

}
