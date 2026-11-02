import { API_BASE_URL } from "./api";

/**
 * StudioSpace Google OAuth Configuration & State Management
 *
 * This configuration holds all endpoints, client identifiers, and feature
 * flags for Google OAuth 2.0.
 *
 * To re-enable Google OAuth later:
 * 1. Ensure the following Redirect URIs are authorized in the Google Cloud Console
 *    (APIs & Services > Credentials > OAuth 2.0 Client IDs):
 *    - https://studiospace-server-f9ek.onrender.com/api/auth/google/callback
 *    - http://localhost:5000/api/auth/google/callback
 * 2. Ensure Authorized JavaScript Origins include:
 *    - https://studiospace-luxury.netlify.app
 *    - https://studiospace-client-nine.vercel.app
 *    - http://localhost:3000
 * 3. Set NEXT_PUBLIC_ENABLE_GOOGLE_AUTH=true in your .env.local / Netlify / Vercel
 *    environment variables, or toggle ENABLED below to true.
 */
export const GOOGLE_OAUTH_CONFIG = {
  // Feature toggle: Keep false while Google Cloud Console redirect URI is pending update
  ENABLED: process.env.NEXT_PUBLIC_ENABLE_GOOGLE_AUTH === "true",

  // Google Cloud OAuth Client ID (studiospace-client-513508)
  CLIENT_ID:
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
    "199695232756-9b1its7cgdvpc03e1uo875fcc1ccvu8d.apps.googleusercontent.com",

  // Backend OAuth 2.0 authorization entry point
  AUTH_ENDPOINT: `${API_BASE_URL}/auth/google`,

  // Backend OAuth 2.0 token exchange and user persistence callback
  CALLBACK_ENDPOINT: `${API_BASE_URL}/auth/google/callback`,
};
