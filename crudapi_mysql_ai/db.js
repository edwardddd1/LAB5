import mysql from "mysql2/promise";
import dotenv from "dotenv";
import fs from "fs"; // Add this to read the certificate file

dotenv.config();

export const db = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  // --- ADD THIS SECTION ---
  ssl: {
    rejectUnauthorized: true,
    ca: fs.readFileSync("./ca.pem"), // Path to the certificate you download from Aiven
  },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});