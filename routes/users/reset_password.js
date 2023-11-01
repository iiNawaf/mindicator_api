const express = require("express");
const router = express.Router();
const pool = require("../../db");
const bcrypt = require("bcryptjs");
const transporter = require("../../services/node_mailer");
const generateCharacters = require("../../generateCharacters");
const randomTenDigitNumber = require("../../generateCharacters");
require("dotenv").config();

router.post("/reset_password", async (req, res) => {
  const { email } = req.body;

  const user = await pool.query("SELECT * FROM users WHERE email=$1", [email]);

  if (user.rows.length === 0) {
    return res.status(401).send({
      message: "Email not found.",
      error: 1,
    });
  } else {
    // Password hash
    const newPassword = randomTenDigitNumber.toString();
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);


    const updatedUserPassword = await pool.query(
      "UPDATE users SET password=$1 WHERE user_id=$2 RETURNING *",
      [hashedPassword, user.rows[0].user_id]
    );

    var mailOptions = {
      from: process.env.GMAIL_EMAIL,
      to: email,
      subject: "Mindicator - Reset Password!",
      text: `Your new generated password is: ${newPassword}`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        res.status(401).send({
            message: "Cannot send email.",
            error: error
        });
      } else {
        res.status(201).send({
            message: "User password updated successfully!",
            user: updatedUserPassword.rows[0],
            emailInfo: info
        })
      }
    });

  }
});

module.exports = router;
