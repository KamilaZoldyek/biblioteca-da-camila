import { Colors, Dimensions } from "@/constants/";
import * as React from "react";
import { Pressable, StyleProp, ViewStyle } from "react-native";
import { Card, Icon } from "react-native-paper";

type CustomCardProps = {
  customStyle?: StyleProp<ViewStyle>;
  title: string;
  subtitle: string;
  iconName: string;
  theme: string | null;
  onPress?: () => void;
};

export default function CustomCard({
  customStyle,
  title,
  subtitle,
  iconName,
  theme,
  onPress,
}: CustomCardProps) {
  return (
    <Pressable onPress={onPress} style={{ width: "100%" }}>
      <Card.Title
        style={{
          backgroundColor:
            theme === "dark"
              ? Colors.dark.inverseOnSurface
              : Colors.light.inverseOnSurface,
          borderRadius: Dimensions.borderRadius.bookCover,
          marginVertical: Dimensions.padding.halfContainer,
          paddingVertical: Dimensions.padding.container,
        }}
        title={title}
        subtitle={subtitle}
        left={(props) => <Icon source={iconName} size={35} />}
        subtitleNumberOfLines={6}
      />
    </Pressable>
  );
}
