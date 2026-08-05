# LaunchBoard - Fix Sidebar, Routing & Admin Client Management

## Status

### Frontend Shell Refactor (Sidebar & Routing)
- [x] 1. Create `DashboardLayout.jsx` (Sidebar + Navbar + Outlet).
- [x] 2. Create reusable `SectionPage.jsx` for sidebar menu sections.
- [x] 3. Update `Sidebar.jsx` to use `Link` navigation + active state from `useLocation`.
- [x] 4. Update `Navbar.jsx` to reflect current section title.
- [x] 5. Rewire `App.jsx` routes under `/dashboard/*` with the layout.
- [x] 6. Add CSS for section pages.
- [x] 7. Build frontend to verify no errors.
- [x] 8. Test login + sidebar navigation.

### Admin Client Management (Create/Edit/Delete/Change Password)
- [x] 9. Add `passwordSetupToken` + `passwordSetupExpiry` to `User` schema.
- [x] 10. Apply schema to DB (`prisma db push`).
- [x] 11. Add admin CRUD controllers (`createUser`, `updateUser`, `deleteUser`, `changeUserPassword`).
- [x] 12. Wire admin routes (`POST /users`, `PUT /users/:id`, `DELETE /users/:id`, `PUT /users/:id/password`).
- [x] 13. Add client self-set-password endpoint (`POST /auth/set-password`).
- [x] 14. Update Admin.jsx page with full CRUD UI + change password.
- [x] 15. Create SetPassword.jsx page for clients.
- [x] 16. Add `/set-password` route.
- [x] 17. Add CSS for admin forms + section pages.
- [x] 18. Restart backend, test full flow (create → set pw → login → change pw → login → delete).

## Test Results
- Admin login: 200 ✅
- Client login: 200 ✅
- Admin create client: 201 (with setup token) ✅
- Client self-set password: 200 ✅
- Client login with set password: 200 ✅
- Admin change client password: 200 ✅
- Client login with changed password: 200 ✅
- Admin delete client: 200 ✅
- Frontend build: success (only chunk-size warning) ✅
