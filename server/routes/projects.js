const express = require('express');
const { client } = require('../config/db');
const { auth } = require('../middleware/auth');

const router = express.Router();
router.use(auth);

router.get('/', async (req, res) => {
  const result = await client.execute({ sql: 'SELECT id, name, description, created_at, updated_at FROM projects WHERE user_id = ? ORDER BY updated_at DESC', args: [req.user.userId] });
  res.json(result.rows);
});

router.post('/', async (req, res) => {
  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  const { name, description = '', data = { nodes: [], edges: [], viewport: { x: 0, y: 0, zoom: 1 } } } = req.body;
  await client.execute({
    sql: 'INSERT INTO projects (id, user_id, name, description, data_json, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
    args: [id, req.user.userId, name, description, JSON.stringify(data), now, now],
  });
  res.status(201).json({ id, name, description, data });
});

router.get('/:id', async (req, res) => {
  const result = await client.execute({ sql: 'SELECT * FROM projects WHERE id = ? AND user_id = ?', args: [req.params.id, req.user.userId] });
  if (!result.rows.length) return res.status(404).json({ message: 'Project not found' });
  const item = result.rows[0];
  return res.json({ ...item, data: JSON.parse(item.data_json) });
});

router.put('/:id', async (req, res) => {
  const now = new Date().toISOString();
  const { name, description, data } = req.body;
  await client.execute({
    sql: 'UPDATE projects SET name = ?, description = ?, data_json = ?, updated_at = ? WHERE id = ? AND user_id = ?',
    args: [name, description, JSON.stringify(data), now, req.params.id, req.user.userId],
  });
  res.json({ success: true });
});

router.delete('/:id', async (req, res) => {
  await client.execute({ sql: 'DELETE FROM projects WHERE id = ? AND user_id = ?', args: [req.params.id, req.user.userId] });
  res.status(204).send();
});

router.post('/:id/export', async (req, res) => {
  const result = await client.execute({ sql: 'SELECT * FROM projects WHERE id = ? AND user_id = ?', args: [req.params.id, req.user.userId] });
  if (!result.rows.length) return res.status(404).json({ message: 'Project not found' });
  res.json({ export: JSON.parse(result.rows[0].data_json) });
});

module.exports = router;
