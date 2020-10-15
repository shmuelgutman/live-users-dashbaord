const jwt = require("jsonwebtoken");
const { hash } = require("./hasher");

const jwtExpiresIn = process.env.JWT_EXPIRES_IN || 60 * 60;
const jwtSecret = process.env.JWT_SECRET || "secret"; // Of course not in real project.

module.exports = (db) => ({
  async login(user, requestHeaders) {
    await db.userLoggedIn(user.username, {
      ip: requestHeaders["x-forwared-for"],
      useragent: requestHeaders["user-agent"],
    });
    return jwt.sign({ userId: user.id, username: user.username }, jwtSecret, {
      algorithm: "HS256",
      expiresIn: jwtExpiresIn,
    });
  },
  async authenticate({ username, password }) {
    const user = await db.getUser(username);
    return user && user.password === hash(password) ? user : false;
  },
  verifyJwt(token) {
    try {
      return jwt.verify(token, jwtSecret);
    } catch (e) {
      return false;
    }
  },
  parseJwt(token) {
    const decoded = jwt.decode(token);
    return db.getUser(decoded.username);
  },
});
