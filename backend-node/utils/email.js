const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  try {
    console.log(`[Email Service] Attempting to send email to: ${options.email}`);

    // ✅ Render-safe Gmail transporter
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,            // IMPORTANT: use 587 on Render
      secure: false,        // must be false for 587
      requireTLS: true,     // force TLS upgrade
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // Gmail App Password
      },
      connectionTimeout: 60000,
      greetingTimeout: 30000,
      socketTimeout: 60000,
      tls: {
        rejectUnauthorized: false,
      },
    });

    // ✅ Verify SMTP connection
    await transporter.verify();
    console.log("[Email Service] SMTP connection established successfully");

    const message = {
      from: `"${process.env.FROM_NAME || "SkillBridge AI"}" <${process.env.EMAIL_USER}>`,
      to: options.email,
      subject: options.subject,
      html: options.html,
    };

    const info = await transporter.sendMail(message);

    console.log(`[Email Service] ✅ Email sent! Message ID: ${info.messageId}`);
    return info;

  } catch (error) {
    console.error(`[Email Service] ❌ Failed to send email to ${options.email}:`, error.message);
    console.error(`[Email Service] Full Error Stack:`, error.stack);
    throw new Error("Email sending failed. Please check backend logs for details.");
  }
};

const getVerificationEmailTemplate = (name, url) => {
  return `
    <div style="font-family: Arial; max-width:600px; margin:auto;">
      <h2 style="color:#f47c20;">Welcome to SkillBridge AI!</h2>
      <p>Hello ${name},</p>
      <p>Please verify your email:</p>
      <a href="${url}" style="padding:10px 20px;background:#f47c20;color:#fff;text-decoration:none;border-radius:5px;">Verify Email</a>
      <p>If button doesn't work:</p>
      <a href="${url}">${url}</a>
    </div>
  `;
};

const getResetPasswordEmailTemplate = (name, url) => {
  return `
    <div style="font-family: Arial; max-width:600px; margin:auto;">
      <h2 style="color:#f47c20;">Password Reset</h2>
      <p>Hello ${name},</p>
      <p>Click below to reset password:</p>
      <a href="${url}" style="padding:10px 20px;background:#f47c20;color:#fff;text-decoration:none;border-radius:5px;">Reset Password</a>
    </div>
  `;
};

module.exports = {
  sendEmail,
  getVerificationEmailTemplate,
  getResetPasswordEmailTemplate,
};
