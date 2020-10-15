const sqlite3 = require("sqlite3").verbose();
const { hash } = require("../hasher");

class Sqlite {
  constructor(config) {
    this.db = new sqlite3.Database(config.file, (err) => {
      if (err) {
        console.error(err.message);
        process.exit();
      }
      console.log(`Connected to the ${config.file} database.`);
    });
  }

  createUser(params) {
    return new Promise((res, rej) => {
      this.db.serialize(() => {
        this.db.run(
          `
        INSERT INTO users (username, password, created_at, updated_at)
        VALUES ($username, $password, $created_at, $created_at)
        `,
          {
            $username: params.username,
            $password: hash(params.password),
            $created_at: new Date().toISOString(),
          },
          (err) => (err ? rej(err) : null)
        );
        this.db.get(
          `SELECT * FROM users WHERE username=$username`,
          { $username: params.username },
          (err, user) => (err ? rej(err) : res(user))
        );
      });
    });
  }

  getUser(username) {
    return new Promise((res, rej) => {
      this.db.get(
        `SELECT * FROM users WHERE username=$username`,
        { $username: username },
        (err, user) => (err ? rej(err) : res(user))
      );
    });
  }

  userLoggedIn(username, params) {
    return new Promise((res, rej) => {
      this.db.run(
        `UPDATE users SET
      updated_at = $updated_at, 
      logged_in_at = $logged_in_at, 
      logged_in_ip = $logged_in_ip, 
      logged_in_useragent = $logged_in_useragent, 
      is_online = $is_online 
      WHERE username = $username
      `,
        {
          $updated_at: new Date().toISOString(),
          $logged_in_at: new Date().toISOString(),
          $logged_in_ip: params.ip,
          $logged_in_useragent: params.useragent,
          $is_online: 1,
          $username: username,
        },
        (err) => (err ? rej(err) : res())
      );
    });
  }

  userLoggedOut(username) {
    return new Promise((res, rej) => {
      this.db.run(
        `UPDATE users SET
      updated_at = $updated_at, 
      is_online = $is_online 
      WHERE username = $username
      `,
        {
          $updated_at: new Date().toISOString(),
          $is_online: 0,
          $username: username,
        },
        (err) => (err ? rej(err) : res())
      );
    });
  }

  getOnlineUsers() {
    return new Promise((res, rej) =>
      this.db.all(
        `SELECT * FROM users WHERE is_online = $is_online `,
        { $is_online: 1 },
        (err, rows) => (err ? rej(err) : res(rows))
      )
    );
  }

  /**
   * Prepare database and tables.
   * @return {Promise<unknown>}
   */
  migrate() {
    return new Promise((res, rej) => {
      this.db.exec(
        `
CREATE TABLE IF NOT EXISTS users (
id INTEGER PRIMARY KEY AUTOINCREMENT,
username TEXT NOT NULL UNIQUE,
password TEXT NOT NULL,
created_at TEXT NOT_NULL,
updated_at TEXT NOT_NULL,
logged_in_at TEXT,
logged_in_ip TEXT,
logged_in_useragent TEXT,
is_online TEXT NOT NULL CHECK (is_online IN (0,1)) DEFAULT 0
);
`,
        (err) => (err ? rej(err) : res())
      );
    });
  }

  /**
   * Drop tables. To be used in tests.
   * @return {Promise<unknown>}
   */
  drop() {
    return new Promise((res, rej) => {
      this.db.exec("DROP TABLE IF EXISTS users;", (err) => (err ? rej(err) : res()));
    });
  }
}
module.exports = Sqlite;
