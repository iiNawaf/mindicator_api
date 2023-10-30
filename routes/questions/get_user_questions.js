const express = require("express");
const router = express.Router();
const pool = require("../../db");

router.get("/:uid", async (req, res) => {
  try {
    const userId = req.params.uid;

    const userQuestions = await pool.query(
      `
    SELECT questions.question_id, question_list.value, questions.answer
    FROM questions
    JOIN question_list ON questions.q_item_id = question_list.q_item_id
    WHERE user_id = $1`,
      [userId]
    );
    if (userQuestions.rows.length === 0) {
      return res.status(401).send({
        message: "List is empty.",
      });
    }

    return res.status(201).send({
      message: "Question retrieved successfully.",
      userQuestions: userQuestions.rows,
    });
  } catch (error) {
    return res.status(400).send({
      message: "An error occurred",
    });
  }
});

module.exports = router;
