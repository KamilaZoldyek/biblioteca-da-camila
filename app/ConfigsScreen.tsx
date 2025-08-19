import { Container } from "@/components";
import { Dimensions, Strings } from "@/constants/";
import * as React from "react";
import { Appearance, StyleSheet, useColorScheme, View } from "react-native";
import { Button, Switch, Text } from "react-native-paper";
import { TimePickerModal } from "react-native-paper-dates";

export default function ConfigsScreen() {
  const colorScheme = useColorScheme();

  const [isDarkModeOn, setIsDarkModeOn] = React.useState(
    colorScheme === Strings.configsScreen.dark
  );
  const [visible, setVisible] = React.useState(false);
  const [hour, setHour] = React.useState(12);
  const [minutes, setMinutes] = React.useState(30);

  const onDismiss = React.useCallback(() => {
    setVisible(false);
  }, [setVisible]);

  const onConfirm = React.useCallback(
    ({ hours, minutes }) => {
      setVisible(false);
      setHour(hours);
      setMinutes(minutes);
    },
    [setVisible]
  );

  const onToggleDarkMode = () => {
    if (colorScheme === Strings.configsScreen.light) {
      setIsDarkModeOn(true);
      Appearance.setColorScheme("dark");
      
    } else {
       setIsDarkModeOn(false);
      Appearance.setColorScheme("light");
     
    }
  }; //TODO async storage pra guardar isso aqui

  return (
    <Container title={Strings.configsScreen.title} showGoBack>
      <View style={styles.alarmSection}>
        <Text variant="titleMedium">{Strings.configsScreen.alarmTitle}</Text>
        <Text variant="bodyMedium">
          {Strings.configsScreen.alarmDescription}
        </Text>

        <View style={styles.timeSection}>
          <Button
            onPress={() => setVisible(true)}
            uppercase={false}
            mode="contained"
            icon={"clock-outline"}
          >
            {Strings.configsScreen.pickTime}
          </Button>
          <Text variant="displaySmall">
            {hour.toString()}:{minutes.toString()}
          </Text>
        </View>
      </View>
      <View style={styles.darkModeSection}>
        <Text variant="titleMedium" >
          {Strings.configsScreen.darkMode}
        </Text>
        <Switch value={isDarkModeOn} onValueChange={onToggleDarkMode}></Switch>
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
  );
}

const styles = StyleSheet.create({
  alarmSection: {
    flexDirection: "column",
    alignItems: "flex-start",
    paddingVertical: Dimensions.padding.divider,
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
