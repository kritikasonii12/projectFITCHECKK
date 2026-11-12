const express = require('express');
const { db, save, uid, pick } = require('../data/store');
const auth = require('../middleware/auth');

const router = express.Router();
router.use(auth);

// layout = collage positions [{src:'closet'|'wishlist', id, x, y, w, z}] (percentages of the canvas)
const FIELDS = ['name', 'occasion', 'itemIds', 'layout'];

router.get('/', (req, res) => {
  res.json(db.outfits.filter(o => o.userId === req.userId));
});

router.post('/', (req, res) => {
  const body = pick(req.body, FIELDS);
  if (!body.name) return res.status(400).json({ message: 'Name is required' });
  const outfit = { id: uid(), userId: req.userId, itemIds: [], ...body, createdAt: Date.now() };
  db.outfits.push(outfit); save();
  res.status(201).json(outfit);
});

router.put('/:id', (req, res) => {
  const o = db.outfits.find(x => x.id === req.params.id && x.userId === req.userId);
  if (!o) return res.status(404).json({ message: 'Outfit not found' });
  Object.assign(o, pick(req.body, FIELDS));
  save();
  res.json(o);
});

router.delete('/:id', (req, res) => {
  db.outfits = db.outfits.filter(o => !(o.id === req.params.id && o.userId === req.userId));
  // plans that pointed at this look keep their own item list, just lose the link
  db.history.forEach(h => { if (h.userId === req.userId && h.outfitId === req.params.id) { h.outfitId = null; } });
  save();
  res.json({ message: 'Deleted' });
});

module.exports = router;
