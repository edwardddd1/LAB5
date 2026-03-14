<template>
  <div class="container">
    <h2>Mood Check-in</h2>

    <!-- Input Section -->
    <div class="form-group">
      <input v-model="name" placeholder="Your name" :disabled="loading" />
      <textarea v-model="mood" placeholder="How are you feeling today?" :disabled="loading"></textarea>

      <button @click="submitMood" :disabled="loading || !name || !mood">
        <span v-if="loading">💬 Processing...</span>
        <span v-else>Submit</span>
      </button>
    </div>

    <!-- Error/AI Response Section -->
    <p v-if="error" class="error-msg">⚠️ {{ error }}</p>
    <div v-if="aiMessage" class="ai-box">
      <strong>AI Advisor:</strong> {{ aiMessage }}
    </div>

    <hr />

    <!-- Mood History List (Extra Credit) -->
    <h3>Mood History</h3>
    <button @click="fetchHistory" class="refresh-btn">🔄 Refresh History</button>

    <table v-if="history.length > 0" class="history-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Mood</th>
          <th>AI Response</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="entry in history" :key="entry.id">
          <td>{{ entry.full_name }}</td>
          <td>{{ entry.mood_text }}</td>
          <td>{{ entry.ai_message }}</td>
        </tr>
      </tbody>
    </table>
    <p v-else>No history found.</p>
  </div>
</template>

<script>
import api from '../services/api';

export default {
  data() {
    return {
      name: '',
      mood: '',
      aiMessage: '',
      loading: false,
      error: null,
      history: []
    };
  },
  mounted() {
    console.log("MoodForm component loaded");
    this.fetchHistory();
  },
  methods: {
    async submitMood() {
  console.log("User clicked submit button");
  console.log("Name entered:", this.name);
  console.log("Mood value entered:", this.mood);

  try {
    const response = await fetch("https://lab5-api-g91e.onrender.com/api/moods", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: this.name,
        mood: this.mood
      })
    });

    console.log("API response status:", response.status);

    const data = await response.json();
    console.log("API response data:", data);

  } catch (error) {
    console.error("Error submitting mood:", error);
  }
},

    async fetchHistory() {
      try {
        const res = await api.get('/api/moods');
        this.history = res.data;
      } catch (err) {
        console.error("Could not fetch history");
      }
    }
  }
};
</script>

<style scoped>
.container {
  max-width: 600px;
  margin: auto;
  font-family: sans-serif;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.ai-box {
  background: rgb(0, 0, 0);
  padding: 15px;
  border-left: 5px solid #2196f3;
  margin-top: 10px;
}

.error-msg {
  color: red;
  font-weight: bold;
}

.history-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

.history-table th,
.history-table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

.refresh-btn {
  margin-bottom: 10px;
  cursor: pointer;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
