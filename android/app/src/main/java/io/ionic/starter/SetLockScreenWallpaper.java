package io.ionic.starter;

import android.app.WallpaperManager;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.util.Log;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;

@CapacitorPlugin(name = "SetLockScreenWallpaper")
public class SetLockScreenWallpaper extends Plugin {

  @PluginMethod()
  public void setLockScreenWallpaper(PluginCall call) {
    String imageUrl = call.getString("url");

    if (imageUrl == null || imageUrl.isEmpty()) {
      return;
    }

    HttpURLConnection connection = null;
    InputStream inputStream = null;

    try {
      URL url = new URL(imageUrl);
      connection = (HttpURLConnection) url.openConnection();
      connection.setDoInput(true);
      connection.connect();

      int responseCode = connection.getResponseCode();
      if (responseCode != HttpURLConnection.HTTP_OK) {
        return;
      }

      inputStream = connection.getInputStream();
      Bitmap bitmap = BitmapFactory.decodeStream(inputStream);

      if (bitmap == null) {
        return;
      }

      WallpaperManager wallpaperManager = WallpaperManager.getInstance(getContext());
      wallpaperManager.setBitmap(bitmap, null, true, WallpaperManager.FLAG_LOCK);

      JSObject ret = new JSObject();
      ret.put("success", true);
      ret.put("message", "Wallpaper aplicado en la pantalla de bloqueo");
      call.resolve(ret);

    } catch (IOException e) {

      call.reject("Error aplicando wallpaper: " + e.getMessage());
    } finally {
      try {
        if (inputStream != null)
          inputStream.close();
        if (connection != null)
          connection.disconnect();
      } catch (IOException e) {

      }
    }
  }
}
