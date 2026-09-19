const express = require('express');
const cors = require('cors');
const { initDb } = require('./db');
const authRoutes = require('./routes/auth');
const clientRoutes = require('./routes/clients');
const saleRoutes = require('./routes/sales');
const chatRoutes = require('./routes/chat');
const statsRoutes = require('./routes/stats');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ ok: true }));

app.use('/api/auth', authRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/sales', saleRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/stats', statsRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Erreur serveur' });
});

const PORT = process.env.PORT || 8000;

initDb().then(() => {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Backend OBM running on port ${PORT}`);
  });
});
