// ───────────────────────────────────────────────────
//  FoodShare – API Configuration
//  Change API_BASE to your deployed backend URL before hosting
// ───────────────────────────────────────────────────

const API_BASE = window.location.hostname === "localhost"
  ? "http://localhost:5000"          // Local development
  : "https://your-app.onrender.com"; // ← Replace with your Render URL after deploying backend
