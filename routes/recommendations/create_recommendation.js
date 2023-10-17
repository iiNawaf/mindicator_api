const express = require("express");
const router = express.Router();
const pool = require("../../db");

router.post("/create", async (req, res) => {
  try {
    const { userId, moodScore } = req.body;

    // Set the timestamp for mood creation
    const date = new Date();
    date.setHours(date.getHours() + 3);
    const formattedDate = date.toISOString().slice(0, 19).replace("T", " ");

    // filter recommendations list
    let recommendations = [];

    if (moodScore <= 4) {
      const recommendationList = await pool.query(
        "SELECT * FROM recommendation_list WHERE mood_type = 'BAD' ORDER BY RANDOM() LIMIT 3"
      );
      recommendations = recommendationList.rows;
    } else if (moodScore <= 9) {
      const recommendationList = await pool.query(
        "SELECT * FROM recommendation_list WHERE mood_type = 'GOOD' ORDER BY RANDOM() LIMIT 3"
      );
      recommendations = recommendationList.rows;
    }
    // End filteration

    // Create the recommendation
    if (recommendations.length !== 0) {
      // Loop and insert into recommendations
      for (var i = 0; i < recommendations.length; i++) {
        await pool.query(
          "INSERT INTO recommendations (user_id, r_item_id, mood_score, time) VALUES ($1, $2, $3, $4)",
          [userId, recommendations[i].r_item_id, moodScore, formattedDate]
        );
      }
      // Insert success
      return res.status(201).send({
        message: `Recommendations has been added for user ${userId}`,
      });
    } else {
      return res.status(401).send({
        message: "There is no recommendation to add.",
      });
    }
  } catch (error) {
    return res.status(400).send({
        message: "An error occurred while inserting recommendations."
    });
  }
});

module.exports = router;
