const { google } = require("googleapis");
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
    const response = await youtube.search.list({
      part: "snippet",
      q: req.body.searchText,
      type: "video",
      maxResults: 5,
    });

    const searchResult = response.data.items.map((item) => {
      return {
        videoId: item.id.videoId,
        publishedAt: item.snippet.publishedAt,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail: item.snippet.thumbnails.high.url,
        channelTitle: item.snippet.channelTitle,
      };
    });

    res.status(200).json({ searchResult: searchResult });
  } catch (error) {
    const err = error.response.data.error;
    res.status(err.code).json(err.message);
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
    const url = req.body.url;
    const response = await axios.get(url, {
      responseType: "arraybuffer",
      encoding: null,
    });

    const imageType = response.headers["content-type"];
    const base64 = Buffer.from(response.data, "utf8").toString("base64");
    const dataURI = "data:" + imageType + ";base64," + base64;
    res.status(200).json({ data: dataURI });
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
};
