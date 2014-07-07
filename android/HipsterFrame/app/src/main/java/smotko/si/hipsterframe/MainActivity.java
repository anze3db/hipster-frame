package smotko.si.hipsterframe;

import android.app.Activity;
import android.os.Bundle;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.view.MotionEvent;
import android.view.View;
import android.view.WindowManager;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;


public class MainActivity extends Activity {

    private WebView mWebView;
    private boolean reload;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
        initWebView();
        setImmersiveMode();
    }

    @Override
    protected void onResume() {
        super.onResume();
        setImmersiveMode();
    }

    @Override
    public boolean dispatchTouchEvent(MotionEvent e){
        super.dispatchTouchEvent(e);
        switch(e.getAction() & MotionEvent.ACTION_MASK){
            case MotionEvent.ACTION_POINTER_UP:
                if(e.getPointerCount() == 2){
                    mWebView.reload();
                }
                break;
            case MotionEvent.ACTION_UP:
                setImmersiveMode();
                break;
        }
        return false;
    }

    private void setImmersiveMode() {
        getWindow().getDecorView().setSystemUiVisibility(
                View.SYSTEM_UI_FLAG_LAYOUT_STABLE
                        | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
                        | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
                        | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
                        | View.SYSTEM_UI_FLAG_FULLSCREEN
                        | View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY);
    }

    private void initWebView() {
        mWebView = (WebView) findViewById(R.id.activity_main_webview);
        mWebView.setWebViewClient(new WebViewClient());
        WebSettings webSettings = mWebView.getSettings();
        webSettings.setJavaScriptEnabled(true);
        mWebView.loadUrl("http://hipster-frame.herokuapp.com/");
    }
}
