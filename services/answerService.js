const supabase = require("../config/supabaseClient");

// ✅ Fetch all answers for a given question
const fetchAnswersByQuestion = async (question_id) => {
  const { data, error } = await supabase
    .from("answers")
    .select(`
      id,
      answer,
      created_at,
      user:users!answers_user_id_fkey(username)
    `)
    .eq("question_id", question_id)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
};

// ✅ Post a new answer
const createAnswer = async ({ question_id, user_id, answer }) => {
  const { data, error } = await supabase
    .from("answers")
    .insert([{ question_id, user_id, answer }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

module.exports = {
  fetchAnswersByQuestion,
  createAnswer,
};
