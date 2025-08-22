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
import { useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { ActivityIndicator, Searchbar, Text } from "react-native-paper";

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [shouldShowResult, setShouldShowResult] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
          <TagList onPress={(tag) => setSelectedTag(tag)} />
        </View>

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

        {isLoading ? (
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
        )}
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
  },
});
