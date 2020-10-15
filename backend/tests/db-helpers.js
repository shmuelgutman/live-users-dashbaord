const { provideDb } = require("../lib/db/db.provider");

const db = provideDb({ file: ":memory:" });

module.exports = {
  db,
  async refreshDatabase() {
    await db.drop();
    await db.migrate();
  },
  async userExists(username) {
    const user = await db.getUser(username);
    return !!user;
  },
  createUser(username, password) {
    return db.createUser({ username, password });
  },
  getUser(username) {
    return db.getUser(username);
  },
};
