export const delay = (milliseconds: number) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

export const IMAGE_PLACEHOLDER =
  "https://wrxchwepnruhjnsziquz.supabase.co/storage/v1/object/public/book-covers/placeholders/new_placeholder.png";

export const BASE_IMG_URL =
  "https://wrxchwepnruhjnsziquz.supabase.co/storage/v1/object/public/book-covers/";

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

export const formatMinute = (value: number): string => {
  return value.toString().padStart(2, '0');
} //engraçado que eu conheci esse padStart essa semana mesmo na task do esfera
