
function extractToken(req) {
  const authorization = req.headers.authorization || req.headers.Authorization;
  if (authorization && authorization.split(" ")[0] === "Bearer") {
    return authorization.split(" ")[1];
  }

  return null;
}

module.exports = (guard) => async (req, res, next) => {
  const token = extractToken(req);
  if (!token || !guard.verifyJwt(token)) {
    return res.status(401).send();
  }
  req.user = await guard.parseJwt(token);
  next();
};
