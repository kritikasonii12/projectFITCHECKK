# Fitcheck — Digital Wardrobe, Wishlist & Planner

A responsive web app (laptop **and** phone browser) inspired by Alta / Whering:
digitise your closet, keep a shoppable wishlist, style outfit collages, and plan
what to wear on a calendar.

## Features

| Area | What you can do |
|---|---|
| **Closet** | Add pieces with a **live camera shot** or **photo upload** (multi-select = bulk add, each opens in turn). Tag category / colour / brand / price / season / occasion. Search, filter, sort (newest, most/least worn). Item page shows wear count + cost-per-wear, "Wore it today", "Plan it". |
| **Wishlist** | Save items you want (photo, brand, price, product link, priority *Love it / Want / Maybe*, notes). Sort by priority / price. **"Bought it"** moves the item into your closet. **"Style it"** drops a wishlist item onto the outfit canvas before you buy. |
| **Outfits** | Collage canvas: tap pieces to add, drag to arrange, bigger/smaller, bring front/send back. Mix closet + wishlist items (wishlist = dashed outline). Save, edit, delete looks. |
| **Planner** | Month calendar with outfit thumbnails per day. Plan a saved outfit or hand-pick pieces for any date, mark as **worn** (updates wear counts) or planned, add notes. |
| **Stats** | Closet value, wishlist value, wears logged, avg cost-per-wear, most worn, best value, never-worn (declutter), category breakdown. |
| **Theme** | Dark / light switch (sun–moon toggle in the sidebar, top bar on phone, and login screen). Your choice is remembered on that device. |
| **Auth** | Email + password, 2FA code on signup, forgot-password flow, JWT sessions (unchanged from before). |

Photos are resized in the browser (≤ 900 px JPEG) before saving. "Remove plain
background" does a simple edge flood-fill — it works best on photos taken on a
white/plain surface (it is not AI cut-out).

## Run it

```
npm install
npm start
```

The terminal prints two addresses:

```
Laptop:  http://localhost:3000
Phone (same Wi-Fi):  http://192.168.x.x:3000
```

### Using it on your phone

1. Phone and laptop on the same Wi-Fi → open the **Phone** URL in the phone browser.
2. **Camera note:** browsers only allow the in-page live camera on **HTTPS or localhost**.
   - On the plain `http://192.168…` address, the **Take photo** button automatically
     opens your phone's native camera app instead (works fine, same result).
   - For the in-page live camera on your phone, open the app through an HTTPS tunnel:
     `npx localtunnel --port 3000` (or `ngrok http 3000`, or `cloudflared tunnel --url http://localhost:3000`)
     and use the https URL it prints.
3. On the laptop, **Take photo** opens the webcam (allow the permission prompt); **Upload** opens the file picker.
4. Add it to your phone's home screen from the browser menu for an app-like feel.

Data is stored in `data/fitcheck-data.json` (auto-created, git-ignored). Delete it to start fresh.

## Structure

```
server.js                 Express entry (listens on all interfaces)
routes/  auth · clothing · wishlist · outfits · wear (planner) · dashboard
middleware/auth.js        JWT check
data/store.js             JSON-file database helper
public/                   index.html · style.css · app.js (vanilla JS, no build step)
```

## API

All routes except `/api/auth/*` and `/api/health` need `Authorization: Bearer <token>`.

| Method | Route | Purpose |
|---|---|---|
| POST | /api/auth/register/start · /register/verify · /login | Signup (2FA) / login |
| POST | /api/auth/forgot/start · /verify · /reset | Password reset |
| GET/POST, PUT/DELETE `/:id` | /api/clothing | Closet items |
| GET/POST, PUT/DELETE `/:id` | /api/wishlist | Wishlist items |
| POST | /api/wishlist/:id/purchase | Move wishlist item → closet |
| GET/POST, PUT/DELETE `/:id` | /api/outfits | Saved outfits (with collage `layout`) |
| GET/POST, PUT/DELETE `/:id` | /api/wear | Planner entries `{date, outfitId?, itemIds[], worn, note}` |
| GET | /api/dashboard | Aggregate stats |

Entities for your report: **User → Clothing, Wishlist (1:many) · Outfit (many:many via itemIds/layout) → Planner entry (many:1 Outfit, date)**.
