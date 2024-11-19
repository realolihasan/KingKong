// db.js - Ensure this file is present and correctly written

const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'kingkong.mysql.database.azure.com',
  user: 'realolihasan',
  password: 'Md954146',
  database: 'mywebdatabase',
  ssl: {
    ca: 'D:/Programming Folder/KingKong/DigiCertGlobalRootCA.crt.pem', // Update path if needed
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

module.exports = db;