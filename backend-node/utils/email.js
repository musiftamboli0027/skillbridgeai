const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const message = {
        from: `${process.env.FROM_NAME || 'SkillBridge AI'} <${process.env.FROM_EMAIL || 'noreply@skillbridge.ai'}>`,
        to: options.email,
        subject: options.subject,
        html: options.html,
    };

    const info = await transporter.sendMail(message);

    console.log('Message sent: %s', info.messageId);
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
