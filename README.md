# Turbo AI Challenge

Monorepo for the Turbo AI Challenge: Django REST backend + Next.js (React) frontend,
managed with pnpm workspaces and Turborepo, runnable locally via Docker Compose,
and deployable for free on Render (backend + Postgres) and Vercel (frontend).

## Structure

```
turbo-ai-challenge/
├── apps/
│   ├── backend/         # Django + Django REST Framework
│   │   ├── config/      # settings, urls, wsgi/asgi
│   │   ├── core/        # example app (health check endpoint)
│   │   ├── requirements.txt
│   │   ├── Dockerfile
│   │   └── .env.example
│   └── frontend/        # Next.js (App Router) + TypeScript
│       ├── app/
│       ├── package.json
│       ├── Dockerfile
│       └── .env.example
├── docker-compose.yml    # Postgres + backend + frontend for local dev
├── render.yaml           # Render blueprint (backend web service + Postgres)
├── turbo.json            # Turborepo pipeline
├── pnpm-workspace.yaml
├── package.json          # root workspace scripts (turbo run dev/build/lint)
└── .env.example          # Postgres credentials for docker-compose
```

## Prerequisites

- Node.js >= 18 and [pnpm](https://pnpm.io/installation) (`corepack enable` will provide it)
- Python >= 3.12 (only needed if you run the backend without Docker)
- Docker + Docker Compose (recommended path for local dev)
- A GitHub account (to push this repo)
- Free accounts on [Render](https://render.com) and [Vercel](https://vercel.com) for deployment

## Option A — Local dev with Docker Compose (recommended)

This spins up Postgres, Django and Next.js together, wired to talk to each other.

```bash
# from the repo root
cp .env.example .env
cp apps/backend/.env.example apps/backend/.env
cp apps/frontend/.env.example apps/frontend/.env

docker compose up --build
```

- Frontend: http://localhost:3000
- Backend health check: http://localhost:8000/api/health/

Run Django management commands inside the running container:

```bash
docker compose exec backend python manage.py migrate
docker compose exec backend python manage.py createsuperuser
```

**Troubleshooting: containers stuck in `Created` and never start**

If `docker compose up` prints `Attaching to ...` and then nothing happens, run
`docker ps -a` — if services show status `Created` (never `Running`), something
else on your machine is already bound to one of the ports Compose wants
(`5432` for Postgres, `8000`, or `3000`). This is common if you have a native
Postgres install running. Check with `lsof -nP -iTCP:5432 -sTCP:LISTEN`, then
either stop that process or change `POSTGRES_PORT` (and/or the backend/frontend
ports in `docker-compose.yml`) to a free port. Clean up the stuck containers
first with `docker compose down` before retrying.

## Option B — Local dev without Docker

**Backend**

```bash
cd apps/backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements-dev.txt
cp .env.example .env   # edit DATABASE_URL if not using Postgres — sqlite works by default if you unset it
python manage.py migrate
python manage.py runserver
```

**Frontend** (in a second terminal, from repo root)

```bash
corepack enable
pnpm install
cp apps/frontend/.env.example apps/frontend/.env
pnpm dev
```

`pnpm dev` at the root runs `turbo run dev`, which starts every app in the workspace
(currently just the frontend — the Django backend isn't part of the pnpm/turbo
pipeline since it's a Python project, so run it separately as shown above).

## Environment variables

**Root `.env`** (docker-compose Postgres container)
| Variable | Purpose |
|---|---|
| `POSTGRES_DB` / `POSTGRES_USER` / `POSTGRES_PASSWORD` | Local Postgres credentials |

**`apps/backend/.env`**
| Variable | Purpose |
|---|---|
| `SECRET_KEY` | Django secret key |
| `DEBUG` | `True` locally, `False` in production |
| `ALLOWED_HOSTS` | Comma-separated hostnames |
| `DATABASE_URL` | e.g. `postgres://user:pass@host:5432/db` |
| `CORS_ALLOWED_ORIGINS` | Comma-separated origins allowed to call the API (your frontend URL) |

**`apps/frontend/.env`**
| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_API_URL` | Backend base URL, used client- and server-side |
| `API_URL` | Backend base URL used by the Next.js rewrite proxy (server-side only) |

## Push to GitHub

```bash
cd turbo-ai-challenge
git init
git add .
git commit -m "Initial monorepo scaffold: Django + Next.js"
git branch -M main
git remote add origin <your-empty-github-repo-url>
git push -u origin main
```

## Deployment

### Backend → Render (free tier)

1. Push this repo to GitHub (above).
2. In Render, choose **New > Blueprint**, point it at your repo — it will read
   `render.yaml` and provision a free web service (`turbo-ai-challenge-backend`)
   plus a free Postgres database, wiring `DATABASE_URL` automatically.
3. After the first deploy, open the service's **Shell** tab (or add a one-off job)
   and run:
   ```bash
   python manage.py migrate
   python manage.py createsuperuser
   ```
4. Update the `CORS_ALLOWED_ORIGINS` env var on the Render service to your real
   Vercel URL once you have it (step below), then redeploy.
5. Note the backend's public URL, e.g. `https://turbo-ai-challenge-backend.onrender.com`.

### Frontend → Vercel (free tier)

1. In Vercel, **Add New > Project**, import the same GitHub repo.
2. Set **Root Directory** to `apps/frontend` (Vercel auto-detects Next.js from there).
3. Add environment variables in the Vercel project settings:
   - `NEXT_PUBLIC_API_URL` = your Render backend URL
   - `API_URL` = your Render backend URL
4. Deploy. Vercel gives you a URL like `https://your-project.vercel.app`.
5. Go back to Render and set `CORS_ALLOWED_ORIGINS` to that Vercel URL, then redeploy the backend.

Both platforms redeploy automatically on every push to `main` once connected.

## Turborepo commands (from repo root)

```bash
pnpm dev     # turbo run dev   — starts the frontend dev server
pnpm build   # turbo run build — production build of the frontend
pnpm lint    # turbo run lint  — lints the frontend
```
