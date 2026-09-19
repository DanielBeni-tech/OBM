const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      email VARCHAR UNIQUE NOT NULL,
      password VARCHAR NOT NULL,
      full_name VARCHAR DEFAULT '',
      activity_name VARCHAR DEFAULT 'Mon Activité',
      role VARCHAR DEFAULT 'user',
      created_date TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS clients (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      name VARCHAR NOT NULL,
      phone VARCHAR DEFAULT '',
      amount_due NUMERIC DEFAULT 0,
      notes TEXT DEFAULT '',
      created_date TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS sales (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      description VARCHAR NOT NULL,
      amount NUMERIC NOT NULL,
      payment_method VARCHAR DEFAULT 'cash',
      client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
      client_name VARCHAR DEFAULT '',
      sale_date TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS chat_messages (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      role VARCHAR NOT NULL,
      content TEXT NOT NULL,
      created_date TIMESTAMPTZ DEFAULT NOW()
    );
  `);
  console.log('Database initialized');
}

module.exports = { pool, initDb };
