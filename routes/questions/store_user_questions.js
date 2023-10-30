const express = require("express");
const router = express.Router();
const pool = require("../../db");

router.post("/store", async (req, res) => {
  try {
    const { userId } = req.body;

    // Set the timestamp for questions creation
    const date = new Date();
    date.setHours(date.getHours() + 3);
    const formattedDate = date.toISOString().slice(0, 19).replace("T", " ");

    // Start the insert query
    await pool.query(
      `INSERT INTO questions (user_id, q_item_id, time) 
      SELECT $1, q_item_id, $2
      FROM question_list
      `,
      [userId, formattedDate]
    );

    return res.status(201).send({
      message: "Questions stored succesfully.",
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send({
      message: "Cannot stored questions.",
    });
  }
});

module.exports = router;
