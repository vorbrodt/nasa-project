const express = require("express");
const cors = require("cors");
const path = require("path");
const morgan = require("morgan");

//const { httpGetAllLaunches } = require("./routes/planets/planets.controller");

const api = require("./routes/api");

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

// set the version of the api
app.use("/v1", api);
// then if we wanted to create a new version of the api we code do add v2 version below
//app.use("/v2", v2Router);

// inital page load in client
app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

module.exports = app;
