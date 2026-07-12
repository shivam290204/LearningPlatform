const nodemailer = require('nodemailer');

/**
 * Send an email notification using Nodemailer if credentials are provided in .env
 * @param {Object} options - { to, subject, text, html }
 */
const sendEmail = async (options) => {
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;

  if (!emailUser || !emailPass || emailUser.includes('yourpersonalemail')) {
    // If credentials aren't set in .env yet or are default placeholders, skip SMTP sending
    return false;
  }

  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
      user: emailUser,
      pass: emailPass
    }
  });

  const mailOptions = {
    from: `"NoobSyte Platform" <${emailUser}>`,
    to: options.to || process.env.CONTACT_RECEIVER_EMAIL || emailUser,
    subject: options.subject,
    text: options.text,
    html: options.html
  };

  await transporter.sendMail(mailOptions);
  return true;
};

module.exports = sendEmail;
