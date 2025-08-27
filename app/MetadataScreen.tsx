import { Container } from "@/components";
import { Colors, Dimensions, Strings } from "@/constants/";
import { router, useLocalSearchParams } from "expo-router";
import * as React from "react";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { HelperText, Text, TextInput } from "react-native-paper";

export default function MetadataScreen() {
  const item = useLocalSearchParams<{ isbn: string }>();
  const ISBN = item.isbn;
  const [bookTitle, setBookTitle] = useState("");
  const [collectionTitle, setcollectionTitle] = useState("");
  const [author, setAuthor] = useState("");

  const customGoBack = () => {
    router.navigate("/HomeScreen");
  };

  return (
    <Container
      title={Strings.metadataScreen.titleNewBook}
      showGoBack
      customGoBack={customGoBack}
    >
      {/* TODO: tem que colocar o dialog de ce tem certeza disso? */}

      <View style={styles.alarmSection}>
        <Text variant="titleMedium">Seu isbn é {item.isbn}</Text>
      </View>

      <View>
        <TextInput
          style={styles.textInputs}
          label="Título da obra"
          value={bookTitle}
          onChangeText={(text) => setBookTitle(text)}
          mode="outlined"
          error={bookTitle === ""}
        />
        <TextInput
          style={styles.textInputs}
          label="Título da série"
          value={collectionTitle}
          onChangeText={(text) => setcollectionTitle(text)}
          mode="outlined"
        />
        <TextInput
          style={styles.textInputs}
          label="Autor"
          value={author}
          onChangeText={(text) => setAuthor(text)}
          mode="outlined"
        />
        <TextInput
          style={styles.textInputs}
          label="Número do volume"
          keyboardType="numeric"
          value={author}
          onChangeText={(text) => setAuthor(text)}
          mode="outlined"
        />
        <TextInput
          label="ISBN"
          value={ISBN}
          editable={false}
          mode="outlined"
          outlineColor={Colors.dark.onSecondary}
        />
        <HelperText style={styles.textInputs} type={"info"} visible={true}>
          Pode ser 10 ou 13 dígitos. Campo não editável.
        </HelperText>
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  alarmSection: {
    flexDirection: "column",
    alignItems: "flex-start",
    paddingVertical: Dimensions.padding.divider,
  },
  darkModeSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  timeSection: {
    paddingTop: Dimensions.padding.container,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  time: {
    alignSelf: "flex-end",
  },
  textInputs: {
    marginBottom: Dimensions.padding.dividerInput,
  },
});
