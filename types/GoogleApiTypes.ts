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
  userInfo?: UserInfo;
  saleInfo: SaleInfo;
  accessInfo: AccessInfo;
  searchInfo?: SearchInfo;
};


export type VolumeInfo = {
  title: string;
  subtitle?: string;
  authors?: string[];
  publisher?: string;
  publishedDate?: string;
  description?: string;
  industryIdentifiers?: IndustryIdentifier[];
  pageCount?: number;
  dimensions?: Dimensions;
  printType?: string;
  mainCategory?: string;
  categories?: string[];
  averageRating?: number;
  ratingsCount?: number;
  contentVersion?: string;
  imageLinks?: ImageLinks;
  language?: string;
  previewLink?: string;
  infoLink?: string;
  canonicalVolumeLink?: string;
};

export type IndustryIdentifier = {
  type: string; // "ISBN_13", "ISBN_10"
  identifier: string;
};

export type Dimensions = {
  height?: string;
  width?: string;
  thickness?: string;
};

export type ImageLinks = {
  smallThumbnail?: string;
  thumbnail?: string;
  small?: string;
  medium?: string;
  large?: string;
  extraLarge?: string;
};


export type UserInfo = {
  review?: undefined; // mylibrary.reviews Resource (não detalhado)
  readingPosition?: undefined; // mylibrary.readingpositions Resource (não detalhado)
  isPurchased?: boolean;
  isPreordered?: boolean;
  updated?: string; 
};


export type SaleInfo = {
  country: string;
  saleability: string;
  onSaleDate?: string; 
  isEbook: boolean;
  listPrice?: Price;
  retailPrice?: Price;
  buyLink?: string;
};

export type Price = {
  amount: number;
  currencyCode: string;
};


export type AccessInfo = {
  country: string;
  viewability: string;
  embeddable: boolean;
  publicDomain: boolean;
  textToSpeechPermission: string;
  epub?: AccessFormat;
  pdf?: AccessFormat;
  webReaderLink?: string;
  accessViewStatus: string;
  downloadAccess?: DownloadAccess;
};

export type AccessFormat = {
  isAvailable: boolean;
  downloadLink?: string;
  acsTokenLink?: string;
};

export type DownloadAccess = {
  kind: "books#downloadAccessRestriction";
  volumeId: string;
  restricted: boolean;
  deviceAllowed: boolean;
  justAcquired: boolean;
  maxDownloadDevices: number;
  downloadsAcquired: number;
  nonce: string;
  source: string;
  reasonCode: string;
  message: string;
  signature: string;
};


export type SearchInfo = {
  textSnippet: string;
};
