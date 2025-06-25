const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

const app = express();
const PORT = 3000;

// PostgreSQL connection setup
const pool = new Pool({
  user: 'your_pg_user',
  host: 'localhost',
  database: 'your_pg_database',
  password: 'your_pg_password',
  port: 5432,
});

app.use(cors());
app.use(bodyParser.json());

// Create cart table if it doesn't exist
pool.query(`
  CREATE TABLE IF NOT EXISTS cart (
    id SERIAL PRIMARY KEY,
    product TEXT NOT NULL,
    price NUMERIC NOT NULL,
    quantity INTEGER DEFAULT 1
  )
`, (err) => {
  if (err) console.error('Error creating table:', err);
  else console.log('Cart table ready.');
});

// Add to cart endpoint
app.post('/add-to-cart', async (req, res) => {
  const { product, price } = req.body;
  if (!product || !price) {
    return res.status(400).json({ message: 'Product and price required.' });
  }
  try {
    await pool.query(
      'INSERT INTO cart (product, price) VALUES ($1, $2)',
      [product, price]
    );
    res.json({ message: 'Added to cart!' });
  } catch (err) {
    res.status(500).json({ message: 'Database error.' });
  }
});

// (Optional) Get cart items
app.get('/cart', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM cart');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Database error.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
