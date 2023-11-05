const express = require("express");
const router = express.Router();
const pool = require("../../db");

router.get('/mood_history/:uid', async (req, res) => {
    try {
        const userId = parseInt(req.params.uid);
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;

        const offset = (page - 1) * pageSize;

        const moodHistory = await pool.query(
            "SELECT (time AT TIME ZONE 'UTC') AS time_utc, * FROM moods WHERE user_id=$1 ORDER BY time DESC LIMIT $2 OFFSET $3",
            [userId, pageSize, offset]
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
