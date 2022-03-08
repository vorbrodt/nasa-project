const API_URL = "http://localhost:8000";

// Load planets and return as JSON.
async function httpGetPlanets() {
  const response = await fetch(`${API_URL}/planets`);
  return await response.json();
}

// Load launches, sort by flight number, and return as JSON.
async function httpGetLaunches() {
  const response = await fetch(`${API_URL}/launches`);
  const fetchedLaunches = await response.json();
  console.log(JSON.stringify(fetchedLaunches));
  return fetchedLaunches.sort((a, b) => {
    return a.flightNumber - b.flightNumber;
  });
}

// Submit given launch data to launch system.
async function httpSubmitLaunch(launch) {
  // try/catch in case unreliable internet connection or server rejects because of CORS
  try {
    // set method to post as fetch default to get
    return await fetch(`${API_URL}/launches`, {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(launch),
    });
  } catch (err) {
    return {
      ok: false,
    };
  }
}

// Delete launch with given ID.
async function httpAbortLaunch(id) {
  try {
    return await fetch(`${API_URL}/launches/${id}`, {
      method: "delete",
    });
  } catch (err) {
    console.log(err);
    return { ok: false };
  }
}

export { httpGetPlanets, httpGetLaunches, httpSubmitLaunch, httpAbortLaunch };
