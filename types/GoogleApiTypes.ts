export type GoogleBooksListResponse = { 
  kind: string; // "books#volumes"
  totalItems: number;
  items: GoogleBookItem[];
};

export type GoogleBookItem = { 
  kind: string; // "books#volume"
  id: string;
  etag: string;
  selfLink: string;
  volumeInfo: VolumeInfo;
  saleInfo: SaleInfo;
  accessInfo: AccessInfo;
  searchInfo?: SearchInfo;
};

export type VolumeInfo = { 
  title: string;
  authors?: string[];
  publisher?: string;
  publishedDate?: string;
  description?: string;
  industryIdentifiers?: IndustryIdentifier[];
  readingModes?: ReadingModes;
  pageCount?: number;
  printType?: string;
  categories?: string[];
  maturityRating?: string;
  allowAnonLogging?: boolean;
  contentVersion?: string;
  panelizationSummary?: PanelizationSummary;
  imageLinks?: ImageLinks;
  language?: string;
  previewLink?: string;
  infoLink?: string;
  canonicalVolumeLink?: string;
};

export type IndustryIdentifier = {
  type: string;
  identifier: string;
};

export type ReadingModes = {
  text: boolean;
  image: boolean;
};

export type PanelizationSummary = {
  containsEpubBubbles: boolean;
  containsImageBubbles: boolean;
};

export type ImageLinks = {
  smallThumbnail?: string;
  thumbnail?: string;
};

export type SaleInfo = {
  country: string;
  saleability: string;
  isEbook: boolean;
};

export type AccessInfo = {
  country: string;
  viewability: string;
  embeddable: boolean;
  publicDomain: boolean;
  textToSpeechPermission: string;
  epub: {
    isAvailable: boolean;
    acsTokenLink?: string;
  };
  pdf: {
    isAvailable: boolean;
    acsTokenLink?: string;
  };
  webReaderLink?: string;
  accessViewStatus: string;
  quoteSharingAllowed: boolean;
};

export type SearchInfo = {
  textSnippet: string;
};
