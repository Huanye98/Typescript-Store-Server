const db = require("../../db/index");

const storeTransactionDb = async (
  paymentId,
  userId,
  amount,
  currency,
  status,
  clientSecret
) => {
  try {
    await db.query(
      "insert into transactions (payment_id, user_id, amount, currency, status,client_secret) values ($1,$2,$3,$4,$5,$6)",
      [paymentId, userId, amount, currency, status, clientSecret]
    );
  } catch (error) {
    console.log("Database error:", error);
    throw error;
  }
};
const updatePaymentIntentDb = async (paymentIntentId, clientSecret) => {
  try {
    const payment = await db.query(
      `update transactions
            set status = 'complete' 
            where payment_id = $1 and client_secret = $2
            returning *`,
      [paymentIntentId, clientSecret]
    );
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }
  } catch (error) {
    console.log("Database error:", error);
    throw error;
  }
};

module.exports = { storeTransactionDb, updatePaymentIntentDb };
