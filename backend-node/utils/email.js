const { Resend } = require("resend");

// Initialize Resend with API Key lazily to prevent startup crashes if key is missing
let resend;
try {
  if (process.env.RESEND_API_KEY) {
    resend = new Resend(process.env.RESEND_API_KEY);
  } else {
    console.warn("[Email Service] ⚠️ RESEND_API_KEY is missing. Email features will fail.");
  }
} catch (error) {
  console.error("[Email Service] ❌ Failed to initialize Resend client:", error.message);
}

/**
 * Send email using Resend API
 * @param {Object} options - { email, subject, html }
 */
const sendEmail = async (options) => {
  try {
    if (!resend) {
      // Re-try initialization if it failed or wasn't configured
      if (process.env.RESEND_API_KEY) {
        resend = new Resend(process.env.RESEND_API_KEY);
      } else {
        throw new Error("RESEND_API_KEY is missing. Please add it to your environment variables.");
      }
    }

    console.log(`[Email Service] Attempting to send email via Resend to: ${options.email}`);

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
    throw new Error(`Email sending failed: ${error.message}`);
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
