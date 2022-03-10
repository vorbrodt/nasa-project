const mongoose = require("mongoose");
const MONGO_URL =
  "mongodb+srv://nasa-api:ReRI5kOH8f7zQfp5@nasacluster.3zdb8.mongodb.net/nasa?retryWrites=true&w=majority";
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
