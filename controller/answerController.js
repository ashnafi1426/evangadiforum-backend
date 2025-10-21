const db = require("../db/dbConfig");
const { StatusCodes } = require("http-status-codes");

const getAnswersByQuestion = async (req, res) => {
  try {
    const { question_id } = req.params;
    const [answers] = await db.query(
      `SELECT a.id, a.answer, a.created_at, u.username 
       FROM answers a JOIN users u ON a.user_id = u.id
       WHERE a.question_id = ?
       ORDER BY a.created_at DESC`,
      [question_id]
    );
    res.status(StatusCodes.OK).json(answers);
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: err.message });
  }
};

const postAnswer = async (req, res) => {
  try {
    const { question_id } = req.params;
    const { answer } = req.body;
    const userId = req.user.user_id;

    if (!answer) {
      return res.status(StatusCodes.BAD_REQUEST).json({ msg: "Answer cannot be empty" });
    }

    await db.query("INSERT INTO answers (question_id, user_id, answer) VALUES (?, ?, ?)", [
      question_id,
      userId,
      answer,
    ]);

    res.status(StatusCodes.CREATED).json({ msg: "Answer posted successfully!" });
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: err.message });
  }
};

module.exports = { getAnswersByQuestion, postAnswer };
