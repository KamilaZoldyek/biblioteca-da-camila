import { Container } from "@/components";
import {
  BarcodeScanningResult,
  CameraType,
  CameraView,
  useCameraPermissions,
} from "expo-camera";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Card, Text } from "react-native-paper";

import { Dimensions, Strings } from "@/constants";
import { router } from "expo-router";

export default function CameraScreen() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [enableTorch, setEnableTorch] = useState(false);
  const [scanSuccess, setScanSuccess] = useState(false);

  const onBarcodeScanned = (scanningResult: BarcodeScanningResult) => {
    const isbnCode = scanningResult.data;
    setScanSuccess(true);

    router.push({ pathname: "/MetadataScreen", params: { isbn: isbnCode } });
  };

  const onGoBack = () => {
    router.back();
  };

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    return (
      <Container title={""}>
        <View style={styles.container}>
          <Card>
            <Card.Content style={styles.message}>
              <Text variant="titleLarge">
                {Strings.cameraScreen.permissionsTitle}
              </Text>
              <Text variant="bodyMedium">
                {Strings.cameraScreen.permissionsDescription}
              </Text>
            </Card.Content>

            <Card.Actions>
              <Button onPress={onGoBack}>{Strings.cameraScreen.goBack}</Button>
              <Button onPress={requestPermission}>
                {Strings.cameraScreen.permissionsRequest}
              </Button>
            </Card.Actions>
          </Card>
        </View>
      </Container>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <Button
          onPress={onGoBack}
          mode="contained-tonal"
          icon={"arrow-left-circle"}
        >
          <Text variant="bodyMedium">{Strings.cameraScreen.goBack}</Text>
        </Button>
        <Button
          onPress={() => setEnableTorch(!enableTorch)}
          icon={"flash"}
          mode="contained-tonal"
        >
          <Text variant="bodyMedium">{Strings.cameraScreen.flash}</Text>
        </Button>
      </View>
      {!scanSuccess && (
        <CameraView
          style={styles.camera}
          facing={facing}
          autofocus="on"
          barcodeScannerSettings={{
            barcodeTypes: ["ean13", "ean8"],
          }}
          onBarcodeScanned={(result) => onBarcodeScanned(result)}
          enableTorch={enableTorch}
        ></CameraView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  message: {
    paddingVertical: Dimensions.padding.container,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    position: "absolute",
    right: -20,
    bottom: 20,
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    margin: 54,
    width: "80%",
    justifyContent: "space-around",
    alignContent: "center",
    alignItems: "center",
  },
});
