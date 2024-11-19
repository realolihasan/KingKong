const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: true })); // For form submissions
app.use(bodyParser.json()); // For JSON payloads

// Serve static files from the "public" directory
app.use(express.static('public'));

// Database connection
const db = mysql.createConnection({
  host: 'kingkong.mysql.database.azure.com',
  user: 'realolihasan',
  password: 'Md954146',
  database: 'mywebdatabase',
  ssl: {
    ca: 'D:/Programming Folder/KingKong/DigiCertGlobalRootCA.crt.pem',
    rejectUnauthorized: false,
  },
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error('Database connection failed: ', err.stack);
    return;
  }
  console.log('Connected to database.');
});

// Routes

// Root Route
app.get('/', (req, res) => {
  res.send('Welcome to the MySQL CRUD Web App! Use /users-table to interact with the users table.');
});

// View Users Table with Add/Edit/Delete Options
app.get('/users-table', (req, res) => {
  const query = 'SELECT * FROM users';
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).send('Error retrieving users');
      return;
    }

    let html = `
      <html>
        <head>
          <title>Users Table</title>
          <link rel="stylesheet" type="text/css" href="/styles.css">
        </head>
        <body>
          <h1>Users Table</h1>
          <form action="/add-user" method="POST">
            <input type="text" name="name" placeholder="Name" required />
            <input type="email" name="email" placeholder="Email" required />
            <button type="submit">Add User</button>
          </form>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
    `;

    results.forEach(user => {
      html += `
        <tr>
          <td>${user.id}</td>
          <td>${user.name}</td>
          <td>${user.email}</td>
          <td>
            <a href="/edit-user/${user.id}">Edit</a> |
            <a href="/delete-user/${user.id}">Delete</a>
          </td>
        </tr>
      `;
    });

    html += `
            </tbody>
          </table>
        </body>
      </html>
    `;

    res.send(html);
  });
});

// Add a New User
app.post('/add-user', (req, res) => {
  const { name, email } = req.body;
  const query = 'INSERT INTO users (name, email) VALUES (?, ?)';
  db.query(query, [name, email], (err) => {
    if (err) {
      res.status(500).send('Error adding user');
      return;
    }
    res.redirect('/users-table');
  });
});

// Delete a User
app.get('/delete-user/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM users WHERE id = ?';
  db.query(query, [id], (err) => {
    if (err) {
      res.status(500).send('Error deleting user');
      return;
    }
    res.redirect('/users-table');
  });
});

// Edit a User
app.get('/edit-user/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM users WHERE id = ?';
  db.query(query, [id], (err, results) => {
    if (err || results.length === 0) {
      res.status(500).send('Error retrieving user for edit');
      return;
    }

    const user = results[0];
    let html = `
      <html>
        <head>
          <title>Edit User</title>
          <link rel="stylesheet" type="text/css" href="/styles.css">
        </head>
        <body>
          <h1>Edit User</h1>
          <form action="/update-user/${user.id}" method="POST">
            <input type="text" name="name" value="${user.name}" required />
            <input type="email" name="email" value="${user.email}" required />
            <button type="submit">Update User</button>
          </form>
        </body>
      </html>
    `;

    res.send(html);
  });
});

app.post('/update-user/:id', (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;
  const query = 'UPDATE users SET name = ?, email = ? WHERE id = ?';
  db.query(query, [name, email, id], (err) => {
    if (err) {
      res.status(500).send('Error updating user');
      return;
    }
    res.redirect('/users-table');
  });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
