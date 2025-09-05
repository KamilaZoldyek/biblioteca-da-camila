import { Container } from "@/components";
import { Dimensions, Strings } from "@/constants/";
import { Image } from "expo-image";
import * as React from "react";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Chip, Text } from "react-native-paper";

export default function BookScreen() {
  const TAGS = ["Livro", "Lido", "Coleção completa", "Minha casa"];
  const [visible, setVisible] = useState(false);
  const [hour, setHour] = useState(12);
  const [minutes, setMinutes] = useState(30);
  const [theme, setTheme] = useState<"light" | "dark" | null>(null);

  const onDismiss = React.useCallback(() => {
    setVisible(false);
  }, [setVisible]);

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
          <Text ellipsizeMode="tail" numberOfLines={2} variant="headlineSmall">
            Fahrenheit 451
          </Text>
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
    return TAGS.map((item) => {
      return (
        <Chip key={item.indexOf(item)} style={styles.chip} mode={"flat"}>
          {item}
        </Chip>
      );
    });
  };

  return (
    <Container
      title={Strings.bookScreen.title}
      showGoBack
      iconLeft="pencil"
      iconRight="delete"
      onPressIconRight={() => setVisible(true)}
    >
      {renderMetadata()}
      <View style={styles.tagsSection}>{renderTags()}</View>
    </Container>
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
});
