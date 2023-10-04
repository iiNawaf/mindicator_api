const express = require("express");
const router = express.Router();
const pool = require("../../db");

router.post("/store", async (req, res) => {
  const { userId, steps, hrv, sleep, moodScore } = req.body;

  // Set the timestamp for health data creation
  const date = new Date();
  date.setHours(date.getHours() + 3);
  const formattedDate = date.toISOString().slice(0, 19).replace("T", " ");

  console.log(formattedDate);

  const healthData = await pool.query(
    "INSERT INTO health_data (user_id, hrv, steps, sleep_time_in_minutes, mood_score, time) VALUES ($1, $2, $3, $4, $5, $6)",
    [userId, steps, hrv, sleep, moodScore, formattedDate]
  );

  res.json(healthData);
});

module.exports = router;
