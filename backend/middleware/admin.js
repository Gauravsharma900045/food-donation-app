const verifyToken = require("./auth");

const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user && req.user.role === "admin") {
      next();
    } else {
      res.status(403).json({ error: "Access Denied: Admins Only" });
    }
  });
};

module.exports = verifyAdmin;
