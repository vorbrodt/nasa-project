const mongoose = require("mongoose");
require('dotenv').config();

const MONGO_URL = process.env.MONGO_URL;
// import function loading the data

// EventEmitter, emits events when connection is ready - .once means to only trigger 1 time
mongoose.connection.once("open", () => {
  console.log("MongoDB connection ready!");
});
// handle any potential errors in connection
mongoose.connection.on("error", (err) => {
  console.log(err);
});

// function to create connection to mongoDB using mongoose
async function mongoConnect() {
  await mongoose.connect(MONGO_URL);
}

// disconnect fron mongoDB - useful after tests have completed
async function mongoDisconnect() {
  await mongoose.disconnect();
}

module.exports = {
  mongoConnect,
  mongoDisconnect,
};
