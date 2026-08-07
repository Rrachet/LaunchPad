# Favicon & UI Fixes - TODO

## Task
Fix favicon not showing properly (shows "L" in browser tab), replace the "L" text placeholders with the real LaunchPad logo on auth pages/sidebar/admin, and clean up overall UI/CSS.

## Steps
- [x] Rewrite `frontend/public/favicon.svg` with browser-safe colors (no `display-p3`/`color()` syntax)
- [x] Update `frontend/index.html` favicon link with `type="image/svg+xml"` + add apple-touch-icon
- [x] Update `frontend/src/index.css`: add `.brand-logo-img` styles, remove duplicate `.section-*` blocks, tidy stray rules
- [x] Replace `<div className="brand-logo">L</div>` with `<img src="/favicon.svg" className="brand-logo-img" />` in:
  - Login.jsx, Register.jsx, SetPassword.jsx, GoogleSuccess.jsx, Sidebar.jsx, Admin.jsx
- [x] Sync `live.html` favicon link with `type` attribute
- [x] **User feedback: use the real asset logos (`LP1.png` square / `LP.png` landscape) everywhere, not the bolt**
  - Switched browser favicon to `/LP1.png` (png) in `index.html` + `live.html`
  - Replaced `<img src="/favicon.svg">` brand tiles in Login, Register, SetPassword, GoogleSuccess, Sidebar, Admin with `<img src="/LP1.png">`
  - Removed the unused `frontend/public/favicon.svg`
- [x] Build & verify (`npm run build`) — build succeeded
- [x] Commit & push changes to `origin/master`


