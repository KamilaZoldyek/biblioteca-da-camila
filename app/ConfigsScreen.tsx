import { Container } from "@/components";
import { TextMap } from "@/constants/";
import * as React from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";

export default function ConfigsScreen() {
  return (
    <Container title={TextMap.configsScreen.title} showGoBack>
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
