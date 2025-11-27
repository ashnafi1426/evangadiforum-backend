const supabase = require("../config/supabaseClient");
const { StatusCodes } = require("http-status-codes");

// ✅ Create a new question
const askQuestion = async (req, res) => {
  const { title, description } = req.body;
  const userId = req.user.user_id;

  if (!title || !description) {
    return res.status(StatusCodes.BAD_REQUEST).json({ msg: "Title and description required" });
  }

  try {
    const { data, error } = await supabase
      .from("questions")
      .insert([{ user_id: userId, title, description }])
      .select()
      .single();

    if (error) throw error;

    res.status(StatusCodes.CREATED).json({ msg: "Question posted successfully!", question: data });
  } catch (err) {
    console.error("Supabase error:", err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: "Database error", error: err.message });
  }
};

// ✅ Get all questions with username
const getAllQuestions = async (req, res) => {
  try {
    const { data: questions, error } = await supabase
      .from("questions")
      .select(`
        id,
        title,
        description,
        created_at,
        usere!inner(username)
      `)
      .order("created_at", { ascending: false });

    if (error) throw error;

    res.status(StatusCodes.OK).json(questions);
  } catch (err) {
    console.error("Supabase error:", err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: "Database error", error: err.message });
  }
};

// ✅ Get a single question by ID along with its answers
const getQuestionById = async (req, res) => {
  const { id } = req.params;

  try {
    // Get the question with user info
    const { data: [question], error: questionError } = await supabase
      .from("questions")
      .select(`
        id,
        title,
        description,
        created_at,
        usere!inner(username)
      `)
      .eq("id", id);

    if (questionError) throw questionError;
    if (!question) return res.status(StatusCodes.NOT_FOUND).json({ msg: "Question not found" });

    // Get answers for the question
    const { data: answers, error: answersError } = await supabase
      .from("answers")
      .select(`
        id,
        answer,
        created_at,
        usere!inner(username)
      `)
      .eq("question_id", id)
      .order("created_at", { ascending: false });

    if (answersError) throw answersError;

    res.status(StatusCodes.OK).json({ question, answers });
  } catch (err) {
    console.error("Supabase error:", err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: "Database error", error: err.message });
  }
};

module.exports = { askQuestion, getAllQuestions, getQuestionById };
