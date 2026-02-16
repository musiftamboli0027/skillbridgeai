const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  try {
    console.log(`[Email Service] Attempting to send email to: ${options.email}`);

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465, // Secure port for Gmail
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // Expected to be a Gmail App Password
      },
      // Reduce timeout issues on Render's free tier
      connectionTimeout: 10000,
      greetingTimeout: 5000,
      socketTimeout: 10000
    });

    const message = {
      from: `"${process.env.FROM_NAME || 'SkillBridge AI'}" <${process.env.EMAIL_USER}>`,
      to: options.email,
      subject: options.subject,
      html: options.html,
    };

    const info = await transporter.sendMail(message);

    console.log(`[Email Service] ✅ Success! Message ID: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error(`[Email Service] ❌ Failed to send email to ${options.email}:`, error.message);
    console.error(`[Email Service] Full Error Stack:`, error.stack);

    // Throw error so it can be handled by the controller (e.g. authController)
    throw new Error('Email sending failed. Please check backend logs for details.');
  }
};

const getVerificationEmailTemplate = (name, url) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
      <h2 style="color: #f47c20;">Welcome to SkillBridge AI!</h2>
      <p>Hello ${name},</p>
      <p>Thank you for registering. Please click the button below to verify your email address and activate your account:</p>
      <a href="${url}" style="display: inline-block; padding: 10px 20px; background-color: #f47c20; color: #fff; text-decoration: none; border-radius: 5px; margin-top: 10px;">Verify Email</a>
      <p style="margin-top: 20px;">If the button doesn't work, you can also copy and paste the following link into your browser:</p>
      <p><a href="${url}">${url}</a></p>
      <p>This link will expire in 30 minutes.</p>
      <p>Best regards,<br>The SkillBridge AI Team</p>
    </div>
  `;
};

const getResetPasswordEmailTemplate = (name, url) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
      <h2 style="color: #f47c20;">Password Reset Request</h2>
      <p>Hello ${name},</p>
      <p>You requested a password reset. Please click the button below to set a new password:</p>
      <a href="${url}" style="display: inline-block; padding: 10px 20px; background-color: #f47c20; color: #fff; text-decoration: none; border-radius: 5px; margin-top: 10px;">Reset Password</a>
      <p style="margin-top: 20px;">If you didn't request this, please ignore this email.</p>
      <p>The link will expire in 10 minutes.</p>
      <p>Best regards,<br>The SkillBridge AI Team</p>
    </div>
  `;
};

module.exports = {
  sendEmail,
  getVerificationEmailTemplate,
  getResetPasswordEmailTemplate,
};
