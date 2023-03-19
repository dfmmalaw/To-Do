import nodemailer from "nodemailer";

//nodemailer function for app to send email to new and existing users
const SendMail = (options, res) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.office365.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });
  const mailOptions = {
    from: process.env.YOUR_MAIL,
    to: options.to,
    subjects: options.subject,
    html: options.html,
  };
  transporter.sendMail(mailOptions, function (err, info) {
    if (err) {
      console.log('sending email error - ', err);
      return res.status(400).json({
        error: "Something is wrong! Please try",
      });
    } else {
      return res.status(200).json({
        message: `Email has been sent to ${options.to}`,
      });
    }
  });
};

export default SendMail;
