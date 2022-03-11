const axios = require("axios");
const launchesDatabase = require("./launches.mongo");
const planets = require("./planets.mongo");

const DEFAULT_FLIGHT_NUMBER = 0;

const SPACEX_API_URL = "https://api.spacexdata.com/v4/launches/query";

async function populateLaunches(){
  console.log("Downloading SpaceX data");
  // this post request works as a get request in the SpaceX api
  const response = await axios.post(SPACEX_API_URL, 
    {
      query:{},
      options:{
          pagination: false,
          populate:[
            {
              path:"rocket",
              select: {name:1}
            },{
              path: "payloads",
              select: {
                "customers":1
              }
            }
          ]
      }
    });

    if (response.status !== 200){
      console.log("Problem downloading launch data");
      throw new Error("Launch data downlaod failed.")
    }

    const launchDocs = response.data.docs;
    for (const launchDoc of launchDocs){
      const payloads = launchDoc["payloads"];
      const customers = payloads.flatMap((payload) => 
      {return payload["customers"];})

      const launch = {
        flightNumber: launchDoc["flight_number"],
        mission: launchDoc["name"],
        rocket: launchDoc["rocket"]["name"],
        launchDate: launchDoc["date_local"],
        upcoming: launchDoc["upcoming"],
        success: launchDoc["success"],
        customers: customers,
      }
      console.log(`${launch.flightNumber} ${launch.mission}`);

      //populate launches collection...
      await saveLaunch(launch)

    }

     
}

// load launches data from SpaceX api
async function loadLaunchData(){
  // check if data already exist to minimize api load
  const firstLaunch = await findLaunch({
    flightNumber: 1,
    rocket: "Falcon 1",
    mission: "FalconSat",
  });
  if (!firstLaunch){
    await populateLaunches();
  }

}

async function getAllLaunches(skip,limit) {
  return await launchesDatabase.find(
    {},
    {
      __v: 0,
      _id: 0,
    }
  )
  .sort({flightNumber:1})
  .skip(skip)
  .limit(limit);
}

async function saveLaunch(launch) {
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
  //check that planet exist before adding to database
  const planet = await planets.findOne({
    keplerName: launch.target,
  });

  // if entered planet don't exist
  if (!planet) {
    throw new Error("No matching planet was found");
  }

  const latestFlightNumber = (await getLatestFlightNumber()) + 1;
  const newLaunch = Object.assign(launch, {
    flightNumber: latestFlightNumber,
    customers: ["Nasa", "SpaceX"],
    upcoming: true,
    success: true,
  });

  await saveLaunch(newLaunch);
}

// used to minimize load on API if found than we already got the data.
async function findLaunch(filter){
  return await launchesDatabase.findOne(filter);
}

async function exsistsLaunchWithId(launchId) {
  return await findLaunch({ flightNumber: launchId });
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
  loadLaunchData,
  getAllLaunches,
  scheduleNewLaunch,
  exsistsLaunchWithId,
  abortLaunchById,
};
