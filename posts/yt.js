const { google } = require("googleapis");
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
//yt analytics set up

// Your OAuth2 credentials
const credentials = require("../yt-analytics-oauth.json").web;
const readline = require("readline");
const fs = require("fs");
const path = require("path");
const { writeFile } = require("fs/promises");

// Channel ID of the channel you want to retrieve the likes for
const CHANNEL_ID = "UCrWdPsIgE4GIWGiFUMHL4bQ";
const scopes = ["https://www.googleapis.com/auth/youtube.readonly"];
const { client_id, client_secret, redirect_uris } = credentials;
const TOKEN_PATH = "token.json";

const oAuth2Client = new google.auth.OAuth2(
  client_id,
  client_secret,
  redirect_uris[0]
);

const getNewToken = (oAuth2Client) => {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
  });
  console.log("Authorize this app by visiting this url:", authUrl);

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question("Enter the code from that page here: ", (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err)
        return console.error("Error getting access token", err.response.data);
      oAuth2Client.setCredentials(token);

      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.log("Error saving token to file", err);
        console.log("Token saved to file succesfully");
      });
    });
  });
};

// Function to authorize and make API requests
const setOAuth2Client = () => {
  fs.readFile(TOKEN_PATH, "utf-8", (err, data) => {
    if (err) {
      return console.log("Error reading token file", err);
    }

    const token = JSON.parse(data);
    const expiryTimestamp = token.expiry_date;
    const currentTimestamp = Date.now();
    console.log(currentTimestamp);

    if (currentTimestamp > expiryTimestamp) {
      console.log("----- Token has expired. Generating new token -----");
      getNewToken(oAuth2Client);
    } else {
      oAuth2Client.setCredentials(token);
      console.log("OAuth2Client set up complete");
    }
  });
};

const getAnalytics = async (req, res) => {
  try {
    const youtubeAnalytics = google.youtubeAnalytics({
      version: "v2",
      auth: oAuth2Client,
    });

    // Get the current date in the format required by the YouTube Analytics API
    const currentDate = new Date().toISOString().split("T")[0];

    // Retrieve YouTube Analytics data for the channel
    const response = await youtubeAnalytics.reports.query({
      ids: `channel==${CHANNEL_ID}`,
      startDate: currentDate,
      endDate: currentDate,
      metrics: "likes",
    });

    const analyticsData = response.data.rows[0];
    const channelLikesToday = parseInt(analyticsData[0]);

    console.log(`Number of likes on the channel today: ${channelLikesToday}`);
  } catch (error) {
    res.status(500).json(error);
  }
};

// Load the service account key file
const serviceAccount = require("../service-account-key.json");
const { JWT } = require("google-auth-library");

// Create a new JWT client using the service account credentials
const jwtClient = new JWT(
  serviceAccount.client_email,
  "yt-analytics-oauth.json",
  serviceAccount.private_key,
  ["https://www.googleapis.com/auth/youtube.readonly"] // Specify the desired scopes
);

async function getAccessToken() {
  try {
    // Authenticate and obtain an access token
    const tokenResponse = await jwtClient.getAccessToken();
    const accessToken = tokenResponse.token;

    console.log("Access token:", accessToken);
  } catch (error) {
    console.error("Error retrieving access token:", error);
  }
}

// Call the function to get the access token
// getAccessToken();

module.exports = {
  searchYt,
  getChannelStatistics,
  getChannelDetails,
  setOAuth2Client,
  getAnalytics,
};
