import * as React from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";

import { Image } from "expo-image";
import { ProgressBar } from "react-native-paper";

type LoadingOverlayProps = {
  customStyle?: StyleProp<ViewStyle>;
};

export default function LoadingOverlay({ customStyle }: LoadingOverlayProps) {
  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/camila-svg.svg")}
        style={styles.image}
      />
      <ProgressBar
        indeterminate
        color="white"
        style={{ height: 4, width: 150 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    marginVertical: 30,
    width: 100,
    height: 100,
  },
});
