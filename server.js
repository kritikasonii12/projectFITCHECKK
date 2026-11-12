/**
 * Fitcheck — Digital Wardrobe
 * Full-stack app: Express + JWT auth (register → 2FA → login, forgot
 * password) + a JSON-file database, serving the React-free vanilla-JS
 * frontend from /public.
 *
 * Run:
 *   npm install
 *   npm start
 *   → open http://localhost:3000
 *
 * See README.md for the full walkthrough.
 */
const express = require('express');
const path = require('path');

const authRoutes = require('./routes/auth');
const clothingRoutes = require('./routes/clothing');
const wishlistRoutes = require('./routes/wishlist');
const outfitRoutes = require('./routes/outfits');
const wearRoutes = require('./routes/wear');
const dashboardRoutes = require('./routes/dashboard');

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json({ limit: '12mb' })); // generous limit for base64 clothing photos
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/health', (req, res) => res.json({ status: 'ok', service: 'fitcheck' }));

app.use('/api/auth', authRoutes);
app.use('/api/clothing', clothingRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/outfits', outfitRoutes);
app.use('/api/wear', wearRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.use((req, res) => res.status(404).json({ message: 'Route not found' }));
app.use((err, req, res, next) => { console.error(err); res.status(500).json({ message: 'Server error' }); });

app.listen(PORT, '0.0.0.0', () => {
  console.log(`
👗 Fitcheck is running`);
  console.log(`   Laptop:  http://localhost:${PORT}`);
  const nets = require('os').networkInterfaces();
  Object.values(nets).flat().filter(n => n && n.family === 'IPv4' && !n.internal)
    .forEach(n => console.log(`   Phone (same Wi-Fi):  http://${n.address}:${PORT}`));
  console.log('');
});
