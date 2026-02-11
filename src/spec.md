# Specification

## Summary
**Goal:** Show a unique world-landscape background image behind the content on each main route, applied consistently via the shared AppLayout, while keeping the UI readable with a dark overlay.

**Planned changes:**
- Add a per-route background mapping in the shared layout so each main page uses a distinct landscape image: /, /home, /trip-builder, /results, /saved, /memory-finder, /groups, /profile.
- Ensure nested routes reuse the appropriate parent background (e.g., /memory-finder/$albumId uses the Memory Finder background; /groups/$groupId uses the Groups background).
- Render backgrounds behind TopNav/page content/Footer with full-height coverage and responsive cover/center behavior.
- Add a consistent dark overlay/tint so text, cards, and surfaces remain readable on top of the landscape images.
- Add the new background images as static assets in frontend/public/assets/generated and reference them via absolute paths (/assets/generated/<filename>).

**User-visible outcome:** Each main page displays its own scenic world landscape background behind the existing UI, with consistent readability and smooth navigation between routes.
