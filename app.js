const express = require("express");
const cors = require("cors");
const db = require("./db/dbConfig");
const app = express();
const PORT = 5500;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const userRoutes = require("./routes/userRoute");
const questionRoutes = require("./routes/questionRoute");
const answerRoutes = require("./routes/answerRoute");

// ✅ Public routes
app.use("/api/users", userRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/answers", answerRoutes);

// Start server
async function start() {
  try {
    await db.execute("SELECT 1");
    console.log("✅ Database connected");
  } catch (err) {
    console.log("❌ DB connection failed:", err.message);
  }
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}
start();