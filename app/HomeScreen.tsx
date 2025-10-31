import { Container, TagList } from "@/components";
import BookDisplayListItem from "@/components/BookDisplayListItem/BookDisplayListItem";
import { Colors, Dimensions, Strings } from "@/constants/";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { BookList, CollectionList } from "@/types/SupabaseSchemaTypes";
import { registerForPushNotificationsAsync } from "@/utils/notifications";
import { router, useFocusEffect } from "expo-router";
import { getFirestore } from "firebase/firestore";
import * as React from "react";
import { useCallback, useEffect, useState } from "react";
import {
  BackHandler,
  FlatList,
  StyleSheet,
  ToastAndroid,
  View,
} from "react-native";
import { firebaseApp } from "./firebaseConfig";

import { useIsFocused } from "@react-navigation/native";
import {
  Button,
  Chip,
  Dialog,
  Divider,
  FAB,
  Portal,
  Searchbar,
  Text,
  TextInput,
} from "react-native-paper";
import { SectionGrid } from "react-native-super-grid";

export default function HomeScreen() {
  const { user } = useAuth();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [shouldShowResult, setShouldShowResult] = useState(false);
  const [showCollections, setShowCollections] = useState(false);
  const [forceClear, setForceClear] = useState(false);
  const [isExtended, setIsExtended] = useState(true);
  const [sections, setSections] = useState<
    { title: string; data: BookList[] }[]
  >([]);
  const [allBooks, setAllBooks] = useState<BookList[]>([]);
  const [state, setState] = React.useState({ open: false });
  const onStateChange = ({ open }) => setState({ open });
  const { open } = state;
  const [manualISBNVisible, setManualISBNVisible] = useState(false);
  const [insertedISBNValue, setInsertedISBNValue] = useState("");
  const [isTextInputFocused, setIsTextInputFocused] = useState(false);

  const db = getFirestore(firebaseApp);
  const isFocused = useIsFocused();

  useEffect(() => {
    async function setupPush() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) await registerForPushNotificationsAsync(user.id);
    }
    setupPush();
  }, []);

  useEffect(() => {
    const fetchCollectionsWithBooks = async () => {
      const { data, error } = await supabase
        .from("collections")
        .select(
          `
          collection_id,
          collection_name,
          books (
            isbn,
            book_title,
            book_author,
            book_cover_url,
            book_volume
          )
        `
        )
        .eq("user_id", user?.id);

      if (error) {
        ToastAndroid.show("Erro ao buscar coleções", ToastAndroid.LONG);
        console.log(error);
        console.error("Erro ao buscar coleções:", error);

        return;
      }

      if (data) {
        const mapped = data.map((coll: CollectionList) => ({
          title: coll.collection_name,
          data: coll.books ?? [],
        }));

        const sortedMapped = mapped.map((section) => ({
          ...section,
          data: [...section.data].sort(
            (a, b) => Number(a.book_volume) - Number(b.book_volume)
          ),
        }));

        setSections(sortedMapped);
      }
    };

    fetchCollectionsWithBooks();
  }, [user?.id]);

  useEffect(() => {
    const fetchAllBooks = async () => {
      const { data, error } = await supabase.rpc("get_user_books", {
        uid: user?.id,
      });
      if (error) {
        console.error(error);
        return;
      }

      const formattedBooks = data.map((book) => {
        ///
        const tags = [
          book.book_reading_status,
          book.book_kind,
          book.book_location,
          book.book_collection_status,
        ].filter(Boolean);

        return {
          ...book,
          book_tags: tags,
        };
      });

      setAllBooks(formattedBooks);
    };

    fetchAllBooks();
  }, [user?.id]);

  const handleConfigScreen = () => {
    router.navigate("/ConfigsScreen");
  };
  const handleAboutScreen = () => {
    router.navigate("/AboutScreen");
  };

  const handleSearch = (query: string) => {
    setSelectedTag("");
    setShouldShowResult(true);
    setShowCollections(false);
    setSearchQuery(query);
    if (query === "") {
      setShouldShowResult(false);
    }
  };

  const findItem = () => {
    const result: BookList[] = [];
    allBooks.map((item) => {
      if (
        item.book_title
          .toLocaleLowerCase()
          .includes(searchQuery.toLocaleLowerCase()) ||
        item.book_author
          .toLocaleLowerCase()
          .includes(searchQuery.toLocaleLowerCase()) ||
        item.collection_name
          .toLocaleLowerCase()
          .includes(searchQuery.toLocaleLowerCase())
      ) {
        result.push(item);
      }
    });
    return result;
  };

  const findAllBooksByTag = (tag: string) => {
    const result: BookList[] = [];
    allBooks.map((item) => {
      if (item.book_tags) {
        item.book_tags.map((i) => {
          if (i === tag) {
            result.push(item);
          }
        });
      }
      return "";
    });

    return result;
  };

  const whatDatabaseToUse = React.useCallback(() => {
    if (shouldShowResult) return findItem();
    if (selectedTag === "") return allBooks;
    return findAllBooksByTag(selectedTag);
  }, [shouldShowResult, selectedTag, allBooks, findItem]);

  const handleSelectedTag = (tag: string) => {
    setSelectedTag(tag);
    setShowCollections(false);
    setShouldShowResult(false);
    setSearchQuery("");
  };

  useEffect(() => {
    if (showCollections) {
      setSelectedTag("");
      setForceClear(true);
    }
  }, [showCollections]);

  useFocusEffect(
    useCallback(() => {
      const backAction = () => {
        BackHandler.exitApp();
        return true;
      };

      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        backAction
      );

      return () => subscription.remove();
    }, [])
  );

  const onChangeManualISBN = (text: string) => {
    const noSpecialCharacters = text.replace(/[.\-]/g, "");
    setInsertedISBNValue(noSpecialCharacters);
  };

  const handleFAB = ({ nativeEvent }) => {
    const currentScrollPosition =
      Math.floor(nativeEvent?.contentOffset?.y) ?? 0;

    setIsExtended(currentScrollPosition <= 0);
  };

  const onFABPress = () => {
    router.navigate("/CameraScreen");
  };

  const collectionChipMode = showCollections && selectedTag === "";

  const renderEmptyComponent = () => {
    return (
      <View style={styles.emptyList}>
        <Text
          style={{ color: Colors.dark.onSurfaceDisabled }}
          variant="titleLarge"
        >
          {Strings.homeScreen.emptyList}
        </Text>
      </View>
    );
  };

  const onPressBook = (isbnCode: string) => {
    router.push({ pathname: "/BookScreen", params: { isbn: isbnCode } });
  };

  const onManualSearch = () => {
    setManualISBNVisible(false);
    if (insertedISBNValue.length === 10 || insertedISBNValue.length === 13) {
      router.push({
        pathname: "/MetadataScreen",
        params: { isbn: insertedISBNValue },
      });
    }
  };

  const manualISBNError = !(
    insertedISBNValue.length === 10 || insertedISBNValue.length === 13
  );

  const clearManualISBN = () => {
    setIsTextInputFocused(false);
    setInsertedISBNValue("");
    setManualISBNVisible(false);
  };

  return (
    <>
      {/* DEIXE o title vazio para alinhar os ícones a direita! */}
      <Container
        title={""}
        iconLeft="cog"
        iconRight="information"
        onPressIconLeft={handleConfigScreen}
        onPressIconRight={handleAboutScreen}
      >
        <View style={styles.headerContainer}>
          <Text variant="displaySmall" style={styles.headerTitle}>
            {Strings.homeScreen.hello}
          </Text>
          <Searchbar
            onChangeText={handleSearch}
            value={searchQuery}
            placeholder={Strings.homeScreen.searchPlaceholder}
          />
        </View>

        {shouldShowResult && (
          <Text variant="bodySmall" style={styles.headerTitle}>
            {Strings.homeScreen.searchResultText}
            {searchQuery}
          </Text>
        )}
        <View style={styles.tags}>
          <Chip
            style={styles.collectionChip}
            onPress={() => setShowCollections(!showCollections)}
            selected={collectionChipMode}
            mode={collectionChipMode ? "flat" : "outlined"}
          >
            <Text variant="labelLarge">{Strings.homeScreen.collections}</Text>
          </Chip>
          <TagList
            onPress={(tag) => {
              handleSelectedTag(tag);
              setForceClear(false);
            }}
            clearSelection={forceClear}
          />
        </View>

        {showCollections ? (
          <SectionGrid
            contentContainerStyle={styles.flatgrid}
            showsVerticalScrollIndicator={false}
            onScroll={handleFAB}
            sections={sections}
            renderItem={({ item }) => (
              <View style={styles.booksSectionList}>
                <BookDisplayListItem
                  title={item.book_title}
                  author={item.book_author}
                  volume={item.book_volume}
                  onPress={(isbnCode) => onPressBook(isbnCode)}
                  isbn={item.isbn}
                  image={item.book_cover_url}
                />
              </View>
            )}
            renderSectionHeader={({ section: { title } }) => (
              <View style={styles.collectionHeader}>
                <Text variant="titleLarge">{title}</Text>
                <Divider bold />
              </View>
            )}
          />
        ) : (
          <FlatList
            data={whatDatabaseToUse()}
            numColumns={2}
            onScroll={handleFAB}
            contentContainerStyle={styles.flatgrid}
            ListEmptyComponent={renderEmptyComponent}
            showsVerticalScrollIndicator={false}
            extraData={[shouldShowResult, selectedTag, allBooks.length]}
            renderItem={({ item }) => (
              <View style={styles.books}>
                <BookDisplayListItem
                  title={item.book_title}
                  author={item.book_author}
                  volume={item.book_volume}
                  onPress={(isbnCode) => onPressBook(isbnCode)}
                  isbn={item.isbn}
                  image={item.book_cover_url}
                />
              </View>
            )}
          />

          // <FlatGrid
          //   contentContainerStyle={styles.flatgrid}
          //   keyExtractor={(item) => item.isbn}
          //   ListEmptyComponent={renderEmptyComponent}
          //   itemDimension={130}
          //   showsVerticalScrollIndicator={false}
          //   onScroll={handleFAB}
          //   data={whatDatabaseToUse()}
          //   extraData={[shouldShowResult, selectedTag, allBooks.length]}
          //   numColumns={2}
          //   renderItem={({ item }) => (
          //     <View style={styles.books}>
          //       <BookDisplayListItem
          //         title={item.book_title}
          //         author={item.book_author}
          //         volume={item.book_volume}
          //         onPress={(isbnCode) => onPressBook(isbnCode)}
          //         isbn={item.isbn}
          //         image={item.book_cover_url}
          //       />
          //     </View>
          //   )}
          // />
        )}

        {/* <AnimatedFAB
          icon={"plus"}
          label={Strings.homeScreen.fabAdd}
          extended={isExtended}
          onPress={onFABPress}
          visible={true}
          style={[styles.fabStyle]}
        /> */}

        {isFocused && (
          <Portal>
            <FAB.Group
              open={open}
              visible
              icon={open ? "book-plus" : "plus"}
              actions={[
                {
                  icon: "pencil",
                  label: Strings.homeScreen.addISBNManually,
                  onPress: () => setManualISBNVisible(true),
                },
                {
                  icon: "barcode",
                  label: Strings.homeScreen.addISBNScan,
                  onPress: onFABPress,
                },
              ]}
              onStateChange={onStateChange}
            />
          </Portal>
        )}

        {/* <SectionList
          stickyHeaderHiddenOnScroll
          sections={collections}
          renderItem={({ item }) => (
            <BookDisplayListItem
              title={item.title}
              author={item.author}
              volume={item.volume}
            />
          )}
          renderSectionHeader={({ section: { collectionName } }) => (
            <Text variant="titleLarge">{collectionName}</Text>
          )}
        /> */}

        {/* {isLoading ? (
          //TODO: se vira e arruma o loading, tá zoado
          <ActivityIndicator animating={true} />
        ) : (
          <FlatList
            data={whatDatabaseToUse()}
            numColumns={2}
            renderItem={({ item }) => (
              <View style={styles.books}>
                <BookDisplayListItem
                  title={item.title}
                  author={item.author}
                  volume={item.volume}
                />
              </View>
            )}
          />
        )} */}
      </Container>
      <Portal>
        <Dialog
          style={styles.manualISBNTextInput}
          visible={manualISBNVisible}
          onDismiss={clearManualISBN}
        >
          <Dialog.Icon icon="book-plus" />
          <Dialog.Title style={{ textAlign: "center" }}>
            {Strings.homeScreen.manualISBNTitle}
          </Dialog.Title>
          <Dialog.Content>
            <Text style={{ paddingVertical: 16 }} variant="bodyMedium">
              {Strings.homeScreen.manualISBNDescription}
            </Text>
            <TextInput
              onFocus={() => setIsTextInputFocused(true)}
              onBlur={clearManualISBN}
              mode="outlined"
              maxLength={13}
              error={manualISBNError && isTextInputFocused}
              keyboardType="numeric"
              label={Strings.homeScreen.manualISBNPlaceholder}
              value={insertedISBNValue}
              onChangeText={onChangeManualISBN}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={clearManualISBN}>
              {Strings.homeScreen.manualISBNCancel}
            </Button>
            <Button onPress={onManualSearch}>
              {Strings.homeScreen.manualISBNSearch}
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
}

const styles = StyleSheet.create({
  headerTitle: {
    alignItems: "flex-start",
    paddingBottom: Dimensions.padding.halfContainer,
  },
  headerContainer: {
    paddingBottom: Dimensions.padding.container,
  },
  books: {
    paddingHorizontal: Dimensions.padding.flatListItems,
  },
  tags: {
    paddingVertical: Dimensions.padding.halfContainer,
    flexDirection: "row",
  },
  collectionChip: {
    margin: 3,
  },
  collectionHeader: {
    paddingTop: Dimensions.padding.container,
    paddingHorizontal: Dimensions.padding.halfContainer,
  },
  booksSectionList: {
    paddingHorizontal: Dimensions.padding.halfContainer,
  },
  fabStyle: {
    bottom: 50,
    right: 25,
    position: "absolute",
  },
  emptyList: {
    justifyContent: "center",
    alignItems: "center",
    paddingTop: Dimensions.margin.divider,
  },
  flatgrid: {
    paddingBottom: 150,
  },
  manualISBNTextInput: {
    backgroundColor: Colors.dark.background,
  },
});
