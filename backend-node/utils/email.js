const { Resend } = require("resend");

// Initialize Resend with API Key
const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Send email using Resend API
 * @param {Object} options - { email, subject, html }
 */
const sendEmail = async (options) => {
  try {
    console.log(`[Email Service] Attempting to send email via Resend to: ${options.email}`);

    // Note: If you haven't verified a domain on Resend, 
    // you must use 'onboarding@resend.dev' as the from address.
    const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
    const fromName = process.env.FROM_NAME || "SkillBridge AI";

    const { data, error } = await resend.emails.send({
      from: `"${fromName}" <${fromEmail}>`,
      to: options.email,
      subject: options.subject,
      html: options.html,
    });

    if (error) {
      console.error(`[Email Service] ❌ Resend API Error:`, error);
      throw new Error(error.message);
    }

    console.log(`[Email Service] ✅ Email sent! Resource ID: ${data.id}`);
    return data;

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
