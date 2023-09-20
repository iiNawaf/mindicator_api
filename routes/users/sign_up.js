const express = require("express");
const router = express.Router();
const pool = require("../../db");
const bcrypt = require("bcrypt");

router.post("/signup", async (req, res) => {
  try {
    const { name, password, phone, email, gender, dateOfBirth } = req.body;
    
    // Password hash
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Check if email address is already used
    const searchedEmail = await pool.query("SELECT email FROM users WHERE email=lower($1)", [email]);
    if(searchedEmail.rows.length > 0){
      return res.status(401).send({
        message: "Email address is already used.",
        error: 1,
      })
    }else{
      // Create user record.
      const newUser = await pool.query(
      "INSERT INTO users(name, password, phone, email, gender, date_of_birth) VALUES($1, $2, $3, lower($4), $5, $6) RETURNING *",
      [name, hashedPassword, phone, email, gender, dateOfBirth]
    );

    // Create Mood Profile for the user created above.
    const userMoodProfile = await pool.query(
      "INSERT INTO mood_profiles (user_id, mood_score) VALUES ($1, $2) RETURNING *",
      [newUser.rows[0].user_id, -1]
    );

    var userObj = newUser.rows[0];

    userObj['current_mood'] = userMoodProfile.rows[0].mood_score

    // success
    return res.status(201).send({
      message: "User created successfully!",
      userInfo: userObj,
      // userMoodProfile: userMoodProfile.rows[0],
    });
    }

  } catch (e) {
    return res.status(400).send({
      message: "Error creating user.",
      error: e,
    });
  }
});

module.exports = router;