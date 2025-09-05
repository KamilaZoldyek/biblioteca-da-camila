import { Strings } from "@/constants";
import { Colors } from "@/constants/Colors";
import { storedThemeDataOrColorScheme } from "@/Storage/ThemeData";
import { Montserrat_500Medium } from "@expo-google-fonts/montserrat";
import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import merge from "deepmerge";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useState } from "react";
import { StyleSheet, useColorScheme, View } from "react-native";
import {
  adaptNavigationTheme,
  MD3DarkTheme,
  PaperProvider,
} from "react-native-paper";
import { pt, registerTranslation } from "react-native-paper-dates";

SplashScreen.preventAutoHideAsync();

const { LightTheme, DarkTheme } = adaptNavigationTheme({
  reactNavigationLight: NavigationDefaultTheme,
  reactNavigationDark: NavigationDarkTheme,
});

const customDarkTheme = { ...MD3DarkTheme, colors: Colors.dark };
const customLightTheme = { ...MD3DarkTheme, colors: Colors.light };

const CombinedDefaultTheme = merge(LightTheme, customLightTheme);
const CombinedDarkTheme = merge(DarkTheme, customDarkTheme);

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [theme, setTheme] = useState<"light" | "dark" | null>(null);
  const [loaded, error] = useFonts({
    Montserrat_500Medium,
  });

  registerTranslation("pt", pt);

  useEffect(() => {
    storedThemeDataOrColorScheme(colorScheme).then((mode) => {
      setTheme(mode);
    });
  }, [colorScheme, setTheme]);

  const paperTheme =
    theme === "light" ? CombinedDefaultTheme : CombinedDarkTheme;

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  return (
    <PaperProvider theme={paperTheme}>
      <ThemeProvider value={paperTheme}>
        <View
          style={[
            styles.background,
            {
              backgroundColor:
                paperTheme === CombinedDefaultTheme
                  ? Colors.light.background
                  : Colors.dark.background,
            },
          ]}
        >
          <Stack
            initialRouteName={Strings.homeScreen.screenName}
            screenOptions={{ headerShown: false }}
          >
            <Stack.Screen
              name={Strings.homeScreen.screenName}
              options={{ title: Strings.homeScreen.title }}
            />
            <Stack.Screen
              name={Strings.configsScreen.screenName}
              options={{ title: Strings.configsScreen.title }}
            />
            <Stack.Screen
              name={Strings.loginScreen.screenName}
              options={{ title: Strings.loginScreen.title, headerShown: false }}
            />
            <Stack.Screen
              name={Strings.aboutScreen.screenName}
              options={{ title: Strings.aboutScreen.title }}
            />
            <Stack.Screen
              name={Strings.cameraScreen.screenName}
              options={{ title: Strings.cameraScreen.title }}
            />
            <Stack.Screen
              name={Strings.metadataScreen.screenName}
              options={{ title: Strings.metadataScreen.titleNewBook }}
            />
             <Stack.Screen
              name={Strings.bookScreen.screenName}
              options={{ title: Strings.bookScreen.title }}
            />
          </Stack>
        </View>
      </ThemeProvider>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
});
