import { Container, LogoTitle, LongButton } from "@/components";
import { Dimensions, Strings } from "@/constants/";
import { storedThemeDataOrColorScheme } from "@/Storage/ThemeData";
import { router } from "expo-router";
import * as React from "react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { StyleSheet, useColorScheme, View } from "react-native";
import { TextInput } from "react-native-paper";

export default function SignUpScreen() {
  const colorScheme = useColorScheme();

  const { control, handleSubmit, formState } = useForm({
    mode: "onChange",
    defaultValues: {
      login: "",
      password: "",
    },
  });

  const [theme, setTheme] = useState<"light" | "dark" | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    storedThemeDataOrColorScheme(colorScheme).then((mode) => {
      setTheme(mode);
    });
  }, [colorScheme, setTheme]);

  const onLoginPress = () => {
    console.log("click");
    router.navigate("/HomeScreen");
  };
  const onVisitorPress = () => {
    console.log("click");
  };

  return (
    <Container title={""}>
      <View style={styles.container}>
        <LogoTitle />
      </View>
      <View style={styles.buttons}>
        <Controller
          rules={{ required: Strings.loginScreen.title }}
          control={control}
          name={"login"}
          render={({ field: { onChange, value } }) => (
            <View style={styles.textInputs}>
              <TextInput
                label={Strings.loginScreen.title}
                value={value}
                onChangeText={onChange}
                mode="outlined"
                error={value === ""}
              />
            </View>
          )}
        />
        <Controller
          rules={{ required: Strings.loginScreen.password }}
          control={control}
          name={"password"}
          render={({ field: { onChange, value } }) => (
            <View style={styles.textInputs}>
              <TextInput
                secureTextEntry={showPassword}
                right={
                  <TextInput.Icon
                    icon={showPassword ? "eye" : "eye-off"}
                    onPress={() => setShowPassword(!showPassword)}
                  />
                }
                label={Strings.loginScreen.password}
                value={value}
                onChangeText={onChange}
                mode="outlined"
                error={value === ""}
              />
            </View>
          )}
        />
        <LongButton
          text={"Cadastra"}
          onPress={handleSubmit(onLoginPress)}
          theme={theme}
          disabled={!formState.isValid}
        />
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingVertical: Dimensions.padding.divider,
  },
  buttons: {
    justifyContent: "space-between",
    paddingVertical: Dimensions.padding.divider,
  },
  textInputs: {
    marginBottom: Dimensions.padding.dividerInput,
  },
});
