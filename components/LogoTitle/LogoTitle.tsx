import { Dimensions, Strings } from "@/constants/";
import { Image } from "expo-image";
import * as React from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { Text } from "react-native-paper";

type LogoTitleProps = {
  customStyle?: StyleProp<ViewStyle>;
};

export default function LogoTitle({ customStyle }: LogoTitleProps) {
  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/camila-svg.svg")}
        style={styles.image}
      />
      <Text style={styles.font} variant="displaySmall">
        {Strings.aboutScreen.appName}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  font: {
    fontFamily: "Montserrat_500Medium",
    fontSize: 32,
  },
  image: {
    width: 200,
    height: 200,
  },
});
