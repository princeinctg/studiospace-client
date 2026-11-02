# StudioSpace — Google OAuth 2.0 Integration & Re-enabling Guide

This document explains the full architecture of Google OAuth 2.0 within StudioSpace and provides exact steps to re-enable it.

---

## Architecture Overview

Google OAuth in StudioSpace supports two production flows:
1. **Full Authorization Code Flow (Server-side)**:
   - Frontend initiates flow via `initiateGoogleLogin()` -> redirects to `GET /api/auth/google`.
   - Backend redirects user to Google Accounts consent screen with `client_id`, scopes, and `redirect_uri`.
   - User grants permission; Google calls `GET /api/auth/google/callback?code=...&state=...`.
   - Backend exchanges the authorization code with Google for tokens via `https://oauth2.googleapis.com/token`.
   - Backend fetches the user profile via `https://www.googleapis.com/oauth2/v3/userinfo`.
   - Backend finds or creates the user in MongoDB Atlas, issues a secure JWT cookie, and redirects the user to the frontend dashboard with `?auth_token=...`.
   - Frontend `AuthContext` parses the token from query parameters, stores it in `localStorage`, and fetches the authenticated session.

2. **Direct Verified Token / Credential Flow**:
   - Frontend exchanges verified credential via `POST /api/auth/google`.
   - Backend verifies the ID token with Google's TokenInfo API (`https://oauth2.googleapis.com/tokeninfo?id_token=...`).

---

## Current Status: Temporarily Paused

Google Sign-In is temporarily paused using the feature toggle `NEXT_PUBLIC_ENABLE_GOOGLE_AUTH=false` because the Google Cloud Console credentials project needed updated Authorized Redirect URIs matching production domains.

All underlying routes, controllers, tokens, and client logic remain **100% implemented and intact**.

---

## How to Re-enable Google OAuth

### Step 1: Configure Google Cloud Console
1. Open the [Google Cloud Console](https://console.cloud.google.com/).
2. Select the project: `studiospace-client-513508` (Client ID: `199695232756-9b1its7cgdvpc03e1uo875fcc1ccvu8d.apps.googleusercontent.com`).
3. Navigate to **APIs & Services > Credentials**.
4. Click to edit the **OAuth 2.0 Client ID**.
5. Add to **Authorized JavaScript origins**:
   - `https://studiospace-luxury.netlify.app`
   - `https://studiospace-client-nine.vercel.app`
   - `http://localhost:3000`
6. Add to **Authorized redirect URIs**:
   - `https://studiospace-server-f9ek.onrender.com/api/auth/google/callback`
   - `http://localhost:5000/api/auth/google/callback`
7. Click **Save**.

### Step 2: Set the Environment Variable
Set the following environment variable to `true`:
```env
NEXT_PUBLIC_ENABLE_GOOGLE_AUTH=true
```

- **Netlify**: Site configuration > Environment variables > Add `NEXT_PUBLIC_ENABLE_GOOGLE_AUTH` = `true`.
- **Vercel**: Project Settings > Environment Variables > Add `NEXT_PUBLIC_ENABLE_GOOGLE_AUTH` = `true`.
- **Local (`.env.local`)**: Add `NEXT_PUBLIC_ENABLE_GOOGLE_AUTH=true`.

### Step 3: Verify
- Visit `/login` or `/register`.
- The Google button will automatically transition from the disabled "Temporarily Disabled" state to an active, interactive Google button with full hover styling and official multicolor branding.
- Clicking "Continue with Google" will redirect cleanly through Google OAuth and log the user into the StudioSpace dashboard.
