const supabase = require("../config/supabaseClient");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

class UserService {
  // Check if user exists
  static async findByEmail(email) {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email);

    if (error) throw error;
    return data;
  }
  // Register user
  static async createUser({ firstname, lastname, username, email, password }) {
    const hashedPassword = await bcrypt.hash(password, 10);

    const { data, error } = await supabase
      .from("users")
      .insert([
        {
          firstname,
          lastname,
          username,
          email,
          password: hashedPassword,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Login user
  static async loginUser(email, password) {
    const { data: users, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email);

    if (error) throw error;
    if (users.length === 0) return null;

    const user = users[0];
    const match = await bcrypt.compare(password, user.password);

    if (!match) return null;

    const token = jwt.sign(
      { user_id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    return { user, token };
  }
}
module.exports = UserService;
