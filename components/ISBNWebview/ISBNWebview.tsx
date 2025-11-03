import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import * as React from "react";
import { StyleProp, StyleSheet, ToastAndroid, ViewStyle } from "react-native";

import { WebView } from "react-native-webview";

type ISBNWebviewProps = {
  isbn: string;
  customStyle?: StyleProp<ViewStyle>;
};

export default function ISBNWebview({ isbn, customStyle }: ISBNWebviewProps) {
  
  const onDownload = async (downloadUrl: string) => {
    if (downloadUrl) {
      const filename = downloadUrl.substring(downloadUrl.lastIndexOf("/") + 1);
      const fileUri = `${FileSystem.documentDirectory}${filename}`;

      try {
        const { uri } = await FileSystem.downloadAsync(downloadUrl, fileUri);
        saveFile(uri);
      } catch (error) {
        console.error("Download error:", error);
      }
    }
  };

  const saveFile = async (fileUri: string) => {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status === "granted") {
      const asset = await MediaLibrary.createAssetAsync(fileUri);
      await MediaLibrary.createAlbumAsync("Download", asset, false);
      ToastAndroid.show("Imagem baixada!", ToastAndroid.LONG);
    }
  };

  const injectedJavaScript = `
  document.querySelectorAll('img').forEach(img => {
    img.addEventListener('contextmenu', function(e) {
      e.preventDefault();
      window.ReactNativeWebView.postMessage(JSON.stringify({ image: img.src }));
    });
  });
  true;
`;
  return (
    <WebView
      style={styles.webViewContainer}
      source={{ uri: "https://isbnsearch.org/isbn/" + isbn }}
      injectedJavaScript={injectedJavaScript}
      onMessage={(event) => {
        const data = JSON.parse(event.nativeEvent.data);
        if (data.image) {
          console.log("Imagem selecionada:", data.image);
          onDownload(data.image);
        }
      }}
    />
  );
}

const styles = StyleSheet.create({
  webViewContainer: {
    flex: 1,
    marginTop: 35,
  },
});
