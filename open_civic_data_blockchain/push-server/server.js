import express from "express";
import { sendNotifications, handleReceipts } from "./src/pushNotifications.js";

const app = express();
const port = 8080;

app.use(express.json());

app.post("/send-notifications", async (req, res) => {
  const { pushTokens, message } = req.body;
  try {
    const tickets = await sendNotifications(pushTokens, message);
    await handleReceipts(tickets);
    res.status(200).send("Notifications sent successfully");
  } catch (error) {
    res.status(500).send("Error sending notifications");
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
