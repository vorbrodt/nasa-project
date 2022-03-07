const express = require("express");

const {getAllPlanets} = require("./routes/planets/planets.controller");

const planetsRouter = require("./routes/planets/planets.router");



const app = express();

app.use(express.json());
app.use(planetsRouter);


module.exports = app;