# Counterflow POS Frontend

Standalone React interface for the Counterflow POS API.

Requires Node.js 22.13 or newer.

## Install and run
```sh
npm ci
npm run dev
```
UI: http://127.0.0.1:5173

Start counterflow-pos-backend separately on port 3001. The frontend proxies /api requests to it. To change the destination, copy .env.example to .env and edit API_PROXY_TARGET.

Run npm test for component tests. Run npm run build to generate dist/. Run npm run preview for a local build check at http://127.0.0.1:4173 while the backend is running.

## Deployment
Serve dist/ with your web server and forward /api to the backend, preserving cookies and the original Host header. The Vite proxy configuration applies only to development and local preview; it is not included in the static build.

## Upload to GitHub
Create an empty GitHub repository with this folder's name, without an initial README. Open a terminal in this folder and run:
```sh
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/REPOSITORY_NAME.git
git push -u origin main
```
Replace YOUR_USERNAME and REPOSITORY_NAME with your GitHub details. GitHub will prompt for authentication if needed.
