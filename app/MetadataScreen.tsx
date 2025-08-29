import { Container } from "@/components";
import { Dimensions, Strings } from "@/constants/";
import { router, useLocalSearchParams } from "expo-router";
import * as React from "react";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { Chip, Divider, HelperText, Text, TextInput } from "react-native-paper";

export default function MetadataScreen() {
  const item = useLocalSearchParams<{ isbn: string }>();
  const ISBN = item.isbn;
  const [bookTitle, setBookTitle] = useState("");
  const [collectionTitle, setCollectionTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [volume, setVolume] = useState("");
  const [publisher, setPublisher] = useState("");
  const [hasSynopsis, setHasSynopsis] = useState(true);
  const [synopsis, setSynopsis] = useState("");
  const [year, setYear] = useState("");
  const [wasRead, setWasRead] = useState(false);

  const customGoBack = () => {
    router.navigate("/HomeScreen");
  };

  return (
    <Container
      title={Strings.metadataScreen.titleNewBook}
      showGoBack
      customGoBack={customGoBack}
    >
      {/* TODO: TIRAR o keyboard avoiding view quando exportar pq não precisa */}
      {/* TODO: Adicionar 
          <activity
          android:name=".MainActivity"
          android:windowSoftInputMode="adjustResize"
          android:exported="true"
          ... >
        no android.manifest pra funcionar e depois tirar o comentário da scrollview
      */}
      <KeyboardAvoidingView
        behavior="padding"
        keyboardVerticalOffset={Platform.select({ ios: 64, android: 120 })}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          // contentContainerStyle={{
          //   flexGrow: 1,
          //   justifyContent: "flex-end",
          //   padding: 16,
          // }}
          // keyboardShouldPersistTaps="handled"
          // keyboardDismissMode="on-drag"
        >
          <Text variant="titleLarge">
            {Strings.metadataScreen.metadataTitle}
          </Text>
          <Divider bold style={styles.largeMarginBottom} />

          <View style={styles.textInputs}>
            <TextInput
              label={Strings.metadataScreen.bookTitle}
              value={bookTitle}
              onChangeText={(text) => setBookTitle(text)}
              mode="outlined"
              error={bookTitle === ""}
            />
            <HelperText style={styles.textInputs} type={"info"} visible={true}>
              {Strings.metadataScreen.bookTitleHelper}
            </HelperText>
          </View>

          <View style={styles.textInputs}>
            <TextInput
              label={Strings.metadataScreen.collectionTitle}
              value={collectionTitle}
              onChangeText={(text) => setCollectionTitle(text)}
              mode="outlined"
              error={bookTitle === ""}
            />
            <HelperText style={styles.textInputs} type={"info"} visible={true}>
              {Strings.metadataScreen.collectionTitleHelper}
            </HelperText>
          </View>

          <View style={styles.textInputs}>
            <TextInput
              label={Strings.metadataScreen.author}
              value={author}
              onChangeText={(text) => setAuthor(text)}
              mode="outlined"
            />
            <HelperText style={styles.textInputs} type={"info"} visible={true}>
              {Strings.metadataScreen.authorHelper}
            </HelperText>
          </View>

          <View style={styles.textInputs}>
            <TextInput
              label={Strings.metadataScreen.volume}
              value={volume.toString()}
              keyboardType="numeric"
              onChangeText={(text) => setVolume(text)}
              mode="outlined"
            />
            <HelperText style={styles.textInputs} type={"info"} visible={true}>
              {Strings.metadataScreen.volumeHelper}
            </HelperText>
          </View>

          <View style={styles.textInputs}>
            <TextInput
              label={Strings.metadataScreen.isbn}
              value={ISBN}
              mode="outlined"
              editable={false}
            />
            <HelperText style={styles.textInputs} type={"info"} visible={true}>
              {Strings.metadataScreen.isbnHelper}
            </HelperText>
          </View>

          <View style={styles.textInputs}>
            <TextInput
              label={Strings.metadataScreen.publisher}
              value={publisher}
              onChangeText={(text) => setPublisher(text)}
              mode="outlined"
            />
            <HelperText style={styles.textInputs} type={"info"} visible={true}>
              {Strings.metadataScreen.volumeHelper}
            </HelperText>
          </View>

          <View style={styles.textInputs}>
            <TextInput
              label={Strings.metadataScreen.year}
              value={year}
              onChangeText={(text) => setYear(text)}
              mode="outlined"
            />
            <HelperText style={styles.textInputs} type={"info"} visible={true}>
              {Strings.metadataScreen.volumeHelper}
            </HelperText>
          </View>

          <View style={styles.blocks}>
            <Text variant="titleMedium">{Strings.metadataScreen.synopsis}</Text>
            <Chip
              style={styles.chip}
              icon={!hasSynopsis ? "check" : undefined}
              mode={!hasSynopsis ? "flat" : "outlined"}
              onPress={() => setHasSynopsis(!hasSynopsis)}
              disabled={synopsis !== ""}
            >
              {Strings.metadataScreen.noSynopsis}
            </Chip>
            <TextInput
              disabled={!hasSynopsis}
              label={
                !hasSynopsis
                  ? Strings.metadataScreen.noSynopsisReally
                  : Strings.metadataScreen.synopsis
              }
              value={synopsis}
              onChangeText={(text) => setSynopsis(text)}
              mode="outlined"
              multiline
            />
          </View>

          <View style={styles.blocks}>
            <Text variant="titleMedium">
              {Strings.metadataScreen.readingStatus}
            </Text>
            <View style={styles.chipBlock}>
              <Chip
                style={styles.chip}
                icon={!wasRead ? "check" : undefined}
                mode={!wasRead ? "flat" : "outlined"}
                onPress={() => setWasRead(!wasRead)}
              >
                {Strings.metadataScreen.unread}
              </Chip>
              <Chip
                style={styles.chip}
                icon={wasRead ? "check" : undefined}
                mode={wasRead ? "flat" : "outlined"}
                onPress={() => setWasRead(!wasRead)}
              >
                {Strings.metadataScreen.read}
              </Chip>
            </View>
          </View>

          <View style={styles.blocks}>
            <Text variant="titleMedium">
              {Strings.metadataScreen.readingStatus}
            </Text>
            <View style={styles.chipBlock}>
              <Chip
                style={styles.chip}
                icon={!wasRead ? "check" : undefined}
                mode={!wasRead ? "flat" : "outlined"}
                onPress={() => setWasRead(!wasRead)}
              >
                {Strings.metadataScreen.unread}
              </Chip>
              <Chip
                style={styles.chip}
                icon={wasRead ? "check" : undefined}
                mode={wasRead ? "flat" : "outlined"}
                onPress={() => setWasRead(!wasRead)}
              >
                {Strings.metadataScreen.read}
              </Chip>
            </View>
          </View>

          <View style={{ paddingBottom: 250 }} />
        </ScrollView>
      </KeyboardAvoidingView>
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
  largeMarginBottom: {
    marginBottom: Dimensions.margin.divider,
  },
  chip: {
    alignSelf: "flex-start",
    marginVertical: Dimensions.padding.halfContainer,
    marginRight: Dimensions.padding.container,
  },
  blocks: {
    marginVertical: Dimensions.padding.container,
    justifyContent: "space-between",
  },
  chipBlock: {
    flexDirection: "row",
    width: "100%",
    //justifyContent: 'space-between',
  },
});
