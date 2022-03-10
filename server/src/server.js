const http = require("http");
const app = require("./app");
const mongoose = require("mongoose");

const PORT = process.env.PORT || 8000;
const MONGO_URL =
  "mongodb+srv://nasa-api:ReRI5kOH8f7zQfp5@nasacluster.3zdb8.mongodb.net/nasa?retryWrites=true&w=majority";
// import function loading the data
const { loadPlanetsData } = require("./models/planets.model");

const server = http.createServer(app);

// EventEmitter, emits events when connection is ready - .once means to only trigger 1 time
mongoose.connection.once("open", () => {
  console.log("MongoDB connection ready!");
});
// handle any potential errors in connection
mongoose.connection.on("error", (err) => {
  console.log(err);
});

async function startServer() {
  await mongoose.connect(MONGO_URL);
  // wait for data to load
  await loadPlanetsData();

  server.listen(PORT, () => {
    console.log(`Listeningen on port ${PORT}`);
  });
}

startServer();
