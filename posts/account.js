const {
  getChannelDetails,
  getChannelStatistics,
  addYtAccount,
  searchYt,
} = require("./yt");

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
  res.status(200).json({ message: "success" });
};

module.exports = { getAccountInfo, accountSearch, addAccount, removeAccount };
