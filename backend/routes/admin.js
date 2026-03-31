const router = require("express").Router();
const User = require("../models/User");
const Food = require("../models/Food");
const verifyAdmin = require("../middleware/admin");

// SYSTEM STATS
router.get("/stats", verifyAdmin, async (req, res) => {
  try {
    const totalDonors = await User.countDocuments({ role: "donor" });
    const totalReceivers = await User.countDocuments({ role: "receiver" });
    const totalFoods = await Food.countDocuments();
    const completedDonations = await Food.countDocuments({ status: "completed" });

    res.json({
      totalDonors,
      totalReceivers,
      totalFoods,
      completedDonations
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET ALL USERS
router.get("/users", verifyAdmin, async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: "admin" } }).select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE USER (And Cascade Foods?)
router.delete("/user/:id", verifyAdmin, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    await Food.deleteMany({ donor: req.params.id });
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
