const ContactMessage = require('../models/ContactMessage');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');

/**
 * Handles support message submissions from the Contact Us footer form.
 * Supports silent honeypot spam filtering.
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

  // Create new contact message in database
  await ContactMessage.create({
    name: name.trim(),
    email: email.trim().toLowerCase(),
    message: message.trim()
  });

  return res.status(200).json({
    success: true,
    message: 'Thank you! Your message has been received.'
  });
});

module.exports = {
  submitContactMessage
};
