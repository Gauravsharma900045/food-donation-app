const router = require("express").Router();
const Notification = require("../models/Notification");
const verifyToken = require("../middleware/auth");

// GET ALL NOTIFICATIONS
router.get("/", verifyToken, async (req, res) => {
  const notifications = await Notification.find({ user: req.user.id }).sort({ createdAt: -1 });
  res.json(notifications);
});

// MARK AS READ
router.post("/read", verifyToken, async (req, res) => {
  await Notification.updateMany({ user: req.user.id, read: false }, { read: true });
  res.send("Read");
});

module.exports = router;
