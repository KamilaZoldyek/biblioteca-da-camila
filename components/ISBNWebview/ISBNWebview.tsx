import * as React from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";

import { WebView } from "react-native-webview";

type ISBNWebviewProps = {
  isbn: string;
  customStyle?: StyleProp<ViewStyle>;
};

export default function ISBNWebview({ isbn, customStyle }: ISBNWebviewProps) {
  return (
      <WebView
        style={styles.webViewContainer}
        source={{ uri: "https://isbnsearch.org/isbn/" + isbn }}
      />
  );
}

const styles = StyleSheet.create({
  webViewContainer: {
    flex: 1,
    marginTop: 35,
  },
});
// TODO: injection to long press images and download them

// https://www.google.com/search?q=react-native-webview+long+press+image&client=ubuntu-sn&hs=AG0&sca_esv=67db8545f6bda9c4&channel=fs&sxsrf=AE3TifPDYf7hrOqUxCWdJInIIa4rCiUw7A%3A1757095297578&ei=gSW7aNOKI-HT1sQPgezl-AI&oq=react-native-webview+long+press&gs_lp=Egxnd3Mtd2l6LXNlcnAiH3JlYWN0LW5hdGl2ZS13ZWJ2aWV3IGxvbmcgcHJlc3MqAggAMgUQIRigAUjFN1DlEli7JXACeACQAQCYAZQDoAHEEqoBCTAuNi4zLjEuMbgBAcgBAPgBAZgCDKAC_g_CAggQABjvBRiwA8ICCxAAGIAEGKIEGLADwgIGEAAYFhgewgIIEAAYFhgeGArCAgUQABjvBcICCBAAGIAEGKIEmAMAiAYBkAYFkgcHMi42LjMuMaAH7DmyBwcwLjYuMy4xuAf0D8IHBzAuMi45LjHIBzc&sclient=gws-wiz-serp