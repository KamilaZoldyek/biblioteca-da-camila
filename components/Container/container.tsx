import { Dimensions } from "@/constants/";
import { router } from "expo-router";
import * as React from "react";
import { StyleSheet, View } from "react-native";
import { Appbar } from "react-native-paper";

type ContainerProps = {
  title: string;
  children: React.ReactNode;
  iconLeft?: string;
  onPressIconLeft?: () => void;
  iconRight?: string;
  onPressIconRight?: () => void;
  showGoBack?: boolean;
};

export default function Container({
  title,
  children,
  iconLeft,
  iconRight,
  showGoBack,
  onPressIconLeft,
  onPressIconRight,
}: ContainerProps) {
  function handleGoBack() {
    router.back();
  }

  return (
    <>
      <Appbar.Header>
        {showGoBack && <Appbar.BackAction onPress={handleGoBack} />}
        <Appbar.Content title={title} />
        {iconLeft && (
          <Appbar.Action icon={iconLeft} onPress={onPressIconLeft} />
        )}
        {iconRight && (
          <Appbar.Action icon={iconRight} onPress={onPressIconRight} />
        )}
      </Appbar.Header>
      <View style={styles.container}>{children}</View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Dimensions.padding.container,
  },
});
