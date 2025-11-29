const QuestionService = require("../services/questionService");
const { StatusCodes } = require("http-status-codes");

// ✅ Create a new question
const askQuestion = async (req, res) => {
  const { title, description } = req.body;
  const userId = req.user.user_id;

  if (!title || !description) {
    return res.status(StatusCodes.BAD_REQUEST).json({ msg: "Title and description required" });
  }

  try {
    const question = await QuestionService.createQuestion({ userId, title, description });
    res.status(StatusCodes.CREATED).json({ msg: "Question posted successfully!", question });
  } catch (err) {
    console.error("Supabase error:", err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: "Database error", error: err.message });
  }
};

// ✅ Get all questions
const getAllQuestions = async (req, res) => {
  try {
    const questions= await QuestionService.fetchAllQuestions();
    res.status(StatusCodes.OK).json(questions);
  } catch (err) {
    console.error("Supabase error:", err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: "Database error", error: err.message });
  }
};

// ✅ Get question by ID
const getQuestionById = async (req, res) => {
  const { id } = req.params;

  try {
    const data = await QuestionService.fetchQuestionById(id);

    if (!data) {
      return res.status(StatusCodes.NOT_FOUND).json({ msg: "Question not found" });
    }

    res.status(StatusCodes.OK).json(data);
  } catch (err) {
    console.error("Supabase error:", err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: "Database error", error: err.message });
  }
};

module.exports = { askQuestion, getAllQuestions, getQuestionById };
