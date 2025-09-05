import { Dimensions, Strings } from "@/constants";
import * as React from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { Button } from "react-native-paper";

type ISBNSearchButtonProps = {
  onPress: () => void;
  customStyle?: StyleProp<ViewStyle>;
};

export default function ISBNSearchButton({
  onPress,
  customStyle,
}: ISBNSearchButtonProps) {
  return (
    <View style={customStyle}>
      <Button
        icon={"magnify"}
        mode="contained"
        style={styles.chip}
        onPress={onPress}
      >
        {Strings.metadataScreen.isbnSearch}
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    alignSelf: "flex-start",
    marginVertical: Dimensions.padding.halfContainer,
    marginRight: Dimensions.padding.container,
  },
});
