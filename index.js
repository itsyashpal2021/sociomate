const express = require("express");
const fs = require("fs");
const https = require("https");
const cors = require("cors");
const { connectToMongo, User } = require("./db.js");
const session = require("express-session");
const passport = require("passport");
const {
  register,
  login,
  checkSession,
  signout,
  userData,
} = require("./posts/user.js");
const {
  searchYtVideo,
  downloadThumbnail,
  downloadVideo,
} = require("./posts/yt.js");

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
    cookie: {
      sameSite: "none",
      secure: "auto",
    },
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

//yt tools
app.post("/ytSearch", searchYtVideo);
app.post("/downloadThumbnail", downloadThumbnail);
app.post("/downloadVideo", downloadVideo);

//account
// app.post("/accountSearch", accountSearch);
// app.post("/addAccount", addAccount);
// app.post("/removeAccount", removeAccount);

//serving static files in prod
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
  );
}

const options = {
  key: fs.readFileSync("server.key"),
  cert: fs.readFileSync("server.cert"),
};

const httpsServer = https.createServer(options, app);

connectToMongo(process.env.MONGO_URI).then(() => {
  httpsServer.listen(port, () => {
    console.log(`App listening on port ${port}`);
    // setOAuth2Client();
  });
});
