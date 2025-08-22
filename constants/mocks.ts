type BookListItemType = {
  id: string;
  title: string;
  author: string;
  collection: string;
  volume: string;
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
  "Não Lido",
  "Coleção incompleta",
  "Coleção completa",
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

export const mockBookList: BookList = [
  //mandei o gpt gerar essa lista pra mim, e agora mandei tirar a obra daquela mulher
  {
    id: "1",
    title: "A Sociedade do Anel",
    author: "J.R.R. Tolkien",
    collection: "O Senhor dos Anéis",
    volume: "1",
    tags: ["Livro", "Não Lido", "Coleção completa", "Minha casa"],
  },
  {
    id: "2",
    title: "As Duas Torres",
    author: "J.R.R. Tolkien",
    collection: "O Senhor dos Anéis",
    volume: "2",
    tags: ["Livro", "Lido", "Coleção completa", "Minha casa"],
  },
  {
    id: "3",
    title: "O Retorno do Rei",
    author: "J.R.R. Tolkien",
    collection: "O Senhor dos Anéis",
    volume: "3",
    tags: ["Livro", "Lido", "Coleção completa", "Minha casa"],
  },

  // --- Ursula K. Le Guin - Terramar ---
  {
    id: "4",
    title: "O Feiticeiro de Terramar",
    author: "Ursula K. Le Guin",
    collection: "Ciclo Terramar",
    volume: "1",
    tags: ["Livro", "Não Lido", "Coleção incompleta", "Minha casa"],
  },
  {
    id: "5",
    title: "As Tumbas de Atuan",
    author: "Ursula K. Le Guin",
    collection: "Ciclo Terramar",
    volume: "2",
    tags: ["Livro", "Lido", "Coleção incompleta", "Minha casa"],
  },
  {
    id: "6",
    title: "A Praia Mais Longínqua",
    author: "Ursula K. Le Guin",
    collection: "Ciclo Terramar",
    volume: "3",
    tags: ["Livro", "Não Lido", "Coleção incompleta", "Minha casa"],
  },
  {
    id: "7",
    title: "Tehanu",
    author: "Ursula K. Le Guin",
    collection: "Ciclo Terramar",
    volume: "4",
    tags: ["Livro", "Não Lido", "Coleção incompleta", "Casa de Mãe"],
  },

  // --- Percy Jackson ---
  {
    id: "8",
    title: "O Ladrão de Raios",
    author: "Rick Riordan",
    collection: "Percy Jackson",
    volume: "1",
    tags: ["Livro", "Lido", "Coleção completa", "Minha casa"],
  },
  {
    id: "9",
    title: "O Mar de Monstros",
    author: "Rick Riordan",
    collection: "Percy Jackson",
    volume: "2",
    tags: ["Livro", "Lido", "Coleção completa", "Minha casa"],
  },
  {
    id: "10",
    title: "A Maldição do Titã",
    author: "Rick Riordan",
    collection: "Percy Jackson",
    volume: "3",
    tags: ["Livro", "Não Lido", "Coleção completa", "Minha casa"],
  },

  // --- One Piece (mangá) ---
  {
    id: "11",
    title: "One Piece Vol. 1",
    author: "Eiichiro Oda",
    collection: "One Piece",
    volume: "1",
    tags: ["Mangá", "Lido", "Coleção incompleta", "Minha casa"],
  },
  {
    id: "12",
    title: "One Piece Vol. 2",
    author: "Eiichiro Oda",
    collection: "One Piece",
    volume: "2",
    tags: ["Mangá", "Não Lido", "Coleção incompleta", "Minha casa"],
  },
  {
    id: "13",
    title: "One Piece Vol. 3",
    author: "Eiichiro Oda",
    collection: "One Piece",
    volume: "3",
    tags: ["Mangá", "Não Lido", "Coleção incompleta", "Casa de Mãe"],
  },
  {
    id: "14",
    title: "One Piece Vol. 4",
    author: "Eiichiro Oda",
    collection: "One Piece",
    volume: "4",
    tags: ["Mangá", "Lido", "Coleção incompleta", "Casa de Mãe"],
  },
  {
    id: "15",
    title: "One Piece Vol. 5",
    author: "Eiichiro Oda",
    collection: "One Piece",
    volume: "5",
    tags: ["Mangá", "Não Lido", "Coleção incompleta", "Minha casa"],
  },

  // --- Naruto (mangá) ---
  {
    id: "16",
    title: "Naruto Vol. 1",
    author: "Masashi Kishimoto",
    collection: "Naruto",
    volume: "1",
    tags: ["Mangá", "Lido", "Coleção completa", "Minha casa"],
  },
  {
    id: "17",
    title: "Naruto Vol. 2",
    author: "Masashi Kishimoto",
    collection: "Naruto",
    volume: "2",
    tags: ["Mangá", "Não Lido", "Coleção completa", "Minha casa"],
  },
  {
    id: "18",
    title: "Naruto Vol. 3",
    author: "Masashi Kishimoto",
    collection: "Naruto",
    volume: "3",
    tags: ["Mangá", "Lido", "Coleção completa", "Casa de Mãe"],
  },

  // --- Death Note (mangá) ---
  {
    id: "19",
    title: "Death Note Vol. 1",
    author: "Tsugumi Ohba",
    collection: "Death Note",
    volume: "1",
    tags: ["Mangá", "Lido", "Coleção completa", "Minha casa"],
  },
  {
    id: "20",
    title: "Death Note Vol. 2",
    author: "Tsugumi Ohba",
    collection: "Death Note",
    volume: "2",
    tags: ["Mangá", "Não Lido", "Coleção completa", "Minha casa"],
  },

  // --- Akira (mangá) ---
  {
    id: "21",
    title: "Akira Vol. 1",
    author: "Katsuhiro Otomo",
    collection: "Akira",
    volume: "1",
    tags: ["Mangá", "Não Lido", "Coleção incompleta", "Casa de Mãe"],
  },
  {
    id: "22",
    title: "Akira Vol. 2",
    author: "Katsuhiro Otomo",
    collection: "Akira",
    volume: "2",
    tags: ["Mangá", "Lido", "Coleção incompleta", "Minha casa"],
  },

  // --- HQs ---
  {
    id: "23",
    title: "Batman: Ano Um",
    author: "Frank Miller",
    collection: "Batman",
    volume: "1",
    tags: ["HQ", "Lido", "Coleção completa", "Minha casa"],
  },
  {
    id: "24",
    title: "Batman: O Cavaleiro das Trevas",
    author: "Frank Miller",
    collection: "Batman",
    volume: "2",
    tags: ["HQ", "Não Lido", "Coleção completa", "Minha casa"],
  },
  {
    id: "25",
    title: "Watchmen",
    author: "Alan Moore",
    collection: "Watchmen",
    volume: "1",
    tags: ["HQ", "Lido", "Coleção única", "Minha casa"],
  },
  {
    id: "26",
    title: "Sandman Vol. 1",
    author: "Neil Gaiman",
    collection: "Sandman",
    volume: "1",
    tags: ["HQ", "Lido", "Coleção incompleta", "Minha casa"],
  },
  {
    id: "27",
    title: "Sandman Vol. 2",
    author: "Neil Gaiman",
    collection: "Sandman",
    volume: "2",
    tags: ["HQ", "Não Lido", "Coleção incompleta", "Casa de Mãe"],
  },

  // --- Obras volume único ---
  {
    id: "28",
    title: "A Mão Esquerda da Escuridão",
    author: "Ursula K. Le Guin",
    collection: "A Mão Esquerda da Escuridão",
    volume: "1",
    tags: ["Livro", "Não Lido", "Coleção única", "Minha casa"],
  },
  {
    id: "29",
    title: "O Nome do Vento",
    author: "Patrick Rothfuss",
    collection: "O Nome do Vento",
    volume: "1",
    tags: ["Livro", "Lido", "Coleção única", "Casa de Mãe"],
  },
  {
    id: "30",
    title: "1984",
    author: "George Orwell",
    collection: "1984",
    volume: "1",
    tags: ["Livro", "Lido", "Coleção única", "Minha casa"],
  },
  {
    id: "31",
    title: "A Revolução dos Bichos",
    author: "George Orwell",
    collection: "A Revolução dos Bichos",
    volume: "1",
    tags: ["Livro", "Não Lido", "Coleção única", "Minha casa"],
  },
  {
    id: "32",
    title: "Dom Casmurro",
    author: "Machado de Assis",
    collection: "Dom Casmurro",
    volume: "1",
    tags: ["Livro", "Lido", "Coleção única", "Casa de Mãe"],
  },
  {
    id: "33",
    title: "Memórias Póstumas de Brás Cubas",
    author: "Machado de Assis",
    collection: "Memórias Póstumas de Brás Cubas",
    volume: "1",
    tags: ["Livro", "Lido", "Coleção única", "Minha casa"],
  },
  {
    id: "34",
    title: "Grande Sertão: Veredas",
    author: "Guimarães Rosa",
    collection: "Grande Sertão: Veredas",
    volume: "1",
    tags: ["Livro", "Não Lido", "Coleção única", "Minha casa"],
  },
  {
    id: "35",
    title: "Ensaio Sobre a Cegueira",
    author: "José Saramago",
    collection: "Ensaio Sobre a Cegueira",
    volume: "1",
    tags: ["Livro", "Lido", "Coleção única", "Minha casa"],
  },
  {
    id: "36",
    title: "O Conto da Aia",
    author: "Margaret Atwood",
    collection: "O Conto da Aia",
    volume: "1",
    tags: ["Livro", "Não Lido", "Coleção única", "Casa de Mãe"],
  },
  {
    id: "37",
    title: "Fahrenheit 451",
    author: "Ray Bradbury",
    collection: "Fahrenheit 451",
    volume: "1",
    tags: ["Livro", "Lido", "Coleção única", "Minha casa"],
  },
  {
    id: "38",
    title: "A Metamorfose",
    author: "Franz Kafka",
    collection: "A Metamorfose",
    volume: "1",
    tags: ["Livro", "Lido", "Coleção única", "Minha casa"],
  },
  {
    id: "39",
    title: "O Hobbit",
    author: "J.R.R. Tolkien",
    collection: "O Hobbit",
    volume: "1",
    tags: ["Livro", "Não Lido", "Coleção única", "Casa de Mãe"],
  },
  {
    id: "40",
    title: "O Silmarillion",
    author: "J.R.R. Tolkien",
    collection: "O Silmarillion",
    volume: "1",
    tags: ["Livro", "Lido", "Coleção única", "Minha casa"],
  },

  // --- Mais Mangás para completar ---
  {
    id: "41",
    title: "Fullmetal Alchemist Vol. 1",
    author: "Hiromu Arakawa",
    collection: "Fullmetal Alchemist",
    volume: "1",
    tags: ["Mangá", "Lido", "Coleção incompleta", "Minha casa"],
  },
  {
    id: "42",
    title: "Fullmetal Alchemist Vol. 2",
    author: "Hiromu Arakawa",
    collection: "Fullmetal Alchemist",
    volume: "2",
    tags: ["Mangá", "Não Lido", "Coleção incompleta", "Minha casa"],
  },
  {
    id: "43",
    title: "Attack on Titan Vol. 1",
    author: "Hajime Isayama",
    collection: "Attack on Titan",
    volume: "1",
    tags: ["Mangá", "Não Lido", "Coleção incompleta", "Casa de Mãe"],
  },
  {
    id: "44",
    title: "Attack on Titan Vol. 2",
    author: "Hajime Isayama",
    collection: "Attack on Titan",
    volume: "2",
    tags: ["Mangá", "Lido", "Coleção incompleta", "Minha casa"],
  },
  {
    id: "45",
    title: "Dragon Ball Vol. 1",
    author: "Akira Toriyama",
    collection: "Dragon Ball",
    volume: "1",
    tags: ["Mangá", "Lido", "Coleção incompleta", "Minha casa"],
  },
  {
    id: "46",
    title: "Dragon Ball Vol. 2",
    author: "Akira Toriyama",
    collection: "Dragon Ball",
    volume: "2",
    tags: ["Mangá", "Não Lido", "Coleção incompleta", "Minha casa"],
  },
  {
    id: "47",
    title: "Berserk Vol. 1",
    author: "Kentaro Miura",
    collection: "Berserk",
    volume: "1",
    tags: ["Mangá", "Lido", "Coleção incompleta", "Casa de Mãe"],
  },
  {
    id: "48",
    title: "Berserk Vol. 2",
    author: "Kentaro Miura",
    collection: "Berserk",
    volume: "2",
    tags: ["Mangá", "Não Lido", "Coleção incompleta", "Minha casa"],
  },
  {
    id: "49",
    title: "Bleach Vol. 1",
    author: "Tite Kubo",
    collection: "Bleach",
    volume: "1",
    tags: ["Mangá", "Lido", "Coleção incompleta", "Minha casa"],
  },
  {
    id: "50",
    title: "Bleach Vol. 2",
    author: "Tite Kubo",
    collection: "Bleach",
    volume: "2",
    tags: ["Mangá", "Não Lido", "Coleção incompleta", "Casa de Mãe"],
  },
];
