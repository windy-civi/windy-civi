import { useState, useEffect } from "react";
import * as BackgroundFetch from "expo-background-fetch";
import * as TaskManager from "expo-task-manager";
import { github } from "../../utils/gh-get";

const BACKGROUND_FETCH_TASK = "background-fetch";

TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
  const now = Date.now();

  console.log(
    `Got background fetch call at date: ${new Date(now).toISOString()}`
  );

  // Add the legislation fetch here
  const legislation = await github.getLegislation("chicago");
  console.log("Background Fetch - Legislation:", legislation);

  // Be sure to return the successful result type!
  return BackgroundFetch.BackgroundFetchResult.NewData;
});

async function registerBackgroundFetchAsync() {
  return BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
    minimumInterval: 60 * 10, // 1 day
    stopOnTerminate: false, // android only,
    startOnBoot: true, // android only
  });
}

export default function BackgroundFetchScreen() {
  const [isRegistered, setIsRegistered] = useState(false);
  const [status, setStatus] =
    useState<BackgroundFetch.BackgroundFetchStatus | null>(null);

  useEffect(() => {
    checkStatusAsync();
  }, []);

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
}
