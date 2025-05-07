const bcrypt = require("bcrypt");

const nodemailer = require("nodemailer");

const Incriptpassword = (password) => {
  const hashpassword = bcrypt.hashSync(password, 8);
  return hashpassword;
};

const checkpassword = (password, hashedpassword) => {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, hashedpassword, function (err, result) {
      if (err) reject(err);
      else resolve(result);
    });
  });
};

const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const SendverificationMail = (toEmail, code) => {
  return new Promise((resolve, reject) => {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      port: 465,
      auth: {
        user: "itsdipakpawar4206@gmail.com",
        pass: "afei itmo eoph catx",
      },
    });

    const mailOptions = {
      from: "itsdipakpawar4206@gmail.com",
      to: toEmail,
      subject: "Your Email Verification Code",
      text: `Your verification code is: ${code}`,
      html: `<h3>Your verification code is:</h3><h1>${code}</h1>`,
    };

    transporter.sendMail(mailOptions, function (err, info) {
      if (err) {
        reject(err);
      } else {
        resolve(true);
      }
    });
  });
};

module.exports = {
  Incriptpassword,
  SendverificationMail,
  generateVerificationCode,
  checkpassword,
};
