if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const createError = require("http-errors");
const express = require("express");
const session = require("express-session");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const {
  initializeMongooseConnection,
} = require("./mongoose/initializeConnection.js");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const flash = require("connect-flash");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const MongoStore = require("connect-mongo");
const mongoSanitize = require("express-mongo-sanitize");
const User = require("./models/user.js");
const nodemailer = require("nodemailer");
const scheduler = require("./scheduler");
const expenses = require("./controllers/expenses.js");
const usersRouter = require("./routes/users");
const remindersRouter = require("./routes/reminders");
const filesRouter = require("./routes/files");
const expensesRouter = require("./routes/expenses");
const itemsRouter = require("./routes/items");
const { isLoggedIn } = require("./utils");

const DbUrl = process.env.DB_URL;
const secret = process.env.SECRET;

const app = express();

// database store
const store = MongoStore.create({
  mongoUrl: DbUrl,
  touchAfter: 24 * 60 * 60,
  crypto: {
    secret,
  },
});

// connect to database
initializeMongooseConnection(DbUrl);

// express session
const sessionConfig = {
  store,
  name: "session",
  secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
app.use(session(sessionConfig));
app.use(flash());

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.engine("ejs", ejsMate);

// authentication
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// locals
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.itemId = null;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

// middleware
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(methodOverride("_method"));
app.use(mongoSanitize());
app.use(express.static(path.join(__dirname, "public")));

// routes
app.use("/", usersRouter);
app.use("/folios", itemsRouter);
app.use("/folios/:itemId/reminders", remindersRouter);
app.use("/folios/:itemId/expenses", expensesRouter);
app.use("/folios/:itemId/files", filesRouter);
app.get("/allexpenses", isLoggedIn, expenses.getAllExpenses);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
