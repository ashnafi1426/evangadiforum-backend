const express = require("express");
const cors = require("cors");
const supabase = require("./config/supabaseClient"); // updated
const app = express();
const PORT = process.env.PORT;

// Middleware
app.use(cors({
  origin:"https://evangadi-forum-nu-tawny.vercel.app"
}));
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
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
