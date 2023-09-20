const express = require("express");
const router = express.Router();
const pool = require("../../db");
const bcrypt = require("bcrypt");

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // Check if email or password are empty.
  if (!email || !password) {
    return res
      .status(401)
      .send({ message: "Please provide both email and password." });
  }

  try {
    // Get user by email
    const user = await pool.query(
      "SELECT * FROM users WHERE email=lower($1)",
      [email]
    );

    const userObj = user.rows[0];

    // If there is no user: return message
    if(user.rows.length === 0){
        return res.status(401).send({ message: "Invalid credentials." });
    }
    
    // Compare the entered password with the hashed password stored in the database.
    const isPasswordValid = await bcrypt.compare(password, userObj.password);

    // If password is wrong: return message.
    if(!isPasswordValid){
        return res.status(401).send({ message: "Invalid credentials." });
    }

    // Get user current mood
    const userMood = await pool.query(
      "SELECT * FROM mood_profiles WHERE user_id=$1",
      [userObj.user_id]
    );
    
    userObj['current_mood'] = userMood.rows[0].mood_score;
    
    // If the login credentials are correct: log in.
    return res.status(201).send({ message: "Login successful!", userInfo: userObj });

  } catch (error) {
    return res.status(400).send({ message: "Error while logging in.", error: error });
  }

});

module.exports = router;
