const express = require("express");
const router = express.Router();
const { askQuestion, getAllQuestions, getQuestionById } = require("../controller/questionController");
const auth = require("../middleware/authMiddleware");

router.post("/ask", auth, askQuestion);
router.get("/all", getAllQuestions);
router.get("/:id", getQuestionById);

module.exports = router;
