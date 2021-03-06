const request = require("supertest");
const app = require("../../app");
const { mongoConnect, mongoDisconnect } = require("../../services/mongo");
const {loadPlanetsData} = require("../../models/planets.model")

describe("Launches API", () => {
  // inital test setup - beforeALL
  beforeAll(async () => {
    // setting up mongoDB connection
    await mongoConnect();
    // load in intial data
    await loadPlanetsData();
  });

  afterAll(async () => {
    await mongoDisconnect();
  });

  describe("Test GET /launches", () => {
    test("Valid request", async () => {
      const reponse = await request(app)
        .get("/v1/launches")
        .expect("Content-Type", /json/)
        .expect(200);
      // could also do assertion like below
      // expect(reponse.statusCode).toBe(200);
    });
  });

  describe("Test POST /launches", () => {
    const completeLaunchData = {
      mission: "Man on Mars",
      rocket: "Flying thunder",
      target: "Kepler-442 b",
      launchDate: "January 17, 2030",
    };

    const launchDataWithoutDate = {
      mission: "Man on Mars",
      rocket: "Flying thunder",
      target: "Kepler-442 b",
    };

    const launchDataWithInvalidDate = {
      mission: "Man on Mars",
      rocket: "Flying thunder",
      target: "Kepler-442 b",
      launchDate: "invalid date string",
    };

    test("valid request should respond with 201", async () => {
      const response = await request(app)
        .post("/v1/launches")
        .send(completeLaunchData)
        .expect("Content-Type", /json/)
        .expect(201);

      // check launchDate is correct
      const requestDate = new Date(completeLaunchData.launchDate).valueOf;
      const responseDate = new Date(response.body.launchDate).valueOf;
      expect(requestDate).toBe(responseDate);

      // check if everything, execept, launchDate is correct - toMatchObject matches objects partially
      expect(response.body).toMatchObject(launchDataWithoutDate);
    });

    test("catch missing properties", async () => {
      const response = await request(app)
        .post("/v1/launches")
        .send(launchDataWithoutDate)
        .expect("Content-Type", /json/)
        .expect(400);

      // toStrictEqual test that objects have the same types as well as structure
      expect(response.body).toStrictEqual({
        error: "Missing required launch property",
      });
    });
    test("catch invalid date", async () => {
      const response = await request(app)
        .post("/v1/launches")
        .send(launchDataWithInvalidDate)
        .expect("Content-Type", /json/)
        .expect(400);

      // toStrictEqual test that objects have the same types as well as structure
      expect(response.body).toStrictEqual({
        error: "Invalid launch date",
      });
    });
  });
});
