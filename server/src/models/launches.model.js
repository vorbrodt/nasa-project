const launchesDatabase = require("./launches.mongo");
const planets = require("./planets.mongo");

const DEFAULT_FLIGHT_NUMBER = 0;
//const launches = new Map();

const launch1 = {
  flightNumber: 100,
  mission: "Kepler Exploration X",
  rocket: "Explorer IS1",
  launchDate: new Date("June 5, 2077"),
  target: "Kepler-442 b",
  customers: ["Nasa", "SpaceX"],
  upcoming: true,
  success: true,
};

saveLaunch(launch1);

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
  //check that planet exist before adding to database
  const planet = await planets.findOne({
    keplerName: launch.target,
  });

  // if entered planet don't exist
  if (!planet) {
    throw new Error("No matching planet was found");
  }

  await launchesDatabase.findOneAndUpdate(
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

async function getLatestFlightNumber() {
  // use mongoDB sort() function to make it easier finding the latest flightNumber faster
  // -flightNumber means sort on flightNumber in decending order (highest to lowest)
  const latestLaunch = await launchesDatabase.findOne().sort("-flightNumber");

  // when no flights exist
  if (!latestLaunch) {
    return DEFAULT_FLIGHT_NUMBER;
  }

  return latestLaunch.flightNumber;
}

async function scheduleNewLaunch(launch) {
  const latestFlightNumber = (await getLatestFlightNumber()) + 1;
  const newLaunch = Object.assign(launch, {
    flightNumber: latestFlightNumber,
    customers: ["Nasa", "SpaceX"],
    upcoming: true,
    success: true,
  });

  await saveLaunch(newLaunch);
}

async function exsistsLaunchWithId(launchId) {
  return await launchesDatabase.findOne({ flightNumber: launchId });
}

// update upcoming and success status of flight
async function abortLaunchById(launchId) {
  const aborted = await launchesDatabase.updateOne(
    {
      // find and match to flightNumber to launchId
      flightNumber: launchId,
    },
    {
      // when found set the following
      upcoming: false,
      success: false,
    }
  );
  // aborted contains data about how the request went
  // check the reponse data to determine what message to send to user
  console.log(JSON.stringify(aborted));
  return aborted.modifiedCount === 1;
}

module.exports = {
  getAllLaunches,
  scheduleNewLaunch,
  exsistsLaunchWithId,
  abortLaunchById,
};
