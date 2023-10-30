const express = require("express");
const router = express.Router();
const pool = require("../../db");

router.put("/update/:id", async (req, res) => {
  try {
    const questionId = req.params.id;
    const { answer } = req.body;

    const newAnswer = await pool.query(
      "UPDATE questions SET answer = $1 WHERE question_id = $2 RETURNING *",
      [answer, questionId]
    );

    return res.status(201).send({
      message: "Answer updated successfully.",
      answer: newAnswer.rows[0],
    });
  } catch (error) {
    return res.status(400).send({
      message: "Cannot update the answer.",
      error: 1,
    });
  }
});
module.exports = router;
