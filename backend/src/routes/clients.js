const express = require('express');
const { pool } = require('../db');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);

// List clients
router.get('/', async (req, res) => {
  const { search } = req.query;
  let query = 'SELECT * FROM clients WHERE user_id = $1';
  let params = [req.userId];
  if (search) {
    query += ' AND name ILIKE $2';
    params.push(`%${search}%`);
  }
  query += ' ORDER BY created_date DESC';
  const result = await pool.query(query, params);
  res.json(result.rows);
});

// Create client
router.post('/', async (req, res) => {
  const { name, phone, amount_due, notes } = req.body;
  if (!name) return res.status(400).json({ error: 'Le nom est requis' });
  const result = await pool.query(
    'INSERT INTO clients (user_id, name, phone, amount_due, notes) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [req.userId, name, phone || '', amount_due || 0, notes || '']
  );
  res.json(result.rows[0]);
});

// Update client
router.patch('/:id', async (req, res) => {
  const { name, phone, amount_due, notes } = req.body;
  const result = await pool.query(
    `UPDATE clients SET
      name = COALESCE($1, name),
      phone = COALESCE($2, phone),
      amount_due = COALESCE($3, amount_due),
      notes = COALESCE($4, notes)
    WHERE id = $5 AND user_id = $6 RETURNING *`,
    [name, phone, amount_due, notes, req.params.id, req.userId]
  );
  if (!result.rows.length) return res.status(404).json({ error: 'Client introuvable' });
  res.json(result.rows[0]);
});

// Delete client
router.delete('/:id', async (req, res) => {
  const result = await pool.query('DELETE FROM clients WHERE id = $1 AND user_id = $2', [req.params.id, req.userId]);
  if (!result.rowCount) return res.status(404).json({ error: 'Client introuvable' });
  res.json({ ok: true });
});

module.exports = router;
