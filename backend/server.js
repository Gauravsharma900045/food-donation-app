const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json({ limit: "10kb" })); // prevent huge JSON payloads

// ── DB ──
mongoose.connect("mongodb+srv://gkr0527_db_user:test123@cluster0.6i4tjwo.mongodb.net/food-donation?retryWrites=true&w=majority")
.then(() => console.log("✅ DB Connected"))
.catch(err => console.log("❌ DB Error:", err));

// ── ROUTES ──
app.use("/api/auth",          require("./routes/auth"));
app.use("/api/food",          require("./routes/food"));
app.use("/api/notifications", require("./routes/notifications"));
app.use("/api/admin",         require("./routes/admin"));
app.use("/uploads",           express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => res.send("🚀 FoodShare Server is running"));

// ── GLOBAL ERROR HANDLER ──
// This catches errors thrown by multer (file type/size) and other middleware
app.use((err, req, res, next) => {
  if(err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({ error: "Image too large. Maximum size is 5MB." });
  }
  if(err.message && err.message.includes("Only JPG")) {
    return res.status(400).json({ error: err.message });
  }
  console.error("Server Error:", err.message);
  res.status(500).json({ error: "Internal server error." });
});

app.listen(5000, () => console.log("🔥 Server running on port 5000"));