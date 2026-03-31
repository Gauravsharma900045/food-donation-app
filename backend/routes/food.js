const router = require("express").Router();
const Food = require("../models/Food");
const Notification = require("../models/Notification");
const verifyToken = require("../middleware/auth");
const multer = require("multer");

// IMAGE STORAGE — with file type & size validation
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    const safeName = Date.now() + "-" + file.originalname.replace(/\s+/g, "_");
    cb(null, safeName);
  }
});

const fileFilter = (req, file, cb) => {
  const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  if(allowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error("Only JPG, PNG, and WEBP images allowed."), false);
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } }); // max 5MB

// ADD FOOD (WITH IMAGE)
router.post("/add", verifyToken, upload.single("image"), async (req, res) => {
  const { foodType, quantity, location, pickupTime, category, lat, lng } = req.body;

  // Input validation
  if(!foodType || !quantity || !location || !pickupTime) {
    return res.status(400).json({ error: "All fields (foodType, quantity, location, pickupTime) are required." });
  }

  const food = new Food({
    foodType: foodType.trim(),
    quantity: quantity.trim(),
    location: location.trim(),
    pickupTime,
    category: category || "veg",
    lat, lng,
    image: req.file ? req.file.filename : "",
    donor: req.user.id
  });

  await food.save();
  res.json({ message: "Food Added", id: food._id });
});

// GET FOOD
router.get("/all", async (req, res) => {
  let foods = await Food.find({ status: "available" }).populate("donor", "name").lean();
  
  const userLat = parseFloat(req.query.lat);
  const userLng = parseFloat(req.query.lng);

  if (!isNaN(userLat) && !isNaN(userLng)) {
    const calcDist = (lat1, lon1, lat2, lon2) => {
      if (!lat1 || !lon1 || !lat2 || !lon2) return Infinity;
      const p = 0.017453292519943295;    // Math.PI / 180
      const c = Math.cos;
      const a = 0.5 - c((lat2 - lat1) * p)/2 + 
                c(lat1 * p) * c(lat2 * p) * 
                (1 - c((lon2 - lon1) * p))/2;
      return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
    };
    
    foods = foods.map(f => {
      f.distance = calcDist(userLat, userLng, f.lat, f.lng);
      return f;
    }).sort((a, b) => a.distance - b.distance);
  }

  res.json(foods);
});

// REQUEST FOOD
router.post("/request/:id", verifyToken, async (req, res) => {
  // Prevent donor from requesting their own food
  const food = await Food.findById(req.params.id);
  if(!food) return res.status(404).json({ error: "Food not found" });
  if(food.donor.toString() === req.user.id) {
    return res.status(400).json({ error: "You cannot request your own donation." });
  }
  if(food.status !== "available") {
    return res.status(400).json({ error: "This food has already been requested." });
  }

  food.status = "requested";
  food.requestedBy = req.user.id;
  await food.save();

  await new Notification({ 
    user: food.donor, 
    message: `Someone requested your food: ${food.foodType}` 
  }).save();

  res.json({ message: "Requested" });
});

// MY REQUESTS (Receiver)
router.get("/my-requests", verifyToken, async (req, res) => {
  const foods = await Food.find({ requestedBy: req.user.id }).populate("donor", "name email");
  res.json(foods);
});

// MY DONATIONS (Donor)
router.get("/my-donations", verifyToken, async (req, res) => {
  const foods = await Food.find({ donor: req.user.id }).populate("requestedBy", "name email");
  res.json(foods);
});

// COMPLETE DONATION — only the donor can complete it
router.post("/complete/:id", verifyToken, async (req, res) => {
  const food = await Food.findById(req.params.id);
  if(!food) return res.status(404).json({ error: "Food not found" });
  if(food.donor.toString() !== req.user.id) {
    return res.status(403).json({ error: "Only the donor can complete this donation." });
  }

  food.status = "completed";
  await food.save();

  await new Notification({
    user: food.requestedBy,
    message: `Your requested food '${food.foodType}' is ready for pickup! 🎉`
  }).save();

  res.json({ message: "Completed" });
});

module.exports = router;