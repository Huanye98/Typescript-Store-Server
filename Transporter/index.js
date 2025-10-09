const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.NOREPLYEMAIL,
        pass: process.env.NOREPLYEMAILPASSWORD,
    },
});

module.exports = transporter;
