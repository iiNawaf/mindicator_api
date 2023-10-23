const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");
const fetch = require("node-fetch");
const admin = require("firebase-admin");
const serviceAccount = require("./mindicatorapp-6df6a-firebase-adminsdk-y85rk-334b998653.json");
const cron = require("node-cron");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

//Middlewares
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

//Routes

// Users Routes
app.use("/users", require("./routes/users/sign_up"));
app.use("/users", require("./routes/users/login"));
app.use("/users", require("./routes/users/update_user"));
app.use("/users", require("./routes/users/reset_password"));

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

// Schedule notifications
const body = {
  fcmToken:
    "dproAfuKlUbFkEH4MzBqbF:APA91bHDClmlxlfhwvfbHacZkNYJpwM7QhmbI-TjwyHehjfFQau45lsgK5HqXgoi4Wmhi8a3ULTVeWAye9SyQ_bpVOd7Dim1aSmhSYohamDNeHngCKvW-rZTIns14MKiuVI91TjJRCMh",
  title: "Check your mood!",
  body: "Enter the app to see how you feel at the moment.",
};

// Define the schedule using cron syntax
const schedule = "0 0,6,12,18 * * *";

// Define the task you want to repeat
const task = async () => {
  // This function will be executed at the specified times
  console.log("Task executed at:", new Date());
  try {
    const response = await fetch("http://localhost:8000/notifications/send", {
    method: "post",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });
  const data = await response.json();

  console.log(data);
  } catch (error) {
    console.log("Error:", error);
  }
};

// Schedule the task
cron.schedule(schedule, task);

//Listen
app.listen(8000, () => console.log("Listening to port 8000..."));
