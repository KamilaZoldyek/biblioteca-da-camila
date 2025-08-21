import AsyncStorage from "@react-native-async-storage/async-storage";

export const getStoredThemeData = async () => {
  const value = await AsyncStorage.getItem("@bib-themeData");
  return value;
};

export const setStoredThemeData = async (value: string) => {
  await AsyncStorage.setItem("@bib-themeData", value);
};

export const storedThemeDataOrColorScheme = async (colorScheme: any) => {
  const themeValue = await getStoredThemeData();
  if (!themeValue) {
    return colorScheme;
  }
  return themeValue;
};
