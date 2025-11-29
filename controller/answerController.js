const AnswerService = require("../services/answerService");
const { StatusCodes } = require("http-status-codes");

// ✅ Get answers for a question
const getAnswersByQuestion = async (req, res) => {
  const { question_id } = req.params;

  try {
    const answers = await AnswerService.fetchAnswersByQuestion(question_id);
    res.status(StatusCodes.OK).json(answers);
  } catch (err) {
    console.error("Supabase error:", err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: "Database error", error: err.message });
  }
};

// ✅ Post a new answer
const postAnswer = async (req, res) => {
  const { question_id } = req.params;
  const { answer } = req.body;
  const user_id = req.user.user_id;

  if (!answer) {
    return res.status(StatusCodes.BAD_REQUEST).json({ msg: "Answer cannot be empty" });
  }

  try {
    const newAnswer = await AnswerService.createAnswer({ question_id, user_id, answer });
    res.status(StatusCodes.CREATED).json({ msg: "Answer posted successfully!", answer: newAnswer });
  } catch (err) {
    console.error("Supabase error:", err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: "Database error", error: err.message });
  }
};

module.exports = { getAnswersByQuestion, postAnswer };
