import { Container, LogoTitle } from "@/components";
import { Dimensions, Strings } from "@/constants/";
import * as React from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";

export default function AboutScreen() {
  return (
    <Container title={Strings.aboutScreen.title} showGoBack>
      <View>
        <LogoTitle customStyle={styles.logo} />
        <Text variant="bodySmall">{Strings.aboutScreen.appVersion}</Text>
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  logo: {
    flex: 1,
  },

  darkModeSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  timeSection: {
    paddingTop: Dimensions.padding.container,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  time: {
    alignSelf: "flex-end",
  },
});
