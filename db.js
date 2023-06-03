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
  channels: [{ type: String }],
});
userSchema.plugin(passportLocalMongoose);
const User = mongoose.model("User", userSchema);

module.exports = { connectToMongo, User };
