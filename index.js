const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");
const firebaseInit = require("./services/firebase");
const moodNotification = require("./cron/mood_notification");

// Initialize Firebase
firebaseInit();

//Middlewares
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

//Routes

app.get('/test', (req, res) => res.send("Hello There!"));

// Users Routes
app.use("/users", require("./routes/users/sign_up"));
app.use("/users", require("./routes/users/login"));
app.use("/users", require("./routes/users/update_user"));
app.use("/users", require("./routes/users/reset_password"));
app.use("/users", require("./routes/users/update_fcm_token"));

// Moods Routes
app.use("/moods", require("./routes/moods/create_mood"));
app.use("/moods", require("./routes/moods/get_current_mood"));
app.use("/moods", require("./routes/moods/get_mood_history"));
app.use("/moods", require("./routes/moods/mood_during_day"));
app.use("/moods", require("./routes/moods/update_mood_profile"));

// Recommendations Routes
app.use(
  "/recommendations",
  require("./routes/recommendations/create_recommendation")
);
app.use(
  "/recommendations",
  require("./routes/recommendations/get_user_recommendations")
);
app.use(
  "/recommendations",
  require("./routes/recommendations/update_recommendation")
);

// Health Data Routes
app.use("/health", require("./routes/health_data/store_health_data"));

// Notifications Routes
app.use("/notifications", require("./routes/notifications/send_notification"));

// Question Routes
app.use("/questions",require("./routes/questions/update_answer"));
app.use("/questions",require("./routes/questions/store_user_questions"));
app.use("/questions",require("./routes/questions/get_user_questions"));

// Schedule mood reminder notifications
moodNotification

//Listen
app.listen(8000, () => console.log("Listening to port 8000..."));

