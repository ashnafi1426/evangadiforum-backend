require("dotenv").config();
const mysql2 = require("mysql2");

// ✅ Create a connection pool (recommended for production)
const dbConnection = mysql2.createPool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306,
  connectionLimit: 10,
});

// ✅ Test connection safely
dbConnection.getConnection((err, connection) => {
  if (err) {
    console.error("❌ DB connection failed:", err.message);
  } else {
    console.log("✅ Connected to MySQL database");
    connection.release(); // release back to pool
  }
});

module.exports = dbConnection.promise();
