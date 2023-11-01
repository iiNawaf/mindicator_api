const fetch = require("node-fetch");
const cron = require("node-cron");

const body = {
  title: "Check Your Mood!",
  body: "Enter the app to see how you feel at the moment.",
};

// Define the schedule using cron syntax
const schedule = "0 * * * *";

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
module.exports = cron.schedule(schedule, task);
