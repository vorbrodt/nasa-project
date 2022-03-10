const http = require("http");
const app = require("./app");
const { mongoConnect } = require("./services/mongo");
const { loadPlanetsData } = require("./models/planets.model");

const PORT = process.env.PORT || 8000;

const server = http.createServer(app);

async function startServer() {
  // connect to mongoDB through mongoose
  await mongoConnect();
  // wait for data to load
  await loadPlanetsData();

  server.listen(PORT, () => {
    console.log(`Listeningen on port ${PORT}`);
  });
}

startServer();
