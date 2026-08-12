require("dotenv").config();

const app = require("./app");
const pool = require("./config/database");

const PORT = Number(process.env.PORT) || 3000;

function validateEnvironment() {
  const missing = [];

  if (!process.env.DATABASE_URL) {
    missing.push("DATABASE_URL");
  }

  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
    missing.push("JWT_SECRET (minimum 32 characters)");
  }

  if (missing.length > 0) {
    throw new Error(`Missing or invalid environment configuration: ${missing.join(", ")}`);
  }
}

async function startServer() {
  validateEnvironment();

  try {
    await pool.query("SELECT 1");
    console.log("Database connected successfully");

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed");
    if (process.env.NODE_ENV !== "production") {
      console.error(error.message);
    }
    process.exit(1);
  }
}

startServer();
