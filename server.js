const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // From Railway
  ssl: { rejectUnauthorized: false }
});

// 🚀 POST /leads
app.post('/leads', async (req, res) => {
  const { company, contact, email, phone, stage, source, industry, status, content, notes } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO leads (company, contact, email, phone, stage, source, industry, status, content, notes)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
      [company, contact, email, phone, stage, source, industry, status, content, notes]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// 🧠 GET /leads
app.get('/leads', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM leads ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
