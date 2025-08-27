import { Container, TagList } from "@/components";
import BookDisplayListItem from "@/components/BookDisplayListItem/BookDisplayListItem";
import { Dimensions, Strings } from "@/constants/";
import {
  BookList,
  getCollectionsFromBookList,
  mockBookList,
} from "@/constants/mocks";
import { router } from "expo-router";
import * as React from "react";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import {
  AnimatedFAB,
  Chip,
  Divider,
  Searchbar,
  Text,
} from "react-native-paper";
import { FlatGrid, SectionGrid } from "react-native-super-grid";

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [shouldShowResult, setShouldShowResult] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showCollections, setShowCollections] = useState(false);
  const [forceClear, setForceClear] = useState(false);
  const [isExtended, setIsExtended] = useState(true);

  const collections = getCollectionsFromBookList(mockBookList);

  const handleConfigScreen = () => {
    router.navigate("/ConfigsScreen");
  };
  const handleAboutScreen = () => {
    router.navigate("/AboutScreen");
  };

  const handleSearch = (query: string) => {
    setSelectedTag("");
    setShouldShowResult(true);
    setSearchQuery(query);
    if (query === "") {
      setShouldShowResult(false);
    }
  };

  const findItem = () => {
    const result: BookList = [];
    mockBookList.map((item) => {
      if (
        item.title
          .toLocaleLowerCase()
          .includes(searchQuery.toLocaleLowerCase()) ||
        item.author
          .toLocaleLowerCase()
          .includes(searchQuery.toLocaleLowerCase()) ||
        item.collection
          .toLocaleLowerCase()
          .includes(searchQuery.toLocaleLowerCase())
      ) {
        result.push(item);
      }
    });
    return result;
  };

  const findAllBooksByTag = (tag: string) => {
    const result: BookList = [];
    mockBookList.map((item) => {
      item.tags.map((i) => {
        if (i === tag) {
          result.push(item);
        }
      });
    });

    return result;
  };

  const whatDatabaseToUse = () => {
    if (shouldShowResult) {
      return findItem();
    } else if (selectedTag !== "") {
      return findAllBooksByTag(selectedTag);
    }

    return mockBookList;
  };

  const handleSelectedTag = (tag: string) => {
    setSelectedTag(tag);
    setShowCollections(false);
  };

  useEffect(() => {
    if (showCollections) {
      setSelectedTag("");
      setForceClear(true);
    }
  }, [showCollections]);

  const handleFAB = ({ nativeEvent }) => {
    const currentScrollPosition =
      Math.floor(nativeEvent?.contentOffset?.y) ?? 0;

    setIsExtended(currentScrollPosition <= 0);
  };

  const onFABPress = () => {
    router.navigate("/CameraScreen");
  };

  const collectionChipMode = showCollections && selectedTag === "";

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
            onScroll={handleFAB}
            itemDimension={130}
            sections={collections}
            renderItem={({ item }) => (
              <View style={styles.booksSectionList}>
                <BookDisplayListItem
                  title={item.title}
                  author={item.author}
                  volume={item.volume}
                />
              </View>
            )}
            renderSectionHeader={({ section: { collectionName } }) => (
              <View style={styles.collectionHeader}>
                <Text variant="titleLarge">{collectionName}</Text>
                <Divider bold />
              </View>
            )}
          />
        ) : (
          <FlatGrid
            itemDimension={130}
            showsVerticalScrollIndicator={false}
            onScroll={handleFAB}
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
        )}

        <AnimatedFAB
          icon={"plus"}
          label={Strings.homeScreen.fabAdd}
          extended={isExtended}
          onPress={onFABPress}
          visible={true}
          style={[styles.fabStyle]}
        />

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
});
