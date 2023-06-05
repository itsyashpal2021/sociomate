const { google } = require("googleapis");
const ytdl = require("ytdl-core");
const fs = require("fs");

const ffmpeg = require("fluent-ffmpeg");
const ffmpegPath = require("ffmpeg-static");
ffmpeg.setFfmpegPath(ffmpegPath);

const axios = require("axios");
require("dotenv").config();

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

    //available video qualities
    const formats = (await ytdl.getBasicInfo(url)).formats;

    var videoQualityOptions = formats.map((format) => {
      return {
        qualityLabel: format.qualityLabel,
        size: format.contentLength,
      };
    });

    videoQualityOptions = videoQualityOptions.filter(
      (format) => format && format.size && format.qualityLabel
    );

    const uniqueQualityOptions = Array.from(
      new Set(videoQualityOptions.map((obj) => obj.qualityLabel))
    ).map((qualityLabel) =>
      videoQualityOptions.find((obj) => obj.qualityLabel === qualityLabel)
    );

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
        videoQualityOptions: uniqueQualityOptions,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error while searching video" });
  }
};

// channel search result
const searchYtChannel = async (channelName, res) => {
  try {
    const response = await youtube.search.list({
      part: "snippet",
      q: channelName,
      type: "channel",
      maxResults: 5,
    });
    const searchResult = response.data.items.map((item) => {
      return {
        channelId: item.snippet.channelId,
        channelTitle: item.snippet.channelTitle,
        description: item.snippet.description,
        thumbnail: item.snippet.thumbnails.default.url,
      };
    });
    return res.status(200).json({ searchResults: searchResult });
  } catch (error) {
    const err = error.response.data.error;
    res.status(err.code).json(err.message);
  }
};

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

    const mergedFilePath = "temp/merged.mp4";
    const audioFilePath = "temp/audio.mp3";
    const videoFilePath = "temp/video.mp4";

    const audioWritableStream = fs.createWriteStream(audioFilePath);
    audioStream.pipe(audioWritableStream);

    audioStream.on("end", () => {
      const videoWritableStream = fs.createWriteStream(videoFilePath);
      videoStream.pipe(videoWritableStream);

      videoStream.on("end", () => {
        // Create an FFmpeg command
        const command = ffmpeg();

        // Set input files
        command.input("temp/audio.mp3");
        command.input("temp/video.mp4");

        // Merge the audio and video streams
        command.outputOptions("-c", "copy");
        command.format("mp4");

        command
          .save(mergedFilePath)
          .on("error", (err) => {
            console.error(
              "Error occurred while saving to merged:",
              err.message
            );
            throw err;
          })
          .on("end", () => {
            res.setHeader("Content-Type", "video/mp4");
            fs.stat(mergedFilePath, (err, stats) => {
              if (err) throw err;
              res.setHeader("Content-Length", stats.size);
            });

            const stream = fs.createReadStream(mergedFilePath);
            stream.pipe(res);

            // Clean up the temporary files after streaming is complete
            stream.on("end", () => {
              fs.unlinkSync(mergedFilePath);
              fs.unlinkSync(audioFilePath);
              fs.unlinkSync(videoFilePath);
            });
          });
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const downloadAudio = async (req, res) => {
  try {
    const url = req.body.url;
    const audioStream = ytdl(url, {
      filter: "audioonly",
      quality: req.body.quality,
    });

    res.setHeader("content-type", "audio/mp3");
    audioStream.pipe(res);
    audioStream.on("error", (err) => {
      console.log("Error while sending audio");
      throw err;
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  searchYtVideo,
  searchYtChannel,
  getChannelStatistics,
  getChannelDetails,
  downloadThumbnail,
  downloadVideo,
  downloadAudio,
};
