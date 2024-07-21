const Razorpay = require('razorpay');
const crypto = require('crypto');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET
});

const createOrder = async (amount) => {
  try {
    const options = {
      amount: amount * 100, 
      currency: 'INR',
      receipt: `receipt_${new Date().getTime()}`,
      payment_capture: 1
    };

    const order = await razorpay.orders.create(options);
    return order;
  } catch (error) {
    throw new Error('Error creating order');
  }
};

// verfy payment
const verifyPayment = (orderId, paymentId, signature) => {
  const body = `${orderId}|${paymentId}`;
  const expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_SECRET)
                                .update(body.toString())
                                .digest('hex');
  return expectedSignature === signature;
};

module.exports = { createOrder, verifyPayment };
