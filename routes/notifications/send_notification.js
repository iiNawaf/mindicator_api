const express = require("express");
const router = express.Router();
const { getMessaging } = require("firebase-admin/messaging");

router.post("/send", async (req, res) => {
  try {
    const { fcmToken, title, body } = req.body;

    const message = {
      notification: {
        title: title,
        body: body,
      },
      android: {
        notification: {
          sound: 'default', // Use 'default' for the default notification sound
          priority: 'high' // Set notification priority to high
        }
      },
      apns: {
        payload: {
          aps: {
            sound: 'default' // Use 'default' for the default notification sound
          }
        }
      },
      token: fcmToken,
    };

    const response = await getMessaging().send(message);
    console.log("Successfully sent message:", response);
    res.status(201).send({
      message: "Notification successfully sent!",
      response: response,
    });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).send({ error: "Error sending message" });
  }
});

module.exports = router;
