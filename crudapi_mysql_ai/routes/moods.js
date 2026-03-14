import express from "express";
import { db } from "../db.js";
import { getAIResponse } from "../services/aiService.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { full_name, mood_text } = req.body; // Matches what Vue is sending
  try {
    // 1. Check if user exists, if not, INSERT them
    let [userRows] = await db.query("SELECT id FROM users WHERE full_name = ?", [full_name]);
    let userId;

    if (userRows.length === 0) {
      const [newUser] = await db.query("INSERT INTO users (full_name) VALUES (?)", [full_name]);
      userId = newUser.insertId;
    } else {
      userId = userRows[0].id;
    }

    // 2. Insert the mood using the userId we just found/created
    const [moodResult] = await db.query(
      "INSERT INTO mood_ent (user_id, mood_text) VALUES (?, ?)",
      [userId, mood_text]
    );

    // 3. Get AI Response and save it
    const aiMessage = await getAIResponse(mood_text);
    await db.query(
      "INSERT INTO ai_responses (mood_entry_id, ai_message) VALUES (?, ?)",
      [moodResult.insertId, aiMessage]
    );

    // 4. Send back the response (Note: using ai_message to match your Vue code)
    res.json({ message: "Mood saved", ai_message: aiMessage });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});




router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT m.id, u.full_name, m.mood_text, a.ai_message
      FROM users u
      JOIN mood_entries m ON u.id = m.user_id
      JOIN ai_responses a ON m.id = a.mood_entry_id
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM ai_responses WHERE mood_entry_id = ?", [id]);
    const [result] = await db.query("DELETE FROM mood_entries WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Entry not found" });
    }
    res.json({ message: "Entry deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
