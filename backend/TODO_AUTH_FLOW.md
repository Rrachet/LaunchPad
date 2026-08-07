# LaunchPad - Auth Flow Implementation Checklist

- [ ] Decide whether Google uses Passport sessions or direct OAuth flow.
- [ ] Implement endpoints:
  - [ ] POST /api/auth/google/start (or callback)
  - [ ] POST /api/auth/email-otp/start
  - [ ] POST /api/auth/email-otp/verify
  - [ ] POST /api/auth/password/start
  - [ ] POST /api/auth/password/verify
  - [ ] POST /api/auth/password/complete (set password hash + passwordVerified)
  - [ ] POST /api/auth/login (only if both verified)
- [ ] Ensure JWT issued ONLY after emailVerified && passwordVerified.
- [ ] Store OTPs in EmailOtp table with purpose and expiration.
- [ ] Make frontend store only signup session token (temporary) or use email as identifier.
- [ ] Handle resend/expiration errors.

