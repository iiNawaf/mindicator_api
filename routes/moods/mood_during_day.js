const express = require("express");
const router = express.Router();
const pool = require("../../db");

router.get("/mood_today/:uid", async (req, res) => {
  try {
    const userId = req.params.uid;

  const moodToday = await pool.query(
    "SELECT * FROM moods WHERE user_id = $1 AND DATE_TRUNC('day', time + INTERVAL '1 day') = CURRENT_DATE + INTERVAL '1 day' ORDER BY time",
    [userId]
  );

  if(moodToday.rows.length === 0){
    return res.status(401).send({
        message: "No moods found!",
        error: 1
    });
  }

  return res.status(201).send({
    message: "Mood during the day found!",
    moodToday: moodToday.rows
  });
  } catch (error) {
    return res.status(400).send({
        message: "Error retrieving mood for the day.",
        error: error
    });
  }
});

module.exports = router;
