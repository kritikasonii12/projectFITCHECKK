const express = require('express');
const { db, save, uid, pick } = require('../data/store');
const auth = require('../middleware/auth');

const router = express.Router();
router.use(auth);

const FIELDS = ['name', 'category', 'color', 'brand', 'price', 'link', 'priority', 'notes', 'image', 'season', 'occasion'];

router.get('/', (req, res) => {
  res.json(db.wishlist.filter(w => w.userId === req.userId));
});

router.post('/', (req, res) => {
  const body = pick(req.body, FIELDS);
  if (!body.name) return res.status(400).json({ message: 'Name is required' });
  const item = { id: uid(), userId: req.userId, ...body, createdAt: Date.now() };
  db.wishlist.push(item); save();
  res.status(201).json(item);
});

router.put('/:id', (req, res) => {
  const item = db.wishlist.find(w => w.id === req.params.id && w.userId === req.userId);
  if (!item) return res.status(404).json({ message: 'Wishlist item not found' });
  Object.assign(item, pick(req.body, FIELDS));
  save();
  res.json(item);
});

// "I bought it" — moves the item from the wishlist into the closet
router.post('/:id/purchase', (req, res) => {
  const w = db.wishlist.find(x => x.id === req.params.id && x.userId === req.userId);
  if (!w) return res.status(404).json({ message: 'Wishlist item not found' });
  const clothing = {
    id: uid(), userId: req.userId, name: w.name, category: w.category || 'Tops', color: w.color || '#111111',
    brand: w.brand || '', price: w.price || null, season: w.season || 'All season', occasion: w.occasion || 'Casual',
    image: w.image || null, notes: w.notes || '', createdAt: Date.now()
  };
  db.clothing.push(clothing);
  db.wishlist = db.wishlist.filter(x => x.id !== w.id);
  // keep the planner working: swap any saved-look layout references from the wishlist item to the new closet item
  db.outfits.forEach(o => {
    if (o.userId !== req.userId) return;
    (o.layout || []).forEach(l => { if (l.src === 'wishlist' && l.id === w.id) { l.src = 'closet'; l.id = clothing.id; } });
    if (Array.isArray(o.itemIds) && (o.layout || []).some(l => l.id === clothing.id) && !o.itemIds.includes(clothing.id)) o.itemIds.push(clothing.id);
  });
  save();
  res.status(201).json(clothing);
});

router.delete('/:id', (req, res) => {
  const before = db.wishlist.length;
  db.wishlist = db.wishlist.filter(w => !(w.id === req.params.id && w.userId === req.userId));
  if (db.wishlist.length === before) return res.status(404).json({ message: 'Wishlist item not found' });
  save();
  res.json({ message: 'Deleted' });
});

module.exports = router;
