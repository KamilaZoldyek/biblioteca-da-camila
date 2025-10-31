import { Container } from "@/components";
import { Colors, Dimensions, Strings } from "@/constants/";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import {
  setStoredThemeData,
  storedThemeDataOrColorScheme,
} from "@/Storage/ThemeData";
import { convertLocalToUTC } from "@/utils/timeConversion";
import { formatMinute } from "@/utils/util";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import { router } from "expo-router";
import * as React from "react";
import { useCallback, useEffect, useState } from "react";
import {
  Appearance,
  StyleSheet,
  ToastAndroid,
  useColorScheme,
  View,
} from "react-native";
import {
  ActivityIndicator,
  Button,
  Dialog,
  Portal,
  Switch,
  Text,
} from "react-native-paper";
import { TimePickerModal } from "react-native-paper-dates";

export default function ConfigsScreen() {
  const STORAGE_KEY_TIME = "@daily_reminder_time";
  const colorScheme = useColorScheme();

  const { user } = useAuth();

  const [userName, setUserName] = useState("");
  const [isDarkModeOn, setIsDarkModeOn] = useState(true);
  const [visible, setVisible] = useState(false);
  const [hour, setHour] = useState(12);
  const [minutes, setMinutes] = useState(30);
  const [theme, setTheme] = useState<"light" | "dark" | null>(null);
  const [reminderOn, setReminderOn] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  useEffect(() => {
    storedThemeDataOrColorScheme(colorScheme).then((mode) => {
      setTheme(mode);
      setIsDarkModeOn(mode === "dark");
    });
  }, [colorScheme, setTheme, setIsDarkModeOn]);

  useEffect(() => {
    setUserName(user?.email || "");
  }, [user?.email]);

  useEffect(() => {
    getReminder();
  }, []);

  const getReminder = async () => {
    const hasReminder = await AsyncStorage.getItem(STORAGE_KEY_TIME);
    if (hasReminder) {
      const [h, m] = hasReminder.split(":").map(Number);
      setReminderOn(true);
      setHour(h);
      setMinutes(m);
      return;
    }
    setReminderOn(false);
  };

  const onLogOut = async () => {
    await supabase.auth.signOut();
    router.replace("/LoginScreen");
  };

  const onToggleDarkMode = () => {
    if (theme === "light") {
      setIsDarkModeOn(true);
      Appearance.setColorScheme("dark");
      setStoredThemeData("dark");
    } else if (theme === "dark") {
      setIsDarkModeOn(false);
      Appearance.setColorScheme("light");
      setStoredThemeData("light");
    }
  };

  const onDismiss = useCallback(() => {
    setVisible(false);
  }, [setVisible]);

  const onConfirm = useCallback(
    ({ hours, minutes }) => {
      setVisible(false);
      setHour(hours);
      setMinutes(minutes);
      const time = hours.toString() + ":" + formatMinute(minutes);
      setUserReminder(user?.id!, time);
    },
    [user?.id]
  );

  const setUserReminder = async (userId: string, selectedTime: string) => {
    const utcTime = convertLocalToUTC(selectedTime);

    const { data, error: reminderError } = await supabase
      .from("users")
      .update({ reminder_time: utcTime })
      .eq("user_id", userId)
      .select();

    if (data) {
      console.log(data);
    }

    if (reminderError) {
      ToastAndroid.show("Problemas ao cadastrar o horário", ToastAndroid.LONG);
      console.log(reminderError);
    }

    await AsyncStorage.setItem(STORAGE_KEY_TIME, selectedTime);

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Lembrete salvo",
        body: `Você será lembrado às ${selectedTime}`,
      },
      trigger: null,
    });

    ToastAndroid.show(
      `Você será lembrado às ${selectedTime}`,
      ToastAndroid.LONG
    );

    console.log("Reminder feito");
  };

  const cancelUserReminder = async (userId: string) => {
    const { error: cancelError } = await supabase
      .from("users")
      .update({ reminder_time: null })
      .eq("user_id", userId);

    if (cancelError) {
      ToastAndroid.show("Problemas ao cancelar o lembrete", ToastAndroid.LONG);
      console.log(cancelError);
    }
    await AsyncStorage.removeItem(STORAGE_KEY_TIME);
    await Notifications.cancelAllScheduledNotificationsAsync();
  };

  const onToggleReminder = () => {
    if (!reminderOn) {
      setReminderOn(true);
      setVisible(true);
    } else {
      setReminderOn(false);
      cancelUserReminder(user?.id!);
    }
  };

  return (
    <>
      <Container title={Strings.configsScreen.title} showGoBack>
        <View style={styles.darkModeSection}>
          <Text variant="titleMedium">{Strings.configsScreen.alarmTitle}</Text>
          <Switch value={reminderOn} onValueChange={onToggleReminder}></Switch>
        </View>
        <View style={styles.alarmSection}>
          <Text variant="bodyMedium">
            {Strings.configsScreen.alarmDescription}
          </Text>

          <View style={styles.timeSection}>
            <Button
              onPress={() => setVisible(true)}
              uppercase={false}
              mode="contained"
              icon={"clock-outline"}
              disabled={!reminderOn}
            >
              {Strings.configsScreen.pickTime}
            </Button>
            <Text
              style={{
                color: !reminderOn
                  ? Colors.dark.onSurfaceDisabled
                  : Colors.dark.onSurface,
              }}
              variant="displaySmall"
            >
              {hour.toString()}:{formatMinute(minutes)}
            </Text>
          </View>
        </View>
        <View style={styles.darkModeSection}>
          <Text variant="titleMedium">{Strings.configsScreen.darkMode}</Text>
          <Switch
            value={isDarkModeOn}
            onValueChange={onToggleDarkMode}
          ></Switch>
        </View>

        <View style={styles.accountSection}>
          <Text variant="titleMedium">{Strings.configsScreen.account}</Text>

          {userName === "" ? (
            <ActivityIndicator />
          ) : (
            <Text variant="bodyMedium">{userName}</Text>
          )}

          <View style={styles.timeSection}>
            <Button
              style={{ marginRight: Dimensions.padding.halfContainer }}
              onPress={onLogOut}
              uppercase={false}
              mode="contained"
            >
              {Strings.configsScreen.logOut}
            </Button>

            <Button
              textColor={Colors.dark.onError}
              buttonColor={Colors.dark.error}
              icon={"alert"}
              uppercase={false}
              mode="contained"
              onPress={() => setDeleteModalVisible(true)}
            >
              {Strings.configsScreen.deleteAccount}
            </Button>
          </View>
        </View>

        <TimePickerModal
          label={Strings.configsScreen.timePickerLabel}
          cancelLabel={Strings.configsScreen.timePickerCancelLabel}
          visible={visible}
          onDismiss={onDismiss}
          onConfirm={onConfirm}
          defaultInputType="keyboard"
          locale="pt"
        />
      </Container>
      <Portal>
        <Dialog
          visible={deleteModalVisible}
          onDismiss={() => setDeleteModalVisible(false)}
        >
          <Dialog.Title> {Strings.configsScreen.deleteAccount}</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              {Strings.configsScreen.deleteAccountDescription}
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDeleteModalVisible(false)}>Ok!</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
}

const styles = StyleSheet.create({
  alarmSection: {
    flexDirection: "column",
    alignItems: "flex-start",
  },
  accountSection: {
    flexDirection: "column",
    alignItems: "flex-start",
    paddingTop: Dimensions.padding.divider,
  },
  darkModeSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: Dimensions.padding.divider,
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
  buttons: {
    paddingTop: Dimensions.padding.container,
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
});
