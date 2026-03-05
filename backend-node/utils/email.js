const nodemailer = require("nodemailer");

/**
 * Send email using Nodemailer (Gmail SMTP)
 * @param {Object} options - { email, subject, html }
 */
const sendEmail = async (options) => {
  try {
    // Basic validation
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      throw new Error("Email configuration missing in .env (EMAIL_USER or EMAIL_PASS)");
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_PORT) || 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      // Debug info
      debug: process.env.NODE_ENV === 'development',
      logger: process.env.NODE_ENV === 'development'
    });

    const fromName = process.env.FROM_NAME || "SkillBridge AI";
    const fromEmail = process.env.FROM_EMAIL || process.env.EMAIL_USER;

    const mailOptions = {
      from: `"${fromName}" <${fromEmail}>`,
      to: options.email,
      subject: options.subject || "No Subject",
      html: options.html,
    };

    console.log(`[Email Service] Attempting to dispatch email to: ${options.email}`);

    const info = await transporter.sendMail(mailOptions);

    console.log(`[Email Service] ✅ Email sent successfully! MessageID: ${info.messageId}`);
    return info;

  } catch (error) {
    console.error(`[Email Service] ❌ Fatal Error:`, error.message);
    throw new Error(`Email failed: ${error.message}`);
  }
};

const getVerificationEmailTemplate = (name, url) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width:600px; margin:auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
      <h2 style="color:#f47c20;">Welcome to SkillBridge AI, ${name}!</h2>
      <p>Thank you for joining us. Please verify your email address to unlock all features:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${url}" style="padding:12px 24px; background:#f47c20; color:#fff; text-decoration:none; border-radius:5px; font-weight: bold; display: inline-block;">Verify My Email</a>
      </div>
      <p style="color: #666; font-size: 14px;">If the button above does not work, copy and paste this link into your browser:</p>
      <p style="color: #f47c20; font-size: 12px; word-break: break-all;">${url}</p>
      <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
      <p style="color: #999; font-size: 12px;">This is an automated email. Please do not reply.</p>
    </div>
  `;
};

const getResetPasswordEmailTemplate = (name, url) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width:600px; margin:auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
      <h2 style="color:#f47c20;">Password Reset Request</h2>
      <p>Hello ${name}, we received a request to reset your password. Click the button below to continue:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${url}" style="padding:12px 24px; background:#f47c20; color:#fff; text-decoration:none; border-radius:5px; font-weight: bold; display: inline-block;">Reset Password</a>
      </div>
      <p style="color: #666; font-size: 14px;">This link will expire in 10 minutes. If you did not request this, please ignore this email.</p>
      <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
      <p style="color: #999; font-size: 12px;">SkillBridge AI Team</p>
    </div>
  `;
};

module.exports = {
  sendEmail,
  getVerificationEmailTemplate,
  getResetPasswordEmailTemplate,
};
