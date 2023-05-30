const { User, Account } = require("../db.js");
const passport = require("passport");
const { getAccountInfo } = require("./account.js");

const register = async (req, res) => {
  try {
    const password = req.body.password;
    const user = await User.register(new User(req.body), password);
    await passport.authenticate("local")(req, res, function () {
      res.status(200).json({ message: "SUCCESS" });
    });
  } catch (error) {
    if (error.code === 11000 && error.keyPattern.email === 1) {
      res
        .status(400)
        .json({ message: "A User with this Email is already registered." });
    } else {
      res.status(400).json({ message: error.message });
    }
  }
};

const login = async (req, res) => {
  try {
    const user = new User(req.body);
    req.logIn(user, function (err) {
      if (err) {
        throw err;
      } else {
        passport.authenticate("local")(req, res, function () {
          res.status(200).json({ message: "SUCCESS" });
        });
      }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const checkSession = async (req, res) => {
  try {
    const sessionActive = req.isAuthenticated();
    res.status(200).json({ sessionActive: sessionActive });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const signout = async (req, res) => {
  try {
    req.logOut(function (err) {
      if (err) {
        throw err;
      }
      res.status(200).json({ message: "SUCCESS" });
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const userData = async (req, res) => {
  try {
    let userData = new User(req.user).toJSON();
    // let userData = new User(req.body.user).toJSON();
    let accounts = await Account.find({ username: userData.username });
    accounts = await Promise.all(
      accounts.map(async (account) => {
        const info = await getAccountInfo(account);
        return {
          [account.platform]: {
            id: account.id,
            ...info,
          },
        };
      })
    );

    let accountsJson = {};
    accounts.forEach((account) => {
      accountsJson = { ...accountsJson, ...account };
    });
    userData = { ...userData, accounts: accountsJson };

    res.status(200).json({ userData: userData });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
module.exports = { register, login, checkSession, signout, userData };
