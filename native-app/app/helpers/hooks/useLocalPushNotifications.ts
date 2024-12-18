import { useCallback, useEffect, useRef } from "react";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

export const useLocalPushNotifications = () => {
  const backgroundSubscription = useRef<Notifications.Subscription>();

  useEffect(() => {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
      }),
    });

    backgroundSubscription.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const notificationData = response.notification.request.content.data;
        console.log("Notification clicked in background:", notificationData);
        // Handle the notification data here
      });

    return () => {
      if (backgroundSubscription.current) {
        Notifications.removeNotificationSubscription(
          backgroundSubscription.current
        );
      }
    };
  }, []);

  const registerForLocalPushNotifications = useCallback(async () => {
    let token;

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#b21357",
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        console.error("Failed to get push token for push notification!");
        return;
      }

      if (process.env.EXPO_PUBLIC_PROJECT_ID) {
        token = (
          await Notifications.getExpoPushTokenAsync({
            projectId: process.env.EXPO_PUBLIC_PROJECT_ID,
          })
        ).data;
        console.log(token);
      }
    } else {
      console.error("Must use physical device for Push Notifications");
    }

    return token;
  }, []);

  const scheduleLocalPushNotification = useCallback(async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Hello there!",
        body: "There is new legislation you might be interested in!",
        data: { data: "goes here" },
      },
      trigger: {
        seconds: 120,
        repeats: true,
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      },
    });
  }, []);

  const initializeNotifications = useCallback(async () => {
    const token = await registerForLocalPushNotifications();
    if (token) {
      await scheduleLocalPushNotification();
      return true;
    }
    return false;
  }, [registerForLocalPushNotifications, scheduleLocalPushNotification]);

  return {
    initializeNotifications,
    registerForLocalPushNotifications,
    scheduleLocalPushNotification,
  };
};
