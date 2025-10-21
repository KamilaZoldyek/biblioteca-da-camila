/**
 * Converte um horário local (HH:mm) para UTC (HH:mm)
 * Exemplo: "21:30" em Brasília → "00:30" UTC
 */
export function convertLocalToUTC(localTime: string): string {
  const [hour, minute] = localTime.split(":").map(Number);

  const date = new Date();
  date.setHours(hour, minute, 0, 0);

  // converte para UTC
  const utcHour = date.getUTCHours();
  const utcMinute = date.getUTCMinutes();

  return `${String(utcHour).padStart(2, "0")}:${String(utcMinute).padStart(2, "0")}`;
}

/**
 * Converte um horário UTC (HH:mm) salvo no Supabase
 * de volta para o horário local do usuário (HH:mm)
 */
export function convertUTCToLocal(utcTime: string): string {
  const [hour, minute] = utcTime.split(":").map(Number);

  const date = new Date();
  date.setUTCHours(hour, minute, 0, 0);

  // converte pra hora local
  const localHour = date.getHours();
  const localMinute = date.getMinutes();

  return `${String(localHour).padStart(2, "0")}:${String(localMinute).padStart(2, "0")}`;
}