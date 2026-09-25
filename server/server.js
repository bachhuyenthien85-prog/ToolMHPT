const express = require('express');
const path = require('path');
const db = require('./db');

const app = express();
const PORT = 3000;
const REGISTER_CODE = 'Vunb7117@';

app.use(express.json());

// --- Static directories for bot scripts ---
app.use('/lib', express.static(path.join(__dirname, '..', 'lib')));
app.use('/auto', express.static(path.join(__dirname, '..', 'auto')));

// --- Page routes ---
app.get('/', (req, res) => res.redirect('/dashboard'));
app.get('/dashboard', (req, res) => res.sendFile(path.join(__dirname, '..', 'public', 'dashboard.html')));
app.get('/account', (req, res) => res.sendFile(path.join(__dirname, '..', 'public', 'account.html')));
app.get('/run', (req, res) => res.sendFile(path.join(__dirname, '..', 'public', 'run.html')));

// --- API: GameAccount CRUD ---
app.get('/api/accounts', (req, res) => {
  const rows = db.prepare('SELECT * FROM game_accounts ORDER BY id').all();
  res.json(rows.map(r => ({ ...r, settings: JSON.parse(r.settings) })));
});

app.get('/api/accounts/:id', (req, res) => {
  const row = db.prepare('SELECT * FROM game_accounts WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Not found' });
  res.json({ ...row, settings: JSON.parse(row.settings) });
});

app.post('/api/accounts', (req, res) => {
  const { code, display_name, username, password, server } = req.body;
  if (code !== REGISTER_CODE) {
    return res.status(401).json({ error: 'Mã không đúng' });
  }
  if (!display_name || !username || !password || !server) {
    return res.status(400).json({ error: 'Missing fields' });
  }
  const result = db.prepare(
    'INSERT INTO game_accounts (display_name, username, password, server, settings) VALUES (?, ?, ?, ?, ?)'
  ).run(display_name, username, password, server, '{}');
  const row = db.prepare('SELECT * FROM game_accounts WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json({ ...row, settings: JSON.parse(row.settings) });
});

app.put('/api/accounts/:id', (req, res) => {
  const { display_name, username, password, server, settings } = req.body;
  const row = db.prepare('SELECT * FROM game_accounts WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Not found' });
  db.prepare(
    'UPDATE game_accounts SET display_name = ?, username = ?, password = ?, server = ?, settings = ? WHERE id = ?'
  ).run(
    display_name ?? row.display_name,
    username ?? row.username,
    password ?? row.password,
    server ?? row.server,
    settings !== undefined ? JSON.stringify(settings) : row.settings,
    req.params.id
  );
  const updated = db.prepare('SELECT * FROM game_accounts WHERE id = ?').get(req.params.id);
  res.json({ ...updated, settings: JSON.parse(updated.settings) });
});

app.delete('/api/accounts/:id', (req, res) => {
  const result = db.prepare('DELETE FROM game_accounts WHERE id = ?').run(req.params.id);
  if (result.changes === 0) return res.status(404).json({ error: 'Not found' });
  res.json({ success: true });
});

// --- API: AppSettings ---
app.get('/api/settings/:key', (req, res) => {
  const row = db.prepare('SELECT * FROM app_settings WHERE key = ?').get(req.params.key);
  if (!row) return res.status(404).json({ error: 'Not found' });
  res.json(row);
});

app.put('/api/settings/:key', (req, res) => {
  const { value } = req.body;
  db.prepare('INSERT OR REPLACE INTO app_settings (key, value) VALUES (?, ?)').run(req.params.key, value);
  res.json({ key: req.params.key, value });
});

// --- Root static (old HTML pages + their JS deps) ---
app.use(express.static(path.join(__dirname, '..'), { index: false }));

app.listen(PORT, '0.0.0.0', () => {
  console.log(`XZTW Bot Manager running on http://localhost:${PORT}`);
});
