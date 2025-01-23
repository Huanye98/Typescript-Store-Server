const {
  storeTransactionDb,
  updatePaymentIntentDb,
} = require("../models/Stripe.model");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const paymentIntent = async (req, res, next) => {
  const { amount, currency, userId } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      metadata: { userId },
    });
    console.log(paymentIntent)
    await storeTransactionDb(
      paymentIntent.id,
      userId,
      amount,
      currency,
      "incomplete",
      paymentIntent.client_secret
    );

    res.status(200).json({
      message: "good payment intent",
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    next(error);
  }
};

const updatePaymentIntent = async (req, res, next) => {
  const { clientSecret, paymentIntentId } = req.body;

  try {
    await updatePaymentIntentDb( paymentIntentId, clientSecret,);
    res.status(200).json({ message: "Payment status updated successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = { paymentIntent, updatePaymentIntent };
