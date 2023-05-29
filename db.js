const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const { Schema } = mongoose;

const connectToMongo = async (uri) => {
  try {
    await mongoose.connect(uri);
    console.log("connected to mongo host " + mongoose.connection.host);
  } catch (error) {
    console.error("Error while connecting to mongo db", error);
  }
};

const userSchema = new Schema({
  firstName: String,
  lastName: String,
  username: { type: String, unique: true },
  email: { type: String, unique: true },
});
userSchema.plugin(passportLocalMongoose);
const User = mongoose.model("User", userSchema);

const accountSchema = new Schema({
  username: String,
  platform: String,
  id: String,
});
accountSchema.index({ username: 1, platform: 1 }, { unique: true });
// Ensure the index is created
accountSchema.on("index", (err) => {
  if (err) {
    console.error("Error creating index:", err);
  } else {
    console.log("Index created successfully");
  }
});
const Account = mongoose.model("Account", accountSchema);

module.exports = { connectToMongo, User, Account };
