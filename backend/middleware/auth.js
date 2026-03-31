const jwt = require("jsonwebtoken");

function verifyToken(req, res, next){

  const token = req.headers.authorization;

  if(!token){
    return res.status(401).send("Access Denied");
  }

  try {
    const verified = jwt.verify(token, "foodshare_super_secret_2026");
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).send("Invalid Token");
  }
}

module.exports = verifyToken;