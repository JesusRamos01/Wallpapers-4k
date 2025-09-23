package com.wallpapers4k.app;

import android.os.Bundle;

import com.getcapacitor.BridgeActivity;

import io.ionic.starter.SetLockScreenWallpaper;
import io.ionic.starter.SetHomeScreenWallpaper;

public class MainActivity extends BridgeActivity {
  @Override
  protected void onCreate(Bundle savedInstanceState) {
    registerPlugin(SetLockScreenWallpaper.class);
    registerPlugin(SetHomeScreenWallpaper.class);
    super.onCreate(savedInstanceState);
  }
}

