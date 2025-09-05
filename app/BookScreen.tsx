import {
  Container,
  ISBNSearchButton,
  ISBNWebview,
  TextblockWithTitle,
} from "@/components";
import { Dimensions, Strings } from "@/constants/";
import { Image } from "expo-image";
import { router } from "expo-router";
import * as React from "react";
import { useCallback, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Button, Chip, Dialog, Portal, Text } from "react-native-paper";

export default function BookScreen() {
  const TAGS = ["Livro", "Lido", "Coleção completa", "Minha casa"];
  const [visible, setVisible] = useState(false);
  const [showWebview, setShowWebview] = useState(false);

  const onDismiss = useCallback(() => {
    setVisible(false);
  }, [setVisible]);

  const goToEditScreen = () => {
    router.push({ pathname: "/MetadataScreen", params: { name: "Editar" } });
  };

  const renderMetadata = () => {
    return (
      <View style={styles.metadataContainer}>
        <Image
          contentFit="contain"
          placeholderContentFit="contain"
          transition={500}
          allowDownscaling
          style={styles.image}
          placeholder={require("../assets/images/book-placeholder.svg")}
          source={"https://m.media-amazon.com/images/I/51tAD6LyZ-L.jpg"}
        />
        <View style={styles.metadataText}>
          <Text variant="headlineSmall">Fahrenheit 451</Text>
          <Text style={{ paddingBottom: 16 }} variant="titleMedium">
            Ray Bradbury
          </Text>
          {/* Nome da coleção - nṹmero do volume */}
          <Text style={styles.text} variant="bodyLarge">
            Fahrenheit 451 - 1
          </Text>
          <Text style={styles.text} variant="bodyLarge">
            {Strings.metadataScreen.year}: 2012
          </Text>
          <Text style={styles.text} variant="bodyLarge">
            {Strings.metadataScreen.isbn}: 9788525052247
          </Text>
          <Text style={styles.text} variant="bodyLarge">
            {Strings.metadataScreen.publisher}: Biblioteca Azul
          </Text>
          <Chip
            style={{ alignSelf: "flex-start" }}
            icon={"star"}
            mode="outlined"
          >
            <Text variant="bodyLarge">5</Text>
          </Chip>
        </View>
      </View>
    );
  };

  const renderTags = () => {
    return TAGS.map((item, index) => {
      return (
        <Chip key={index} style={styles.chip} mode={"flat"}>
          {item}
        </Chip>
      );
    });
  };

  return (
    <>
      {!showWebview && (
        <Container
          title={Strings.bookScreen.title}
          showGoBack
          iconLeft="pencil"
          iconRight="delete"
          onPressIconRight={() => setVisible(true)}
          onPressIconLeft={goToEditScreen}
        >
          <ScrollView showsVerticalScrollIndicator={false}>
            {renderMetadata()}
            <View style={styles.tagsSection}>{renderTags()}</View>

            <TextblockWithTitle
              customStyle={{ paddingBottom: Dimensions.padding.divider }}
              chipText={Strings.metadataScreen.noSynopsis}
              title={Strings.metadataScreen.synopsis}
            />

            <TextblockWithTitle
              customStyle={{ paddingBottom: 50 }}
              text={
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
              }
              title={Strings.metadataScreen.review}
            />
            <ISBNSearchButton onPress={() => setShowWebview(true)} />
          </ScrollView>
        </Container>
      )}
      {showWebview && <ISBNWebview isbn={"9788525052247"} />}
      {visible && (
        <Portal>
          <Dialog
            dismissableBackButton
            visible={visible}
            onDismiss={() => setVisible(false)}
          >
            <Dialog.Icon icon="alert" />
            <Dialog.Title style={styles.center}>
              {Strings.bookScreen.deleteModalTitle}
            </Dialog.Title>
            <Dialog.Content>
              <Text variant="bodyMedium">
                {Strings.bookScreen.deleteModalDescription}
              </Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={onDismiss}>{Strings.bookScreen.back}</Button>
              <Button onPress={() => console.log("delete")}>
                {Strings.bookScreen.delete}
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  alarmSection: {
    flexDirection: "column",
    alignItems: "flex-start",
    paddingVertical: Dimensions.padding.divider,
  },
  tagsSection: {
    paddingBottom: 16,
    flexDirection: "row",
    width: "100%",
    flexWrap: "wrap",
  },
  metadataText: {
    padding: Dimensions.padding.container,
    flexDirection: "column",
  },
  text: {
    paddingBottom: Dimensions.padding.dividerInput,
  },

  metadataContainer: {
    flexDirection: "row",
    paddingVertical: Dimensions.padding.container,
  },
  image: {
    width: 150,
    height: 250,
  },
  chip: {
    alignSelf: "flex-start",
    marginRight: Dimensions.padding.container,
    marginBottom: Dimensions.padding.container,
  },
  center: {
    alignSelf: "center",
  },
});
