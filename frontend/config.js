// ───────────────────────────────────────────────────
//  FoodShare – API Configuration
// ───────────────────────────────────────────────────

const API_BASE = window.location.hostname === "localhost"
  ? "http://localhost:5000"                              // Local development
  : "https://foodshare-backend-ao8p.onrender.com";      // Production (Render)
