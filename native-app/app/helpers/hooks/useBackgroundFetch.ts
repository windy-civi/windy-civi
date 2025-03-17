import { useState, useEffect } from "react";
import * as BackgroundFetch from "expo-background-fetch";
import * as TaskManager from "expo-task-manager";
import { findDifferences } from "@windy-civi/domain/legislation-diff/diff";
import { useStorage } from "./useStorage";
import { useLocalPushNotifications } from "./useLocalPushNotifications";
import { getFeed } from "@windy-civi/domain/feed/api";
import { rnDataGetter } from "../rn-api";
import { WindyCiviBill } from "@windy-civi/domain/types";

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
      const userPreferences = await getData({ key: "userPreferences" });

      // Fetch and store the legislation data
      const newLegislation = await getFeed({
        dataStoreGetter: rnDataGetter,
        preferences: userPreferences.preferences,
      });

      // Check if old data is in storage
      const oldLegislation = await getData({ key: "legislation" });

      if (oldLegislation?.feed) {
        const prevBills = oldLegislation.feed.map(
          (legislation: WindyCiviBill) => ({
            id: legislation.bill.id,
            status: legislation.bill.status,
            statusDate: legislation.bill.statusDate,
            sponsors: legislation.bill.sponsors,
          })
        );

        const currentBills = newLegislation.feed.map(
          (legislation: WindyCiviBill) => ({
            id: legislation.bill.id,
            status: legislation.bill.status,
            statusDate: legislation.bill.statusDate,
            sponsors: legislation.bill.sponsors,
          })
        );

        // Find differences between old and new legislation
        const differences = findDifferences(prevBills, currentBills);
        if (differences.length > 0) {
          await scheduleLocalPushNotification({
            title: "New Legislation",
            body: `There are ${differences.length} legislation updates`,
            data: {},
          });
        }
      }

      await storeData({
        key: "legislation",
        value: newLegislation,
      });

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
