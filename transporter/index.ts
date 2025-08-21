const nodemailer = require("nodemailer");
const sgTransport = require("nodemailer-sendgrid-transport");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.NOREPLYEMAIL,
      pass: process.env.NOREPLYEMAILPASSWORD, 
    },}
);



module.exports = transporter;
