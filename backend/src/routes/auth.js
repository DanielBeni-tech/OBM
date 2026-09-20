const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../db');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

function signToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '30d' });
}

// Register
router.post('/register', async (req, res) => {
  const { email, password, full_name } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email et mot de passe requis' });
  }
  const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
  if (existing.rows.length) {
    return res.status(409).json({ error: 'Email déjà utilisé' });
  }
  const hash = await bcrypt.hash(password, 10);
  const result = await pool.query(
    'INSERT INTO users (email, password, full_name) VALUES ($1, $2, $3) RETURNING id, email, full_name, activity_name, role, created_date',
    [email, hash, full_name || '']
  );
  const user = result.rows[0];
  res.json({ token: signToken(user.id), user });
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email et mot de passe requis' });
  }
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  if (!result.rows.length) {
    return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
  }
  const user = result.rows[0];
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
  }
  res.json({
    token: signToken(user.id),
    user: { id: user.id, email: user.email, full_name: user.full_name, activity_name: user.activity_name, role: user.role, created_date: user.created_date }
  });
});

// Demo login
router.post('/demo', async (req, res) => {
  const email = 'demo@orangemboa.business';
  let result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  if (!result.rows.length) {
    const hash = await bcrypt.hash('demo1234', 10);
    result = await pool.query(
      'INSERT INTO users (email, password, full_name, activity_name) VALUES ($1, $2, $3, $4) RETURNING *',
      [email, hash, 'Entrepreneur Démo', 'Mon Snack Bar']
    );
  }
  const user = result.rows[0];
  res.json({
    token: signToken(user.id),
    user: { id: user.id, email: user.email, full_name: user.full_name, activity_name: user.activity_name, role: user.role, created_date: user.created_date }
  });
});

// Get current user
router.get('/me', authMiddleware, async (req, res) => {
  const result = await pool.query(
    'SELECT id, email, full_name, activity_name, role, created_date FROM users WHERE id = $1',
    [req.userId]
  );
  if (!result.rows.length) return res.status(404).json({ error: 'Utilisateur introuvable' });
  res.json(result.rows[0]);
});

// Update user
router.patch('/me', authMiddleware, async (req, res) => {
  const { full_name, activity_name } = req.body;
  const result = await pool.query(
    `UPDATE users SET
      full_name = COALESCE($1, full_name),
      activity_name = COALESCE($2, activity_name)
    WHERE id = $3 RETURNING id, email, full_name, activity_name, role, created_date`,
    [full_name, activity_name, req.userId]
  );
  res.json(result.rows[0]);
});

module.exports = router;
