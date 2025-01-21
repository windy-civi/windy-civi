import { useState, useEffect } from "react";
import * as BackgroundFetch from "expo-background-fetch";
import * as TaskManager from "expo-task-manager";
import { github } from "../../utils/gh-get";
import { findDifferences } from "../../domain/legislation-diff/diff";
import { useStorage } from "./useStorage";
import { useLocalPushNotifications } from "./useLocalPushNotifications";

const BACKGROUND_FETCH_TASK = "background-fetch";

const registerBackgroundFetchAsync = async () => {
  await BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
    minimumInterval: 60 * 60 * 24, // 24 hours
    stopOnTerminate: false,
    startOnBoot: true,
  });
};

export const useBackgroundFetch = () => {
  const [isRegistered, setIsRegistered] = useState(false);
  const { getData, storeData } = useStorage();
  const { scheduleLocalPushNotification } = useLocalPushNotifications();
  const [status, setStatus] =
    useState<BackgroundFetch.BackgroundFetchStatus | null>(null);

  useEffect(() => {
    TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
      // Fetch and store the legislation data
      const newLegislation = await github.getLegislation("chicago");

      // Check if old data is in storage
      const oldLegislation = await getData({ key: "legislation" });
      if (oldLegislation) {
        // Find differences between old and new legislation
        const differences = findDifferences(oldLegislation, newLegislation);

        // Schedule a local push notification if there are differences
        if (differences.length > 0) {
          await scheduleLocalPushNotification({
            title: "New Legislation",
            body: `There are ${differences.length} legislation updates`,
            data: {},
          });
        }

        console.log("Background Fetch - Differences:", differences);
      }

      await storeData({
        key: "legislation",
        value: JSON.stringify(newLegislation),
      });
      console.log("newLegislation", newLegislation);
      return BackgroundFetch.BackgroundFetchResult.NewData;
    });

    checkStatusAsync();
  }, [getData, storeData, scheduleLocalPushNotification]);

  const checkStatusAsync = async () => {
    const status = await BackgroundFetch.getStatusAsync();
    const isRegistered = await TaskManager.isTaskRegisteredAsync(
      BACKGROUND_FETCH_TASK
    );
    setStatus(status);
    setIsRegistered(isRegistered);
  };

  const toggleFetchTask = async () => {
    if (!isRegistered) {
      await registerBackgroundFetchAsync();
    }
    checkStatusAsync();
  };

  return { toggleFetchTask, isRegistered, status };
};
