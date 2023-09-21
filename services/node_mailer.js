var nodemailer = require("nodemailer");
require('dotenv').config();

var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_EMAIL,
    pass: process.env.GMAIL_PASSWORD
  },
});

module.exports = transporter;
