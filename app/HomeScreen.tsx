import { Container } from "@/components";
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
import { Searchbar, Text } from "react-native-paper";

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [shouldShowResult, setShouldShowResult] = useState(false);

  const collections = getCollectionsFromBookList(mockBookList);

  const handleConfigScreen = () => {
    console.log(collections);
    router.navigate("/ConfigsScreen");
  };
  const handleAboutScreen = () => {
    router.navigate("/AboutScreen");
  };

  const handleSearch = (query: string) => {
    query = query.trim();
    setShouldShowResult(true);
    setSearchQuery(query);
    if(query === ''){
      setShouldShowResult(false);
    }
  };

  const findItem = () => {
    const result: BookList = [];
    mockBookList.map((item) => {
      if (
        item.title.includes(searchQuery) ||
        item.author.includes(searchQuery) ||
        item.collection.includes(searchQuery)
      ) {
        result.push(item);
      }
    });
    return result;
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
            placeholder={Strings.homeScreen.search}
          />
        </View>

        {shouldShowResult && (
          <Text variant="bodySmall" style={styles.headerTitle}>
            Resultados de busca para: {searchQuery}
          </Text>
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
        <FlatList
          data={shouldShowResult === true ? findItem() : mockBookList}
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
});
