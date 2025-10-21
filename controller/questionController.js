const db = require("../db/dbConfig");
const { StatusCodes } = require("http-status-codes");

// ✅ Create question
const askQuestion = async (req, res) => {
  const { title, description } = req.body;
  const userId = req.user.user_id;

  if (!title || !description) {
    return res.status(StatusCodes.BAD_REQUEST).json({ msg: "Title and description required" });
  }

  try {
    await db.query(
      "INSERT INTO questions (user_id, title, description) VALUES (?, ?, ?)",
      [userId, title, description]
    );

    res.status(StatusCodes.CREATED).json({ msg: "Question posted successfully!" });
  } catch (err) {
    console.error("DB error:", err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: "Database error", error: err.message });
  }
};

// ✅ Get all questions with username
const getAllQuestions = async (req, res) => {
  try {
    const [questions] = await db.query(`
      SELECT q.id, q.title, q.description, q.created_at, u.username
      FROM questions q
      JOIN users u ON q.user_id = u.id
      ORDER BY q.created_at DESC
    `);

    res.status(StatusCodes.OK).json(questions);
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: "Database error", error: err.message });
  }
};
const getQuestionById = async (req, res) => {
  const { id } = req.params;
  try {
    const [[question]] = await db.query(
      "SELECT q.id, q.title, q.description, u.username FROM questions q JOIN users u ON q.user_id = u.id WHERE q.id = ?",
      [id]
    );

    if (!question) {
      return res.status(StatusCodes.NOT_FOUND).json({ msg: "Question not found" });
    }

    const [answers] = await db.query(
      "SELECT a.id, a.answer, u.username FROM answers a JOIN users u ON a.user_id = u.id WHERE a.question_id = ? ORDER BY a.created_at DESC",
      [id]
    );

    res.status(StatusCodes.OK).json({ question, answers });
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: "Database error", error: err.message });
  }
};
module.exports = { askQuestion, getAllQuestions,getQuestionById };
