module.exports = {
  registerValidator: () => (req, res, next) => {
    if (!req.body.username || !req.body.password) {
      return res.status(422).send("Invalid username or password");
    }
    next();
  },
  loginValidator: () => (req, res, next) => {
    if (!req.body.username || !req.body.password) {
      return res.status(422).send("Invalid username or password");
    }
    next();
  },
};
