import React from "react";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";

// Login is optional. When Clerk has no publishable key configured, render
// nothing so the app works in anonymous mode without crashing.
const clerkConfigured = Boolean(process.env.CLERK_PUBLISHABLE_KEY);

export default function AuthButton() {
  if (!clerkConfigured) return null;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <SignedOut>
        <SignInButton mode="modal">
          <button type="button" className="auth-signin-btn">
            Sign in
          </button>
        </SignInButton>
      </SignedOut>
      <SignedIn>
        <UserButton afterSignOutUrl="/" />
      </SignedIn>
    </div>
  );
}
