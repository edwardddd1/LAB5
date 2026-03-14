import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import moodRoutes from "./routes/moods.js";
import { db } from "db.js"

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/moods", moodRoutes);

app.post("/mood", async (req, res) => {
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


app.listen(process.env.PORT, () => {
  console.log("Server running on port", process.env.PORT);
});