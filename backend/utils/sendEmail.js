const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});

module.exports = (to, subject, text) =>
  transporter.sendMail({
    from: `"SaveIt" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
  });
