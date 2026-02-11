# Specification

## Summary
**Goal:** Restore a successful build and deployment by identifying the prior deployment failure, applying minimal fixes, and making critical startup/runtime failures visible in English.

**Planned changes:**
- Re-run frontend and backend build/deploy, identify the exact failing step, and apply the minimum required code/config change(s) to make builds and deployment succeed.
- Add safe defaults/fallback handling for missing/invalid configuration so the app fails gracefully instead of crashing on startup.
- Add a visible, non-blocking English error surface (and console logging) for critical initialization/runtime failures that would otherwise cause a blank screen or silent failure (e.g., service worker registration/initialization issues).

**User-visible outcome:** The app deploys successfully and loads reliably; if a critical startup step fails, users see a clear English message (and developers see logs) instead of a blank or silently broken app.
