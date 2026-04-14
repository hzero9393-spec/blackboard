# Visual Web Builder

Production-ready starter for a dark-theme infinite canvas visual builder using React Flow + Zustand and a Turso-backed Express API.

## Stack

- Frontend: React + Vite + Tailwind + React Flow + Zustand + Fabric-ready hook points
- Backend: Express + JWT auth + Turso (`@libsql/client`)
- Deploy: Vercel (frontend), server can be deployed separately or adapted to Vercel functions
- Repo: GitHub-ready structure

## Project Structure

```txt
client/
server/
```

## Run Locally

### 1) Client

```bash
cd client
npm install
npm run dev
```

### 2) Server

```bash
cd server
npm install
npm run dev
```

Server default: `http://localhost:4000`

## Environment Variables

### `server/.env`

```env
PORT=4000
JWT_SECRET=replace-with-strong-secret
TURSO_DATABASE_URL=libsql://your-db-url.turso.io
TURSO_AUTH_TOKEN=your-turso-token
```

## API Endpoints

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/projects`
- `POST /api/projects`
- `GET /api/projects/:id`
- `PUT /api/projects/:id`
- `DELETE /api/projects/:id`
- `POST /api/projects/:id/export`

## Data Structure

```json
{
  "version": "1.0",
  "projectId": "uuid",
  "nodes": [],
  "edges": [],
  "viewport": { "x": 0, "y": 0, "zoom": 1 },
  "history": { "past": [], "future": [] }
}
```

## Core Features Implemented

- Infinite canvas with dark grid background, zoom/pan, minimap
- Node create/select/move/duplicate/delete + edge connect
- Undo/redo history with capped stack
- Toolbar + layer list + basic style panel
- PNG/PDF export
- Local autosave-ready store snapshot flow
- Project CRUD API with Turso persistence

## Future-ready hooks included

- WebSocket collaboration placeholder in server bootstrap
- AI layout generation integration point in editor flow
- Cloud storage note: add S3/Supabase object storage for uploaded assets and store URLs in project metadata

## GitHub + Vercel Deployment

1. Create GitHub repo and push this code.
2. Import `client` project in Vercel.
3. Set frontend envs if needed (`VITE_API_URL` when wiring API).
4. Deploy backend separately (or convert Express routes to Vercel serverless handlers).
5. Add Turso env vars in backend hosting provider.

---

This codebase is intentionally modular so you can extend advanced features like rich-text nodes, edge smart routing, free draw overlay, comments, and live collaboration.
