# LaunchBoard - Render Deployment Prep

## Progress
- [x] Analyze project & deployment state
- [x] Confirm Render is connected to GitHub (origin = LaunchPad.git)
- [x] Create render.yaml Blueprint (backend Web Service + frontend Static Site)
- [x] Update frontend API base URL to point to Render backend
- [x] Add backend serve-static for production single-service option
- [x] Commit changes & push to GitHub so Render auto-deploys
- [ ] Set env vars in Render dashboard (DATABASE_URL, JWT_SECRET, SESSION_SECRET, etc.)
- [ ] Verify live site loads & login works end-to-end
- [ ] Confirm final URLs

## Render Service URLs (expected)
- Backend Web Service: https://launchboard-backend.onrender.com
- Frontend: (assigned by Render when Blueprint creates the Static Site)
