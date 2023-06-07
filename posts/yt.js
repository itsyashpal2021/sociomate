require("dotenv").config();
const { google } = require("googleapis");
const axios = require("axios");
const ytdl = require("ytdl-core");

const ffmpegPath = require("ffmpeg-static");
const cp = require("child_process");
const stream = require("stream");

// Set up YouTube Data API client
const youtube = google.youtube({
  version: "v3",
  auth: process.env.YT_DATA_API_KEY,
});

//video search result
const searchYtVideo = async (req, res) => {
  try {
    const url = req.body.url;

    // youtube data api
    const videoId = url.substring(url.length - 11, url.length);
    const response = await youtube.videos.list({
      part: ["snippet", "statistics"],
      id: videoId,
    });

    // thumbnails and sizes for various qualities
    const thumbnails = response.data.items[0].snippet.thumbnails;
    const thumbnailQuality = Object.keys(thumbnails);
    var thumbnailSizes = {};

    for (const quality of thumbnailQuality) {
      const resp = await axios.head(thumbnails[quality].url);
      const contentLength = resp.headers["content-length"];
      thumbnailSizes[quality] = contentLength;
    }

    const item = response.data.items[0];
    const channelDetails = await getChannelDetails(item.snippet.channelId);

    //available video only qualities
    const formats = (await ytdl.getBasicInfo(url)).formats;

    const videoQualityOptions = {};
    formats.forEach((format) => {
      const qualityLabel = format.qualityLabel;
      if (!qualityLabel) return;
      if (videoQualityOptions[qualityLabel])
        videoQualityOptions[qualityLabel] = Math.max(
          videoQualityOptions[qualityLabel],
          format.contentLength
        );
      else videoQualityOptions[qualityLabel] = format.contentLength;
    });

    //available audio qualities
    const audioQualityOptions = {};
    formats.forEach((format) => {
      const qualityLabel = format.audioQuality;
      if (!qualityLabel) return;
      if (audioQualityOptions[qualityLabel])
        audioQualityOptions[qualityLabel] = Math.max(
          audioQualityOptions[qualityLabel],
          format.contentLength
        );
      else audioQualityOptions[qualityLabel] = format.contentLength;
    });

    // total size after max audio quality
    const maxAudioQuality = Math.max(
      ...Object.keys(audioQualityOptions).map(
        (quality) => audioQualityOptions[quality]
      )
    );
    Object.keys(videoQualityOptions).forEach((quality) => {
      videoQualityOptions[quality] += maxAudioQuality;
    });

    // send info to client
    res.status(200).json({
      searchResult: {
        videoId: videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        publishedAt: item.snippet.publishedAt,
        viewCount: item.statistics.viewCount,
        thumbnail: item.snippet.thumbnails.high.url,
        channelTitle: item.snippet.channelTitle,
        channelThumbnail: channelDetails.thumbnail,
        thumbnailSizes: thumbnailSizes,
        videoQualityOptions: videoQualityOptions,
        audioQualityOptions: audioQualityOptions,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error while searching video" });
  }
};

const getChannelDetails = async (channelId) => {
  try {
    const response = await youtube.channels.list({
      part: ["snippet"],
      id: [channelId],
    });
    const details = response.data.items[0].snippet;
    return {
      channelTitle: details.title,
      description: details.description,
      thumbnail: details.thumbnails.default.url,
    };
  } catch (error) {
    console.log(error.response.data.error);
    throw error.response.data.error;
  }
};

const downloadThumbnail = async (req, res) => {
  try {
    const id = req.body.id;
    const quality = req.body.quality;

    //get thumbnail url
    const video = await youtube.videos.list({
      part: "snippet",
      id: id,
    });

    //fetch image using get
    const response = await axios.get(
      video.data.items[0].snippet.thumbnails[quality].url,
      {
        responseType: "arraybuffer",
        encoding: null,
      }
    );

    //send to client
    const imageType = response.headers["content-type"];
    res.setHeader("content-length", response.headers["content-length"]);
    const base64 = Buffer.from(response.data, "utf8").toString("base64");
    const dataURI = "data:" + imageType + ";base64," + base64;
    res.status(200).json({ data: dataURI });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const mergeStreams = (audioStream, videoStream, res) => {
  const result = new stream.PassThrough();
  let ffmpegProcess = cp.spawn(
    ffmpegPath,
    [
      // supress non-crucial messages
      "-loglevel",
      "8",
      "-hide_banner",
      // input audio and video by pipe
      "-i",
      "pipe:3",
      "-i",
      "pipe:4",
      // map audio and video correspondingly
      "-map",
      "0:a",
      "-map",
      "1:v",
      // no need to change the codec
      "-c",
      "copy",
      // output mp4 and pipe
      "-f",
      "matroska",
      "pipe:5",
    ],
    {
      // no popup window for Windows users
      windowsHide: true,
      stdio: [
        // silence stdin/out, forward stderr,
        "inherit",
        "inherit",
        "inherit",
        // and pipe audio, video, output
        "pipe",
        "pipe",
        "pipe",
      ],
    }
  );
  audioStream.pipe(ffmpegProcess.stdio[3]);
  videoStream.pipe(ffmpegProcess.stdio[4]);
  ffmpegProcess.stdio[5].pipe(result);
  result.pipe(res);
};

const downloadVideo = async (req, res) => {
  try {
    const url = req.body.url;
    const qualityLabel = req.body.qualityLabel;

    const info = await ytdl.getInfo(url);
    const format = info.formats.find(
      (item) => item.qualityLabel === qualityLabel && item.contentLength
    );

    const videoStream = ytdl(url, {
      filter: "videoonly",
      format: format,
    });

    const audioStream = ytdl(url, {
      filter: "audioonly",
      quality: "highestaudio",
    });

    res.setHeader("content-type", "video/mp4");
    mergeStreams(audioStream, videoStream, res);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const downloadAudio = async (req, res) => {
  try {
    const url = req.body.url;
    const audioQuality = req.body.audioQuality;

    const audioStream = ytdl(url, {
      filter: "audioonly",
      quality: audioQuality,
    });

    res.setHeader("content-type", "audio/mp3");
    audioStream.on("error", (err) => {
      console.log("Error while sending audio", err);
      throw err;
    });
    audioStream.pipe(res);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// channel search result
const getChannelStatistics = async (channelId) => {
  try {
    const response = await youtube.channels.list({
      part: ["statistics"],
      id: [channelId],
    });
    return response.data.items[0].statistics;
  } catch (error) {
    throw error.response.data.error;
  }
};

const searchYtChannel = async (req, res) => {
  const channelName = req.body.channelName;
  try {
    const response = await youtube.search.list({
      part: "snippet",
      q: channelName,
      type: "channel",
      maxResults: 5,
    });

    const searchResult = await Promise.all(
      response.data.items.map(async (item) => {
        const stats = await getChannelStatistics(item.snippet.channelId);
        return {
          channelId: item.snippet.channelId,
          channelTitle: item.snippet.channelTitle,
          description: item.snippet.description,
          thumbnail: item.snippet.thumbnails.high.url,
          ...stats,
        };
      })
    );

    return res.status(200).json({ searchResults: searchResult });
  } catch (error) {
    const err = error.response.data.error;
    res.status(err.code).json(err.message);
  }
};

module.exports = {
  searchYtVideo,
  searchYtChannel,
  getChannelStatistics,
  downloadThumbnail,
  downloadVideo,
  downloadAudio,
};
