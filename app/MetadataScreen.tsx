import {
  ChipsWithTitle,
  Container,
  CustomCard,
  LongButton,
} from "@/components";
import { Dimensions, Strings } from "@/constants/";
import { storedThemeDataOrColorScheme } from "@/Storage/ThemeData";
import * as ImagePicker from "expo-image-picker";
import { router, useLocalSearchParams } from "expo-router";
import * as React from "react";
import { useEffect, useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  useColorScheme,
  View,
} from "react-native";
import {
  Button,
  Chip,
  Dialog,
  Divider,
  HelperText,
  Portal,
  Text,
  TextInput,
} from "react-native-paper";
import { WebView } from "react-native-webview";

export default function MetadataScreen() {
  const item = useLocalSearchParams<{ isbn: string }>();
  const colorScheme = useColorScheme();
  const ISBN = item.isbn;
  const RATING_LIST = ["N/A", "1", "2", "3", "4", "5"];
  //TODO isso provavelmente vai virar um type, assim como os outros

  const [bookTitle, setBookTitle] = useState("");
  const [collectionTitle, setCollectionTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [volume, setVolume] = useState("");
  const [publisher, setPublisher] = useState("");
  const [hasSynopsis, setHasSynopsis] = useState(true);
  const [synopsis, setSynopsis] = useState("");
  const [year, setYear] = useState("");
  const [wasRead, setWasRead] = useState("Não lido");
  const [kind, setKind] = useState("Mangá");
  const [location, setLocation] = useState("Minha casa");
  const [collectionStatus, setCollectionStatus] = useState("");
  const [uploadCoverName, setUploadCoverName] = useState<string | null>(null);
  const [hasReview, setHasReview] = useState(true);
  const [review, setReview] = useState("");
  const [theme, setTheme] = useState<"light" | "dark" | null>(null);
  const [disabled, setDisabled] = useState(false);
  const [rating, setRating] = useState("");
  const [showWebview, setShowWebview] = useState(false);
  const [showGoBackModal, setShowGoBackModal] = useState(false);

  useEffect(() => {
    storedThemeDataOrColorScheme(colorScheme).then((mode) => {
      setTheme(mode);
    });
  }, [colorScheme, setTheme]);

  useEffect(() => {
    if (bookTitle === "" || collectionTitle === "") {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  }, [bookTitle, collectionTitle]);

  const handleImageUpload = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      // aspect: [3, 5],
      quality: 1,
      selectionLimit: 1,
    });

    console.log(result);
    // TODO: pegar o result e subir pra nuvem ou guardar em algum lugar
    // TODO: gerenciar quando vem capa do google(raro, mas acontece)

    if (!result.canceled) {
      setUploadCoverName(result.assets[0].uri);
    }
  };

  const customGoBack = () => {
    setShowGoBackModal(false);
    router.navigate("/HomeScreen");
  };

  const handleISBNSearch = () => {
    setShowWebview(true);

    // TODO
  };
  const handleSave = () => {
    console.log("click");
    // TODO
  };

  const renderTitleBlock = () => {
    return (
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
    );
  };

  const renderCollectionBlock = () => {
    return (
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
    );
  };

  const renderAuthorBlock = () => {
    return (
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
    );
  };

  const renderVolumeBlock = () => {
    return (
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
    );
  };

  const renderISBNBlock = () => {
    return (
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
    );
  };

  const renderPublisherBlock = () => {
    return (
      <View style={styles.textInputs}>
        <TextInput
          style={styles.mediumMarginBottom}
          label={Strings.metadataScreen.publisher}
          value={publisher}
          onChangeText={(text) => setPublisher(text)}
          mode="outlined"
        />
      </View>
    );
  };

  const renderYearBlock = () => {
    return (
      <View style={styles.textInputs}>
        <TextInput
          label={Strings.metadataScreen.year}
          value={year}
          onChangeText={(text) => setYear(text)}
          mode="outlined"
        />
      </View>
    );
  };

  const renderSynopsisBlock = () => {
    return (
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
    );
  };

  const renderReadingStatusBlock = () => {
    return (
      <View style={styles.blocks}>
        <ChipsWithTitle
          onPress={(status) => setWasRead(status)}
          data={["Não lido", "Lido"]}
          title={Strings.metadataScreen.readingStatus}
        />
      </View>
    );
  };

  const renderKindBlock = () => {
    return (
      <View style={styles.blocks}>
        <ChipsWithTitle
          onPress={(kind) => setKind(kind)}
          data={["Mangá", "Livro", "HQ"]}
          title={Strings.metadataScreen.bookKind}
        />
      </View>
    );
  };

  const renderLocationBlock = () => {
    return (
      <View style={styles.blocks}>
        <ChipsWithTitle
          onPress={(location) => setLocation(location)}
          data={["Casa de mãe", "Minha casa"]}
          title={Strings.metadataScreen.where}
        />
      </View>
    );
  };

  const collectionStatusBlock = () => {
    return (
      <View style={styles.blocks}>
        <ChipsWithTitle
          onPress={(collectionStatus) => setCollectionStatus(collectionStatus)}
          data={["Incompleta", "Completa"]}
          title={Strings.metadataScreen.collectionStatus}
        />
      </View>
    );
  };

  const renderCoverBlock = () => {
    return (
      <View style={styles.blocks}>
        <Text style={styles.smallMarginBottom} variant="titleMedium">
          {Strings.metadataScreen.coverArt}
        </Text>
        {uploadCoverName && (
          <Text style={styles.coverName} variant="bodyMedium">
            {uploadCoverName}
          </Text>
        )}
        <View style={styles.chipBlock}>
          <Button
            icon={"upload"}
            mode="contained"
            style={styles.chip}
            onPress={handleImageUpload}
          >
            {Strings.metadataScreen.uploadCoverCTA}
          </Button>
          {uploadCoverName && (
            <Image source={{ uri: uploadCoverName }} style={styles.image} />
          )}
        </View>
      </View>
    );
  };

  const renderRatingBlock = () => {
    return (
      <View style={styles.blocks}>
        <View style={styles.chipBlock}></View>
        <ChipsWithTitle
          onPress={(rating) => setRating(rating)}
          data={RATING_LIST}
          isRating
          title={Strings.metadataScreen.rating}
        />
      </View>
    );
  };

  const renderReviewBlock = () => {
    return (
      <View style={styles.blocks}>
        <Text variant="titleMedium">{Strings.metadataScreen.review}</Text>
        <Chip
          style={styles.chip}
          icon={!hasReview ? "check" : undefined}
          mode={!hasReview ? "flat" : "outlined"}
          onPress={() => setHasReview(!hasReview)}
          disabled={review !== ""}
        >
          {Strings.metadataScreen.noReview}
        </Chip>
        <TextInput
          disabled={!hasReview}
          label={
            !hasReview
              ? Strings.metadataScreen.noReviewReally
              : Strings.metadataScreen.review
          }
          value={review}
          onChangeText={(text) => setReview(text)}
          mode="outlined"
          multiline
        />
      </View>
    );
  };

  return (
    <>
      {!showWebview && (
        <Container
          title={Strings.metadataScreen.titleNewBook}
          showGoBack
          customGoBack={() => setShowGoBackModal(true)}
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

              {renderTitleBlock()}
              {renderCollectionBlock()}
              {renderAuthorBlock()}
              {renderVolumeBlock()}
              {renderISBNBlock()}
              {renderPublisherBlock()}
              {renderYearBlock()}
              {renderSynopsisBlock()}
              {renderReadingStatusBlock()}
              {renderKindBlock()}
              {renderLocationBlock()}
              {collectionStatusBlock()}
              {renderCoverBlock()}

              <View style={{ paddingBottom: 50 }} />

              <Text variant="titleLarge">
                {Strings.metadataScreen.opinionTitle}
              </Text>
              <Divider bold style={styles.largeMarginBottom} />

              {renderRatingBlock()}
              {renderReviewBlock()}
              <CustomCard
                title={Strings.metadataScreen.manualScrapingTitle}
                subtitle={Strings.metadataScreen.manualScrapingDescription}
                iconName={"information"}
                theme={theme}
              />

              <View style={styles.chipBlock}>
                <Button
                  icon={"magnify"}
                  mode="contained"
                  style={styles.chip}
                  onPress={handleISBNSearch}
                >
                  {Strings.metadataScreen.isbnSearch}
                </Button>
              </View>
              <View style={{ paddingBottom: 120 }} />

              <LongButton
                text={Strings.metadataScreen.save}
                onPress={handleSave}
                theme={theme}
                disabled={disabled}
              />

              <View style={{ paddingBottom: 50 }} />
            </ScrollView>
          </KeyboardAvoidingView>
        </Container>
      )}
      {showWebview && (
        <WebView
          style={styles.webViewContainer}
          source={{ uri: "https://isbnsearch.org/isbn/" + ISBN }}
        />
      )}
      {showGoBackModal && (
        <Portal>
          <Dialog
            dismissableBackButton
            visible={showGoBackModal}
            onDismiss={() => setShowGoBackModal(false)}
          >
            <Dialog.Icon icon="alert" />
            <Dialog.Title>{Strings.metadataScreen.modalTitle}</Dialog.Title>
            <Dialog.Content>
              <Text variant="bodyMedium">
                {Strings.metadataScreen.modalDescription}
              </Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={() => setShowGoBackModal(false)}>
                {Strings.metadataScreen.modalCancel}
              </Button>
              <Button onPress={customGoBack}>
                {Strings.metadataScreen.modalOk}
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
  smallMarginBottom: {
    marginBottom: Dimensions.padding.halfContainer,
  },
  mediumMarginBottom: {
    marginBottom: Dimensions.margin.dividerBetweenPublisherAndYear,
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
  },
  coverName: {
    marginVertical: Dimensions.padding.halfContainer,
    width: "100%",
  },
  image: {
    width: 150,
    height: 250,
    marginLeft: 35,
    marginTop: 8,
    borderRadius: Dimensions.borderRadius.bookCover,
  },
  webViewContainer: {
    flex: 1,
    marginTop: 35,
  },
});
