const crypto = require("crypto");

const key = process.env.PASSWORD_HASH_KEY || "SomeVeryStringKey"; // For demo only. Of course not to be used in real application
exports.hash = (password) => {
  return crypto.createHmac("sha256", key).update(password).digest("hex");
};
