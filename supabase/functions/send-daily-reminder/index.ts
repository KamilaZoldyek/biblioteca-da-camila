import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
const NOTIFICATION_PHRASES = [
  "O livro '{title}' te aguarda...",
  "Biblioteca da Camila Informa: você não terminou de ler '{title}'.",
  "Ei! '{title}' continua não lido. Vai fazer algo sobre isso?",
  "'{title}' pode ser sua próxima leitura...",
  "Lembra de '{title}'? Pois é.",
  "Ainda ignorando '{title}'?",
  "Há quanto tempo '{title}' está pegando pó na estante?",
  "Que bonito esse '{title}' pegando poeira.",
];

const NOTIFICATION_TITLES = [
  "Um capítulo só!",
  "Hora de ler!",
  "Lembrete de leitura!",
  "Tem dez minutos?",
  "Doomscrolling de novo? Hm.",
  "Ahem.",
];

serve(async () => {
  const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
  const SERVICE_ROLE_KEY = Deno.env.get("SERVICE_ROLE_KEY")!;

  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

  const { data: users, error } = await supabase
    .from("users")
    .select(
      "user_id, expo_push_token, reminder_time, books:books!books_user_id_fkey(isbn, book_title, book_reading_status)",
    )
    .eq("books.book_reading_status", "Não lido")
    .not("expo_push_token", "is", null);

  if (error) {
    console.error("Erro ao buscar usuários:", error);
    return new Response("Erro", { status: 500 });
  }

  if (!users?.length) {
    console.log("Nenhum usuário com livros não lidos encontrado.");
    return new Response("OK");
  }

  // hora atual (UTC)
  const now = new Date();
  const nowMinutes = now.getUTCHours() * 60 + now.getUTCMinutes();

  const notifications: any[] = [];

  for (const user of users) {
    if (!user.reminder_time || !user.expo_push_token) continue;

    const [h, m] = user.reminder_time.split(":").map(Number);
    const targetMinutes = h * 60 + m;
    const diff = Math.abs(nowMinutes - targetMinutes);

    if (diff > 5) continue; 

    const unread = user.books ?? [];
    if (!unread.length) continue;

    const randomBook = unread[Math.floor(Math.random() * unread.length)];
    const randomPhrase = NOTIFICATION_PHRASES[
      Math.floor(Math.random() * NOTIFICATION_PHRASES.length)
    ];
    const randomTitle = NOTIFICATION_TITLES[
      Math.floor(Math.random() * NOTIFICATION_TITLES.length)
    ];
    const body = randomPhrase.replace("{title}", randomBook.book_title);

    notifications.push({
      to: user.expo_push_token,
      title: randomTitle,
      body,
      data: { isbn: randomBook.isbn },
      sound: "default",
    });
  }

  if (!notifications.length) {
    console.log("Nenhuma notificação agendada agora.");
    return new Response("OK");
  }

  console.log(`Enviando ${notifications.length} notificações...`);

  const expoResponse = await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify(notifications),
  });

  const expoResult = await expoResponse.text();
  console.log("Resposta do Expo:", expoResult);

  return new Response("OK");
});
