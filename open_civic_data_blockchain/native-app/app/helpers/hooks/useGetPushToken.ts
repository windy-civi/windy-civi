import {
  getPermissionsAsync,
  requestPermissionsAsync,
  getExpoPushTokenAsync,
} from "expo-notifications";

const projectId = process.env.EXPO_PUBLIC_API_URL;

export const useGetPushToken = () => {
  async function getPushToken() {
    try {
      // Request permissions for push notifications
      const { status: existingStatus } = await getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== "granted") {
        console.log("Failed to get push token for push notification!");
        return;
      }

      // Get the push token
      const token = await getExpoPushTokenAsync({ projectId });

      console.log("Push token:", token);
      return token;
    } catch (error) {
      console.log("Error getting push token:", error);
    }
  }

  return { getPushToken };
};
