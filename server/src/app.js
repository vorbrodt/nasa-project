const express = require("express");
const cors = require("cors");
const path = require("path");
const morgan = require("morgan");

const { httpGetAllLaunches } = require("./routes/planets/planets.controller");

const planetsRouter = require("./routes/planets/planets.router");
const launchesRouter = require("./routes/launches/launches.router");

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
app.use(morgan("combined"));

// handle json requests middleware (see req.body)
app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "public")));

app.use("/planets", planetsRouter);
// mount middleware on a specific path ("/launch") which will be the default
app.use("/launches", launchesRouter);

// inital page load in client
app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

module.exports = app;
