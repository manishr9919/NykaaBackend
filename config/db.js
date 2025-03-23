const mongoose = require("mongoose");
require("dotenv").config();
const url = process.env.MONGO_URL;

const connection = async () => {
  try {
    await mongoose.connect(url);
    console.log("database is connected successfully");
  } catch (error) {
    console.log({ message: "error occur while connecting to db" });
  }
};
module.exports = connection;
