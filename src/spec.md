# Specification

## Summary
**Goal:** Make the sign-in (login) screen the default first page and display “Welcome to EOA”.

**Planned changes:**
- Update the `/` (index) route to render a dedicated sign-in page instead of the current Home/Landing page.
- Ensure the sign-in page at `/` shows the exact heading text “Welcome to EOA”.
- Provide a working “Sign In” button on `/` that initiates Internet Identity login and redirects to `/profile` on success.
- Keep all other existing routes unchanged and reachable via navigation or direct URL.

**User-visible outcome:** Visiting `/` shows a sign-in page with the heading “Welcome to EOA”; clicking “Sign In” logs the user in via Internet Identity and then takes them to `/profile`, while other pages remain accessible at their existing URLs.
