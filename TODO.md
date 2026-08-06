# LaunchBoard - Render Deployment Prep

## Progress
- [x] Analyze project & deployment state
- [x] Confirm Render is connected to GitHub (origin = LaunchPad.git)
- [x] Create render.yaml Blueprint (backend Web Service + frontend Static Site)
- [x] Update frontend API base URL to point to Render backend (https://launchboard-backend.onrender.com/api)
- [x] Add .env.example documenting all required env vars
- [x] Backend build now runs Prisma migrations (prisma generate && prisma migrate deploy)
- [x] Commit & push to GitHub (commit 44663ae on master)
- [ ] Connect LaunchPad repo in Render -> Blueprint auto-creates both services
- [ ] Set env vars in Render dashboard (DATABASE_URL, JWT_SECRET, SESSION_SECRET, etc.)
- [ ] Verify live site loads & login works end-to-end
- [ ] Confirm final URLs

## Render Service URLs (expected)
- Backend Web Service: https://launchboard-backend.onrender.com
- Frontend: (assigned by Render when Blueprint creates the Static Site)
