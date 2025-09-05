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
    isbn: "9780261103573",
    image:
      "https://upload.wikimedia.org/wikipedia/en/8/8e/The_Fellowship_of_the_Ring_cover.gif",
  },
  {
    id: "2",
    title: "As Duas Torres",
    author: "J.R.R. Tolkien",
    collection: "O Senhor dos Anéis",
    volume: "2",
    tags: ["Livro", "Lido", "Coleção completa", "Minha casa"],
    isbn: "9780261102361",
    image:
      "https://upload.wikimedia.org/wikipedia/en/a/a0/The_Two_Towers_cover.gif",
  },
  {
    id: "3",
    title: "O Retorno do Rei",
    author: "J.R.R. Tolkien",
    collection: "O Senhor dos Anéis",
    volume: "3",
    tags: ["Livro", "Lido", "Coleção completa", "Minha casa"],
    isbn: "9780261102378",
    image:
      "https://upload.wikimedia.org/wikipedia/en/1/11/The_Return_of_the_King_cover.gif",
  },

  // --- Ursula K. Le Guin - Terramar ---
  {
    id: "4",
    title: "O Feiticeiro de Terramar",
    author: "Ursula K. Le Guin",
    collection: "Ciclo Terramar",
    volume: "1",
    tags: ["Livro", "Não Lido", "Coleção incompleta", "Minha casa"],
    isbn: "12345678",
    image: "https://example.com/broken/terramar1.jpg",
  },
  {
    id: "5",
    title: "As Tumbas de Atuan",
    author: "Ursula K. Le Guin",
    collection: "Ciclo Terramar",
    volume: "2",
    tags: ["Livro", "Lido", "Coleção incompleta", "Minha casa"],
    isbn: "9780140304770",
    image: "https://images-na.ssl-images-amazon.com/images/I/81z5X8HkVbL.jpg",
  },
  {
    id: "6",
    title: "A Praia Mais Longínqua",
    author: "Ursula K. Le Guin",
    collection: "Ciclo Terramar",
    volume: "3",
    tags: ["Livro", "Não Lido", "Coleção incompleta", "Minha casa"],
    isbn: "9780689845338",
    image: "https://example.com/broken/terramar3.png",
  },
  {
    id: "7",
    title: "Tehanu",
    author: "Ursula K. Le Guin",
    collection: "Ciclo Terramar",
    volume: "4",
    tags: ["Livro", "Não Lido", "Coleção incompleta", "Casa de Mãe"],
    isbn: "87654321",
    image: "https://m.media-amazon.com/images/I/71x+AfPquPL.jpg",
  },

  // --- Percy Jackson ---
  {
    id: "8",
    title: "O Ladrão de Raios",
    author: "Rick Riordan",
    collection: "Percy Jackson",
    volume: "1",
    tags: ["Livro", "Lido", "Coleção completa", "Minha casa"],
    isbn: "9781423134947",
    image: "https://images-na.ssl-images-amazon.com/images/I/91HHqVTAJQL.jpg",
  },
  {
    id: "9",
    title: "O Mar de Monstros",
    author: "Rick Riordan",
    collection: "Percy Jackson",
    volume: "2",
    tags: ["Livro", "Lido", "Coleção completa", "Minha casa"],
    isbn: "9781423145509",
    image: "https://example.com/broken/percy2.jpg",
  },
  {
    id: "10",
    title: "A Maldição do Titã",
    author: "Rick Riordan",
    collection: "Percy Jackson",
    volume: "3",
    tags: ["Livro", "Não Lido", "Coleção completa", "Minha casa"],
    isbn: "9781423148227",
    image: "https://images-na.ssl-images-amazon.com/images/I/81t2CVWEsUL.jpg",
  },

  // --- One Piece ---
  {
    id: "11",
    title: "One Piece Vol. 1",
    author: "Eiichiro Oda",
    collection: "One Piece",
    volume: "1",
    tags: ["Mangá", "Lido", "Coleção incompleta", "Minha casa"],
    isbn: "9781569319017",
    image:
      "https://upload.wikimedia.org/wikipedia/en/2/29/OnePieceVol01Cover.jpg",
  },
  {
    id: "12",
    title: "One Piece Vol. 2",
    author: "Eiichiro Oda",
    collection: "One Piece",
    volume: "2",
    tags: ["Mangá", "Não Lido", "Coleção incompleta", "Minha casa"],
    isbn: "12349876",
    image: "https://example.com/broken/onepiece2.png",
  },
  {
    id: "13",
    title: "One Piece Vol. 3",
    author: "Eiichiro Oda",
    collection: "One Piece",
    volume: "3",
    tags: ["Mangá", "Não Lido", "Coleção incompleta", "Casa de Mãe"],
    isbn: "9781569319024",
    image: "https://m.media-amazon.com/images/I/51h1vKmqk1L.jpg",
  },
  {
    id: "14",
    title: "One Piece Vol. 4",
    author: "Eiichiro Oda",
    collection: "One Piece",
    volume: "4",
    tags: ["Mangá", "Lido", "Coleção incompleta", "Casa de Mãe"],
    isbn: "9781569319031",
    image: "https://example.com/broken/onepiece4.jpg",
  },
  {
    id: "15",
    title: "One Piece Vol. 5",
    author: "Eiichiro Oda",
    collection: "One Piece",
    volume: "5",
    tags: ["Mangá", "Não Lido", "Coleção incompleta", "Minha casa"],
    isbn: "9876543212345",
    image:
      "https://upload.wikimedia.org/wikipedia/en/4/4f/OnePieceVol05Cover.jpg",
  },

  // --- Naruto ---
  {
    id: "16",
    title: "Naruto Vol. 1",
    author: "Masashi Kishimoto",
    collection: "Naruto",
    volume: "1",
    tags: ["Mangá", "Lido", "Coleção completa", "Minha casa"],
    isbn: "9781569319000",
    image:
      "https://upload.wikimedia.org/wikipedia/en/9/94/NarutoCoverTankobon1.jpg",
  },
  {
    id: "17",
    title: "Naruto Vol. 2",
    author: "Masashi Kishimoto",
    collection: "Naruto",
    volume: "2",
    tags: ["Mangá", "Não Lido", "Coleção completa", "Minha casa"],
    isbn: "23456789",
    image: "https://example.com/broken/naruto2.png",
  },
  {
    id: "18",
    title: "Naruto Vol. 3",
    author: "Masashi Kishimoto",
    collection: "Naruto",
    volume: "3",
    tags: ["Mangá", "Lido", "Coleção completa", "Casa de Mãe"],
    isbn: "9781569319017",
    image: "https://m.media-amazon.com/images/I/81Xikn0DJBL.jpg",
  },

  // --- Death Note ---
  {
    id: "19",
    title: "Death Note Vol. 1",
    author: "Tsugumi Ohba",
    collection: "Death Note",
    volume: "1",
    tags: ["Mangá", "Lido", "Coleção completa", "Minha casa"],
    isbn: "9781421501680",
    image:
      "https://upload.wikimedia.org/wikipedia/en/6/6f/Death_Note_Vol_1.jpg",
  },
  {
    id: "20",
    title: "Death Note Vol. 2",
    author: "Tsugumi Ohba",
    collection: "Death Note",
    volume: "2",
    tags: ["Mangá", "Não Lido", "Coleção completa", "Minha casa"],
    isbn: "8765432198765",
    image: "https://example.com/broken/deathnote2.jpg",
  },

  // --- Akira ---
  {
    id: "21",
    title: "Akira Vol. 1",
    author: "Katsuhiro Otomo",
    collection: "Akira",
    volume: "1",
    tags: ["Mangá", "Não Lido", "Coleção incompleta", "Casa de Mãe"],
    isbn: "9781935429005",
    image:
      "https://upload.wikimedia.org/wikipedia/en/5/5e/Akira_volume_1_cover.jpg",
  },
  {
    id: "22",
    title: "Akira Vol. 2",
    author: "Katsuhiro Otomo",
    collection: "Akira",
    volume: "2",
    tags: ["Mangá", "Lido", "Coleção incompleta", "Minha casa"],
    isbn: "1234567890123",
    image: "https://example.com/broken/akira2.png",
  },

  // --- HQs ---
  {
    id: "23",
    title: "Batman: Ano Um",
    author: "Frank Miller",
    collection: "Batman",
    volume: "1",
    tags: ["HQ", "Lido", "Coleção completa", "Minha casa"],
    isbn: "9781401207526",
    image:
      "https://upload.wikimedia.org/wikipedia/en/9/9d/Batman_Year_One_cover.jpg",
  },
  {
    id: "24",
    title: "Batman: O Cavaleiro das Trevas",
    author: "Frank Miller",
    collection: "Batman",
    volume: "2",
    tags: ["HQ", "Não Lido", "Coleção completa", "Minha casa"],
    isbn: "2345678123456",
    image: "https://example.com/broken/batman2.jpg",
  },
  {
    id: "25",
    title: "Watchmen",
    author: "Alan Moore",
    collection: "Watchmen",
    volume: "1",
    tags: ["HQ", "Lido", "Coleção única", "Minha casa"],
    isbn: "9780930289232",
    image: "https://upload.wikimedia.org/wikipedia/en/5/5a/Watchmen-cover.jpg",
  },
  {
    id: "26",
    title: "Sandman Vol. 1",
    author: "Neil Gaiman",
    collection: "Sandman",
    volume: "1",
    tags: ["HQ", "Lido", "Coleção incompleta", "Minha casa"],
    isbn: "9781401225759",
    image: "https://example.com/broken/sandman1.png",
  },
  {
    id: "27",
    title: "Sandman Vol. 2",
    author: "Neil Gaiman",
    collection: "Sandman",
    volume: "2",
    tags: ["HQ", "Não Lido", "Coleção incompleta", "Casa de Mãe"],
    isbn: "8765432187654",
    image: "https://m.media-amazon.com/images/I/81JfLxXJhQL.jpg",
  },

  // --- Obras únicas ---
  {
    id: "28",
    title: "A Mão Esquerda da Escuridão",
    author: "Ursula K. Le Guin",
    collection: "A Mão Esquerda da Escuridão",
    volume: "1",
    tags: ["Livro", "Não Lido", "Coleção única", "Minha casa"],
    isbn: "9780441478125",
    image: "https://example.com/broken/mao-esquerda.jpg",
  },
  {
    id: "29",
    title: "O Nome do Vento",
    author: "Patrick Rothfuss",
    collection: "O Nome do Vento",
    volume: "1",
    tags: ["Livro", "Lido", "Coleção única", "Casa de Mãe"],
    isbn: "12344321",
    image: "https://m.media-amazon.com/images/I/81p+xe8cbnL.jpg",
  },
  {
    id: "30",
    title: "1984",
    author: "George Orwell",
    collection: "1984",
    volume: "1",
    tags: ["Livro", "Lido", "Coleção única", "Minha casa"],
    isbn: "9780451524935",
    image: "https://upload.wikimedia.org/wikipedia/en/c/c3/1984first.jpg",
  },
  {
    id: "31",
    title: "A Revolução dos Bichos",
    author: "George Orwell",
    collection: "A Revolução dos Bichos",
    volume: "1",
    tags: ["Livro", "Não Lido", "Coleção única", "Minha casa"],
    isbn: "9780451526342",
    image: "https://example.com/broken/revolucao.jpg",
  },
  {
    id: "32",
    title: "Dom Casmurro",
    author: "Machado de Assis",
    collection: "Dom Casmurro",
    volume: "1",
    tags: ["Livro", "Lido", "Coleção única", "Casa de Mãe"],
    isbn: "9788520926022",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/c/c3/Dom_Casmurro.jpg",
  },
  {
    id: "33",
    title: "Memórias Póstumas de Brás Cubas",
    author: "Machado de Assis",
    collection: "Memórias Póstumas de Brás Cubas",
    volume: "1",
    tags: ["Livro", "Lido", "Coleção única", "Minha casa"],
    isbn: "23456781",
    image: "https://example.com/broken/bras-cubas.jpg",
  },
  {
    id: "34",
    title: "Grande Sertão: Veredas",
    author: "Guimarães Rosa",
    collection: "Grande Sertão: Veredas",
    volume: "1",
    tags: ["Livro", "Não Lido", "Coleção única", "Minha casa"],
    isbn: "9788526013320",
    image: "https://m.media-amazon.com/images/I/81UvZAfhMUL.jpg",
  },
  {
    id: "35",
    title: "Ensaio Sobre a Cegueira",
    author: "José Saramago",
    collection: "Ensaio Sobre a Cegueira",
    volume: "1",
    tags: ["Livro", "Lido", "Coleção única", "Minha casa"],
    isbn: "9780156007757",
    image: "https://example.com/broken/ensaio.jpg",
  },
  {
    id: "36",
    title: "O Conto da Aia",
    author: "Margaret Atwood",
    collection: "O Conto da Aia",
    volume: "1",
    tags: ["Livro", "Não Lido", "Coleção única", "Casa de Mãe"],
    isbn: "9780385490818",
    image:
      "https://upload.wikimedia.org/wikipedia/en/6/62/TheHandmaidsTale%281stEd%29.jpg",
  },
  {
    id: "37",
    title: "Fahrenheit 451",
    author: "Ray Bradbury",
    collection: "Fahrenheit 451",
    volume: "1",
    tags: ["Livro", "Lido", "Coleção única", "Minha casa"],
    isbn: "9788525052247",
    image: "https://m.media-amazon.com/images/I/51tAD6LyZ-L.jpg",
  },
  {
    id: "38",
    title: "A Metamorfose",
    author: "Franz Kafka",
    collection: "A Metamorfose",
    volume: "1",
    tags: ["Livro", "Lido", "Coleção única", "Minha casa"],
    isbn: "9780140184784",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/5/5e/DieVerwandlung.jpg",
  },
  {
    id: "39",
    title: "O Hobbit",
    author: "J.R.R. Tolkien",
    collection: "O Hobbit",
    volume: "1",
    tags: ["Livro", "Não Lido", "Coleção única", "Casa de Mãe"],
    isbn: "9780261102217",
    image: "https://example.com/broken/hobbit.jpg",
  },
  {
    id: "40",
    title: "O Silmarillion",
    author: "J.R.R. Tolkien",
    collection: "O Silmarillion",
    volume: "1",
    tags: ["Livro", "Lido", "Coleção única", "Minha casa"],
    isbn: "9780618391110",
    image:
      "https://upload.wikimedia.org/wikipedia/en/7/72/The_Silmarillion%2C_Houghton_Mifflin_edition.jpg",
  },

  // --- Mais Mangás ---
  {
    id: "41",
    title: "Fullmetal Alchemist Vol. 1",
    author: "Hiromu Arakawa",
    collection: "Fullmetal Alchemist",
    volume: "1",
    tags: ["Mangá", "Lido", "Coleção incompleta", "Minha casa"],
    isbn: "9781591169208",
    image: "https://m.media-amazon.com/images/I/81ZVJmwGq4L.jpg",
  },
  {
    id: "42",
    title: "Fullmetal Alchemist Vol. 2",
    author: "Hiromu Arakawa",
    collection: "Fullmetal Alchemist",
    volume: "2",
    tags: ["Mangá", "Não Lido", "Coleção incompleta", "Minha casa"],
    isbn: "1234432198765",
    image: "https://example.com/broken/fma2.jpg",
  },
  {
    id: "43",
    title: "Attack on Titan Vol. 1",
    author: "Hajime Isayama",
    collection: "Attack on Titan",
    volume: "1",
    tags: ["Mangá", "Não Lido", "Coleção incompleta", "Casa de Mãe"],
    isbn: "9781612620244",
    image:
      "https://upload.wikimedia.org/wikipedia/en/0/0c/Attack_on_Titan_volume_1_cover.jpg",
  },
  {
    id: "44",
    title: "Attack on Titan Vol. 2",
    author: "Hajime Isayama",
    collection: "Attack on Titan",
    volume: "2",
    tags: ["Mangá", "Lido", "Coleção incompleta", "Minha casa"],
    isbn: "9781612620251",
    image: "https://example.com/broken/aot2.png",
  },
];
