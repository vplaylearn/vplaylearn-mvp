import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import "./styles.css";
import { BrowserRouter } from 'react-router-dom';
import { ClerkProvider } from '@clerk/clerk-react';

const clerkKey = process.env.CLERK_PUBLISHABLE_KEY;

const root = ReactDOM.createRoot(document.getElementById('root'));

// Login is optional: only wrap in ClerkProvider when a key is configured.
// Without it the app still runs fully in anonymous (device-id) mode.
const tree = (
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

root.render(
  clerkKey ? (
    <ClerkProvider publishableKey={clerkKey} afterSignOutUrl="/">
      {tree}
    </ClerkProvider>
  ) : (
    tree
  )
);
