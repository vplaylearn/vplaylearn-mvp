# vPlayLearn

## Environment variables

Copy `.env.example` to `.env` (local) or set these in your Vercel project settings.

### Bookmarks (MongoDB)

Bookmarks are stored in MongoDB via the `/api/bookmarks` serverless function.

| Variable | Required | Description |
| --- | --- | --- |
| `MONGODB_URI` | Yes | MongoDB connection string (e.g. from Atlas). |
| `MONGODB_DB` | No | Database name. Defaults to `vplaylearn`. |

Bookmarks are keyed by a `userId`. Until a login flow exists, the client mints an
anonymous per-device id (stored in `localStorage`) and sends it via the
`x-user-id` header. When login is added, call `setUserId(realUserId)` from
`src/utils/bookmarks.js` after authentication — reads and writes then move to
that account with no other changes.

### Suggestions (Resend)

| Variable | Required | Description |
| --- | --- | --- |
| `RESEND_API_KEY` | Yes | Resend API key. |
| `SUGGESTIONS_TO_EMAIL` | Yes | Destination address for suggestions. |
| `RESEND_FROM_EMAIL` | Yes | Verified sender address. |

## Scripts

- `npm start` — dev server
- `npm run build` — production build to `dist/`
