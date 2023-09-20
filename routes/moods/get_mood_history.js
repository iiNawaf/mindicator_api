const express = require("express");
const router = express.Router();
const pool = require("../../db");

router.get('/mood_history/:uid', async (req, res) => {
    try {
        const userId = parseInt(req.params.uid);

        const moodHistory = await pool.query(
            "SELECT * FROM moods WHERE user_id=$1 ORDER BY time DESC",
            [userId]
        );

        if(moodHistory.rows.length === 0){
            return res.status(401).send({
                message: "No mood history found!"
            });
        }
        
        return res.status(201).send({
            message: "Mood history found!",
            moodHistory: moodHistory.rows
        });

    } catch (error) {
        return res.status(400).send({
            message: "Cannot get mood history.",
            error: error,
        });
    }
});

module.exports = router;