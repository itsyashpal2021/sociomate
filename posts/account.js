const { default: mongoose } = require("mongoose");
const {
  getChannelDetails,
  getChannelStatistics,
  addYtAccount,
  searchYt,
} = require("./yt");
const { Account } = require("../db");

const getAccountInfo = async (account) => {
  let details, statistics;
  switch (account.platform) {
    case "Youtube":
      details = await getChannelDetails(account.id);
      statistics = await getChannelStatistics(account.id);
      break;

    default:
      break;
  }
  return { details, statistics };
};

const accountSearch = async (req, res) => {
  switch (req.body.platform) {
    case "Youtube":
      searchYt(req.body.username, res);
      break;

    default:
      res.status(400).json({ message: "Something Went Wrong." });
      break;
  }
};

const addAccount = async (req, res) => {
  switch (req.body.platform) {
    case "Youtube":
      addYtAccount(req.body.id, req.user.username, res);
      break;

    default:
      res.status(400).json({ message: "Something Went Wrong." });
      break;
  }
};

const removeAccount = async (req, res) => {
  try {
    // const username = req.body.username;
    const username = req.user.username;
    const platform = req.body.platform;
    await Account.findOneAndDelete({
      username: username,
      platform: platform,
    });
    res.status(200).json({ message: "success" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { getAccountInfo, accountSearch, addAccount, removeAccount };
