/**
 * Tiny JSON-file "database". Zero setup — no MongoDB/Atlas account needed.
 * Data lives in data/fitcheck-data.json, created automatically on first run.
 */
const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, 'fitcheck-data.json');
const EMPTY = () => ({ users: [], clothing: [], wishlist: [], outfits: [], history: [] });

function load() {
  let data;
  try { data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8')); }
  catch (e) { data = EMPTY(); }
  // make sure every collection exists (older data files had no wishlist)
  const base = EMPTY();
  Object.keys(base).forEach(k => { if (!Array.isArray(data[k])) data[k] = base[k]; });
  return data;
}

const db = load();

let timer = null;
function save() {
  // debounce writes so rapid actions don't hammer the disk
  clearTimeout(timer);
  timer = setTimeout(() => fs.writeFileSync(DATA_FILE, JSON.stringify(db)), 50);
}
process.on('exit', () => { try { fs.writeFileSync(DATA_FILE, JSON.stringify(db)); } catch (e) {} });
process.on('SIGINT', () => process.exit(0));

function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 8); }

// copy only whitelisted keys from a request body (stops users overwriting id/userId)
function pick(body, keys) {
  const out = {};
  keys.forEach(k => { if (body && body[k] !== undefined) out[k] = body[k]; });
  return out;
}

module.exports = { db, save, uid, pick };
