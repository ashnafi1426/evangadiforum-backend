const supabase = require("../config/supabaseClient");

// ✅ Create a new question
const createQuestion = async ({ userId, title, description }) => {
  const { data, error } = await supabase
    .from("questions")
    .insert([{ user_id: userId, title, description }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

// ✅ Fetch all questions with related username
const fetchAllQuestions = async () => {
  const { data, error } = await supabase
    .from("questions")
    .select(`
      id,
      title,
      description,
      created_at,
      users!inner(username)   -- fetch related user
    `)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
};

// ✅ Fetch question by ID with answers and usernames
const fetchQuestionById = async (id) => {
  // Fetch the question
  const { data: [question], error: questionError } = await supabase
    .from("questions")
    .select(`
      id,
      title,
      description,
      created_at,
      users!inner(username)
    `)
    .eq("id", id);

  if (questionError) throw questionError;
  if (!question) return null;

  // Fetch related answers
  const { data: answers, error: answersError } = await supabase
    .from("answers")
    .select(`
      id,
      answer,
      created_at,
      users!inner(username)
    `)
    .eq("question_id", id)
    .order("created_at", { ascending: false });

  if (answersError) throw answersError;

  return { question, answers };
};

module.exports = {
  createQuestion,
  fetchAllQuestions,
  fetchQuestionById,
};
