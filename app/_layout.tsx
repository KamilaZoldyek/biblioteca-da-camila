import { Stack } from "expo-router";
import { useColorScheme } from "react-native";
import { MD3DarkTheme, MD3LightTheme, PaperProvider } from "react-native-paper";
import { Colors } from "@/constants/Colors";


export default function RootLayout() {
  const colorScheme = useColorScheme();

  const paperTheme =
    colorScheme === 'dark'
      ? { ...MD3DarkTheme, colors: Colors.dark }
      : { ...MD3LightTheme, colors: Colors.light };

  return (
    <PaperProvider theme={paperTheme}>
      <Stack />
    </PaperProvider>
  );
}
