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
    // const currentHour = parseInt(formattedDate.split(' ')[1].split(':')[0]);

    // Check if the mood calculated for the quarter
    // if (currentHour >= 0 && currentHour <= 5) {
    //   const countInQuarter1 = await pool.query(
    //     "SELECT COUNT(*) FROM moods WHERE DATE(time) = CURRENT_DATE AND EXTRACT(HOUR FROM time) BETWEEN 0 AND 5 AND user_id=$1",
    //     [userId]
    //   );
    //   // Process countInQuarter1 result
    //   if(countInQuarter1.rows[0].count !== '0'){
    //     return res.status(402).send({
    //       message: "Mood already calculated in quarter 1"
    //     });
    //   }
    // } else if (currentHour >= 6 && currentHour <= 11) {
    //   const countInQuarter2 = await pool.query(
    //     "SELECT COUNT(*) FROM moods WHERE DATE(time) = CURRENT_DATE AND EXTRACT(HOUR FROM time) BETWEEN 6 AND 11 AND user_id=$1",
    //     [userId]
    //   );
    //   // Process countInQuarter2 result
    //   if(countInQuarter2.rows[0].count !== '0'){
    //     return res.status(402).send({
    //       message: "Mood already calculated in quarter 2"
    //     });
    //   }
    // } else if (currentHour >= 12 && currentHour <= 17) {
    //   const countInQuarter3 = await pool.query(
    //     "SELECT COUNT(*) FROM moods WHERE DATE(time) = CURRENT_DATE AND EXTRACT(HOUR FROM time) BETWEEN 12 AND 17 AND user_id=$1",
    //     [userId]
    //   );
    //   // Process countInQuarter3 result
    //   if(countInQuarter3.rows[0].count !== '0'){
    //     return res.status(402).send({
    //       message: "Mood already calculated in quarter 3"
    //     });
    //   }
    // } else if (currentHour >= 18 && currentHour <= 23) {
    //   const countInQuarter4 = await pool.query(
    //     "SELECT COUNT(*) FROM moods WHERE DATE(time) = CURRENT_DATE AND EXTRACT(HOUR FROM time) BETWEEN 18 AND 23 AND user_id=$1",
    //     [userId]
    //   );
    //   if(countInQuarter4.rows[0].count !== '0'){
    //     return res.status(402).send({
    //       message: "Mood already calculated in quarter 4"
    //     });
    //   }
    // }

    // End check

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
        updatedMoodProfile: updatedMoodProfile.rows[0],
    });


  } catch (error) {
    return res.status(400).send({
        message: "Cannot insert into moods.",
        error: error
    });
  }
});

module.exports = router;
