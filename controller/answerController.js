const supabase = require("../config/supabaseClient");
const { StatusCodes } = require("http-status-codes");

// ✅ Get answers by question
const getAnswersByQuestion = async (req, res) => {
  try {
    const { question_id } = req.params;

    const { data: answers, error } = await supabase
      .from("answers")
      .select(`
        id,
        answer,
        created_at,
        usere!inner(username)
      `)
      .eq("question_id", question_id)
      .order("created_at", { ascending: false });

    if (error) throw error;

    res.status(StatusCodes.OK).json(answers);
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: err.message });
  }
};

// ✅ Post a new answer
const postAnswer = async (req, res) => {
  try {
    const { question_id } = req.params;
    const { answer } = req.body;
    const userId = req.user.user_id;

    if (!answer) {
      return res.status(StatusCodes.BAD_REQUEST).json({ msg: "Answer cannot be empty" });
    }

    const { data, error } = await supabase
      .from("answers")
      .insert([{ question_id, user_id: userId, answer }])
      .select()
      .single();

    if (error) throw error;

    res.status(StatusCodes.CREATED).json({ msg: "Answer posted successfully!", answer: data });
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: err.message });
  }
};

module.exports = { getAnswersByQuestion, postAnswer };
