const express = require("express");
const router = express.Router();
const pool = require("../../db");

router.put("/update/:uid", async (req, res) => {
  try {
    const userId = req.params.uid;
    const { moodScore } = req.body;

    const newMoodProfile = await pool.query(
      "UPDATE mood_profiles SET mood_score=$1 WHERE user_id=$2 RETURNING *",
      [moodScore, userId]
    );

    return res.status(201).send({
        message: "Mood profile updated successfully.",
        moodProfile: newMoodProfile.rows[0],
    });

  } catch (error) {
    return res.status(400).send({
        message: "Cannot update mood profile.",
        error: 1
    });
  }
});

module.exports = router;
