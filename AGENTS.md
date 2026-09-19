# Orange Mboa Business — AGENTS.md

## Overview
Mobile-first web app for Cameroonian micro-entrepreneurs to manage sales, clients, and finances. Entirely in French, FCFA currency.

## Stack
- **Frontend**: React 18 + Vite 6 + Tailwind CSS 3, React Router, TanStack Query, lucide-react, date-fns, canvas-confetti, react-markdown
- **Backend**: Express + Node 22, JWT auth (bcryptjs + jsonwebtoken), raw SQL via `pg`
- **Database**: PostgreSQL 16
- **AI Assistant "Oby"**: Rule-based intent parser (no external LLM) — detects sales, clients, stats, debts from French messages

## Architecture
- Single-origin: Vite dev server proxies `/api` to the Express backend. Only port 3000 is exposed.
- Auth: JWT in localStorage. `/api/auth/demo` creates/returns a demo user for quick access.
- All data is user-scoped (every query filters by `user_id` from the JWT).

## Running
```bash
docker compose -f docker-compose.base44.yml up -d
```
- Frontend: http://localhost:3000 (Vite dev, live reload)
- Backend: http://localhost:8000 (Node --watch, auto-restart on changes)
- DB: PostgreSQL in compose volume

## Key Files
- `frontend/src/lib/api.js` — API client with all endpoints
- `frontend/src/context/AuthContext.jsx` — auth state management
- `backend/src/routes/chat.js` — Oby assistant logic (generateObyResponse)
- `backend/src/db.js` — schema initialization

## Conventions
- `@/` alias maps to `frontend/src/`
- FCFA formatting via `Intl.NumberFormat('fr-FR')` in `lib/format.js`
- Components < 50 lines, one component per file
- Tailwind classes are literal strings (no dynamic class names)
