type BookListItemType = {
  id: string;
  title: string;
  author: string;
  collection: string;
  volume: string;
  isbn: string;
  image: string;
  type?: BookKindType;
  tags: string[];
};

type BookCollectionType = {
  collectionName: string;
  coolectionItems: BookList;
};

export type BookKindType = "livro" | "hq" | "mangá";

export type TagType =
  | "Coleções"
  | "Livro"
  | "HQ"
  | "Mangá"
  | "Não Lido"
  | "Lido"
  | "Coleção completa"
  | "Coleção incompleta"
  | "Casa de Mãe"
  | "Minha casa";

export const TAGS = [
  "Livro",
  "HQ",
  "Mangá",
  "Lido",
  "Não lido",
  "Incompleta",
  "Completa",
  "Minha casa",
  "Casa de Mãe",
];

export type BookList = BookListItemType[];

export type BookLibrary = BookCollectionType[];

//Library é a biblioteca INTEIRA. tudo que eu tenho.
//Collection é uma série, ex: Bleach, Kimetsu no Yaiba.
//BookList é a lista de livros da collection
//BookListItem é o item que mostra na LISTA da home.
// TODO: mudar o id para ser ISBN, aí eu bato o ISBN no meu servidor e busco o livro pra PDP

export const getCollectionsFromBookList = (bookList: BookList) => {
  let temp: Record<string, BookListItemType[]> = {};

  bookList.forEach((item) => {
    if (!temp[item.collection]) {
      temp[item.collection] = [];
    }
    temp[item.collection].push(item);
  });

  return Object.entries(temp).map(([collection, data]) => ({
    collectionName: collection,
    data,
  }));
};
