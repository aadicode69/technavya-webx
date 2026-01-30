const nodemailer = require("nodemailer");

console.log("📧 email.js loaded");

const sendVerificationEmail = async (email, token) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const link = `http://localhost:5000/api/auth/verify/${token}`;

  await transporter.sendMail({
    from: `"Dayflow HRMS" <bossontherock2000@gmail.com>`,
    to: email,
    subject: "Verify your Dayflow account",
    html: `
      <h3>Welcome to Dayflow</h3>
      <p>Click below to verify your email:</p>
      <a href="${link}">${link}</a>
      <p>This link expires in 24 hours.</p>
    `,
  });
};

module.exports = sendVerificationEmail;
