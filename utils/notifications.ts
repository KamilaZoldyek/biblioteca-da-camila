import { supabase } from "@/lib/supabase";
import Constants from "expo-constants";
import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
    }),
});

export async function registerForPushNotificationsAsync(userId: string) {
    const projectId = Constants?.expoConfig?.extra?.eas?.projectId ??
        Constants?.easConfig?.projectId;

    const { status: existingStatus } = await Notifications
        .getPermissionsAsync();
    let finalStatus = existingStatus;

    console.log(finalStatus);

    if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }

    if (finalStatus !== "granted") {
        console.log("Permissão negada");
        return;
    }

    try {
        const pushTokenString = (
            await Notifications.getExpoPushTokenAsync({
                projectId,
            })
        ).data;
        return pushTokenString;
    } catch (e: unknown) {
        console.log(e);
    }

    const { error } = await supabase
        .from("users")
        .update({ expo_push_token: pushTokenString })
        .eq("user_id", userId);

    if (error) console.error("Erro token:", error);
    else console.log("Token salvo");
}
