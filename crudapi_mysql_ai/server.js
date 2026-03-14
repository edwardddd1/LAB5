import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import moodRoutes from "./routes/moods.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.listen(process.env.PORT, () => {
  console.log("Server running on port", process.env.PORT);
});

app.post("/api/moods", async (req, res) => {
  console.log("POST /api/moods request received");
  console.log("Request body:", req.body);

  const mood = req.body.mood;

  const result = await db.query(
    "INSERT INTO mood_log (mood) VALUES (?)",
    [mood]
  );

  console.log("Database insert result:", result);

  res.json({ message: "Mood saved successfully" });
});

app.post("/api/moods", async (req, res) => {
  console.log("POST /mood request received");
  console.log("Request body:", req.body);

  const mood = req.body.mood;
  const result = await db.query(
    "INSERT INTO mood_log (mood) VALUES (?)",
    [mood]
  );

  console.log("Database insert result:", result);
  res.json({ message: "Mood saved successfully" });
});