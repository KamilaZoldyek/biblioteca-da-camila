import { TextMap } from "@/constants";
import { Colors } from "@/constants/Colors";
import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import merge from "deepmerge";
import { Stack } from "expo-router";
import { StyleSheet, useColorScheme, View } from "react-native";
import {
  adaptNavigationTheme,
  MD3DarkTheme,
  PaperProvider,
} from "react-native-paper";

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

  const paperTheme =
    colorScheme === "light" ? CombinedDefaultTheme : CombinedDarkTheme;

  return (
    <PaperProvider theme={paperTheme}>
      <ThemeProvider value={paperTheme}>
        <View
          style={[
            styles.background,
            {
              backgroundColor:
                useColorScheme() === "light"
                  ? Colors.light.background
                  : Colors.dark.background,
            },
          ]}
        >
          <Stack
            initialRouteName={TextMap.homeScreen.screenName}
            screenOptions={{ headerShown: false }}
          >
            <Stack.Screen
              name={TextMap.homeScreen.screenName}
              options={{ title: TextMap.homeScreen.title }}
            />
            <Stack.Screen
              name={TextMap.configsScreen.screenName}
              options={{ title: TextMap.configsScreen.title }}
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
