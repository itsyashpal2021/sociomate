const express = require("express");
const cors = require("cors");
const { connectToMongo, User } = require("./db.js");
const session = require("express-session");
const passport = require("passport");
const url = require("url");
const {
  register,
  login,
  checkSession,
  signout,
  userData,
} = require("./posts/user.js");
const {
  accountSearch,
  addAccount,
  removeAccount,
} = require("./posts/account.js");
const { log } = require("util");
const { setOAuth2Client, getAnalytics } = require("./posts/yt.js");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));

//session setup
app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
  })
);

//passport setup
app.use(passport.initialize());
app.use(passport.session());

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//posts
//user
app.post("/register", register);
app.post("/login", login);
app.post("/checkSession", checkSession);
app.post("/signout", signout);
app.post("/userData", userData);

//account
app.post("/accountSearch", accountSearch);
app.post("/addAccount", addAccount);
app.post("/removeAccount", removeAccount);

app.post("/analytics", getAnalytics);

app.get("/", (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  console.log("here");
  res.json(parsedUrl.query);
});

connectToMongo(process.env.MONGO_URI).then(() => {
  app.listen(port, () => {
    console.log(`App listening on port ${port}`);
    // setOAuth2Client();
  });
});
