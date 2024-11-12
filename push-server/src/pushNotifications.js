import { Expo } from "expo-server-sdk";

// Create a new Expo SDK client
const expo = new Expo();

// Function to send notifications
const sendNotifications = async (pushTokens, message) => {
  const messages = [];
  for (const pushToken of pushTokens) {
    if (!Expo.isExpoPushToken(pushToken)) {
      console.error(`Push token ${pushToken} is not a valid Expo push token`);
      continue;
    }

    messages.push({
      to: pushToken,
      sound: "default",
      body: message,
      data: { withSome: "data" },
    });
  }

  const chunks = expo.chunkPushNotifications(messages);
  const tickets = [];
  for (const chunk of chunks) {
    try {
      const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
      console.log(ticketChunk);
      tickets.push(...ticketChunk);
    } catch (error) {
      console.error(error);
    }
  }

  return tickets;
};

// Function to handle receipts
const handleReceipts = async (tickets) => {
  const receiptIds = [];
  for (const ticket of tickets) {
    if (ticket.id) {
      receiptIds.push(ticket.id);
    }
  }

  const receiptIdChunks = expo.chunkPushNotificationReceiptIds(receiptIds);
  for (const chunk of receiptIdChunks) {
    try {
      const receipts = await expo.getPushNotificationReceiptsAsync(chunk);

      if (receipts.length) {
        for (const receipt of receipts) {
          if (receipt.status === "ok") {
            continue;
          } else if (receipt.status === "error") {
            console.error(
              `There was an error sending a notification: ${receipt.message}`
            );
            if (receipt.details && receipt.details.error) {
              console.error(`The error code is ${receipt.details.error}`);
            }
          }
        }
      }
    } catch (error) {
      console.error(error);
    }
  }
};

export { sendNotifications, handleReceipts };
