# vPlayLearn

## Environment variables

Copy `.env.example` to `.env` (local) or set these in your Vercel project settings.

### Bookmarks (MongoDB)

Bookmarks are stored in MongoDB via the `/api/bookmarks` serverless function.

| Variable | Required | Description |
| --- | --- | --- |
| `MONGODB_URI` | Yes | MongoDB connection string (e.g. from Atlas). |
| `MONGODB_DB` | No | Database name. Defaults to `vplaylearn`. |

Bookmarks (and game progress) are keyed by a `userId`. When signed out, the
client uses an anonymous per-device id (in `localStorage`) sent via the
`x-user-id` header. When signed in with Clerk, requests carry the Clerk session
token and the server derives the trusted user id from it (see Authentication).

### Authentication (Clerk)

Login is **optional** — the app works anonymously (per-device data) with no
account. Signing in with Clerk (Google or email) syncs bookmarks and game
progress to the account across devices.

| Variable | Required | Description |
| --- | --- | --- |
| `CLERK_PUBLISHABLE_KEY` | For login | Public key, injected into the browser bundle at build time. Without it, the app runs in anonymous-only mode (no sign-in button). |
| `CLERK_SECRET_KEY` | For login | Server-side only. Used by the serverless functions to verify session tokens. Never expose to the client. |

Get both from the [Clerk dashboard](https://dashboard.clerk.com) → API Keys.
Enable Google and Email sign-in in the Clerk dashboard under User & Authentication.

**How it fits together:**
- The browser attaches the Clerk session token (`Authorization: Bearer`) to API
  requests when signed in; `api/_auth.js` verifies it and derives the user id.
- On first login, `src/components/AuthSync.jsx` calls `/api/claim` to merge the
  anonymous device's bookmarks and progress into the account.
- `setUserId()` in `src/utils/bookmarks.js` is the single switch point that
  points both bookmarks and game progress at the active account.

Note: `CLERK_PUBLISHABLE_KEY` is read at **build time** by webpack. When setting
it in Vercel, redeploy so the browser bundle picks it up.

### Suggestions (Resend)

| Variable | Required | Description |
| --- | --- | --- |
| `RESEND_API_KEY` | Yes | Resend API key. |
| `SUGGESTIONS_TO_EMAIL` | Yes | Destination address for suggestions. |
| `RESEND_FROM_EMAIL` | Yes | Verified sender address. |

## Scripts

- `npm start` — dev server
- `npm run build` — production build to `dist/`
