import { supabase } from "@/lib/supabase";
import Constants from "expo-constants";
import * as Notifications from "expo-notifications";

export async function registerPushToken(userId: string) {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== "granted") return;

  const projectId = Constants.expoConfig?.extra?.eas?.projectId;
  const { data: tokenData } = await Notifications.getExpoPushTokenAsync({
    projectId,
  });
  const token = tokenData;

  if (!token?.startsWith("ExponentPushToken[")) return;

  await supabase
    .from("users")
    .update({ expo_push_token: token })
    .eq("user_id", userId);
}
