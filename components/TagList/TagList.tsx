import { Colors } from "@/constants";
import { TAGS } from "@/constants/mocks";
import * as React from "react";
import { useEffect, useState } from "react";
import { FlatList, StyleProp, StyleSheet, ViewStyle } from "react-native";
import { Chip } from "react-native-paper";

type TagListProps = {
  customStyle?: StyleProp<ViewStyle>;
  onPress: (selected: string) => void;
  clearSelection?: boolean;
};

export default function TagList({
  customStyle,
  onPress,
  clearSelection,
}: TagListProps) {
  const [selected, setSelected] = useState("");

  const ripple = {
    color: Colors.dark.primary,
    radius: 100,
    foreground: true,
    borderless: false,
  };

  useEffect(() => {
    if (clearSelection) {
      setSelected("");
    }
  }, [clearSelection, onPress]);

  return (
    <FlatList
      horizontal
      showsHorizontalScrollIndicator={false}
      data={TAGS}
      renderItem={({ item }) => (
        <Chip
          onPress={() => onPress(selected === item ? item : "")}
          onPressIn={() => setSelected(selected === item ? "" : item)}
          selected={selected === item}
          style={styles.chip}
          background={ripple}
          mode={selected === item ? "flat" : "outlined"}
        >
          {item}
        </Chip>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flexDirection: "row",
  },
  chip: {
    margin: 3,
  },
});
