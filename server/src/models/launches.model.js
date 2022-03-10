const launches = new Map();

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

launches.set(launch.flightNumber, launch);

function getAllLaunches() {
  return Array.from(launches.values());
}

function exsistsLaunchWithId(launchId) {
  return launches.has(launchId);
}

function addNewLaunch(launch) {
  latestFlightNumber++;
  launches.set(
    latestFlightNumber,
    Object.assign(launch, {
      flightNumber: latestFlightNumber,
      customers: ["Nasa", "SpaceX"],
      upcoming: true,
      success: true,
    })
  );
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
