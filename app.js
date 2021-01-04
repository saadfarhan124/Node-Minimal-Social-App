const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const { connectToDb, _ } = require("./config/db");
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const session = require("express-session");
const uniqid = require("uniqid");
var app = express();

//mongoose
connectToDb();

// view engine setup

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");
app.use(express.static(__dirname));
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

const hour = 120000;

app.use(
  session({
    genid: req => {
      return uniqid();
    },
    secret: "keyboard cat",
    cookie: {
      maxAge: hour,
      expires: new Date(Date.now() + hour)
    }
  })
);
app.use("/", usersRouter);
app.use("/api/anonymousPosts/", require("./routes/anonymousPost"));
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
