const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const port = 8080;
const secretKey = 'your_secret_key'; // 실제 비밀 키로 변경

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

// JWT 토큰 검증 미들웨어
const authenticateJWT = (req, res, next) => {
  const authHeader = req.header('Authorization');

  if (!authHeader) {
    return res.status(401).json({ message: 'Access token is missing or invalid' });
  }

  const token = authHeader.replace('Bearer ', '');

  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }

    req.user = user;
    next();
  });
};

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

app.post('/register', async (req, res) => {
  const { username, email, password, firstName, lastName, dateOfBirth, phoneNumber, address } = req.body;

  console.log('Received register request:', req.body);

  if (!username || !email || !password || !firstName || !lastName || !dateOfBirth) {
    res.status(400).json({ message: 'Username, email, password, first name, last name, and date of birth are required' });
    return;
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const signupDate = new Date();

    const checkQuery = 'SELECT * FROM users WHERE email = ? OR username = ?';
    db.query(checkQuery, [email, username], (err, results) => {
      if (err) {
        console.error('Error checking existing users:', err);
        res.status(500).json({ message: 'Error checking existing users' });
        return;
      }

      if (results.length > 0) {
        res.status(400).json({ message: 'Email or username already exists' });
        return;
      }

      const insertQuery = 'INSERT INTO users (username, email, password, first_name, last_name, date_of_birth, phone_number, signup_date, address) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
      db.query(insertQuery, [username, email, hashedPassword, firstName, lastName, dateOfBirth, phoneNumber, signupDate, address], (err, results) => {
        if (err) {
          console.error('Error registering user:', err);
          res.status(500).json({ message: 'Error registering user' });
          return;
        }

        res.json({ message: 'User registered successfully' });
      });
    });
  } catch (err) {
    console.error('Error hashing password:', err);
    res.status(500).json({ message: 'Error registering user' });
  }
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({ message: 'Username and password are required' });
    return;
  }

  const query = 'SELECT * FROM users WHERE username = ?';
  db.query(query, [username], async (err, results) => {
    if (err) {
      console.error('Error fetching user:', err);
      res.status(500).json({ message: 'Error fetching user' });
      return;
    }

    if (results.length === 0) {
      res.status(400).json({ message: 'Invalid username or password' });
      return;
    }

    const user = results[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      res.status(400).json({ message: 'Invalid username or password' });
      return;
    }

    const token = jwt.sign({ id: user.id, username: user.username }, secretKey, { expiresIn: '1h' });

    res.json({ success: true, token, firstName: user.first_name });
  });
});

// 로그인한 유저 정보 가져오기
app.get('/user-info', authenticateJWT, (req, res) => {
  const userId = req.user.id;

  const query = 'SELECT username, email, first_name, last_name, date_of_birth, phone_number, signup_date, address FROM users WHERE id = ?';
  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Error fetching user info:', err);
      res.status(500).json({ message: 'Error fetching user info' });
      return;
    }

    if (results.length === 0) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.json(results[0]);
  });
});

// 유저 정보 업데이트
app.put('/update-user-info', authenticateJWT, (req, res) => {
  const userId = req.user.id;
  const { first_name, last_name, phone_number, email, address, password } = req.body;

  // 요청 본문 로깅
  console.log('Received update request:', req.body);

  // 필요한 필드 확인
  if (!first_name || !last_name || !phone_number || !email || !address || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const query = 'SELECT password FROM users WHERE id = ?';
  db.query(query, [userId], async (err, results) => {
    if (err) {
      console.error('Error fetching user password:', err);
      return res.status(500).json({ message: 'Error fetching user password' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = results[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    const updateQuery = 'UPDATE users SET first_name = ?, last_name = ?, phone_number = ?, email = ?, address = ? WHERE id = ?';
    db.query(updateQuery, [first_name, last_name, phone_number, email, address, userId], (err, results) => {
      if (err) {
        console.error('Error updating user info:', err);
        return res.status(500).json({ message: 'Error updating user info' });
      }

      res.json({ message: 'User info updated successfully' });
    });
  });
});


// 비밀번호 변경
app.post('/change-password', authenticateJWT, (req, res) => {
  const userId = req.user.id;
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: 'Current and new password are required' });
  }

  const query = 'SELECT password FROM users WHERE id = ?';
  db.query(query, [userId], async (err, results) => {
    if (err) {
      console.error('Error fetching user password:', err);
      return res.status(500).json({ message: 'Error fetching user password' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = results[0];
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid current password' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const updateQuery = 'UPDATE users SET password = ? WHERE id = ?';
    db.query(updateQuery, [hashedPassword, userId], (err, results) => {
      if (err) {
        console.error('Error updating password:', err);
        return res.status(500).json({ message: 'Error updating password' });
      }

      res.json({ message: 'Password updated successfully' });
    });
  });
});

// 유저 잔액 업데이트 및 상품 수량 감소
app.post('/checkout', authenticateJWT, (req, res) => {
  const userId = req.user.id;
  const { items, totalPrice } = req.body;

  db.beginTransaction((err) => {
    if (err) {
      console.error('Error starting transaction:', err);
      return res.status(500).json({ message: 'Error starting transaction' });
    }

    // 유저 잔액 업데이트
    const updateBalanceQuery = 'UPDATE users SET balance = balance - ? WHERE id = ? AND balance >= ?';
    db.query(updateBalanceQuery, [totalPrice, userId, totalPrice], (err, results) => {
      if (err) {
        return db.rollback(() => {
          console.error('Error updating user balance:', err);
          return res.status(500).json({ message: 'Error updating user balance' });
        });
      }

      if (results.affectedRows === 0) {
        return db.rollback(() => {
          return res.status(400).json({ message: 'Insufficient balance' });
        });
      }

      // 상품 수량 감소
      const updateProductQuantityQuery = 'UPDATE products SET quantity = quantity - ? WHERE id = ? AND quantity >= ?';
      const tasks = items.map((item) =>
        new Promise((resolve, reject) => {
          db.query(updateProductQuantityQuery, [item.quantity, item.id, item.quantity], (err, results) => {
            if (err) {
              return reject(err);
            }

            if (results.affectedRows === 0) {
              return reject(new Error(`Insufficient stock for product ${item.product_name}`));
            }

            resolve();
          });
        })
      );

      Promise.all(tasks)
        .then(() => {
          db.commit((err) => {
            if (err) {
              return db.rollback(() => {
                console.error('Error committing transaction:', err);
                return res.status(500).json({ message: 'Error committing transaction' });
              });
            }

            res.json({ message: 'Checkout successful' });
          });
        })
        .catch((err) => {
          db.rollback(() => {
            console.error('Error during product quantity update:', err);
            return res.status(400).json({ message: err.message });
          });
        });
    });
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
