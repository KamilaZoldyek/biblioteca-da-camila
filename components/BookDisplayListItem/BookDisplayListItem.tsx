import { Dimensions } from "@/constants/";
import { Image } from "expo-image";
import * as React from "react";
import {
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";

import { Text } from "react-native-paper";

type BookDisplayListItemProps = {
  customStyle?: StyleProp<ViewStyle>;
  title: string;
  author: string;
  volume: string;
  image?: string;
  onPress?: () => void;
};

export default function BookDisplayListItem({
  customStyle,
  title,
  author,
  volume,
  image,
  onPress,
}: BookDisplayListItemProps) {
  return (
    <Pressable onPress={onPress}>
      <View style={styles.container}>
        <Image
          style={styles.image}
          source={require("../../assets/images/book-placeholder.svg")}
        />
        <Text
          style={styles.text}
          ellipsizeMode="tail"
          numberOfLines={2}
          variant="bodyMedium"
        >
          {title}
        </Text>
        <Text variant="bodySmall">
          {author} - {volume}
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

    maxWidth: 150,
    maxHeight: 320,
  },
  image: { width: 150, height: 200, borderRadius: 10 },
});
