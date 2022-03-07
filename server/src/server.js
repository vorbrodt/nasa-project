const http = require("http");
const app = require("./app");

const PORT = process.env.PORT || 8000;

// allows server isolation from express code
const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Listeningen on port ${PORT}`);
});
