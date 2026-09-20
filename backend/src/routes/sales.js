const express = require('express');
const { pool } = require('../db');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);

// List sales
router.get('/', async (req, res) => {
  const { period } = req.query;
  let query = 'SELECT * FROM sales WHERE user_id = $1';
  let params = [req.userId];
  if (period && period !== 'all') {
    let interval = "1 day";
    if (period === 'week') interval = "7 days";
    if (period === 'month') interval = "30 days";
    query += ` AND sale_date >= NOW() - INTERVAL '${interval}'`;
  }
  query += ' ORDER BY sale_date DESC';
  const result = await pool.query(query, params);
  res.json(result.rows);
});

// Create sale
router.post('/', async (req, res) => {
  const { description, amount, payment_method, client_id, client_name, sale_date } = req.body;
  if (!description) return res.status(400).json({ error: 'La description est requise' });
  if (amount == null) return res.status(400).json({ error: 'Le montant est requis' });
  const result = await pool.query(
    `INSERT INTO sales (user_id, description, amount, payment_method, client_id, client_name, sale_date)
     VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    [req.userId, description, amount, payment_method || 'cash', client_id || null, client_name || '', sale_date || new Date()]
  );
  res.json(result.rows[0]);
});

// Delete sale
router.delete('/:id', async (req, res) => {
  const result = await pool.query('DELETE FROM sales WHERE id = $1 AND user_id = $2', [req.params.id, req.userId]);
  if (!result.rowCount) return res.status(404).json({ error: 'Vente introuvable' });
  res.json({ ok: true });
});

module.exports = router;
