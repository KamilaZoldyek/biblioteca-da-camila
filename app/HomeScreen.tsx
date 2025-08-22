import { Container } from "@/components";
import BookDisplayListItem from "@/components/BookDisplayListItem/BookDisplayListItem";
import { Dimensions, Strings } from "@/constants/";
import { getCollectionsFromBookList, mockBookList } from "@/constants/mocks";
import { router } from "expo-router";
import * as React from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { Searchbar, Text } from "react-native-paper";

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = React.useState("");

  const collections = getCollectionsFromBookList(mockBookList);

  const handleConfigScreen = () => {
    console.log(collections);
    router.navigate("/ConfigsScreen");
  };
  const handleAboutScreen = () => {
    router.navigate("/AboutScreen");
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
            onChangeText={setSearchQuery}
            value={searchQuery}
            placeholder={Strings.homeScreen.search}
          />
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
        {/* <FlashList
          data={mockBookList}
          masonry
          numColumns={3}
          renderItem={({ item }) => (
            <BookDisplayListItem
              title={item.title}
              author={item.author}
              volume={item.volume}
            />
          )}
        /> */}
        <FlatList
          data={mockBookList}
          numColumns={2}
          renderItem={({ item }) => (
            <BookDisplayListItem
              title={item.title}
              author={item.author}
              volume={item.volume}
            />
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
});
