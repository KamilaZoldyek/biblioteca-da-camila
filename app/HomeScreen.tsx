import { Container } from "@/components";
import { Strings } from "@/constants/";
import { router } from "expo-router";
import * as React from "react";
import { StyleSheet } from "react-native";
import { Text } from "react-native-paper";

export default function HomeScreen() {
  function handleConfigScreen() {
    router.navigate("/ConfigsScreen");
  }
  return (
    <>
      {/* DEIXE o title vazio para alinhar os ícones a direita! */}
      <Container
        title={""}
        iconLeft="cog"
        iconRight="information"
        onPressIconLeft={handleConfigScreen}
      >
        <Text variant="displaySmall" style={styles.header}>
          {Strings.homeScreen.hello}
        </Text>
      </Container>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    flex: 1,
    alignItems: "flex-start",
  },
});
