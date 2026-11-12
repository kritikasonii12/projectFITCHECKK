const express = require('express');
const { db } = require('../data/store');
const auth = require('../middleware/auth');

const router = express.Router();
router.use(auth);

router.get('/', (req, res) => {
  const clothing = db.clothing.filter(c => c.userId === req.userId);
  const wishlist = db.wishlist.filter(w => w.userId === req.userId);
  const outfits = db.outfits.filter(o => o.userId === req.userId);
  const history = db.history.filter(h => h.userId === req.userId);
  const today = new Date().toISOString().slice(0, 10);
  const worn = history.filter(h => h.worn === true || (h.worn === undefined && h.date <= today));

  const wears = {};
  worn.forEach(h => {
    const ids = (h.itemIds && h.itemIds.length) ? h.itemIds : ((outfits.find(o => o.id === h.outfitId) || {}).itemIds || []);
    ids.forEach(id => { wears[id] = (wears[id] || 0) + 1; });
  });
  const sum = list => list.reduce((s, i) => s + (Number(i.price) || 0), 0);

  res.json({
    totalClothes: clothing.length,
    totalOutfits: outfits.length,
    totalWearsLogged: worn.length,
    wishlistCount: wishlist.length,
    closetValue: sum(clothing),
    wishlistValue: sum(wishlist),
    itemWears: wears
  });
});

module.exports = router;
