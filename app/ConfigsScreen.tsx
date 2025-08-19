import { Container } from "@/components";
import * as React from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";

export default function ConfigsScreen() {
  return (
    <Container title={"Configurações"} showGoBack>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text variant="displayLarge">ConfigsScreen</Text>
      </View>
    </Container>
  );
}
