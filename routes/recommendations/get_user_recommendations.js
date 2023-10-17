const express = require("express");
const router = express.Router();
const pool = require("../../db");

router.get("/get/:uid", async (req, res) => {
  try {
    const userId = req.params.uid;

    const recommendations = await pool.query(
      "SELECT recommendations.r_id, recommendations.user_id, recommendations.mood_score, recommendation_list.value "+
      "FROM recommendations JOIN recommendation_list ON recommendations.r_item_id = recommendation_list.r_item_id "+
      "WHERE user_id = $1 AND status IS NULL",
      [userId]
    );

    if(recommendations.rows.length === 0){
        return res.status(401).send({
            message: "No recommendations found!"
        });
    }

    return res.status(201).send({
        message: "Recommendations retrieved successfully",
        recommendations: recommendations.rows
    });
  } catch (error) {
    return res.status(400).send({
      message: "An error occurred while getting user recommendations",
    });
  }
});

module.exports = router;
