const ContactMessage = require('../models/ContactMessage');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');
const sendEmail = require('../utils/sendEmail');

/**
 * Handles support message submissions from the Contact Us footer form.
 * Supports silent honeypot spam filtering, MongoDB storage, and Nodemailer notifications.
 * @route POST /api/v1/contact
 */
const submitContactMessage = asyncHandler(async (req, res, next) => {
  const { name, email, message, website } = req.body;

  // Honeypot spam protection: silently discard submissions if the hidden "website" field is filled
  if (website) {
    console.log("🤖 Spam bot caught by honeypot field. Discarding message silently.");
    return res.status(200).json({
      success: true,
      message: 'Thank you! Your message has been received.'
    });
  }

  // Basic validation
  if (!name || !name.trim()) {
    return next(new AppError('Please provide your name.', 400));
  }

  if (!email || !email.trim()) {
    return next(new AppError('Please provide your email address.', 400));
  }

  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  if (!emailRegex.test(email)) {
    return next(new AppError('Please provide a valid email address.', 400));
  }

  if (!message || !message.trim()) {
    return next(new AppError('Please provide a message.', 400));
  }

  if (message.trim().length < 10) {
    return next(new AppError('Message must be at least 10 characters long.', 400));
  }

  if (message.trim().length > 1000) {
    return next(new AppError('Message cannot exceed 1000 characters.', 400));
  }

  // 1. Create new contact message in database
  const contactDoc = await ContactMessage.create({
    name: name.trim(),
    email: email.trim().toLowerCase(),
    message: message.trim()
  });

  // 2. Terminal Notification
  console.log('\n=============================================================');
  console.log('📬 [NEW CONTACT MESSAGE RECEIVED]');
  console.log(`From    : ${contactDoc.name} (${contactDoc.email})`);
  console.log(`Time    : ${contactDoc.createdAt}`);
  console.log(`Message : ${contactDoc.message}`);
  console.log('=============================================================\n');

  // 3. Attempt Email Notification via Nodemailer (non-blocking)
  try {
    await sendEmail({
      subject: `📬 New Contact Form Message from ${contactDoc.name}`,
      text: `You received a new message from ${contactDoc.name} (${contactDoc.email}):\n\n"${contactDoc.message}"`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #111;">
          <h2 style="color: #0284c7;">New Contact Message — NoobSyte</h2>
          <p><strong>Name:</strong> ${contactDoc.name}</p>
          <p><strong>Email:</strong> ${contactDoc.email}</p>
          <hr />
          <p style="white-space: pre-line; background: #f8fafc; padding: 15px; border-left: 4px solid #0284c7;">
            ${contactDoc.message}
          </p>
        </div>
      `
    });
  } catch (emailErr) {
    console.log('Email delivery skipped or failed:', emailErr.message);
  }

  return res.status(200).json({
    success: true,
    message: 'Thank you! Your message has been received.'
  });
});

/**
 * Get all submitted contact messages (sorted newest first)
 * @route GET /api/v1/contact
 */
const getContactMessages = asyncHandler(async (req, res, next) => {
  const messages = await ContactMessage.find().sort('-createdAt');

  return res.status(200).json({
    success: true,
    count: messages.length,
    data: messages
  });
});

module.exports = {
  submitContactMessage,
  getContactMessages
};
