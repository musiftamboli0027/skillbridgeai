const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Send email using Resend API
 * @param {Object} options - { email, subject, html }
 */
const sendEmail = async ({ email, subject, html }) => {
  try {
    const response = await resend.emails.send({
      from: process.env.EMAIL_FROM || "SkillBridge <onboarding@resend.dev>",
      to: email,
      subject: subject,
      html: html
    });

    console.log("[Email Service] Email dispatched via Resend:", response);
    return response;

  } catch (error) {
    console.error("[Email Service] Resend Error:", error);
    // Don't throw to prevent crashing the response flow
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
