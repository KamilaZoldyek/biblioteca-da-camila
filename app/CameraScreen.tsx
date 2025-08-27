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

import { router } from "expo-router";

export default function CameraScreen() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <Container title={""}>
        <View style={styles.container}>
          <Card>
            <Card.Content>
              <Text variant="titleLarge">Permissões</Text>
              <Text variant="bodyMedium">
                Precisamos da sua permissão para usar a câmera. Ela funcionará
                como leitor de código de barras.
              </Text>
            </Card.Content>

            <Card.Actions>
              <Button onPress={() => router.back()}>Voltar</Button>
              <Button onPress={requestPermission}>Solicitar</Button>
            </Card.Actions>
          </Card>
        </View>
      </Container>
    );
  }

  const onBarcodeScanned = (scanningResult: BarcodeScanningResult) => {
    console.log(scanningResult.data);
    const isbnCode = scanningResult.data;

    router.push({ pathname: "/MetadataScreen", params: { isbn: isbnCode } });
  };

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing={facing}
        autofocus="on"
        barcodeScannerSettings={{
          barcodeTypes: ["ean13", "ean8"],
        }}
        onBarcodeScanned={(result) => onBarcodeScanned(result)}
      >
        {/* TODO: add botão de voltar e botão de ligar o flash */}
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
});
