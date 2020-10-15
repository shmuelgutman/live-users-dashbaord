const createApp = require("./lib/app");
const { provideDb } = require("./lib/db/db.provider");

const port = process.env.EXPRESS_PORT || 8080;
const file = process.env.SQLITE_FILE || "./db/live-users.db";

const db = provideDb({ file });

db.migrate();

const app = createApp(db);

app.listen(port, (err) => {
  if (err) console.error(`failed to listen to port ${port}`, err);
  else console.log(`Express app is listening to port ${port}`);
});
