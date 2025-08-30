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
import {
  Button,
  Chip,
  Divider,
  HelperText,
  Text,
  TextInput,
} from "react-native-paper";

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
  const [wasRead, setWasRead] = useState("");
  const [kind, setKind] = useState("");
  const [location, setLocation] = useState("");
  const [collectionStatus, setCollectionStatus] = useState("");
  const [uploadCoverName, setUploadCoverName] = useState(
    "text_cover_name_with_a_lot_of_words_to_test_the_position_and_paddings_and_margins_lorem_ipsum_sit_amet"
  );
    const [hasReview, setHasReview] = useState(true);
  const [review, setReview] = useState("");

  const customGoBack = () => {
    router.navigate("/HomeScreen");
  };

  const handleImageUpload = () => {
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
        <Text variant="titleMedium">
          {Strings.metadataScreen.readingStatus}
        </Text>
        <View style={styles.chipBlock}>
          <Chip
            style={styles.chip}
            icon={
              wasRead === Strings.metadataScreen.unread ? "check" : undefined
            }
            mode={
              wasRead === Strings.metadataScreen.unread ? "flat" : "outlined"
            }
            onPress={() => setWasRead(Strings.metadataScreen.unread)}
          >
            {Strings.metadataScreen.unread}
          </Chip>
          <Chip
            style={styles.chip}
            icon={wasRead === Strings.metadataScreen.read ? "check" : undefined}
            mode={wasRead === Strings.metadataScreen.read ? "flat" : "outlined"}
            onPress={() => setWasRead(Strings.metadataScreen.read)}
          >
            {Strings.metadataScreen.read}
          </Chip>
        </View>
      </View>
    );
  };

  const renderKindBlock = () => {
    return (
      <View style={styles.blocks}>
        <Text variant="titleMedium">{Strings.metadataScreen.bookKind}</Text>
        <View style={styles.chipBlock}>
          <Chip
            style={styles.chip}
            icon={kind === Strings.metadataScreen.manga ? "check" : undefined}
            mode={kind === Strings.metadataScreen.manga ? "flat" : "outlined"}
            onPress={() => setKind(Strings.metadataScreen.manga)}
          >
            {Strings.metadataScreen.manga}
          </Chip>
          <Chip
            style={styles.chip}
            icon={kind === Strings.metadataScreen.book ? "check" : undefined}
            mode={kind === Strings.metadataScreen.book ? "flat" : "outlined"}
            onPress={() => setKind(Strings.metadataScreen.book)}
          >
            {Strings.metadataScreen.book}
          </Chip>
          <Chip
            style={styles.chip}
            icon={kind === Strings.metadataScreen.comics ? "check" : undefined}
            mode={kind === Strings.metadataScreen.comics ? "flat" : "outlined"}
            onPress={() => setKind(Strings.metadataScreen.comics)}
          >
            {Strings.metadataScreen.comics}
          </Chip>
        </View>
      </View>
    );
  };

  const renderLocationBlock = () => {
    return (
      <View style={styles.blocks}>
        <Text variant="titleMedium">{Strings.metadataScreen.where}</Text>
        <View style={styles.chipBlock}>
          <Chip
            style={styles.chip}
            icon={
              location === Strings.metadataScreen.mothersHome
                ? "check"
                : undefined
            }
            mode={
              location === Strings.metadataScreen.mothersHome
                ? "flat"
                : "outlined"
            }
            onPress={() => setLocation(Strings.metadataScreen.mothersHome)}
          >
            {Strings.metadataScreen.mothersHome}
          </Chip>
          <Chip
            style={styles.chip}
            icon={
              location === Strings.metadataScreen.myHome ? "check" : undefined
            }
            mode={
              location === Strings.metadataScreen.myHome ? "flat" : "outlined"
            }
            onPress={() => setLocation(Strings.metadataScreen.myHome)}
          >
            {Strings.metadataScreen.myHome}
          </Chip>
        </View>
      </View>
    );
  };

  const renderCoverBlock = () => {
    return (
      <View style={styles.blocks}>
        <Text style={styles.smallMarginBottom} variant="titleMedium">
          {Strings.metadataScreen.coverArt}
        </Text>
        <View style={styles.chipBlock}>
          <Button
            icon={"upload"}
            mode="contained"
            style={styles.chip}
            onPress={handleImageUpload}
          >
            {Strings.metadataScreen.uploadCoverCTA}
          </Button>
          <Text
            style={styles.coverName}
            variant="bodyMedium"
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {uploadCoverName}
          </Text>
        </View>
      </View>
    );
  };

   const renderRatingBlock = () => {
    return (
      <View style={styles.blocks}>
        <Text variant="titleMedium">{Strings.metadataScreen.rating}</Text>
        <View style={styles.chipBlock}>

        </View>
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
          {renderCoverBlock()}
          

          <Text variant="titleLarge">
            {Strings.metadataScreen.opinionTitle}
          </Text>
          <Divider bold style={styles.largeMarginBottom} />

          {renderRatingBlock()}
          {renderReviewBlock()}

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
    width: "55%",
  },
});
