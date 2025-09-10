import {
  ChipsWithTitle,
  Container,
  CustomCard,
  ISBNSearchButton,
  ISBNWebview,
  LoadingOverlay,
  LongButton,
} from "@/components";
import { Colors, Dimensions, Strings } from "@/constants/";
import { api } from "@/services/api";
import { storedThemeDataOrColorScheme } from "@/Storage/ThemeData";
import {
  GoogleBookItem,
  GoogleBooksListResponse,
  VolumeInfo,
} from "@/types/GoogleApiTypes";
import * as ImagePicker from "expo-image-picker";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import * as React from "react";
import { useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  BackHandler,
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

export default function MetadataScreen() {
  const item = useLocalSearchParams<{ isbn: string }>();
  const name = useLocalSearchParams<{ name: string }>();
  const SCREEN_NAME = name.name;
  const ISBN = item.isbn;
  const colorScheme = useColorScheme();
  const RATING_LIST = ["N/A", "1", "2", "3", "4", "5"];
  //TODO isso provavelmente vai virar um type, assim como os outros

  const [data, setData] = useState<GoogleBookItem[]>();
  const [bookInfo, setBookInfo] = useState<VolumeInfo>();

  const [hasReview, setHasReview] = useState(true);
  const [hasSynopsis, setHasSynopsis] = useState(true);

  const [uploadCoverName, setUploadCoverName] = useState<string | null>(null);

  const [theme, setTheme] = useState<"light" | "dark" | null>(null);
  const [showWebview, setShowWebview] = useState(false);
  const [showGoBackModal, setShowGoBackModal] = useState(false);
  const [showLoading, setShowLoading] = useState(false);

  const { control, handleSubmit, formState, reset } = useForm({
    mode: "onChange",
    defaultValues: {
      bookTitle: "",
      collectionTitle: "",
      author: "",
      volume: "",
      isbn: ISBN,
      publisher: "",
      synopsis: "",
      year: "",
      review: "",
      readingStatus: "Não lido",
      kind: "Mangá",
      location: "Minha casa",
      collectionStatus: "Incompleta",
      rating: "N/A",
    },
  });

  useEffect(() => {
    if (bookInfo) {
      reset({
        bookTitle: bookInfo.title,
        author: bookInfo.authors[0],
        publisher: bookInfo.publisher,
        synopsis: bookInfo.description,
        year: bookInfo.publishedDate,
      });
    }
  }, [bookInfo, reset]);

  useEffect(() => {
    if (bookInfo?.imageLinks?.thumbnail) {
      setUploadCoverName(bookInfo?.imageLinks?.thumbnail);
    } else if (bookInfo?.imageLinks?.large) {
      setUploadCoverName(bookInfo?.imageLinks?.large);
    }
  }, [bookInfo]);

  const delay = (milliseconds: number) =>
    new Promise((resolve) => setTimeout(resolve, milliseconds));

  const handleLoading = async () => {
    setShowLoading(true);
    await delay(3000);
    setShowLoading(false);
  };

  //Typescript tá chorando porque a dependency array tá vazia,
  //mas É PRA FICAR VAZIA, só quero o loading aparecendo uma vez só, chora mais
  useEffect(() => {
    handleLoading();
  }, []);

  useEffect(() => {
    const loadFromAPI = async () => {
      await api
        .get<GoogleBooksListResponse>("/volumes?q=isbn:" + ISBN) //TODO pelo amor de deus arruma isso
        .then((response) => {
          if (response.data) {
            console.log("response.data.items", response.data.items);
            setData(response.data.items);
            setBookInfo(response.data.items[0].volumeInfo);
          } else {
            console.log("F"); //press F to pay respect
          }
        })
        .catch((error) => {
          console.log(error);
        });
    };

    loadFromAPI();
  }, [ISBN]);

  useEffect(() => {
    storedThemeDataOrColorScheme(colorScheme).then((mode) => {
      setTheme(mode);
    });
  }, [colorScheme, setTheme]);

  useFocusEffect(
    useCallback(() => {
      const backAction = () => {
        setShowGoBackModal(true);
        return true;
      };

      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        backAction
      );

      return () => subscription.remove();
    }, [])
  );

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

  const handleSave = (data: any) => {
    console.log(data);
    // TODO adicionar a URL da capa aqui no data
  };

  const renderTitleBlock = () => {
    return (
      <Controller
        rules={{ required: Strings.metadataScreen.bookTitleHelper }}
        control={control}
        name={"bookTitle"}
        render={({ field: { onChange, value } }) => (
          <View style={styles.textInputs}>
            <TextInput
              label={Strings.metadataScreen.bookTitle}
              value={value}
              onChangeText={onChange}
              mode="outlined"
              error={value === ""}
            />
            <HelperText style={styles.textInputs} type={"info"} visible={true}>
              {Strings.metadataScreen.bookTitleHelper}
            </HelperText>
          </View>
        )}
      />
    );
  };

  const renderCollectionBlock = () => {
    return (
      <Controller
        rules={{ required: Strings.metadataScreen.collectionTitleHelper }}
        control={control}
        name={"collectionTitle"}
        render={({ field: { onChange, value } }) => (
          <View style={styles.textInputs}>
            <TextInput
              label={Strings.metadataScreen.collectionTitle}
              value={value}
              onChangeText={onChange}
              mode="outlined"
              error={value === ""}
            />
            <HelperText style={styles.textInputs} type={"info"} visible={true}>
              {Strings.metadataScreen.collectionTitleHelper}
            </HelperText>
          </View>
        )}
      />
    );
  };

  const renderAuthorBlock = () => {
    return (
      <Controller
        control={control}
        name={"author"}
        render={({ field: { onChange, value } }) => (
          <View style={styles.textInputs}>
            <TextInput
              label={Strings.metadataScreen.author}
              value={value}
              onChangeText={onChange}
              mode="outlined"
            />
            <HelperText style={styles.textInputs} type={"info"} visible={true}>
              {Strings.metadataScreen.authorHelper}
            </HelperText>
          </View>
        )}
      />
    );
  };

  const renderVolumeBlock = () => {
    return (
      <Controller
        control={control}
        name={"volume"}
        render={({ field: { onChange, value } }) => (
          <View style={styles.textInputs}>
            <TextInput
              label={Strings.metadataScreen.volume}
              value={value.toString()}
              keyboardType="numeric"
              onChangeText={onChange}
              mode="outlined"
            />
            <HelperText style={styles.textInputs} type={"info"} visible={true}>
              {Strings.metadataScreen.volumeHelper}
            </HelperText>
          </View>
        )}
      />
    );
  };

  const renderISBNBlock = () => {
    return (
      <Controller
        control={control}
        name={"isbn"}
        render={({ field: { onChange, value } }) => (
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
        )}
      />
    );
  };

  const renderPublisherBlock = () => {
    return (
      <Controller
        control={control}
        name={"publisher"}
        render={({ field: { onChange, value } }) => (
          <View style={styles.textInputs}>
            <TextInput
              style={styles.mediumMarginBottom}
              label={Strings.metadataScreen.publisher}
              value={value}
              onChangeText={onChange}
              mode="outlined"
            />
          </View>
        )}
      />
    );
  };

  const renderYearBlock = () => {
    return (
      <Controller
        control={control}
        name={"year"}
        render={({ field: { onChange, value } }) => (
          <View style={styles.textInputs}>
            <TextInput
              label={Strings.metadataScreen.year}
              value={value}
              onChangeText={onChange}
              mode="outlined"
            />
          </View>
        )}
      />
    );
  };

  const renderSynopsisBlock = () => {
    return (
      <Controller
        control={control}
        name={"synopsis"}
        render={({ field: { onChange, value } }) => (
          <View style={styles.blocks}>
            <Text variant="titleMedium">{Strings.metadataScreen.synopsis}</Text>
            <Chip
              style={styles.chip}
              icon={!hasSynopsis ? "check" : undefined}
              mode={!hasSynopsis ? "flat" : "outlined"}
              onPress={() => setHasSynopsis(!hasSynopsis)}
              disabled={value !== ""}
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
              value={value}
              onChangeText={onChange}
              mode="outlined"
              multiline
            />
          </View>
        )}
      />
    );
  };

  const renderReadingStatusBlock = () => {
    return (
      <Controller
        control={control}
        name={"readingStatus"}
        render={({ field: { onChange, value } }) => (
          <View style={styles.blocks}>
            <ChipsWithTitle
              onPress={onChange}
              data={["Não lido", "Lido"]}
              title={Strings.metadataScreen.readingStatus}
              defaultValue={value}
            />
          </View>
        )}
      />
    );
  };

  const renderKindBlock = () => {
    return (
      <Controller
        control={control}
        name={"kind"}
        render={({ field: { onChange, value } }) => (
          <View style={styles.blocks}>
            <ChipsWithTitle
              onPress={onChange}
              data={["Mangá", "Livro", "HQ"]}
              title={Strings.metadataScreen.bookKind}
              defaultValue={value}
            />
          </View>
        )}
      />
    );
  };

  const renderLocationBlock = () => {
    return (
      <Controller
        control={control}
        name={"location"}
        render={({ field: { onChange, value } }) => (
          <View style={styles.blocks}>
            <ChipsWithTitle
              onPress={onChange}
              data={["Casa de mãe", "Minha casa"]}
              title={Strings.metadataScreen.where}
              defaultValue={value}
            />
          </View>
        )}
      />
    );
  };

  const collectionStatusBlock = () => {
    return (
      <Controller
        control={control}
        name={"collectionStatus"}
        render={({ field: { onChange, value } }) => (
          <View style={styles.blocks}>
            <ChipsWithTitle
              onPress={onChange}
              data={["Incompleta", "Completa"]}
              title={Strings.metadataScreen.collectionStatus}
              defaultValue={value}
            />
          </View>
        )}
      />
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
      <Controller
        control={control}
        name={"rating"}
        render={({ field: { onChange, value } }) => (
          <View style={styles.blocks}>
            <View style={styles.chipBlock}></View>
            <ChipsWithTitle
              onPress={onChange}
              data={RATING_LIST}
              isRating
              title={Strings.metadataScreen.rating}
              defaultValue={value}
            />
          </View>
        )}
      />
    );
  };

  const renderReviewBlock = () => {
    return (
      <Controller
        control={control}
        name={"review"}
        render={({ field: { onChange, value } }) => (
          <View style={styles.blocks}>
            <Text variant="titleMedium">{Strings.metadataScreen.review}</Text>
            <Chip
              style={styles.chip}
              icon={!hasReview ? "check" : undefined}
              mode={!hasReview ? "flat" : "outlined"}
              onPress={() => setHasReview(!hasReview)}
              disabled={value !== ""}
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
              value={value}
              onChangeText={onChange}
              mode="outlined"
              multiline
            />
          </View>
        )}
      />
    );
  };

  return (
    <>
      {!showWebview && (
        <Container
          title={
            SCREEN_NAME ? SCREEN_NAME : Strings.metadataScreen.titleNewBook
          }
          showGoBack
          customGoBack={() => setShowGoBackModal(true)}
        >
          <KeyboardAvoidingView
            behavior="padding"
            keyboardVerticalOffset={Platform.select({ ios: 64, android: 120 })}
          >
            <ScrollView showsVerticalScrollIndicator={false}>
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

              <CustomCard
                title={Strings.metadataScreen.manualScrapingTitle}
                subtitle={Strings.metadataScreen.manualScrapingDescription}
                iconName={"information"}
                theme={theme}
              />

              <View style={styles.chipBlock}>
                <ISBNSearchButton onPress={() => setShowWebview(true)} />
              </View>

              <View style={{ paddingBottom: 50 }} />

              <Text variant="titleLarge">
                {Strings.metadataScreen.opinionTitle}
              </Text>
              <Divider bold style={styles.largeMarginBottom} />

              {renderRatingBlock()}
              {renderReviewBlock()}
              <View style={{ paddingBottom: 120 }} />

              <LongButton
                text={Strings.metadataScreen.save}
                onPress={handleSubmit(handleSave)}
                theme={theme}
                disabled={!formState.isValid}
              />
              <View style={{ padding: 20 }} />
            </ScrollView>
          </KeyboardAvoidingView>
        </Container>
      )}
      {showLoading && (
        <View style={styles.loadingContainer}>
          <LoadingOverlay />
        </View>
      )}
      {showWebview && <ISBNWebview isbn={ISBN} />}
      {showGoBackModal && (
        <Portal>
          <Dialog
            dismissableBackButton
            visible={showGoBackModal}
            onDismiss={() => setShowGoBackModal(false)}
          >
            <Dialog.Icon icon="alert" />
            <Dialog.Title style={{ alignSelf: "center" }}>
              {Strings.metadataScreen.modalTitle}
            </Dialog.Title>
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
  loadingContainer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: "center",
    backgroundColor: Colors.dark.background,
  },
});
