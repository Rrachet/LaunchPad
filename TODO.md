# LaunchBoard — Product-Level Auth Upgrade

## Goals
1. ✅ Add OTP step for email/password login (same-page 2-step flow).
2. ✅ Fix Google OAuth to issue a real JWT and land user in the dashboard.
3. ✅ Ensure demo-booking email to host confirms detail + Google Meet booked.
4. ✅ Set up SMTP so OTP + demo emails actually send.

## Backend
- [x] `authController.js`: add `loginOtpStart` (verify creds → send OTP → return temp token) and `loginOtpVerify` (verify OTP → return real JWT).
- [x] `authRoutes.js`: add `/login-otp/start` and `/login-otp/verify` routes.
- [x] Google callback: issue real JWT and redirect with token to `/google-success`.
- [x] `demoController.js`: confirm Google Meet booked in the host email subject + body.

## Frontend
- [x] `Login.jsx`: 2-step same-page flow (email+password → OTP → logged in).
- [x] `GoogleSuccess.jsx`: capture token, store, redirect to dashboard/admin.
- [x] Add "Continue with Google" button on Login page.

## Deployment / Env
- [ ] Configure Google OAuth credentials (Google Cloud Console) in Render env.
- [ ] Configure SMTP credentials (Gmail App Password) in Render env.
- [x] Build & verify frontend + backend.
- [ ] Commit & push to GitHub (triggers Render deploy).
