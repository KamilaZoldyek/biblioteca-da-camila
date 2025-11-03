import { Container, LogoTitle, LongButton } from "@/components";
import { Dimensions, Strings } from "@/constants/";
import { supabase } from "@/lib/supabase";
import { storedThemeDataOrColorScheme } from "@/Storage/ThemeData";
import { router } from "expo-router";
import * as React from "react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  ToastAndroid,
  useColorScheme,
  View,
} from "react-native";
import { ActivityIndicator, TextInput } from "react-native-paper";

type FormData = {
  login: string;
  password: string;
};

export default function LoginScreen() {
  const colorScheme = useColorScheme();

  const { control, handleSubmit, formState } = useForm({
    mode: "onChange",
    defaultValues: {
      login: "",
      password: "",
    },
  });

  const [theme, setTheme] = useState<"light" | "dark" | null>(null);
  const [showPassword, setShowPassword] = useState(true);
  const [showLoading, setShowLoading] = useState(false);

  useEffect(() => {
    storedThemeDataOrColorScheme(colorScheme).then((mode) => {
      setTheme(mode);
    });
  }, [colorScheme, setTheme]);

  const onLoginPress = async (formData: FormData) => {
    setShowLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email: formData.login.trim(),
      password: formData.password.trim(),
    });

    if (error) {
      setShowLoading(false);
      ToastAndroid.show("Erro no login", ToastAndroid.LONG);
      console.log("login error", error);
      return;
    }

    setShowLoading(false);
    router.replace("/HomeScreen");
  };
  const onVisitorPress = () => {
    router.replace("/SignUpScreen");
  };

  return (
    <Container title={""}>
      <KeyboardAvoidingView
        behavior="padding"
        keyboardVerticalOffset={Platform.select({ ios: 64, android: 120 })}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
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
                    autoCapitalize="none"
                    inputMode="email"
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
            {showLoading ? (
              <ActivityIndicator />
            ) : (
              <LongButton
                text={Strings.loginScreen.title}
                onPress={handleSubmit(onLoginPress)}
                theme={theme}
                disabled={!formState.isValid}
              />
            )}
          </View>
          <LongButton
            text={Strings.loginScreen.visitor}
            onPress={onVisitorPress}
            theme={theme}
          />
        </ScrollView>
      </KeyboardAvoidingView>
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
