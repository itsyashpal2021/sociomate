require("dotenv").config();
const express = require("express");
const fs = require("fs");
const path = require("path");
const https = require("https");
const cors = require("cors");
const {
  searchYtVideo,
  downloadThumbnail,
  downloadVideo,
  downloadAudio,
} = require("./posts/yt.js");

const app = express();
const port = process.env.PORT || 3000;
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({ credentials: true, origin: true }));

//yt tools
app.post("/ytSearch", searchYtVideo);
app.post("/downloadThumbnail", downloadThumbnail);
app.post("/downloadVideo", downloadVideo);
app.post("/downloadAudio", downloadAudio);

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
httpsServer.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
