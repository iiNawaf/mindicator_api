const express = require("express");
const router = express.Router();
const pool = require("../../db");

router.get("/current_mood/:uid", async (req, res) => {
  try {
    const userId = parseInt(req.params.uid);

    const userCurrentMood = await pool.query(
        "SELECT * FROM mood_profiles WHERE user_id=$1",
        [userId]
    );

    if(userCurrentMood.rows.length === 0){
        return res.status(401).send({
            message: "Cannot find user mood profile."
        });
    }else{
        return res.status(201).send({
            message: "Mood Profile found!",
            moodProfile: userCurrentMood.rows[0]
        })
    }

  } catch (error) {
    return res.status(400).send({
        message: "Cannot get current mood.",
        error: error,
    })
  }
});

module.exports = router;
