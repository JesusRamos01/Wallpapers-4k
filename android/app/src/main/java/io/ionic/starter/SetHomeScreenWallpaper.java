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

@CapacitorPlugin(name = "SetHomeScreenWallpaper")
public class SetHomeScreenWallpaper extends Plugin {

  private static final String TAG = "SetHomeWallpaperPlugin";

  @PluginMethod()
  public void setHomeScreenWallpaper(PluginCall call) {
    String imageUrl = call.getString("url");

    if (imageUrl == null || imageUrl.isEmpty()) {
      Log.e(TAG, "No se proporcionó URL de la imagen");
      call.reject("No se proporcionó URL de la imagen");
      return;
    }

    Log.d(TAG, "URL recibida: " + imageUrl);

    HttpURLConnection connection = null;
    InputStream inputStream = null;

    try {
      URL url = new URL(imageUrl);
      connection = (HttpURLConnection) url.openConnection();
      connection.setDoInput(true);
      connection.connect();

      int responseCode = connection.getResponseCode();
      Log.d(TAG, "Código de respuesta HTTP: " + responseCode);
      if (responseCode != HttpURLConnection.HTTP_OK) {
        call.reject("Error al descargar la imagen: HTTP " + responseCode);
        return;
      }

      inputStream = connection.getInputStream();
      Bitmap bitmap = BitmapFactory.decodeStream(inputStream);

      if (bitmap == null) {
        Log.e(TAG, "Bitmap es null después de decodificar");
        call.reject("No se pudo decodificar la imagen");
        return;
      }

      Log.d(TAG, "Imagen descargada correctamente. Tamaño: " + bitmap.getWidth() + "x" + bitmap.getHeight());

      WallpaperManager wallpaperManager = WallpaperManager.getInstance(getContext());
      wallpaperManager.setBitmap(bitmap, null, true, WallpaperManager.FLAG_SYSTEM);

      Log.d(TAG, "Wallpaper aplicado en pantalla de inicio");
      JSObject ret = new JSObject();
      ret.put("success", true);
      ret.put("message", "Wallpaper aplicado en la pantalla de inicio");
      call.resolve(ret);

    } catch (IOException e) {
      Log.e(TAG, "IOException al aplicar wallpaper: " + e.getMessage());
      call.reject("Error aplicando wallpaper: " + e.getMessage());
    } finally {
      try {
        if (inputStream != null)
          inputStream.close();
        if (connection != null)
          connection.disconnect();
      } catch (IOException e) {
        Log.e(TAG, "Error cerrando conexión: " + e.getMessage());
      }
    }
  }
}
