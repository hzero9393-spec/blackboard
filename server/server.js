require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { initDb } = require('./config/db');
const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');

const app = express();
const port = process.env.PORT || 4000;
let dbReadyPromise = null;

app.use(cors());
app.use(express.json({ limit: '5mb' }));
app.get('/api/health', (_req, res) => res.json({ ok: true }));
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);

// Placeholder for future real-time collaboration with Socket.IO broadcast.
// Placeholder for future AI layout generation service integration.

async function ensureDb() {
  if (!dbReadyPromise) dbReadyPromise = initDb();
  await dbReadyPromise;
}

if (process.env.VERCEL !== '1') {
  ensureDb().then(() => {
    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  });
}

module.exports = { app, ensureDb };
