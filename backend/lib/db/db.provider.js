const Sqlite = require("./Sqlite");

/**
 * DB Provider, theoretically can be used to easily change DB implementation based on config.
 *
 * @param config
 *    file: path to db file or ':memory:' to use runtime memory storage
 */
exports.provideDb = (config) => {
  return new Sqlite(config);
};
