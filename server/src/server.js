const http = require("http");
const app = require("./app");

const PORT = process.env.PORT || 8000;

// import function loading the data
const { loadPlanetsData } = require("./models/planets.model");

const server = http.createServer(app);

async function startServer() {
  // wait for data to load
  await loadPlanetsData();

  server.listen(PORT, () => {
    console.log(`Listeningen on port ${PORT}`);
  });
}

startServer();
