const nodemailer = require('nodemailer');
const createHttpError = require('http-errors');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD
  }
});

const sendResetPasswordEmail = async (email, resetToken) => {
  try {
    const resetUrl = `${process.env.APP_DOMAIN}/reset-password?token=${resetToken}`;
    
    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: email,
      subject: 'Password Reset Request',
      html: `
        <h2>Password Reset Request</h2>
        <p>You have requested to reset your password.</p>
        <p>Click the link below to reset your password:</p>
        <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
        <p>This link will expire in 5 minutes.</p>
        <p>If you didn't request this, please ignore this email.</p>
      `
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Email sending error:', error);
    throw createHttpError(500, 'Failed to send the email, please try again later.');
  }
};

module.exports = {
  sendResetPasswordEmail
}; 