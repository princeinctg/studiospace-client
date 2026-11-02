# StudioSpace — Premium Cinematic Creative Studio Marketplace (Client)

> An award-winning creative studio booking platform combining Apple's smooth scroll-triggered storytelling with Lusion's immersive visual motion design.

* **Live Frontend (Netlify)**: https://studiospace-luxury.netlify.app/
* **Live Frontend (Vercel)**: https://studiospace-client-nine.vercel.app/
* **Live Backend API (Render)**: https://studiospace-server-f9ek.onrender.com/

---

## 🎨 1. Unified Brand Color System

| Token Name | Hex Code | Purpose & Application |
|---|---|---|
| **Deep Charcoal** | `#171717` | Primary dark theme background, hero vignettes, and cards |
| **Warm Ivory** | `#F5F2EB` | Primary light theme background and crisp contrast typography |
| **Electric Orange** | `#FF6B35` | Primary CTA buttons, interactive hover rings, and active state highlights |
| **Soft Cream** | `#EDE3D2` | Secondary surfaces, subtle containers, and pill backgrounds |
| **Forest Green** | `#173D32` | Verified host badges, trust guarantee accents (used sparingly) |
| **Luxury Gold** | `#C6A15B` | Star ratings, superhost badges, and decorative sparkles (used sparingly) |

* **Dynamic Theming**: Seamless Light and Dark modes with readable contrast, synchronized with system preferences and persisted via `localStorage`.

---

## 🎬 2. Motion Design & Cinematic Interactions
* **Apple-Inspired Scroll Storytelling**: Section fade-ins, staggered card entries, and typography reveals triggered by viewport position.
* **Lusion-Inspired Immersion**: Full-bleed hero photography slider with continuous background zoom, glassmorphic cards, and delicate particle glows.
* **Hero Slider (`Swiper.js`)**: Minimum 3 high-resolution slides with customized animated progress indicators, fade transitions, and embedded interactive search.
* **Performance First**: Motion engineered using GPU-accelerated `transform` and `opacity` properties. Respects `prefers-reduced-motion` preferences.

---

## 🔑 3. Examiner Demo Credentials

To test both Creator and Studio Host capabilities, click the quick fill buttons on `/login` or enter:

| Account Type | Email | Password | Access Capabilities |
|---|---|---|---|
| **Studio Host (Owner)** | `host@studiospace.com` | `HostPassword123!` | Host portal, Add/Edit studio listings, delete listings with confirmation |
| **Guest / Examiner** | `guest@studiospace.com` | `GuestPassword123!` | Studio directory, real-time booking modal, view personal bookings, cancel shoots |

---

## 📱 4. Key Pages & Routes

1. **Homepage (`/`)**:
   * Full-screen cinematic hero slider with live search filter
   * Dynamic Featured Studios section with staggered cards and hover zoom
   * Interactive Category Grid for 6 creative disciplines
   * Animated 4-step "How It Works" workflow
   * StudioSpace Host Guarantee trust section
2. **Explore Studios Directory (`/explore`)**:
   * Multi-faceted sidebar filtering (discipline, city, max hourly rate, sort order)
   * Live search query input with URL sync
   * Dynamic empty state with one-click filter reset
3. **Studio Details & Lightbox (`/studio/[id]`)**:
   * 4-photo collage with full-screen interactive lightbox (zoom, keyboard arrows, image counter)
   * Verified amenities grid with SVG icons
   * Host profile card with verified badge and response time
   * Sticky booking card with duration calculation and double-booking collision prevention
4. **Booking Modal (`/components/booking/BookingModal.tsx`)**:
   * Date and 24-hour time-slot pickers with automatic price calculation
   * Instant conflict detection preventing double-booking
   * Celebratory confirmation card with receipt summary
5. **Host Operations**:
   * **List a Studio (`/studio/add`)**: Full validation form with amenities selector and photo gallery uploader
   * **Edit Studio (`/studio/[id]/edit`)**: Pre-filled form with owner verification
   * **My Listings (`/dashboard/my-listings`)**: Host studio cards with custom destructive `ConfirmModal`
6. **Creator Portal**:
   * **My Bookings (`/dashboard/my-bookings`)**: Active/Cancelled booking cards with cancellation modal
   * **Dashboard Overview (`/dashboard`)**: KPI metric cards and CSS volume trend chart
7. **Authentication (`/login`, `/register`)**:
   * Role selection toggle (Creator vs Host)
   * Google OAuth / Quick demo login
   * Toast notification feedback
8. **Custom 404 Page (`/not-found`)**:
   * Cinematic glow and direct recovery navigation to active directories

---

## 🛠️ 5. Getting Started & Installation

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Create `.env.local` based on `.env.example`:
```bash
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

### 4. Production Build & Verification
```bash
npm run build
npm start
```

