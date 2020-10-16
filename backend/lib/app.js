const express = require("express");
const cors = require("cors");
const auth = require("./auth.middleware");
const { registerValidator, loginValidator } = require("./validation");
const createGuard = require("./guard");

module.exports = (db) => {
  const app = express();
  app.use(express.json());
  app.use(cors());

  const guard = createGuard(db);

  app.use((req, res, next) => {
    // just for demo purposes, we set dummy ip address
    if (!req.headers["x-forwared-for"]) {
      req.headers["x-forwared-for"] = "127.0.0.1";
    }
    next();
  });

  app.post("/register", registerValidator(), (req, res, next) => {
    db.createUser(req.body)
      .then((user) => guard.login(user, req.headers))
      .then((jwt) => res.send({ jwt }))
      .catch(next);
  });

  app.post("/login", loginValidator(), async (req, res) => {
    const user = await guard.authenticate({
      username: req.body.username,
      password: req.body.password,
    });
    if (!user) {
      return res
        .status(400)
        .send({ code: "invalid_credentials", message: "Invalid username or password" });
    }

    const jwt = await guard.login(user, req.headers);
    res.send({ jwt });
  });

  app.post("/logout", auth(guard), (req, res, next) => {
    db.userLoggedOut(req.user.username)
      .then(() => res.send())
      .catch(next);
  });

  app.get("/api/me", auth(guard), (req, res) => {
    res.send(req.user);
  });

  /**
   * Online user is considered to be a user who logged in to the app, either by /login or by /register
   */
  app.get("/api/users", auth(guard), (req, res, next) => {
    db.getOnlineUsers()
      .then((users) => res.send({ users }))
      .catch(next);
  });

  return app;
};
