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
  listingTitle,
  listingLocation,
  checkInDate,
  checkOutDate,
  hostName,
  hostPhone
) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: "Booking Confirmation",
    text: `Dear Guest,

Thank you for choosing our service!

We are pleased to confirm your booking at ${listingTitle} in ${listingLocation}. Below are your booking details:

- Check-In Date: ${checkInDate}
- Check-Out Date: ${checkOutDate}
- Total Stay Duration: ${calculateStayDuration(checkInDate, checkOutDate)} days

Your host for this stay will be ${hostName}. Should you need any assistance or have any questions, please feel free to contact your host directly at ${hostPhone}.

We are excited to host you and hope you have a wonderful stay. Should you have any additional questions or need further assistance, please do not hesitate to contact us.

Thank you once again for choosing our service. We look forward to welcoming you!

Best Regards,
WanderLust Team

---

Note: This is an automated message, please do not reply directly to this email.
`,
  };

  //   await transporter.sendMail(mailOptions);
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

module.exports = sendBookingConfirmation;
