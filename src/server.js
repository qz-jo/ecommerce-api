require("dotenv").config();
const app = require("./app");
const pool = require("./config/database");

const PORT = process.env.PORT || 3000;

// فحص الاتصال بقاعدة البيانات
async function testDatabaseConnection() {
  try {
    const result = await pool.query("SELECT NOW() AS current_time");
    console.log("Database connected successfully!");
    console.log("Current DB Time:", result.rows[0].current_time);
  } catch (error) {
    console.error("Database connection failed:", error.message);
  }
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  testDatabaseConnection();
});