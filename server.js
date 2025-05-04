const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const db = new sqlite3.Database('./reservations.db', (err) => {
  if (err) return console.error(err.message);
  console.log('Connected to SQLite database.');
});

db.run(`CREATE TABLE IF NOT EXISTS reservations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  contact TEXT,
  address TEXT
)`);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/reserve', (req, res) => {
  const { name, contact, address } = req.body;
  db.run('INSERT INTO reservations (name, contact, address) VALUES (?, ?, ?)', [name, contact, address], function(err) {
    if (err) {
      return res.status(500).send('Reservation failed.');
    }
    res.send('<h2>Thank you for your reservation!</h2><a href="/">Back to Home</a>');
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
