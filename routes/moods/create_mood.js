const express = require("express");
const router = express.Router();
const pool = require("../../db");

router.post("/create", async (req, res) => {
  try {
    const { userId, value } = req.body;

    // Set the timestamp for mood creation
    const date = new Date();
    date.setHours(date.getHours() + 3);
    const formattedDate = date.toISOString().slice(0, 19).replace('T', ' ');

    // insert new mood query
    const newMood = await pool.query(
      "INSERT INTO moods (user_id, value, time) VALUES($1, $2, $3) RETURNING *",
      [userId, value, formattedDate]
    );

    // Update the user mood profile with the new mood value.
    const updatedMoodProfile = await pool.query(
      "UPDATE mood_profiles SET mood_score=$1 WHERE user_id=$2 RETURNING *",
      [value, userId]
    )

    // if the creation is success
    return res.status(201).send({
        message: "Mood created successfully!",
        moodInfo: newMood.rows[0],
        updatedMoodProfile: updatedMoodProfile.rows[0]
    });


  } catch (error) {
    return res.status(400).send({
        message: "Cannot insert into moods.",
        error: error
    });
  }
});

module.exports = router;
