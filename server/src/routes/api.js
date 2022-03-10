const express = require("express");

const planetsRouter = require("./planets/planets.router");
const launchesRouter = require("./launches/launches.router");

const api = express.Router();

api.use("/planets", planetsRouter);
// mount middleware on a specific path ("/launch") which will be the default
api.use("/launches", launchesRouter);

module.exports = api;
