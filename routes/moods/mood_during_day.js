const express = require("express");
const router = express.Router();
const pool = require("../../db");

router.get("/mood_today/:uid", async (req, res) => {
  try {
    const userId = req.params.uid;

    const moodToday = await pool.query(
      "SELECT user_id, CASE WHEN EXTRACT(hour FROM time) >= 0 AND EXTRACT(hour FROM time) < 6 THEN 'Q1' WHEN EXTRACT(hour FROM time) >= 6 AND EXTRACT(hour FROM time) < 12 THEN 'Q2' WHEN EXTRACT(hour FROM time) >= 12 AND EXTRACT(hour FROM time) < 18 THEN 'Q3' ELSE 'Q4' END AS quarter_of_day, ROUND(AVG(value)) AS average_mood FROM moods WHERE DATE(time) = CURRENT_DATE AND user_id = $1 GROUP BY user_id, quarter_of_day",
      [userId]
    );

    console.log(moodToday.rows);

    if (moodToday.rows.length === 0) {
      return res.status(401).send({
        message: "No moods found!",
        error: 1,
      });
    }

    return res.status(201).send({
      message: "Mood during the day found!",
      moodToday: moodToday.rows,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send({
      message: "Error retrieving mood for the day.",
      error: error,
    });
  }
});

module.exports = router;
