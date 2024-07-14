require("dotenv").config();
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendBookingConfirmation = async (
  to,
  username,
  listingTitle,
  listingLocation,
  checkInDate,
  checkOutDate,
  hostName,
  hostPhone,
  pricePerNight
) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: "Booking Confirmation",
    html: `<p>Dear <strong>${username}</strong>,</p>
      <p>Thank you for choosing our service!</p>
      <p>We are pleased to confirm your booking at <strong>${listingTitle}</strong> in <strong>${listingLocation}</strong>. Below are your booking details:</p>
      <ul>
        <li>Check-In Date: <strong>${checkInDate}</strong></li>
        <li>Check-Out Date: <strong>${checkOutDate}</strong></li>
        <li>Total Stay Duration:<strong> ${calculateStayDuration(
          checkInDate,
          checkOutDate
        )} days</strong></li>
        <li>Total Price:<strong> ${calculateTotalPrice(
          pricePerNight,
          calculateStayDuration(checkInDate, checkOutDate)
        )} </strong></li>
      </ul>
      <p>Your host for this stay will be <strong>${hostName}</strong>. Should you need any assistance or have any questions, please feel free to contact your host directly at <strong>${hostPhone}</strong>.</p>
      <p>We are excited to host you and hope you have a wonderful stay. Should you have any additional questions or need further assistance, please do not hesitate to contact us.</p>
      <p>Thank you once again for choosing our service. We look forward to welcoming you!</p>
      <p>Best Regards,<br>WanderLust Team</p>
      <p>---</p>
      <p><em>Note: This is an automated message, please do not reply directly to this email.</em></p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending booking confirmation email:", error);
    throw new Error(
      "Booking created successfully but there was an issue sending the confirmation email."
    );
  }
};

const calculateStayDuration = (checkInDate, checkOutDate) => {
  const checkIn = new Date(checkInDate);
  const checkOut = new Date(checkOutDate);
  const duration = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
  return duration;
};

const calculateTotalPrice = (pricePerNight, stayDuration) => {
  if (!stayDuration) {
    throw new Error("Stay duration is required to calculate total price");
  }
  return pricePerNight * stayDuration;
};

const sendWelcomeEmail = async (to, username) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: "Welcome to Our Website!",
    html: `<p>Dear <strong>${username}</strong>,</p>
      <p>Welcome to our website! We are thrilled to have you join our community.</p>
      <p>Thank you for signing up. We look forward to providing you with a great experience.</p>
      <p>If you have any questions or need assistance, feel free to reach out to us.</p>
      <p>Best Regards,<br>WanderLust Team</p>
      <p>---</p>
      <p><em>Note: This is an automated message, please do not reply directly to this email.</em></p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending welcome email:", error);
    throw new Error("Error sending the welcome email.");
  }
};

const sendOtpEmail = async (email, otp) => {
  const mailOptions = {
    from: 'your-email@gmail.com',
    to: email,
    subject: 'Your OTP for Account Deletion',
    html: `Your OTP for account deletion is: <strong>${otp}</strong>. It is valid for 10 minutes.`
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendBookingConfirmation, sendWelcomeEmail, sendOtpEmail };
