import {
  Container,
  ISBNSearchButton,
  ISBNWebview,
  LoadingOverlay,
  TextblockWithTitle,
} from "@/components";
import { Colors, Dimensions, Strings } from "@/constants/";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { BookWithCollection } from "@/types/SupabaseSchemaTypes";
import { delay, IMAGE_PLACEHOLDER } from "@/utils/util";
import { Image } from "expo-image";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import * as React from "react";
import { useCallback, useEffect, useState } from "react";
import { BackHandler, ScrollView, StyleSheet, View } from "react-native";
import { Button, Chip, Dialog, Portal, Text } from "react-native-paper";

export default function BookScreen() {
  const { user } = useAuth();

  const item = useLocalSearchParams<{ isbn: string }>();
  const ISBN = item.isbn;

  const [visible, setVisible] = useState(false);
  const [showWebview, setShowWebview] = useState(false);
  const [book, setBook] = useState<BookWithCollection | null>(null);
  const [tags, setTags] = useState<string[]>([]);

  const [showLoading, setShowLoading] = useState(false);

  const onDismiss = useCallback(() => {
    setVisible(false);
  }, [setVisible]);

  const goToEditScreen = () => {
    router.push({
      pathname: "/MetadataScreen",
      params: { name: "Editar", isbn: ISBN },
    });
  };

  useEffect(() => {
    handleLoading();
  }, []);

  const handleLoading = async () => {
    setShowLoading(true);
    await delay(500);
    setShowLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      const backAction = () => {
        if (showWebview) {
          setShowWebview(false);
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

  const fetchBookWithCollection = async (
    isbn: string
  ): Promise<BookWithCollection> => {
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
      return null;
    } else {
      setBook(data);
      createTagList(data);
    }

    return data;
  };

  useEffect(() => {
    fetchBookWithCollection(ISBN);
  }, []);

  const createTagList = (book: BookMetadata) => {
    const tags = [
      book.book_reading_status,
      book.book_kind,
      book.book_location,
      "Coleção " + book.book_collection_status,
    ];
    setTags(tags);
    return tags;
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
          placeholder={IMAGE_PLACEHOLDER}
          source={book?.book_cover_url}
        />
        <View style={styles.metadataText}>
          <Text variant="headlineSmall">{book?.book_title}</Text>
          <Text style={{ paddingBottom: 16 }} variant="titleMedium">
            {book?.book_author}
          </Text>
          {/* Nome da coleção - nṹmero do volume */}
          <Text style={styles.text} variant="bodyLarge">
            {book?.collections?.collection_name} -{book?.book_volume}
          </Text>
          <Text style={styles.text} variant="bodyLarge">
            {Strings.metadataScreen.year}: {book?.book_year}
          </Text>
          <Text style={styles.text} variant="bodyLarge">
            {Strings.metadataScreen.isbn}: {ISBN}
          </Text>
          <Text style={styles.text} variant="bodyLarge">
            {Strings.metadataScreen.publisher}: {book?.book_publisher}
          </Text>
          <Chip
            style={{ alignSelf: "flex-start" }}
            icon={"star"}
            mode="outlined"
          >
            <Text variant="bodyLarge">{book?.book_rating}</Text>
          </Chip>
        </View>
      </View>
    );
  };

  const renderTags = () => {
    return tags?.map((item, index) => {
      return (
        <Chip key={index} style={styles.chip} mode={"flat"}>
          {item}
        </Chip>
      );
    });
  };

  const deleteBook = async () => {
    const { error } = await supabase
      .from("books")
      .delete()
      .match({ isbn: ISBN, user_id: user?.id });

    if (error) {
      console.error("Erro ao apagar livro:", error);
    } else {
      console.log("Livro apagado");
      router.replace("/HomeScreen");
    }
  };

  return (
    <>
      {showLoading && (
        <View style={styles.loadingContainer}>
          <LoadingOverlay />
        </View>
      )}
      {!showWebview && !showLoading && (
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

            <TextblockWithTitle //SYNOPSIS
              customStyle={{ paddingBottom: Dimensions.padding.divider }}
              chipText={
                book?.book_synopsis === ""
                  ? Strings.metadataScreen.noSynopsis
                  : undefined
              }
              title={Strings.metadataScreen.synopsis}
              text={book?.book_synopsis}
            />

            <TextblockWithTitle //REVIEW
              customStyle={{ paddingBottom: 50 }}
              text={book?.book_review}
              title={Strings.metadataScreen.review}
              chipText={
                book?.book_review === ""
                  ? Strings.metadataScreen.noReview
                  : undefined
              }
            />
            <ISBNSearchButton onPress={() => setShowWebview(true)} />
            <View style={{ padding: 30 }} />
          </ScrollView>
        </Container>
      )}
      {showWebview && <ISBNWebview isbn={ISBN} />}
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
              <Button onPress={deleteBook}>{Strings.bookScreen.delete}</Button>
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
    flexShrink: 1,
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
