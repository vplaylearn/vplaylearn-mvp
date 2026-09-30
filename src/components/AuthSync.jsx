import { useEffect, useRef } from "react";
import { useAuth } from "@clerk/clerk-react";
import { setAuthToken } from "../utils/authToken";
import { getUserId, setUserId, syncFromServer } from "../utils/bookmarks";
import { syncProgressFromServer } from "../utils/gameProgress";

const ANON_ID_BEFORE_LOGIN = "vplaylearn_anon_before_login";

// Bridges Clerk auth into the sync utils:
//  - keeps a fresh session token in authToken so apiHeaders() can attach it
//  - on first login, merges the anonymous device data into the account
//  - swaps the active userId to the Clerk id (or back to the device id on sign-out)
// Rendered only inside ClerkProvider (see App), so useAuth is always valid here.
export default function AuthSync() {
  const { isLoaded, isSignedIn, userId, getToken } = useAuth();
  const claimedRef = useRef(false);

  useEffect(() => {
    if (!isLoaded) return undefined;

    let cancelled = false;

    async function applyAuth() {
      if (isSignedIn && userId) {
        // Remember the anonymous id we were using so we can merge it once.
        let anonId = null;
        try {
          anonId = localStorage.getItem(ANON_ID_BEFORE_LOGIN);
          if (!anonId) {
            anonId = getUserId(); // current device id, pre-swap
            localStorage.setItem(ANON_ID_BEFORE_LOGIN, anonId);
          }
        } catch {
          // ignore storage errors
        }

        const token = await getToken();
        if (cancelled) return;
        setAuthToken(token);

        // Merge anonymous device data into this account once per login.
        if (!claimedRef.current && anonId && anonId !== userId) {
          claimedRef.current = true;
          try {
            await fetch("/api/claim", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ anonymousId: anonId }),
            });
          } catch {
            // Non-fatal: the account still works, just without the old data.
          }
        }

        // Point the sync utils at the verified account id and refresh caches.
        setUserId(userId);
        syncFromServer();
        syncProgressFromServer();
      } else {
        // Signed out: drop the token and go back to the anonymous device id.
        setAuthToken(null);
        claimedRef.current = false;
        try {
          localStorage.removeItem(ANON_ID_BEFORE_LOGIN);
        } catch {
          // ignore
        }
      }
    }

    applyAuth();

    // Clerk session tokens are short-lived; refresh periodically while signed in.
    const interval = isSignedIn
      ? setInterval(async () => {
          const token = await getToken();
          if (!cancelled) setAuthToken(token);
        }, 50 * 1000)
      : null;

    return () => {
      cancelled = true;
      if (interval) clearInterval(interval);
    };
  }, [isLoaded, isSignedIn, userId, getToken]);

  return null;
}
