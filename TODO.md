# Homepage UI Overhaul - TODO

## Task
Fix the mobile burger menu permanently, fix the CSS button error, improve/unify all section buttons with animations, and add a testimonials section (Ankita Mishra, Pragya Mishra).

## Steps
- [x] Fix burger menu: consolidate duplicate `@media (max-width:900px)` blocks into one clean block; ensure `.menu-burger` shows at ≤900px; add slide-down animation for `.home-mobile-menu`
- [x] Fix CSS error: change base `.btn-primary` to `width:auto`; apply `width:100%` only to auth/modal buttons; add uniform + animated button styles (lift, glow, shine sweep)
- [x] Add scroll-reveal (IntersectionObserver) hook + CSS for homepage sections
- [x] Add animated testimonials section (Ankita Mishra, Pragya Mishra) between Founder and Book Demo in `Home.jsx`
- [x] Polish section cards (comparison, hero-stat, founder-avatar) hover/animation states
- [x] Run `npm run build` to verify no errors
