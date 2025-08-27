import { Container } from "@/components";
import { Dimensions, Strings } from "@/constants/";
import { useLocalSearchParams } from "expo-router";
import * as React from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";

export default function MetadataScreen() {
  const item = useLocalSearchParams<{ isbn: string }>();
  return (
    <Container title={Strings.metadataScreen.titleEditing} showGoBack>
      {/* TODO: editar o goBack pra ir pra home por enquanto, mas tem que colocar o dialog de ce tem certeza disso? */}

      <View style={styles.alarmSection}>
        <Text variant="titleMedium">Seu isbn é {item.isbn}</Text>
      </View>
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
