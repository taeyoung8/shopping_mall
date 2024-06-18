const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
const port = 8080;

// CORS 설정
const corsOptions = {
  origin: 'http://localhost:3000', // 클라이언트 도메인
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

// 데이터베이스 연결 설정
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',  // 실제 사용자 이름으로 변경
  password: '1234',  // 실제 비밀번호로 변경
  database: 'my_db'  // 이미 생성된 데이터베이스 이름
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the database');
});

app.get('/products', (req, res) => {
  const query = 'SELECT * FROM products2';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching products:', err);
      res.status(500).json({ message: 'Error fetching products' });
      return;
    }

    res.json(results);
  });
});

app.put('/update-product', (req, res) => {
  const { id, price, quantity } = req.body;

  if (!id || price === undefined || quantity === undefined) {
    res.status(400).json({ message: 'ID, price, and quantity are required' });
    return;
  }

  const updateQuery = 'UPDATE products SET price = ?, quantity = ? WHERE id = ?';
  db.query(updateQuery, [price, quantity, id], (err, results) => {
    if (err) {
      console.error('Error updating product:', err);
      res.status(500).json({ message: 'Error updating product' });
      return;
    }

    res.json({ message: 'Product updated successfully' });
  });
});

app.delete('/delete-product/:id', (req, res) => {
  const { id } = req.params;

  if (!id) {
    res.status(400).json({ message: 'ID is required' });
    return;
  }

  const deleteQuery = 'DELETE FROM products WHERE id = ?';
  db.query(deleteQuery, [id], (err, results) => {
    if (err) {
      console.error('Error deleting product:', err);
      res.status(500).json({ message: 'Error deleting product' });
      return;
    }

    res.json({ message: 'Product deleted successfully' });
  });
});

app.post('/add-product', (req, res) => {
  const { product_name, price, quantity, product_type } = req.body;

  if (!product_name || price === undefined || quantity === undefined || !product_type) {
    res.status(400).json({ message: 'Product name, price, quantity, and product type are required' });
    return;
  }

  const addQuery = 'INSERT INTO products (product_name, price, quantity, product_type, total_sales) VALUES (?, ?, ?, ?, ?)';
  db.query(addQuery, [product_name, price, quantity, product_type, 0], (err, results) => {
    if (err) {
      console.error('Error adding product:', err);
      res.status(500).json({ message: 'Error adding product' });
      return;
    }

    res.json({ message: 'Product added successfully', id: results.insertId });
  });
});



app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
