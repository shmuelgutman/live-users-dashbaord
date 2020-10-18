module.exports = {
  registerValidator: (db) => (req, res, next) => {
    if (!req.body.username || !req.body.password) {
      return res.status(422).send("Invalid username or password");
    }
    // check that user 'username' is not already exists
    db.getUser(req.body.username).then((user) =>
      user ? res.status(422).send("User already exists") : next()
    );
  },
  loginValidator: () => (req, res, next) => {
    if (!req.body.username || !req.body.password) {
      return res.status(422).send("Missing username and/or password");
    }
    next();
  },
};
