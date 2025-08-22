type BookListItemType = {
  id: string;
  title: string;
  author: string;
  collection: string;
  volume: string;
  type: BookKindType;
  tags: string[];
};

type BookCollectionType = {
  collectionName: string;
  coolectionItems: BookList;
};

export type BookKindType = "livro" | "hq" | "mangá";

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

export const mockBookList: BookList = [
  //mandei o gpt gerar essa lista pra mim, nada tenho a ver com aquela mulher
  {
    id: "1",
    title: "O Senhor dos Anéis: A Sociedade do Anel",
    author: "J.R.R. Tolkien",
    collection: "O Senhor dos Anéis",
    volume: "1",
    type: "livro",
    tags: ["Fantasia", "Aventura"],
  },
  {
    id: "2",
    title: "O Senhor dos Anéis: As Duas Torres",
    author: "J.R.R. Tolkien",
    collection: "O Senhor dos Anéis",
    volume: "2",
    type: "livro",
    tags: ["Fantasia", "Aventura"],
  },
  {
    id: "3",
    title: "O Senhor dos Anéis: O Retorno do Rei",
    author: "J.R.R. Tolkien",
    collection: "O Senhor dos Anéis",
    volume: "3",
    type: "livro",
    tags: ["Fantasia", "Aventura"],
  },
  {
    id: "4",
    title: "Harry Potter e a Pedra Filosofal",
    author: "J.K. Rowling",
    collection: "Harry Potter",
    volume: "1",
    type: "livro",
    tags: ["Fantasia", "Juvenil"],
  },
  {
    id: "5",
    title: "Harry Potter e a Câmara Secreta",
    author: "J.K. Rowling",
    collection: "Harry Potter",
    volume: "2",
    type: "livro",
    tags: ["Fantasia", "Juvenil"],
  },
  {
    id: "6",
    title: "Harry Potter e o Prisioneiro de Azkaban",
    author: "J.K. Rowling",
    collection: "Harry Potter",
    volume: "3",
    type: "livro",
    tags: ["Fantasia", "Juvenil"],
  },
  {
    id: "7",
    title: "Batman: Ano Um",
    author: "Frank Miller",
    collection: "Batman",
    volume: "1",
    type: "hq",
    tags: ["Heróis", "Ação"],
  },
  {
    id: "8",
    title: "Batman: O Cavaleiro das Trevas",
    author: "Frank Miller",
    collection: "Batman",
    volume: "2",
    type: "hq",
    tags: ["Heróis", "Sombrio"],
  },
  {
    id: "9",
    title: "Homem-Aranha: De Volta ao Lar",
    author: "Brian Michael Bendis",
    collection: "Homem-Aranha",
    volume: "1",
    type: "hq",
    tags: ["Heróis", "Aventura"],
  },
  {
    id: "10",
    title: "Homem-Aranha: Universo Aranha",
    author: "Dan Slott",
    collection: "Homem-Aranha",
    volume: "2",
    type: "hq",
    tags: ["Heróis", "Multiverso"],
  },
  {
    id: "11",
    title: "One Piece Vol. 1",
    author: "Eiichiro Oda",
    collection: "One Piece",
    volume: "1",
    type: "mangá",
    tags: ["Aventura", "Shonen"],
  },
  {
    id: "12",
    title: "One Piece Vol. 2",
    author: "Eiichiro Oda",
    collection: "One Piece",
    volume: "2",
    type: "mangá",
    tags: ["Aventura", "Shonen"],
  },
  {
    id: "13",
    title: "One Piece Vol. 3",
    author: "Eiichiro Oda",
    collection: "One Piece",
    volume: "3",
    type: "mangá",
    tags: ["Aventura", "Shonen"],
  },
  {
    id: "14",
    title: "Naruto Vol. 1",
    author: "Masashi Kishimoto",
    collection: "Naruto",
    volume: "1",
    type: "mangá",
    tags: ["Aventura", "Shonen"],
  },
  {
    id: "15",
    title: "Naruto Vol. 2",
    author: "Masashi Kishimoto",
    collection: "Naruto",
    volume: "2",
    type: "mangá",
    tags: ["Aventura", "Shonen"],
  },
  {
    id: "16",
    title: "Naruto Vol. 3",
    author: "Masashi Kishimoto",
    collection: "Naruto",
    volume: "3",
    type: "mangá",
    tags: ["Aventura", "Shonen"],
  },
  {
    id: "17",
    title: "Sandman Vol. 1: Prelúdios e Noturnos",
    author: "Neil Gaiman",
    collection: "Sandman",
    volume: "1",
    type: "hq",
    tags: ["Fantasia", "Sombrio"],
  },
  {
    id: "18",
    title: "Sandman Vol. 2: A Casa de Bonecas",
    author: "Neil Gaiman",
    collection: "Sandman",
    volume: "2",
    type: "hq",
    tags: ["Fantasia", "Sombrio"],
  },
  {
    id: "19",
    title: "Sandman Vol. 3: Terra dos Sonhos",
    author: "Neil Gaiman",
    collection: "Sandman",
    volume: "3",
    type: "hq",
    tags: ["Fantasia", "Sombrio"],
  },
  {
    id: "20",
    title: "Percy Jackson e o Ladrão de Raios",
    author: "Rick Riordan",
    collection: "Percy Jackson",
    volume: "1",
    type: "livro",
    tags: ["Fantasia", "Mitologia"],
  },
  {
    id: "21",
    title: "Percy Jackson e o Mar de Monstros",
    author: "Rick Riordan",
    collection: "Percy Jackson",
    volume: "2",
    type: "livro",
    tags: ["Fantasia", "Mitologia"],
  },
  {
    id: "22",
    title: "Percy Jackson e a Maldição do Titã",
    author: "Rick Riordan",
    collection: "Percy Jackson",
    volume: "3",
    type: "livro",
    tags: ["Fantasia", "Mitologia"],
  },
  {
    id: "23",
    title: "Death Note Vol. 1",
    author: "Tsugumi Ohba",
    collection: "Death Note",
    volume: "1",
    type: "mangá",
    tags: ["Suspense", "Shonen"],
  },
  {
    id: "24",
    title: "Death Note Vol. 2",
    author: "Tsugumi Ohba",
    collection: "Death Note",
    volume: "2",
    type: "mangá",
    tags: ["Suspense", "Shonen"],
  },
  {
    id: "25",
    title: "Death Note Vol. 3",
    author: "Tsugumi Ohba",
    collection: "Death Note",
    volume: "3",
    type: "mangá",
    tags: ["Suspense", "Shonen"],
  },
  {
    id: "26",
    title: "Watchmen Capítulo 1",
    author: "Alan Moore",
    collection: "Watchmen",
    volume: "1",
    type: "hq",
    tags: ["Heróis", "Sombrio"],
  },
  {
    id: "27",
    title: "Watchmen Capítulo 2",
    author: "Alan Moore",
    collection: "Watchmen",
    volume: "2",
    type: "hq",
    tags: ["Heróis", "Sombrio"],
  },
  {
    id: "28",
    title: "Watchmen Capítulo 3",
    author: "Alan Moore",
    collection: "Watchmen",
    volume: "3",
    type: "hq",
    tags: ["Heróis", "Sombrio"],
  },
  {
    id: "29",
    title: "Akira Vol. 1",
    author: "Katsuhiro Otomo",
    collection: "Akira",
    volume: "1",
    type: "mangá",
    tags: ["Cyberpunk", "Seinen"],
  },
  {
    id: "30",
    title: "Akira Vol. 2",
    author: "Katsuhiro Otomo",
    collection: "Akira",
    volume: "2",
    type: "mangá",
    tags: ["Cyberpunk", "Seinen"],
  },
];
