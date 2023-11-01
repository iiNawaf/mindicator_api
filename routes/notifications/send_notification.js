const express = require("express");
const router = express.Router();
const pool = require("../../db");
const { getMessaging } = require("firebase-admin/messaging");

router.post("/send", async (req, res) => {
  try {
    const { title, body } = req.body;

    const fcmTokens = await pool.query(
      "SELECT DISTINCT fcm_token FROM users WHERE fcm_token IS NOT NULL"
    );

    const tokens = fcmTokens.rows.map(row => row.fcm_token);

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
      tokens: tokens,
    };

    const response = await getMessaging().sendEachForMulticast(message);
    res.status(201).send({
      message: "Notification successfully sent!",
      successCount: response.successCount,
      failureCount: response.failureCount
    });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).send({ error: "Error sending message" });
  }
});

module.exports = router;
