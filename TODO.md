# Favicon & UI Fixes - TODO

## Task
Fix favicon not showing properly (shows "L" in browser tab), replace the "L" text placeholders with the real LaunchPad logo on auth pages/sidebar/admin, and clean up overall UI/CSS.

## Steps
- [x] Rewrite `frontend/public/favicon.svg` with browser-safe colors (no `display-p3`/`color()` syntax)
- [x] Update `frontend/index.html` favicon link with `type="image/svg+xml"` + add apple-touch-icon
- [x] Update `frontend/src/index.css`: add `.brand-logo-img` styles, remove duplicate `.section-*` blocks, tidy stray rules
- [x] Replace `<div className="brand-logo">L</div>` with `<img src="/favicon.svg" className="brand-logo-img" />` in:
  - Login.jsx
  - Register.jsx
  - SetPassword.jsx
  - GoogleSuccess.jsx
  - Sidebar.jsx
  - Admin.jsx
- [x] Sync `live.html` favicon link with `type` attribute
- [ ] Build & verify (`npm run build` / `npm run dev`)
- [ ] Commit & push changes

