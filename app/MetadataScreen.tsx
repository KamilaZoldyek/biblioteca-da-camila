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
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { api } from "@/services/api";
import { storedThemeDataOrColorScheme } from "@/Storage/ThemeData";
import {
  GoogleBookItem,
  GoogleBooksListResponse,
  VolumeInfo,
} from "@/types/GoogleApiTypes";
import { BookWithCollection } from "@/types/SupabaseSchemaTypes";
import { BASE_IMG_URL, IMAGE_PLACEHOLDER } from "@/utils/util";
import { FileObject } from "@supabase/storage-js";
import { decode } from "base64-arraybuffer";
import * as FileSystem from "expo-file-system";
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

type BookFormData = {
  isbn: string;
  book_title: string;
  book_author: string;
  book_volume: string;
  book_publisher?: string;
  book_year?: string;
  book_synopsis?: string;
  book_reading_status?: string;
  book_kind?: string;
  book_location?: string;
  book_collection_status?: string;
  book_cover_url?: string;
  book_rating?: string;
  book_review?: string;
  collection_name: string;
};

export default function MetadataScreen() {
  const { user } = useAuth();

  const item = useLocalSearchParams<{ isbn: string }>();
  const name = useLocalSearchParams<{ name: string }>();
  const SCREEN_NAME = name.name;
  const ISBN = item.isbn;
  const isEditing = SCREEN_NAME === "Editar";

  const colorScheme = useColorScheme();
  const RATING_LIST = ["N/A", "1", "2", "3", "4", "5"];
  //TODO isso provavelmente vai virar um type, assim como os outros

  const [data, setData] = useState<GoogleBookItem[]>();
  const [bookInfo, setBookInfo] = useState<VolumeInfo>();
  const [hasGoogleImage, setHasGoogleImage] = useState(false);
  const [collectionId, setCollectionId] = useState("");

  const [hasReview, setHasReview] = useState(true);
  const [hasSynopsis, setHasSynopsis] = useState(true);

  const [uploadCoverName, setUploadCoverName] = useState<string | null>(null);

  const [theme, setTheme] = useState<"light" | "dark" | null>(null);
  const [showWebview, setShowWebview] = useState(false);
  const [showGoBackModal, setShowGoBackModal] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [imageFile, setImageFile] = useState<FileObject[]>([]);
  const [base64, setBase64] = useState("");
  const [filePath, setFilePath] = useState("");
  const [contentType, setContentType] = useState("");
  const [duplicatedISBNErrorModal, setDuplicatedISBNErrorModal] =
    useState(false);

  const { control, handleSubmit, formState, reset, setValue } =
    useForm<BookFormData>({
      mode: "onChange",
      defaultValues: {
        isbn: ISBN,
        book_title: "",
        book_author: "",
        book_volume: "1",
        book_publisher: "",
        book_year: "",
        book_synopsis: "",
        book_reading_status: "Não lido",
        book_kind: "Mangá",
        book_location: "Minha casa",
        book_collection_status: "Incompleta",
        book_cover_url: "",
        book_rating: "N/A",
        book_review: "",
        collection_name: "",
      },
    });

  //Typescript tá chorando porque a dependency array tá vazia,
  //mas É PRA FICAR VAZIA, só quero o loading aparecendo uma vez só, chora mais
  useEffect(() => {
    handleLoading();
  }, []);

  useEffect(() => {
    verifyDuplicate(ISBN);
  }, []);

  useEffect(() => {
    const loadFromAPI = async () => {
      if (!isEditing) {
        await api
          .get<GoogleBooksListResponse>("/volumes?q=isbn:" + ISBN) //TODO pelo amor de deus arruma isso
          .then((response) => {
            if (response.data) {
              setData(response.data.items);
              setBookInfo(response.data.items[0].volumeInfo);
            } else {
              console.log("F"); //press F to pay respect
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    };

    loadFromAPI();
  }, [ISBN, isEditing]);

  useEffect(() => {
    if (bookInfo) {
      reset({
        book_title: bookInfo.title,
        book_author: bookInfo.authors[0],
        book_publisher: bookInfo.publisher,
        book_synopsis: bookInfo.description,
        book_year: bookInfo.publishedDate,
      });
    }
  }, [bookInfo, reset]);

  useEffect(() => {
    if (bookInfo?.imageLinks?.thumbnail) {
      setHasGoogleImage(true);
      setUploadCoverName(bookInfo?.imageLinks?.thumbnail);
      setValue("book_cover_url", bookInfo?.imageLinks?.thumbnail, {
        shouldValidate: true,
      });
    } else if (bookInfo?.imageLinks?.large) {
      setHasGoogleImage(true);
      setUploadCoverName(bookInfo?.imageLinks?.large);
      setValue("book_cover_url", bookInfo?.imageLinks?.large, {
        shouldValidate: true,
      });
    }
  }, [bookInfo, setValue]);

  const delay = (milliseconds: number) =>
    new Promise((resolve) => setTimeout(resolve, milliseconds));

  const handleLoading = async () => {
    setShowLoading(true);
    await delay(3000);
    setShowLoading(false);
  };

  useEffect(() => {
    storedThemeDataOrColorScheme(colorScheme).then((mode) => {
      setTheme(mode);
    });
  }, [colorScheme, setTheme]);

  useFocusEffect(
    useCallback(() => {
      const backAction = () => {
        if (showWebview) {
          setShowWebview(false);
        } else {
          setShowGoBackModal(true);
        }
        return true;
      };

      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        backAction
      );

      return () => subscription.remove();
    }, [showWebview])
  );

  const handleImageUpload = async (type: string) => {
    let result;
    if (type === "upload") {
      result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [3, 5],
        quality: 1,
      });
    } else {
      result = await ImagePicker.launchCameraAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        // aspect: [3, 5],
        quality: 1,
        selectionLimit: 1,
      });
    }

    if (!result.canceled) {
      const image = result.assets[0];
      setUploadCoverName(image.uri); //add nome no state

      const imgBase64 = await FileSystem.readAsStringAsync(image.uri, {
        encoding: "base64",
      });
      setBase64(imgBase64);

      const imgFilePath = `${user!.id}/${new Date().getTime()}.png`;
      setFilePath(imgFilePath);

      setContentType("image/png");
    }
  };

  const customGoBack = () => {
    setShowGoBackModal(false);
    router.navigate("/HomeScreen");
  };

  const onISBNError = () => {
    setDuplicatedISBNErrorModal(false);
    router.replace("/HomeScreen");
  };

  const handleImageUploadToSupabase = async () => {
    try {
      const { data, error } = await supabase.storage
        .from("book-covers")
        .upload(filePath, decode(base64), { contentType });

      if (error) {
        console.log("F upload de imagem", error.message);
        return;
      }
    } catch (e) {
      console.log("F upload de imagem", e);
    }
  };

  const handleGetImageURLFromSupabase = () => {
    const { data } = supabase.storage
      .from("book-covers")
      .getPublicUrl(filePath);
    return data.publicUrl;
  };

  const getImgURLFromSupabase = async () => {
    if (filePath) {
      await handleImageUploadToSupabase();
      const imgURL = handleGetImageURLFromSupabase();
      setUploadCoverName(imgURL); //add nome no state

      return imgURL;
    }
    return IMAGE_PLACEHOLDER;
  };

  const verifyDuplicate = async (isbn: string) => {
    const { data, error } = await supabase
      .from("books")
      .select("isbn")
      .eq("user_id", user?.id)
      .eq("isbn", ISBN)
      .maybeSingle();

    if (error) {
      console.error("Erro ao verificar livro:", error);
    } else if (data) {
      setDuplicatedISBNErrorModal(true);
    }
    return;
  };

  const fetchBookWithCollection = async (isbn: string) => {
    const { data, error } = await supabase
      .from("books")
      .select(
        `
          isbn,
          book_title,
          book_author,
          book_volume,
          book_publisher,
          book_year,
          book_synopsis,
          book_reading_status,
          book_kind,
          book_location,
          book_collection_status,
          book_cover_url,
          book_rating,
          book_review,
          collection_id,
          collections ( collection_name )
        `
      )
      .eq("isbn", isbn)
      .single<BookWithCollection>();

    if (error) {
      console.error("Erro ao buscar livro:", error);
      return;
    } else {
      reset({
        collection_name: data.collections?.collection_name,
        book_title: data.book_title,
        book_author: data.book_author,
        book_volume: data.book_volume,
        book_publisher: data.book_publisher,
        book_synopsis: data.book_synopsis,
        book_year: data.book_year,
        book_reading_status: data.book_reading_status,
        book_kind: data.book_kind,
        book_location: data.book_location,
        book_collection_status: data.book_collection_status,
        book_cover_url: data.book_cover_url,
        book_rating: data.book_rating,
        book_review: data.book_review,
        isbn: data.isbn,
      });
      setUploadCoverName(data.book_cover_url);
      setCollectionId(data.collection_id || "");
      setHasSynopsis(data.book_synopsis !== "");
      setHasReview(data.book_review !== "");

      return;
    }
  };

  useEffect(() => {
    //efeito para EDIÇÃO
    if (!isEditing) {
      return;
    }

    fetchBookWithCollection(ISBN);
  }, [ISBN, isEditing]);

  const selectCoverSource = async () => {
    if (filePath) {
      const supabasePath = await getImgURLFromSupabase();
      return supabasePath;
    }

    if (uploadCoverName) return uploadCoverName;

    return IMAGE_PLACEHOLDER;
  };

  ///////////////

  const handleSave = async (formData: BookFormData) => {
    setShowLoading(true);

    const cover = await selectCoverSource();

    if (!isEditing) {
      const { error } = await supabase.rpc("create_book_with_collection", {
        p_isbn: formData.isbn,
        p_book_title: formData.book_title,
        p_book_author: formData.book_author,
        p_book_volume: formData.book_volume ?? "1",
        p_book_publisher: formData.book_publisher ?? "",
        p_book_year: formData.book_year ?? "",
        p_book_synopsis: formData.book_synopsis ?? "",
        p_book_reading_status: formData.book_reading_status ?? "",
        p_book_kind: formData.book_kind ?? "",
        p_book_location: formData.book_location ?? "",
        p_book_collection_status: formData.book_collection_status ?? "",
        p_book_cover_url: cover === BASE_IMG_URL ? IMAGE_PLACEHOLDER : cover,
        p_book_rating: formData.book_rating ?? "",
        p_book_review: formData.book_review ?? "",
        p_collection_name: formData.collection_name,
      });

      if (error) {
        setShowLoading(false);
        //TODO tratar erro de isbn duplicado
        setDuplicatedISBNErrorModal(true);
        console.error("Erro ao criar livro e coleção:", error);
        console.log("Erro ao criar livro e coleção:", error);
        return;
      }
    } else {
      const currentCollectionId = collectionId;
      const newCollectionName = formData.collection_name;

      let newCollectionId = currentCollectionId;

      if (newCollectionName) {
        const { data: existingCollection, error: findError } = await supabase
          .from("collections")
          .select("collection_id")
          .eq("collection_name", newCollectionName)
          .eq("user_id", user?.id)
          .maybeSingle();

        if (findError) {
          setShowLoading(false);
          console.log("F");
          return;
        }

        if (existingCollection) {
          newCollectionId = existingCollection.collection_id;
        } else {
          const { data: newCollection, error: insertError } = await supabase
            .from("collections")
            .insert({
              collection_name: newCollectionName,
              user_id: user?.id,
            })
            .select("collection_id")
            .single();

          if (insertError) {
            setShowLoading(false);
            console.error("Erro ao atualizar livro e coleção:", insertError);
            console.log("Erro ao atualizar livro e coleção:", insertError);
            return;
          }
          newCollectionId = newCollection.collection_id;
        }

        const { error: updateError } = await supabase
          .from("books")
          .update({
            book_title: formData.book_title,
            book_author: formData.book_author,
            book_publisher: formData.book_publisher,
            book_year: formData.book_year,
            book_synopsis: formData.book_synopsis,
            book_reading_status: formData.book_reading_status,
            book_kind: formData.book_kind,
            book_location: formData.book_location,
            book_collection_status: formData.book_collection_status,
            book_cover_url: cover,
            book_rating: formData.book_rating,
            book_review: formData.book_review,
            collection_id: newCollectionId,
          })
          .eq("isbn", ISBN)
          .eq("user_id", user?.id);

        if (updateError) {
          setShowLoading(false);
          console.error("Erro ao atualizar livro e coleção:", updateError);
          console.log("Erro ao atualizar livro e coleção:", updateError);
          return;
        }

        //apaga collection vazia
        if (currentCollectionId && currentCollectionId !== newCollectionId) {
          const { count } = await supabase
            .from("books")
            .select("*", { count: "exact", head: true })
            .eq("collection_id", currentCollectionId);

          if (count === 0) {
            await supabase
              .from("collections")
              .delete()
              .eq("collection_id", currentCollectionId);
          }
        }
      }
    }

    setShowLoading(false);

    router.dismissAll();
    router.replace("/HomeScreen");
  };

  const renderTitleBlock = () => {
    return (
      <Controller
        rules={{ required: Strings.metadataScreen.bookTitleHelper }}
        control={control}
        name={"book_title"}
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
        name={"collection_name"}
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
        rules={{ required: Strings.metadataScreen.collectionTitleHelper }}
        control={control}
        name={"book_author"}
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
        rules={{ required: Strings.metadataScreen.volumeTitleHelper }}
        name={"book_volume"}
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
        name={"book_publisher"}
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
        name={"book_year"}
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
        name={"book_synopsis"}
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
        name={"book_reading_status"}
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
        name={"book_kind"}
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
        name={"book_location"}
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
        name={"book_collection_status"}
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
        {/* {uploadCoverName && (
          <Text style={styles.coverName} variant="bodyMedium">
            {uploadCoverName}
          </Text>
        )} */}
        <View style={styles.chipBlock}>
          <View style={{ flexDirection: "column" }}>
            <Button
              icon={"upload"}
              mode="contained"
              style={styles.fixedChip}
              onPress={() => handleImageUpload("upload")}
            >
              {Strings.metadataScreen.uploadCoverCTA}
            </Button>
            <Button
              icon={"camera"}
              mode="contained"
              style={styles.fixedChip}
              onPress={() => handleImageUpload("camera")}
            >
              {Strings.metadataScreen.cameraCoverCTA}
            </Button>
          </View>

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
        name={"book_rating"}
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
        name={"book_review"}
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
      <Portal>
        <Dialog visible={duplicatedISBNErrorModal} onDismiss={onISBNError}>
          <Dialog.Icon icon="book-check" />
          <Dialog.Title style={{ alignSelf: "center" }}>
            {Strings.metadataScreen.isbnErrorModalTitle}
          </Dialog.Title>
          <Dialog.Content>
            <Text style={{ alignSelf: "center" }} variant="bodyMedium">
              {Strings.metadataScreen.isbnErrorModalDesc}
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={onISBNError}>{Strings.metadataScreen.ok}</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
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
  fixedChip: {
    alignSelf: "flex-start",
    marginVertical: Dimensions.padding.halfContainer,
    marginRight: Dimensions.padding.container,
    width: 150,
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
