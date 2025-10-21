const express = require("express");
const router = express.Router();
const { getAnswersByQuestion, postAnswer } = require("../controller/answerController");
const auth = require("../middleware/authMiddleware");

// Get all answers for a question
router.get("/:question_id", getAnswersByQuestion);

// Post a new answer (protected)
router.post("/:question_id", auth, postAnswer);

module.exports = router;
