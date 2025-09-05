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
  customGoBack?: () => void;
};

export default function Container({
  title,
  children,
  iconLeft,
  iconRight,
  showGoBack,
  onPressIconLeft,
  onPressIconRight,
  customGoBack,
}: ContainerProps) {
  const handleGoBack = () => {
    router.back();
  };

  return (
    <>
      <Appbar.Header>
        {showGoBack && (
          <Appbar.BackAction
            onPress={customGoBack ? customGoBack : handleGoBack}
          />
        )}
        <Appbar.Content title={title} />
        {iconLeft && (
          <Appbar.Action icon={iconLeft} onPress={onPressIconLeft} />
        )}
        {iconRight && (
          <Appbar.Action icon={iconRight} onPress={onPressIconRight} />
        )}
      </Appbar.Header>
      <View style={styles.container}>
        {children}
        <View style={{ paddingBottom: 50 }} />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Dimensions.padding.container,
  },
});
