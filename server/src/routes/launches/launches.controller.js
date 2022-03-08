const { getAllLaunches, addNewLaunch } = require("../../models/launches.model");

function httpGetAllLaunches(req, res) {
  return res.status(200).json(getAllLaunches());
}

function httpPostNewLaunch(req, res) {
  const launch = req.body;
  if (
    !launch.mission ||
    !launch.rocket ||
    !launch.launchDate ||
    !launch.target
  ) {
    return res.status(400).json({
      error: "Missing required launch property",
    });
  }

  // convert string to date object
  console.log(JSON.stringify(launch));
  launch.launchDate = new Date(launch.launchDate);
  // isNaN checks if not a number
  if (isNaN(launch.launchDate)) {
    return res.status(400).json({
      error: "Missing required launch property",
    });
  }

  addNewLaunch(launch);
  return res.status(201).json(launch);
}

module.exports = { httpGetAllLaunches, httpPostNewLaunch };
