const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// 🧪 TEST CONNECTION ROUTE
app.get('/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    console.log('✅ PostgreSQL is connected. Current time:', result.rows[0].now);
    res.send(`🎉 Connected! PostgreSQL time: ${result.rows[0].now}`);
  } catch (err) {
    console.error('❌ Database connection failed:', err);
    res.status(500).send('❌ Database connection failed.');
  }
});

// 🚀 POST /leads
app.post('/leads', async (req, res) => {
  const { company, contact, email, phone, stage, source, industry, status, content, notes } = req.body;
  console.log('📥 Incoming lead data:', req.body);

  try {
    const result = await pool.query(
      `INSERT INTO leads (company, contact, email, phone, stage, source, industry, status, content, notes)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
      [company, contact, email, phone, stage, source, industry, status, content, notes]
    );

    console.log('✅ Lead inserted into database:', result.rows[0]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error('❌ Failed to insert lead:', err);
    res.status(500).send('Server error');
  }
});

// 📤 GET /leads
app.get('/leads', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM leads ORDER BY id DESC');
    console.log(`📊 Fetched ${result.rows.length} leads`);
    res.json(result.rows);
  } catch (err) {
    console.error('❌ Failed to fetch leads:', err);
    res.status(500).send('Server error');
  }
});

// 🟢 Launch Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
