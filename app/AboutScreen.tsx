import { Container, CustomCard, LogoTitle } from "@/components";
import { Dimensions, Strings } from "@/constants/";
import { storedThemeDataOrColorScheme } from "@/Storage/ThemeData";
import * as React from "react";
import { useEffect, useState } from "react";
import { Linking, StyleSheet, useColorScheme, View } from "react-native";
import { Text } from "react-native-paper";

export default function AboutScreen() {
  const colorScheme = useColorScheme();

  const [theme, setTheme] = useState<"light" | "dark" | null>(null);

  useEffect(() => {
    storedThemeDataOrColorScheme(colorScheme).then((mode) => {
      setTheme(mode);
    });
  }, [colorScheme, setTheme]);

  const onPressGitHub = async () => {
    await Linking.openURL(
      "https://github.com/KamilaZoldyek/biblioteca-da-camila"
    );
  };

  const onPressInstagram = async () => {
    await Linking.openURL("instagram://user?username=kamila_zoldyek");
  };

  const onPressComplaints = async () => {
    await Linking.openURL("instagram://user?username=kamila_zoldyek"); //TODO: mudar para a URL do form
  };

  return (
    <Container title={Strings.aboutScreen.title} showGoBack>
      <View style={styles.container}>
        <LogoTitle />
        <Text variant="bodySmall">{Strings.aboutScreen.appVersion}</Text>
        <View style={styles.card}>
          <CustomCard
            onPress={onPressGitHub}
            title={Strings.aboutScreen.githubTitle}
            subtitle={Strings.aboutScreen.githubDesc}
            iconName={"source-repository"}
            theme={theme}
          />
          <CustomCard
            onPress={onPressInstagram}
            title={Strings.aboutScreen.instagramTitle}
            subtitle={Strings.aboutScreen.instagramDesc}
            iconName={"camera"}
            theme={theme}
          />
          <CustomCard
            onPress={onPressComplaints}
            title={Strings.aboutScreen.complaintsTitle}
            subtitle={Strings.aboutScreen.complaintsDesc}
            iconName={"volume-high"}
            theme={theme}
          />
        </View>
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  card: {
    paddingTop: Dimensions.padding.divider,
    justifyContent: "space-between",
    width: "100%",
  },

  container: {
    marginTop: Dimensions.margin.tallMargin,
    flexDirection: "column",
    alignItems: "center",
  },
});
