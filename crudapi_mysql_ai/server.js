import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import moodRoutes from "./routes/moods.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

router.post("/", async (req, res) => {
  console.log("POST /api/moods request received");
  console.log("Request body:", req.body);

  try {
    const mood = req.body.mood;
    const name = req.body.name;

    const result = await db.query(
      "INSERT INTO mood_log (full_name, mood_text) VALUES (?, ?)",
      [name, mood]
    );

    console.log("Database insert result:", result);

    res.json({ message: "Mood saved successfully" });

  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Database error" });
  }
});