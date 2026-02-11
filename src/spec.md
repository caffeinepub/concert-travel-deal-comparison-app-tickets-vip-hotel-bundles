# Specification

## Summary
**Goal:** Make EOATravelDeals installable on Android via PWA support and provide an Android WebView wrapper project with clear build/install documentation for local APK testing.

**Planned changes:**
- Add PWA essentials: web app manifest at a stable path, link it from `frontend/index.html`, include required Android/PWA icons, and register a production service worker with basic app-shell caching plus an offline fallback message/page.
- Add an Android wrapper project (e.g., Capacitor/WebView) in-repo that loads the production HTTPS deployment URL by default and does not break the existing web build.
- Add English documentation explaining how to install the PWA on Android and how to build/sideload a debug APK, including prerequisites and Internet Identity troubleshooting notes for Android/PWA/WebView contexts.

**User-visible outcome:** On Android Chrome, users can “Add to Home screen” and launch EOATravelDeals as a standalone installed PWA, and developers can build and install a debug APK wrapper that opens the existing app sign-in flow and supports Internet Identity authentication.
