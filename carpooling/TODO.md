# SafarGo Website (carpooling) — To-Do & Project State

> Website mirror of `D:\SafarGo - APP\TODO.md`. Same content + website-specific notes.
> Reference for any new chat/session. Read this first to pick up context.

## Website Overview
- **Stack**: React (Create React App) + Tailwind CSS, deployed on **Vercel**
- **API base URL**: `https://api2.safargo.co.in/api` (via `REACT_APP_API_URL` env var on Vercel; fallback + `.env` in repo)
- **Key files**:
  - `src/utils/axiosConfig.js` — axios instance (baseURL from `REACT_APP_API_URL` or localhost)
  - `src/utils/AuthContext.jsx` — auth context; API_URL fallback → `https://api2.safargo.co.in/api`
  - `src/api/api.js` — API helper functions
  - `src/component/Routing.jsx` — routes (public/protected/admin)
- **Pages**: Home, Search, OfferRide (multi-step PublishRide flow), RideDeatil, Notifications, ProfilePage, User (Wallet, MyTrips, MyRide, EditRide), Admin (Dashboard, User, Rides, DriverVerify, Blogs, Contacts, Subscribers), ContactUs, AboutUs, HowWeWork, Help, Cities, Blog
- **Admin pages**: `src/page/Admin/` — `Dashboard.jsx` (recharts analytics), `DriverVerify.jsx` (driver approval), `User.jsx` (block/unblock users), `Rides.jsx`, `Blogs.jsx`, `Contacts.jsx`, `Subscribers.jsx`

---

## INFRASTRUCTURE / DEPLOYMENT NOTES (IMPORTANT)

### Backend hosting — TWO servers exist (root cause of many bugs)
| Server | URL | Env var `FCM_SERVICE_ACCOUNT_JSON` | Used by |
|---|---|---|---|
| NEW (correct) | `safargo.onrender.com` (custom domain `api2.safargo.co.in`) | ✅ SET | Mobile app + website |
| OLD (should retire) | `saafaargo.onrender.com` (custom domain `api.safargo.co.in`) | ❌ NOT SET | nothing anymore (legacy) |

- DNS records in GoDaddy for `safargo.co.in`:
  - `api`  → CNAME → `saafaargo.onrender.com` (OLD — can be repointed/deleted)
  - `api2` → CNAME → `safargo.onrender.com` (NEW — this is what app + website use now)
- The old server (`saafaargo`) still runs the same code + same DB, but has NO FCM env var.
- **TODO (low priority):** free up `api.safargo.co.in` (remove custom domain from old Render service → attach to new one → repoint DNS → delete old service). Currently blocked because the old service can't be found in the account (may be under another login).
- Render deploy: auto-deploys from GitHub repo `Prince188/saafaargo.git` on push to `main`.
- Vercel (website) deploy: auto from GitHub; uses env var `REACT_APP_API_URL` = `https://api2.safargo.co.in/api` (user updated it).

---

## ✅ COMPLETED

### Website → push
- Website API URL changed to `https://api2.safargo.co.in/api`:
  - `.env` (local dev only)
  - `src/utils/AuthContext.jsx` (fallback)
  - Vercel env var `REACT_APP_API_URL` updated by user
- **TODO (verify):** test booking from website → driver phone should get push

### Admin dashboard (website)
- Driver approval workflow — done (`Admin/DriverVerify.jsx` + backend `adminVerificationController.js`); **push to driver still pending**
- Analytics graphs (rides, earnings, active users) — `Admin/Dashboard.jsx` (recharts)

### Push notifications — backend (shared, relevant)
- `User.deviceToken` array (max 5) — `models/User.js`
- `PUT /users/me/device-token` — `userController.js` + `routes/userRoutes.js`
- `util/fcm.js` — FCM HTTP v1 sender; supports `FCM_SERVICE_ACCOUNT_JSON` env var OR `firebase-service-account.json` file
- Push hooks (in `controllers/rideController.js` + `controllers/bookingController.js`):
  1. Passenger books → Driver: **"New Booking"** (`ride_booked`)
  2. Passenger cancels → Driver: **"Booking Cancelled"** (`ride_cancelled`)
  3. Driver edits ride → Passengers: **"Ride Modified"** (`ride_modified`)
  4. Driver completes ride → Passengers: **"Ride Completed"** (`ride_completed`)
  5. Driver cancels ride → Passengers: **"Ride Cancelled"** (`ride_cancelled`)
- FIXED bug: `driverId` scope error in `bookRide` (`rideController.js:541`) was crashing the push
- In-app `Notification` records created for all the above

---

## 🔴 PENDING / BLOCKED (do these next)

1. **SECURITY — regenerate Firebase private key** (HIGH PRIORITY)
   - The service-account private key (`safargo-7c3b4`) was pasted in a chat — treat as exposed
   - Firebase Console → Project settings → Service accounts → **Generate new private key**
   - Update `FCM_SERVICE_ACCOUNT_JSON` env var on Render (`safargo` service) with new value
   - Old key must never be reused

2. **Verify website booking → push** (after Vercel redeploy)
   - Book from website → check driver's phone gets "New Booking"
   - Check Render logs for `[REQ] POST /api/rides/.../book` and no `[FCM]` errors

3. **Remove the temporary `[REQ]` request logger** from `backend/server.js` — keep until testing done, then remove

4. **Decommission old backend** (`saafaargo.onrender.com`) — low priority, see infra notes

---

## 📋 NEXT FEATURE WORK

### Notifications (more events) — mostly backend + push, website-adjacent
- [ ] **Admin approves driver** → notify driver ("Driver Verified") — action lives on `Admin/DriverVerify.jsx`, push added in `adminVerificationController.js`
- [ ] **Admin rejects driver** → notify driver (with reason)
- [ ] **Admin blocks user** → notify user — action on `Admin/User.jsx`
- [ ] **Admin unblocks user** → notify user
- [ ] Ride departure reminder (schedule push ~30 min before ride time)
- [ ] Driver accepts/rejects a passenger request (if we add confirmation flow)
- [ ] Admin broadcast / announcement to all users (promos, updates)
- [ ] Per-user notification toggles (settings screen to opt in/out per type)

### Booking confirmation flow (driver accepts/rejects passenger) — PLAN
- Currently: booking is auto-confirmed the moment a passenger books
- New flow:
  1. Passenger books → booking status = `pending` (seats held/reserved, not reduced)
  2. Driver gets push **"New booking request"** + in-app notification
  3. Driver reviews requests (app: My Rides → Requests tab) and taps **Accept** / **Decline**
  4. Accept → status = `confirmed`, seats reduced, passenger gets push **"Booking confirmed"**
  5. Decline → status = `declined`, seats released, passenger gets push **"Booking declined"**
- Backend: statuses in `Booking` model, new endpoints `POST /api/bookings/:id/accept` & `.../decline` (driver only), push via `notifyUser`
- Website: show booking status on passenger MyTrips + driver MyRide; accept/decline buttons on driver side
- Edge cases: auto-expire pending after X hours, passenger cancel while pending, driver edit ride with pending requests

### v1 additions (prioritized)
- [ ] **1st — Masked phone numbers (contact privacy)**
  - Show `98****25` style masked numbers on ride search/listing
  - Reveal the full number ONLY after a booking is confirmed (both sides)
  - Backend: mask in `getRides`/ride detail responses, reveal in booking/confirmed flow
  - Website: `Search.jsx`, `RideDeatil.jsx` show masked; `MyTrips.jsx`/confirmed booking shows full
- [ ] **2nd — Search filters**
  - Filters on search: price range, vehicle type, women-only, no-smoking, no-pets, departure time range
  - Backend: extend `GET /api/rides` query params; website: filter UI on `Search.jsx` (+ app Search screen)
- [ ] **3rd — Pickup OTP handshake (FREE, no API needed)**
  - In-app 4-digit code generated at trip start, shown on driver's phone; passenger enters it to confirm pickup
  - Stored on the booking; verified in-app (no SMS/gateway). SMS OTP would need paid gateway — NOT planned

### Ride experience (feature parity with app)
- [ ] **Ratings** — driver & passenger rate each other after ride (website: MyTrips / driver rating)
- [ ] **Chat between driver and passenger** — website version (message box) as well as app
- [ ] **Live trip tracking** — app tracks via Socket.IO; website shows a READ-ONLY live map view of the driver's position (see master TODO for full plan)
- [ ] **Recurring rides** (weekly commute) — offer on website too (OfferRide flow)
- [ ] **Share ride post** — share posted-ride link to WhatsApp/Telegram (trivial on website, native share)
- [ ] Fare calculator — website already has `src/utils/segmentPricing.js`; **peak pricing still pending**
- *(Mobile-only, not on website: SOS button, pickup OTP handshake, background GPS tracking)*

### App parity gaps — implemented in APP, missing on WEBSITE (add these)
- [ ] **Dark mode** — app has theme mode (system/light/dark) via `lib/state/settings_provider.dart`; website is light-only. Add toggle (localStorage, `dark:` Tailwind classes)
- [ ] **Multi-language (EN/HI/GU)** — app has full i18n (`lib/l10n/`); website is English-only. Add language switcher (e.g. `i18next` or lightweight JSON) for the 3 languages
- [ ] **Appearance/language settings page** — app has Profile → Appearance/Language (`AppearanceScreen`); website has no settings page. Add one (theme + language, persisted to localStorage/account)
- [ ] **Onboarding/first-visit intro** — app shows onboarding slides on first launch (`onboarding_screen.dart`); website has no first-visit intro. Optional: light welcome/hero intro for first-time visitors
- *(Mobile-only, not applicable to website: splash screen, push-notification permission prompt)*

### UI/UX (website)
- [ ] Loading/empty/error state polish across pages
- [ ] Search results page polish + filter UI (ties into #2)
- [ ] Mobile responsiveness audit (admin pages on small screens)
- [ ] Accessibility improvements

### Payments
- [ ] Online payment (Razorpay / UPI) instead of cash-only
- [ ] Booking confirmation + refund flow
- [ ] Fare receipts / trip history / earnings report

### Admin dashboard
- [ ] Driver approval push (item above)
- [ ] Driver documents expiry tracking
- [ ] Block/unblock user push (item above)

### App quality / infra
- [ ] Firebase Crashlytics + Firebase Analytics
- [ ] Proper Play Store signing config
- [ ] More tests
- [ ] CI/CD for app builds

---

## QUICK REFERENCE — WEBSITE COMMANDS

```bash
# Install deps (first time)
npm install

# Local dev (reads .env → https://api2.safargo.co.in/api)
npm start

# Production build
npm run build
```

## TROUBLESHOOTING QUICK NOTES
- Website calls old server → check `REACT_APP_API_URL` on Vercel (must be `https://api2.safargo.co.in/api`) + redeploy
- `.env` in repo only affects LOCAL dev — Vercel env var overrides it in production
- App not getting notifications → check Render logs (`safargo` service) for `[FCM]` lines
- `[FCM] Send failed (404)` → wrong project ID in service account
- `[FCM] Push error` with `WRONG_TAG`/asn1 → pasted private key got mangled in env var
