const express = require("express");
const router = express.Router();
const pool = require("../../db");

router.put("/fcmToken/:uid", async (req, res) => {
  try {
    const userId = parseInt(req.params.uid);
    const { fcmToken } = req.body;

    const updatedUser = await pool.query(
        "UPDATE users SET fcm_token = $1 WHERE user_id = $2 RETURNING *",
        [fcmToken, userId]
      );
      return res.status(201).send({
        message: "successfully updated",
        updatedUser: updatedUser.rows[0],
      });
  } catch (error) {
    return res.status(400).send({
      message: "Failed updating the user!",
      error: error,
    });
  }
});

module.exports = router;
