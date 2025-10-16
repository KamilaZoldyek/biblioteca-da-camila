export type Book = {
  isbn: string;
  book_title: string;
  book_author: string;
  book_volume: string;
  book_publisher: string;
  book_year: string;
  book_synopsis: string;
  book_reading_status: string;
  book_kind: string;
  book_location: string;
  book_collection_status: string;
  book_cover_url: string;
  book_rating: string;
  book_review: string;
  collection_id: string | null;
  user_id: string | null;
};

export type Collection = {
  collection_id: string;
  created_at: string;
  collection_name: string;
  user_id: string | null;
  isbn: string | null;
};

export type User = {
  user_id: string;
  created_at: string;
  user_name: string;
  collection_id: string | null;
  isbn: string | null;
};

//types usados no app
export type BookMetadata = {
  isbn: string;
  book_title: string;
  book_author: string;
  book_volume: string;
  book_publisher: string;
  book_year: string;
  book_synopsis: string;
  book_reading_status: string;
  book_kind: string;
  book_location: string;
  book_collection_status: string;
  book_cover_url: string;
  book_rating: string;
  book_review: string;
  collection_id: string | null;
  user_id?: string | null;
  created_at?: string;
};

export type BookWithCollection = BookMetadata & {
  collections: {
    collection_name: string;
  } | null; // pode ser null se não houver coleção associada
};


export type BookList = {
  isbn: string;
  book_title: string;
  book_author: string;
  book_cover_url: string;
  book_volume: string;
  book_tags?: string[];
};

export type CollectionList = {
  collection_id: string;
  collection_name: string;
  books: BookList[];
};
