import { Colors, Dimensions } from "@/constants/";
import * as React from "react";
import {
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";

import { Text } from "react-native-paper";

type LongButtonProps = {
  customStyle?: StyleProp<ViewStyle>;
  text: string;
  image?: string;
  onPress: () => void;
  theme: string | null;
  disabled?: boolean;
};

export default function LongButton({
  customStyle,
  text,
  onPress,
  theme,
  disabled,
}: LongButtonProps) {
  const ripple = {
    color: Colors.dark.primaryContainer,
    radius: 200,
    foreground: true,
    borderless: false,
  };
  const backgroundSelector = () => {
    if (disabled) {
      if (theme === "dark") {
        return Colors.dark.surfaceDisabled;
      }
      return Colors.light.surfaceDisabled;
    }
    if (theme === "dark") {
      return Colors.dark.primary;
    }
    return Colors.light.primary;
  };

  const fontColorSelector = () => {
    if (disabled) {
      if (theme === "dark") {
        return Colors.dark.onSurfaceDisabled;
      }
      return Colors.light.onSurfaceDisabled;
    }
    if (theme === "dark") {
      return Colors.dark.onPrimary;
    }
    return Colors.light.onPrimary;
  };

  return (
    <Pressable
      android_ripple={ripple}
      onPress={onPress}
      disabled={disabled}
      style={{
        backgroundColor: backgroundSelector(),
        borderRadius: Dimensions.borderRadius.bookCover,
        width: "100%",
        marginVertical: Dimensions.padding.halfContainer,
      }}
    >
      <View style={styles.container}>
        <Text
          variant="titleMedium"
          style={{
            color: fontColorSelector(),
          }}
        >
          {text}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  text: {
    paddingVertical: Dimensions.padding.halfContainer,
  },
  container: {
    paddingVertical: Dimensions.padding.container,
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
  },
  image: {
    width: 150,
    height: 200,
    borderRadius: Dimensions.borderRadius.bookCover,
  },
});
