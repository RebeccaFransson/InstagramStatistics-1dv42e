package com.tracknshare;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;

import java.util.Arrays;
import java.util.List;

/*npm fb*/
import android.content.Intent;
import android.os.Bundle;

import com.facebook.CallbackManager;
import com.facebook.FacebookSdk;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import com.facebook.appevents.AppEventsLogger;     // <--- import

public class MainActivity extends ReactActivity {
    CallbackManager mCallbackManager;

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "TrackNShare";
    }

    /**
     * Returns whether dev mode should be enabled.
     * This enables e.g. the dev menu.
     */
    @Override
    protected boolean getUseDeveloperSupport() {
        return BuildConfig.DEBUG;
    }

    /**
     * A list of packages used by the app. If the app uses additional views
     * or modules besides the default ones, add more packages here.
     */
    @Override
    protected List<ReactPackage> getPackages() {
        /*fb npm*/
        mCallbackManager = new CallbackManager.Factory().create();
        ReactPackage packages[] = new ReactPackage[]{
            new MainReactPackage(),
            new FBSDKPackage(mCallbackManager),
        };

        return Arrays.<ReactPackage>asList(
            new MainReactPackage()
        );
    }

    /*fb npm resten utav filen*/
    @Override
    protected void onCreate(Bundle savedInstanceState) {
      super.onCreate(savedInstanceState);
        FacebookSdk.sdkInitialize(getApplicationContext());
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
      super.onActivityResult(requestCode, resultCode, data);
        mCallbackManager.onActivityResult(requestCode, resultCode, data);
    }



    @Override
    protected void onResume() {
        super.onResume();
        AppEventsLogger.activateApp(getApplicationContext());
    }

    @Override
    protected void onPause() {
        super.onPause();
        AppEventsLogger.deactivateApp(getApplicationContext());
    }

    @Override
    protected void onStop() {
        super.onStop();
        AppEventsLogger.onContextStop();
    }
}
