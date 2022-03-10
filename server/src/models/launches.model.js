const launchesDatabase = require("./launches.mongo");

//const launches = new Map();

let latestFlightNumber = 100;

const launch = {
  flightNumber: 100,
  mission: "Kepler Exploration X",
  rocket: "Explorer IS1",
  launchDate: new Date("June 5, 2077"),
  target: "Kepler 442 b",
  customers: ["Nasa", "SpaceX"],
  upcoming: true,
  success: true,
};

saveLaunch(launch);

async function getAllLaunches() {
  return await launchesDatabase.find(
    {},
    {
      __v: 0,
      _id: 0,
    }
  );
}

async function saveLaunch(launch) {
  await launchesDatabase.updateOne(
    {
      // check if flightnumber already exist in database
      // if exist: update   if doesn't exist: insert
      flightNumber: launch.flightNumber,
    },
    // if insert then insert this
    launch,
    { upsert: true }
  );
}

function exsistsLaunchWithId(launchId) {
  return launches.has(launchId);
}

function addNewLaunch(launch) {
  /* latestFlightNumber++;
  launches.set(
    latestFlightNumber,
    Object.assign(launch, {
      flightNumber: latestFlightNumber,
      customers: ["Nasa", "SpaceX"],
      upcoming: true,
      success: true,
    })
  ); */
}

function abortLaunchById(launchId) {
  // launches.delete(launchId) would delete the data object
  // instead save it in case we need it later
  const aborted = launches.get(launchId);
  aborted.upcoming = false;
  aborted.success = false;
  return aborted;
}

module.exports = {
  getAllLaunches,
  addNewLaunch,
  exsistsLaunchWithId,
  abortLaunchById,
};
