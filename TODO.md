# Landing Page Fixes - TODO

## Task
Fix the "See LaunchPad in action" form section stretching outside the screen, and fix mobile header congestion.

## Steps
- [x] Remove the global `* { max-width: 100% }` rule from `.home-page` (keep `box-sizing`)
- [x] Add `overflow: hidden` to `.demo-card`
- [x] Change `.demo-form` to `repeat(2, minmax(0, 1fr))`
- [x] Change `.time-grid` to `repeat(6, minmax(0, 1fr))` + `min-width: 0; width: 100%`
- [x] Add `min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis` to `.time-chip`
- [x] Add `flex-wrap: nowrap; max-width: 100%` to `.day-chips`
- [x] Add `flex: 1; min-width: 0` to `.demo-note p`
- [x] Update mobile `.time-grid` breakpoints to use `minmax(0, 1fr)`
- [x] Mobile header: hide `.home-login-btn` at ≤640px (login is in burger menu)
- [x] Hide theme toggle at ≤640px (already covered by existing rule; login button hidden to declutter)
- [x] Verify changes render correctly in browser
- [x] Test mobile viewport widths (375px, 640px, 768px)
