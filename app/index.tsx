import { View } from "react-native";
import { Text } from 'react-native-paper';
import * as React from 'react';

export default function Index() {
  return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text>hello</Text>
        <Text variant="displayLarge">Display Large</Text>
      </View>
  );
}

