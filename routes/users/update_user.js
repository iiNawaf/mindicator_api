const express = require("express");
const router = express.Router();
const pool = require("../../db");

router.put("/update/:uid", async (req, res) => {
  try {
    const userId = parseInt(req.params.uid);
    const { name, phone, dateOfBirth } = req.body;

    // const checkUser = await pool.query("SELECT * FROM users WHERE email=$1", [
    //   email,
    // ]);

    const updatedUser = await pool.query(
        "UPDATE users SET name = $1, phone = $2, date_of_birth = $3 WHERE user_id = $4 RETURNING *",
        [name, phone, dateOfBirth, userId]
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
