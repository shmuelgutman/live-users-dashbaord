const request = require("supertest");
const jwt = require("jsonwebtoken");
const createApp = require("../lib/app");
const dbHelpers = require("./db-helpers");

const app = createApp(dbHelpers.db);

beforeEach(() => {
  return dbHelpers.refreshDatabase();
});

test("Register invalid request", () => {
  return request(app).post("/register").expect(422);
});

test("Register - valid request", async () => {
  const response = await request(app)
    .post("/register")
    .set("User-Agent", "some-user-agent")
    .send({ username: "Shmuel", password: "1234" })
    .expect(200);
  expect(response.body).toHaveProperty("jwt");
  expect(response.body.jwt).toBeTruthy();
  expect(await dbHelpers.userExists("Shmuel")).toBeTruthy();
  const user = await dbHelpers.getUser("Shmuel");
  expect(user).toHaveProperty("is_online", "1");
  expect(user).toHaveProperty("logged_in_ip", "127.0.0.1");
  expect(user).toHaveProperty("logged_in_useragent", "some-user-agent");
});

test("Login - invalid password", async () => {
  await dbHelpers.createUser("Shmuel", "1234");
  const response = await request(app)
    .post("/login")
    .send({ username: "Shmuel", password: "1" })
    .expect(400);
  expect(response.body).toHaveProperty("code");
  expect(response.body.code).toEqual("invalid_credentials");
});

test("Login - valid", async () => {
  await dbHelpers.createUser("Shmuel", "1234");
  const response = await request(app)
    .post("/login")
    .set("User-Agent", "some-user-agent2")
    .send({ username: "Shmuel", password: "1234" })
    .expect(200);
  expect(response.body).toHaveProperty("jwt");
  const user = await dbHelpers.getUser("Shmuel");
  expect(user).toHaveProperty("is_online", "1");
  expect(user).toHaveProperty("logged_in_ip", "127.0.0.1");
  expect(user).toHaveProperty("logged_in_useragent", "some-user-agent2");
});

test("api/me", async () => {
  const user = await dbHelpers.createUser("Shmuel", "1234");
  const authorization = jwt.sign({ userId: user.id, username: user.username }, "secret", {
    algorithm: "HS256",
    expiresIn: 120,
  });
  const response = await request(app)
    .get("/api/me")
    .set("authorization", `Bearer ${authorization}`)
    .expect(200);
  expect(response.body).toHaveProperty("id", user.id);
  expect(response.body).toHaveProperty("username", user.username);
  expect(response.body).toHaveProperty("created_at");
});

test("/api/users", async () => {
  await dbHelpers.createUser("u1", "1234");
  await request(app).post("/login").send({ username: "u1", password: "1234" }).expect(200);
  await dbHelpers.createUser("u2", "1234");
  await request(app).post("/login").send({ username: "u2", password: "1234" }).expect(200);

  await dbHelpers.createUser("Shmuel", "1234");
  const { body } = await request(app)
    .post("/login")
    .send({ username: "Shmuel", password: "1234" })
    .expect(200);

  const response = await request(app)
    .get("/api/users")
    .set("authorization", `Bearer ${body.jwt}`)
    .expect(200);

  expect(response.body).toHaveProperty("users");
  expect(response.body.users).toHaveLength(3);
});

test("login count", async () => {
  await dbHelpers.createUser("u1", "1234");
  expect(await dbHelpers.getUser("u1")).toHaveProperty("login_count", 0);
  await request(app).post("/login").send({ username: "u1", password: "1234" }).expect(200);
  expect(await dbHelpers.getUser("u1")).toHaveProperty("login_count", 1);
  await request(app).post("/login").send({ username: "u1", password: "1234" }).expect(200);
  expect(await dbHelpers.getUser("u1")).toHaveProperty("login_count", 2);
});

test("register - user already exists", async () => {
  await dbHelpers.createUser("u1", "1234");

  await request(app)
    .post("/register")
    .send({ username: "u1", password: "secret" })
    .expect(422, "User already exists");
});
