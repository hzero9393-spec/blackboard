const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { client } = require('../config/db');

const router = express.Router();

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  const passwordHash = await bcrypt.hash(password, 10);
  const id = crypto.randomUUID();
  try {
    await client.execute({
      sql: 'INSERT INTO users (id, name, email, password_hash) VALUES (?, ?, ?, ?)',
      args: [id, name, email, passwordHash],
    });
    res.status(201).json({ id, name, email });
  } catch (error) {
    res.status(400).json({ message: 'User already exists' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await client.execute({ sql: 'SELECT * FROM users WHERE email = ?', args: [email] });
  if (!user.rows.length) return res.status(401).json({ message: 'Invalid credentials' });
  const record = user.rows[0];
  const valid = await bcrypt.compare(password, record.password_hash);
  if (!valid) return res.status(401).json({ message: 'Invalid credentials' });
  const token = jwt.sign({ userId: record.id, email: record.email }, process.env.JWT_SECRET || 'dev-secret', { expiresIn: '7d' });
  return res.json({ token });
});

module.exports = router;
