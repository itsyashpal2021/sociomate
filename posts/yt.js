const { google } = require("googleapis");
const { Account } = require("../db");
require("dotenv").config();

// Set up YouTube Data API client
const youtube = google.youtube({
  version: "v3",
  auth: process.env.YT_DATA_API_KEY,
});

// channel search result
const searchYt = async (channelName, res) => {
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

const getStatistics = async (channelId) => {
  const response = await youtube.channels.list({
    part: ["statistics"],
    id: [channelId],
  });
  return response.data.items[0].statistics;
};

const addYtAccount = async (channelId, username, res) => {
  try {
    const newAccount = new Account({
      username: username,
      platform: "Youtube",
      id: channelId,
    });
    await newAccount.save();

    const statistics = await getStatistics(channelId);
    res.status(200).json(statistics);
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({
        message: "You already have an account added for this platform",
      });
    } else {
      const err = error.response.data.error;
      res.status(err.code).json(err.message);
    }
  }
};
module.exports = { searchYt, addYtAccount };
