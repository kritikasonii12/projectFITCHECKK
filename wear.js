/**
 * Planner / wear log.
 * An entry = one outfit planned (or worn) on one date.
 *   { id, date:'YYYY-MM-DD', outfitId?, itemIds:[...], worn:boolean, note }
 * Older entries (outfitId + date only) still work.
 */
const express = require('express');
const { db, save, uid, pick } = require('../data/store');
const auth = require('../middleware/auth');

const router = express.Router();
router.use(auth);

const FIELDS = ['date', 'outfitId', 'itemIds', 'worn', 'note'];

router.get('/', (req, res) => {
  res.json(db.history.filter(h => h.userId === req.userId));
});

router.post('/', (req, res) => {
  const body = pick(req.body, FIELDS);
  const entry = {
    id: uid(), userId: req.userId, itemIds: [], worn: false, note: '',
    ...body,
    date: body.date || new Date().toISOString().slice(0, 10),
    createdAt: Date.now()
  };
  if (!entry.outfitId && !(entry.itemIds || []).length) return res.status(400).json({ message: 'Pick an outfit or at least one piece' });
  db.history.push(entry); save();
  res.status(201).json(entry);
});

router.put('/:id', (req, res) => {
  const e = db.history.find(h => h.id === req.params.id && h.userId === req.userId);
  if (!e) return res.status(404).json({ message: 'Planner entry not found' });
  Object.assign(e, pick(req.body, FIELDS));
  save();
  res.json(e);
});

router.delete('/:id', (req, res) => {
  const before = db.history.length;
  db.history = db.history.filter(h => !(h.id === req.params.id && h.userId === req.userId));
  if (db.history.length === before) return res.status(404).json({ message: 'Planner entry not found' });
  save();
  res.json({ message: 'Deleted' });
});

module.exports = router;
