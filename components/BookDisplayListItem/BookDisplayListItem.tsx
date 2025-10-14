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
  isbn: string;
  onPress: (isbn: string) => void;
};

const PLACEHOLDER =
  "https://wrxchwepnruhjnsziquz.supabase.co/storage/v1/object/public/book-covers/placeholders/new_placeholder.png";

export default function BookDisplayListItem({
  customStyle,
  title,
  author,
  volume,
  image,
  isbn,
  onPress,
}: BookDisplayListItemProps) {
  console.log(image)
  return (
    <Pressable onPress={() => onPress(isbn)}>
      <View style={styles.container}>
        <Image
          contentFit="contain"
          placeholderContentFit="contain"
          transition={500}
          allowDownscaling
          style={styles.image}
          placeholder={PLACEHOLDER}
          source={image}
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
  image: {
    width: 150,
    height: 250,
    //borderRadius: Dimensions.borderRadius.bookCover,
  },
});
