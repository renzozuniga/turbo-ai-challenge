# Turbo AI Challenge — Notes App

Monorepo for the Turbo AI Challenge: A full-stack, categorized, color-coded Notes application built with Django REST Framework backend and a Next.js 15 (React) frontend. Managed with pnpm workspaces and Turborepo, runnable locally via Docker Compose, and deployable for free on Render (backend + Postgres) and Vercel (frontend).

---

## 📌 Process Summary

1. **Monorepo Architecture & Scaffolding**: Structured using `pnpm` workspaces and Turborepo to unify frontend assets alongside the Django backend.
2. **Authentication & Proxy Strategy**: Configured session cookie authentication proxied through the Next.js origin (`/app/api/[...path]/route.ts`). This enables same-origin browser interactions (`localhost:3000`), eliminating CORS issues and client-side token management.
3. **Domain & Data Modeling**: Built a custom `User` model (`email` primary identifier), coupled with automatic category seeding on signup and scoped `Note` CRUD operations.
4. **Local Standardization & Infrastructure**: Configured Docker Compose with multi-stage builds and container-specific network configs (`API_URL=http://backend:8000`) for consistency between local and containerized workflows.
5. **Incremental Milestone Build**: Implemented in modular passes—spanning core infrastructure, auth screens, notes grid/filtering, full-panel note editor, and UI polish rounds.

---

## 🛠️ Key Design & Technical Decisions

* **Session Cookie Auth via Next.js Explicit Proxy**: Instead of client-stored JWTs or standard `next.config.js` rewrites (which dropped trailing slashes and caused infinite redirect loops with Django's `APPEND_SLASH`), requests are handled via a custom Next.js route handler (`/app/api/[...path]/route.ts`). This appends trailing slashes reliably and proxies session cookies directly to Django.
* **Custom User & Seeded Categories**: Replaced Django's default user model with `AbstractUser` utilizing `USERNAME_FIELD = "email"` prior to initial migrations. Every user is automatically provisioned a default set of fixed categories (`Random Thoughts`, `School`, `Personal`, `Drama`) with predefined hex color tokens.
* **Monorepo Management (Turborepo + pnpm)**: Centralizes linting, script executions, and frontend dependency management while co-locating Python backend assets.
* **Full-Panel Editor Modal**: Implemented create/edit note interfaces as state-driven overlay panels over the dashboard rather than intercepting sub-routes, mirroring seamless UX close/save behaviors.
* **Decoupled Deployment Strategy**:
  * **Backend & Postgres**: Hosted on Render via `render.yaml` Infrastructure-as-Code.
  * **Frontend**: Deployed on Vercel utilizing global CDN edge distribution.

---

## 🤖 AI Tools Used & Workflow Integration

AI tools were integrated throughout the development lifecycle to accelerate scaffolding, solve networking edge cases, and refine UI execution:

* **Cursor / GitHub Copilot**:
  * **Scaffolding & Workspaces**: Generated monorepo configuration (`pnpm-workspace.yaml`, `turbo.json`) and Next.js App Router boilerplate.
  * **Dockerization**: Drafted multi-stage Dockerfiles and container orchestration within `docker-compose.yml`.
* **ChatGPT (GPT-4o) / Claude 3.5 Sonnet**:
  * **Proxy & Redirect Debugging**: Diagnosed infinite redirect loops caused by Next.js rewrite slash trimming and Django's `APPEND_SLASH`, leading to the custom Route Handler proxy implementation.
  * **Auth & CORS Architecture**: Designed the cookie-forwarding session strategy and configured `CSRF_TRUSTED_ORIGINS` for cross-container host headers.
  * **Schema Design & Documentation**: Assisted in designing Django model relations (User/Category/Note) and auto-generating deployment/project documentation.

---

## 📊 Data Model & API Overview

### Models (`apps/backend/core/models.py`)
* **User**: Custom user extending `AbstractUser` using `email` as the primary identifier (`USERNAME_FIELD = "email"`).
* **Category**: Belongs to `User` (`FK`); contains `name` and visual `color` token. Automatically seeded on user creation.
* **Note**: Belongs to `User` (`FK`) and `Category` (`FK`). Contains `title`, `content` (plain text), `created_at`, and `updated_at`.

### API Endpoints
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register/` | Registers new user, seeds categories, sets session cookie |
| `POST` | `/api/auth/login/` | Authenticates user & sets session cookie |
| `POST` | `/api/auth/logout/` | Clears active session cookie |
| `GET`  | `/api/auth/me/` | Hydrates current authenticated user state |
| `GET`  | `/api/categories/` | Lists user's categories with annotated note counts |
| `GET`  | `/api/notes/?category=<id>` | Lists notes (newest first), optional category filter |
| `POST` | `/api/notes/` | Creates a new note |
| `GET/PATCH/DELETE` | `/api/notes/:id/` | Fetches, updates, or deletes a specific note |

---

## Structure

```
turbo-ai-challenge/
├── apps/
│   ├── backend/         # Django REST Framework backend
│   │   ├── config/      # Django settings, urls, wsgi/asgi
│   │   ├── core/        # Core app (User, Category, Note models & API views)
│   │   ├── requirements.txt
│   │   ├── Dockerfile
│   │   └── .env.example
│   └── frontend/        # Next.js 15 (App Router) + TypeScript + Tailwind CSS
│       ├── app/
│       │   ├── api/[...path]/  # Proxy route forwarding requests to backend
│       │   ├── (auth)/         # Login & Register views
│       │   └── page.tsx        # Main Notes Dashboard & Editor overlay
│       ├── lib/         # API client wrappers and helpers
│       ├── package.json
│       ├── Dockerfile
│       └── .env.example
├── docker-compose.yml    # Postgres + backend + frontend container setup
├── render.yaml           # Render blueprint (backend web service + Postgres)
├── turbo.json            # Turborepo pipeline configuration
├── pnpm-workspace.yaml
├── package.json          # Workspace root scripts
└── .env.example          # Root environment variables
```

---

## 🚀 Execution & Development Roadmap

Development followed an incremental milestone breakdown:

* [x] **Milestone 1: Foundations** — Custom User model, Note/Category models, category seeding signals, Next.js API proxy route, base layouts, and Tailwind setup.
* [x] **Milestone 2: Auth Screens** — `/register` and `/login` interface integration with session cookie hydration.
* [x] **Milestone 3: Notes Dashboard Shell** — Sidebar rendering active categories with counts, empty states, and new note trigger.
* [x] **Milestone 4: Notes Grid** — Display cards ordered newest-first with formatted dates and color tokens.
* [x] **Milestone 5: Filtering & Queries** — Category selection filtering via active URL query parameters.
* [x] **Milestone 6: Note Creation Panel** — Full-panel modal overlay with live category selectors.
* [x] **Milestone 7: Note Editing & Deletion** — Pre-filled edit panel allowing modifications and deletion.
* [x] **Milestone 8: Polish Pass** — Responsive refinement, error boundary/loading state checks, and production env validation.

---

## 💻 Running Locally

### Option A — Local Dev with Docker Compose (Recommended)

Spins up Postgres, Django, and Next.js seamlessly:

```bash
# Prepare environment files
cp .env.example .env
cp apps/backend/.env.example apps/backend/.env
cp apps/frontend/.env.example apps/frontend/.env

# Build and start services
docker compose up --build
```

* **Frontend**: http://localhost:3000
* **Backend API / Health**: http://localhost:3000/api/health/ (proxied) or http://localhost:8000/api/health/

Run Django migrations or administrative actions inside the backend container:

```bash
docker compose exec backend python manage.py migrate
docker compose exec backend python manage.py createsuperuser
```

### Option B — Native Local Development

**1. Backend**:
```bash
cd apps/backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements-dev.txt
cp .env.example .env
python manage.py migrate
python manage.py runserver
```

**2. Frontend** (in a separate terminal from repo root):
```bash
corepack enable
pnpm install
cp apps/frontend/.env.example apps/frontend/.env
pnpm dev
```

---

## 🌐 Deployment

### Backend → Render (Free Tier)
1. Push repository to GitHub.
2. Navigate to Render -> **New > Blueprint** pointing to your repository.
3. Render reads `render.yaml` to provision the Django web service and Postgres instance automatically.
4. Run migrations via Render's service shell:
   ```bash
   python manage.py migrate
   ```
5. Update `CORS_ALLOWED_ORIGINS` and `CSRF_TRUSTED_ORIGINS` with your deployment URL.

### Frontend → Vercel (Free Tier)
1. In Vercel, **Add New > Project** and import the GitHub repository.
2. Set **Root Directory** to `apps/frontend`.
3. Add environment variable: `API_URL` = your Render backend endpoint.
4. Deploy.

---

## 🛠️ Turborepo Commands

Run from the root workspace directory:

```bash
pnpm dev     # Runs Next.js frontend dev server via Turborepo
pnpm build   # Produces optimized production builds
pnpm lint    # Executes ESLint checks across workspace packages