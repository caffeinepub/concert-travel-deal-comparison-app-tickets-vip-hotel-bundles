# Specification

## Summary
**Goal:** Provide clear, in-app guidance for installing EOATravelDeals on Android either as a PWA (recommended) or via a sideloaded debug APK, and ensure the Android build documentation is accurate.

**Planned changes:**
- Add an in-app entry point (visible to both signed-out and signed-in users) labeled clearly (e.g., “Install on Android”) that explains Android installation options.
- Provide English-only, step-by-step instructions for (1) installing as an app via Android Chrome PWA and (2) installing a downloadable debug APK for developer/testing from the existing Capacitor Android wrapper.
- Update/verify `frontend/docs/android.md` to include environment variable setup using `.env.capacitor` copied from `frontend/.env.capacitor.example`, note the HTTPS requirement for Internet Identity, and state the exact debug APK output path `android/app/build/outputs/apk/debug/app-debug.apk`, using the app name “EOATravelDeals”.

**User-visible outcome:** Users can find an “Install on Android” section inside the app that explains how to install EOATravelDeals as a PWA or (for developer/testing) how to obtain and sideload a debug APK, with matching repository documentation for building the APK.
