import { Colors, Dimensions } from "@/constants";
import * as React from "react";
import { useEffect, useState } from "react";
import { FlatList, StyleProp, StyleSheet, ViewStyle } from "react-native";
import { Chip, Text } from "react-native-paper";

type ChipsWithTitleProps = {
  customStyle?: StyleProp<ViewStyle>;
  onPress: (selected: string) => void;
  clearSelection?: boolean;
  data: string[];
  isRating?: boolean;
  title: string;
};

export default function ChipsWithTitle({
  customStyle,
  onPress,
  clearSelection,
  data,
  isRating,
  title,
}: ChipsWithTitleProps) {
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
    <>
      <Text style={styles.title} variant="titleMedium">
        {title}
      </Text>

      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={data}
        renderItem={({ item }) => {
          const getStars = () => {
            if (isRating) {
              if (selected === item) {
                return "star";
              }
              return undefined;
            }
            return undefined;
          };

          return (
            <Chip
              onPress={() => onPress(selected === item ? item : "")}
              onPressIn={() => setSelected(selected === item ? "" : item)}
              selected={selected === item}
              style={styles.chip}
              background={ripple}
              mode={selected === item ? "flat" : "outlined"}
              icon={getStars()}
            >
              {item}
            </Chip>
          );
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flexDirection: "row",
  },
  chip: {
    alignSelf: "flex-start",
    marginRight: Dimensions.padding.container,
  },
  title: {
    marginVertical: Dimensions.padding.dividerInput,
  },
});
