const express = require('express');
const { db, save, uid, pick } = require('../data/store');
const auth = require('../middleware/auth');

const router = express.Router();
router.use(auth);

const FIELDS = ['name', 'category', 'color', 'brand', 'price', 'season', 'occasion', 'image', 'notes'];

router.get('/', (req, res) => {
  res.json(db.clothing.filter(c => c.userId === req.userId));
});

router.post('/', (req, res) => {
  const body = pick(req.body, FIELDS);
  if (!body.name) return res.status(400).json({ message: 'Name is required' });
  const item = { id: uid(), userId: req.userId, ...body, createdAt: Date.now() };
  db.clothing.push(item); save();
  res.status(201).json(item);
});

router.put('/:id', (req, res) => {
  const item = db.clothing.find(c => c.id === req.params.id && c.userId === req.userId);
  if (!item) return res.status(404).json({ message: 'Item not found' });
  Object.assign(item, pick(req.body, FIELDS));
  save();
  res.json(item);
});

router.delete('/:id', (req, res) => {
  const before = db.clothing.length;
  db.clothing = db.clothing.filter(c => !(c.id === req.params.id && c.userId === req.userId));
  if (db.clothing.length === before) return res.status(404).json({ message: 'Item not found' });
  save();
  res.json({ message: 'Deleted' });
});

module.exports = router;
