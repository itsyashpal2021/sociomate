require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");
const {
  searchYtVideo,
  downloadThumbnail,
  downloadVideo,
  downloadAudio,
} = require("./posts/yt.js");
const { searchYtChannel } = require("./posts/yt.js");

const app = express();
const port = process.env.PORT || 3000;
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({ credentials: true, origin: true }));

//yt downloader
app.post("/ytVideoSearch", searchYtVideo);
app.post("/downloadThumbnail", downloadThumbnail);
app.post("/downloadVideo", downloadVideo);
app.post("/downloadAudio", downloadAudio);

//channel stats
app.post("/ytChannelSearch", searchYtChannel);

//serving static files in prod
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
  );
}

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
