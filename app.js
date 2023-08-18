if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const createError = require('http-errors');
const express = require('express');
const session = require('express-session');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const { initializeMongooseConnection } = require('./mongoose/initializeConnection.js');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const MongoStore = require('connect-mongo');
const mongoSanitize = require('express-mongo-sanitize');
const User = require('./models/user.js');
const nodemailer = require("nodemailer");

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const remindersRouter = require('./routes/reminders');
const filesRouter = require('./routes/files');
const expensesRouter = require('./routes/expenses');
const itemsRouter = require('./routes/items');

const DbUrl = process.env.DB_URL;
const secret = process.env.SECRET;

const app = express();

// database store
const store = MongoStore.create({
  mongoUrl: DbUrl,
  touchAfter: 24 * 60 * 60,
  crypto: {
    secret
  }
});

// connect to database
initializeMongooseConnection(DbUrl);

// express session
const sessionConfig = {
  store,
  name: 'session',
  secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7
  }
}
app.use(session(sessionConfig));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// authentication
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(mongoSanitize());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', usersRouter);
app.use('/items', itemsRouter)
app.use('/items/:itemId/reminders', remindersRouter)
app.use('/items/:itemId/expenses', expensesRouter)
app.use('/items/:itemId/files', filesRouter)
app.get('/email', async (req, res) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      // TODO: replace `user` and `pass` values from <https://forwardemail.net>
      user: 'yourhomemanagerapp@gmail.com',
      pass: 'wrovgsiasxjbkdan'
    }
  });
  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: '"Home Manager" <foo@example.com>', // sender address
    to: "imrannoah11@gmail.com", // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world?", // plain text body
    html: "<b>Hello world?</b>", // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  //
  // NOTE: You can go to https://forwardemail.net/my-account/emails to see your email delivery status and preview
  //       Or you can use the "preview-email" npm package to preview emails locally in browsers and iOS Simulator
  //       <https://github.com/forwardemail/preview-email>
  //
  res.send('message sent')
})

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
