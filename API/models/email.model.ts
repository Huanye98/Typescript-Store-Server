const pool = require("../../db/index");
const transporter = require("../../transporter/index");
const fs = require("fs");
const path = require("path");

const sendVerificationEmailDB = async (email:string) => {
  try {
    const isEmailRegistered = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );
    if (isEmailRegistered.rowCount === 0) {
      throw new Error("Email not registered");
    }
    if (isEmailRegistered.rows[0].is_verified) {
      throw new Error("Email already verified");
    }
    const user_id_query = "SELECT id FROM users WHERE email = $1";
    const userIdResult = await pool.query(user_id_query, [email]);
    if (userIdResult.rowCount === 0) {
      throw new Error("User not found");
    }
    const userId = userIdResult.rows[0].id;

    const emailVerificationTokenQuery =
      "INSERT INTO email_tokens (user_id) values ($1) RETURNING token";
    const emailVerificationToken = await pool.query(
      emailVerificationTokenQuery,
      [userId]
    );
    const token = emailVerificationToken.rows[0].token;
    let verificationLink = `${process.env.BASE_URL}/verify-email?token=${token}`;

    const emailTemplatePath = path.join(
      __dirname,
      "../../emailVerification.html"
    );
    let emailVerificationTemplate = fs.readFileSync(
      emailTemplatePath,
      "utf8"
    );
    emailVerificationTemplate = emailVerificationTemplate.replace(
      /{{verificationLink}}/g,
      verificationLink
    );

    await transporter.sendMail({
      from: process.env.NOREPLYEMAIL,
      to: email,
      subject: "Verify your Email",
      html: emailVerificationTemplate,
    });

  } catch (error) {
    let errorMessage = "Unknown error";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    throw new Error(
      `Database Error: failed to send verification Email. , ${errorMessage}`
    );
  }
};

const verifyEmailInDb = async (token:string) => {
  try {
    const query =
      "update users set is_verified = true from email_tokens where users.id = email_tokens.user_id and email_tokens.token = $1 and expires_at > NOW() returning users.*";
    const result = await pool.query(query, [token]);

    if (result.rowCount === 0) {
      throw new Error("Invalid or expired token");
    }
    return result.rows[0];
  } catch (error) {
    let errorMessage = "Unknown error";
    if (error instanceof Error) {
      errorMessage = "Invalid or expired token";
    }
    throw new Error(`Database Error: failed to verify email. ${errorMessage}`);
  }
};

const addEmailToNewsLetter = async (email:string) => {
  try {
    const query =
      "insert into newsletter_subscriptions (email) values ($1) ON CONFLICT (email) DO UPDATE SET unsusbribed = false";
    await pool.query(query, [email]);
  } catch (error) {
    let errorMessage = "Unknown error";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    throw new Error(
      `Database Error: failed to add email to newsletter. ${errorMessage}`
    );
  }
};

// como elegir mails personalizados
const selectAndSendNewsletter = async () => {
  try {
    const query =
      "select * from newsletter_subscriptions where unsubscribed = false";
    const subscribedEmails = await pool.query(query);
    await Promise.all(
      subscribedEmails.rows.forEach(async (email:string) => {
        await transporter.sendMail({
          from: process.env.NOREPLYEMAIL,
          to: email,
          subject: "Newsletter",
          html: "Newsletter placeholder",
        });
      })
    );
  } catch (error) {
    let errorMessage = "Unknown error";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    throw new Error(
      `Database Error: failed to send newsletter. ${errorMessage}`
    );
  }
};

module.exports = {
  sendVerificationEmailDB,
  verifyEmailInDb,
  addEmailToNewsLetter,
  selectAndSendNewsletter,
};
