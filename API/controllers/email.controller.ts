const {
  sendVerificationEmailDB,
  verifyEmailInDb,
  addEmailToNewsLetter,
  selectAndSendNewsletter,
} = require("../models/email.model");

const sendVerificationEmail = async (req, res, next) => {
  try {
    const { email } = req.body;
     await sendVerificationEmailDB(email);
     return res.status(200).json({ message: "Verification Email sent" });
  } catch (error) {
    next(error);
  }
};

const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.query;
    await verifyEmailInDb(token);
    return res.status(200).json({ message: "Email verified" });
  } catch (error) {
    next(error);
  }
};

const subscribeToNewsletter = async (req, res, next) => {
  try {
    const { email } = req.body;
    await addEmailToNewsLetter(email);
    return res.status(200).json({ message: "Subscribed to newsletter" });
  } catch (error) {
    next(error);
  }
};
const sendNewsletter = async (req, res, next) => {
  try {
    await selectAndSendNewsletter();
    return res.status(200).json({ message: "Newsletter sent" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  sendVerificationEmail,
  verifyEmail,
  subscribeToNewsletter,
  sendNewsletter,
};
