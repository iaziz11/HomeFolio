const nodemailer = require("nodemailer");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    console.log("You are not logged in!");
    return res.redirect("/login");
  }
  next();
};

module.exports.isNotLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    console.log("You cannot be logged in!");
    return res.redirect("/items");
  }
  next();
};

module.exports.militaryToStandardTime = (time) => {
  time = time.split(":");

  let hours = Number(time[0]);
  let minutes = Number(time[1]);

  let timeValue;

  if (hours > 0 && hours <= 12) {
    timeValue = "" + hours;
  } else if (hours > 12) {
    timeValue = "" + (hours - 12);
  } else if (hours == 0) {
    timeValue = "12";
  }

  timeValue += minutes < 10 ? ":0" + minutes : ":" + minutes;
  timeValue += hours >= 12 ? " P.M." : " A.M.";
  return timeValue;
};

module.exports.sendEmail = async (to, subject, body) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: "HomeFolio", // sender address
    to, // list of receivers
    subject, // Subject line
    html: body, // html body
  });

  console.log("Message sent: %s", info.messageId);
};
