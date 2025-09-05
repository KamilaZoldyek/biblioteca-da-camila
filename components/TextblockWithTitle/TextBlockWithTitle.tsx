import { Dimensions } from "@/constants";
import * as React from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { Chip, Text } from "react-native-paper";

type TextblockWithTitleProps = {
  text?: string;
  title: string;
  chipText?: string;
  customStyle?: StyleProp<ViewStyle>;
};

export default function TextblockWithTitle({
  title,
  text,
  chipText,
  customStyle,
}: TextblockWithTitleProps) {
  return (
    <View style={customStyle}>
      <Text style={styles.title} variant="titleMedium">
        {title}
      </Text>
      {chipText ? (
        <Chip style={styles.chip} mode={"flat"}>
          {chipText}
        </Chip>
      ) : (
        <Text style={styles.title} variant="bodyMedium">
          {text}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    marginVertical: Dimensions.padding.dividerInput,
  },
  chip: {
    alignSelf: "flex-start",
    marginRight: Dimensions.padding.container,
    marginBottom: Dimensions.padding.container,
  },
});
