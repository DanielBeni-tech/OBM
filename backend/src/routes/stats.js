const express = require('express');
const { pool } = require('../db');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);

router.get('/', async (req, res) => {
  const todaySales = await pool.query(
    `SELECT COUNT(*) as count, COALESCE(SUM(amount), 0) as total
     FROM sales WHERE user_id = $1 AND sale_date::date = CURRENT_DATE`,
    [req.userId]
  );
  const totalClients = await pool.query(
    'SELECT COUNT(*) as count FROM clients WHERE user_id = $1',
    [req.userId]
  );
  const totalRevenue = await pool.query(
    'SELECT COALESCE(SUM(amount), 0) as total FROM sales WHERE user_id = $1',
    [req.userId]
  );
  const totalSales = await pool.query(
    'SELECT COUNT(*) as count FROM sales WHERE user_id = $1',
    [req.userId]
  );
  const recentSales = await pool.query(
    'SELECT * FROM sales WHERE user_id = $1 ORDER BY sale_date DESC LIMIT 5',
    [req.userId]
  );

  res.json({
    today_sales_count: parseInt(todaySales.rows[0].count),
    today_sales_total: parseFloat(todaySales.rows[0].total),
    total_clients: parseInt(totalClients.rows[0].count),
    total_revenue: parseFloat(totalRevenue.rows[0].total),
    total_sales: parseInt(totalSales.rows[0].count),
    recent_sales: recentSales.rows
  });
});

module.exports = router;
