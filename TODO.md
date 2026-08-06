# LaunchBoard - Vercel Deployment Status

## Progress
- [x] Analyze project & deployment state
- [x] Deploy backend to Vercel (launchpad-backend) — Ready
- [x] Deploy frontend to Vercel (frontend) — Ready
- [x] Fix frontend Vercel build (root vercel.json builds from frontend dir)
- [x] Revert frontend API base URL to Vercel backend
- [x] Commit changes & push to GitHub
- [ ] Verify live site loads & login works end-to-end
- [ ] Confirm final URLs

## Deployed URLs
- Backend: https://launchpad-backend-zeta.vercel.app
- Frontend: https://frontend-amar-proj.vercel.app

## Notes
- Frontend build was failing because frontend Vercel project used root directory `/`, running the root package.json build (`npm run build --prefix frontend`) which failed with `vite: command not found`.
- Fixed by adding root `vercel.json` with `buildCommand: cd frontend && npm install && npm run build` and `outputDirectory: frontend/dist`.
- The GitHub auto-deploy now succeeds (build runs `vite build`, 508 modules transformed).
