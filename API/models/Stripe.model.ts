import { Transaction } from "../../types/Users";
const db = require("../../db/index");

const storeTransactionDb = async (transaction: Transaction) => {
  const { paymentId, userId, amount, currency, status, clientSecret } = transaction;
  try {
    await db.query(
      "insert into transactions (payment_id, user_id, amount, currency, status,client_secret) values ($1,$2,$3,$4,$5,$6)",
      [paymentId, userId, amount, currency, status, clientSecret]
    );
  } catch (error) {
    let errorMessage = "Unknown error";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    throw new Error(
      `Database Error: failed to store transaction. ${errorMessage}`
    );
  }
};

const updatePaymentIntentDb = async (
  paymentIntentId: number,
  clientSecret: string
) => {
  try {
    const payment = await db.query(
      `update transactions
            set status = 'complete' 
            where payment_id = $1 and client_secret = $2
            returning *`,
      [paymentIntentId, clientSecret]
    );
    if (!payment) {
      throw new Error("Payment not found");
    }
  } catch (error) {
    console.log("Database error:", error);
    let errorMessage = "Unknown error";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    throw new Error(
      `Database Error: failed to update payment data. ${errorMessage}`
    );
  }
};

module.exports = { storeTransactionDb, updatePaymentIntentDb };
