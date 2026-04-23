# Harbor Ops — Port Management System

A microservices-architecture web application for managing harbor operations: ship traffic, container handling, equipment coordination, cargo tracking, and port authority communications.

---

## Architecture

```
harbor-ops/
├── frontend/     → React + Vite + Tailwind   (Port 3000)
├── backend/      → FastAPI + Python           (Port 8000)
├── db/           → PostgreSQL 15              (Port 5432)
└── docker-compose.yml
```

Each service is **independently containerized** and communicates over a shared Docker network (`harbor-net`).

---

## Quick Start

### Prerequisites
- Docker + Docker Compose installed

### Run everything
```bash
cd harbor-ops
docker-compose up --build
```

Then open: **http://localhost:3000**

**Default credentials:** `admin` / `admin123`

---

## Services

### 🗄️ Database (`db/`)
- PostgreSQL 15
- Schema auto-initialized on first run via `init.sql`
- Includes sample data (4 ships, 4 containers, 3 cargo entries, 4 communications)

### ⚙️ Backend (`backend/`)
- FastAPI (Python 3.11)
- JWT authentication
- Full REST API for all modules
- Auto docs: **http://localhost:8000/docs**

**API Endpoints:**
| Module | Endpoint |
|--------|----------|
| Auth | `POST /api/auth/login` |
| Ships | `GET/POST/PUT/DELETE /api/ships/` |
| Containers | `GET/POST/PUT/DELETE /api/containers/` |
| Equipment | `GET/POST/PUT/DELETE /api/equipment/` |
| Cargo | `GET/POST/PUT/DELETE /api/cargo/` |
| Communications | `GET/POST/PUT/DELETE /api/communications/` |
| Dashboard | `GET /api/dashboard/stats` |

### 🖥️ Frontend (`frontend/`)
- React 18 + Vite
- Tailwind CSS (dark maritime theme)
- Recharts for dashboard charts
- Served via Nginx in production

**Pages:**
- `/dashboard` — Operational overview with stats & charts
- `/ships` — Ship arrivals/departures management
- `/containers` — Container tracking in yard
- `/equipment` — Crane & machinery coordination
- `/cargo` — Cargo & customs tracking
- `/communications` — Port authority messaging

---

## Development (without Docker)

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Set your local DB URL
export DATABASE_URL=postgresql+asyncpg://harbor_user:harbor_pass@localhost:5432/harbor_ops

uvicorn main:app --reload --port 8000
```

### Frontend
```bash
cd frontend
npm install
npm run dev   # http://localhost:3000
```

---

## Kubernetes-Ready Notes

Each service has its own `Dockerfile`. When moving to Kubernetes:

- Create a `Deployment` + `Service` for each (`frontend`, `backend`, `db`)
- Use a `ConfigMap` for env vars and a `Secret` for DB credentials
- Use a `PersistentVolumeClaim` for PostgreSQL data
- Use an `Ingress` to route `/api/` → backend and `/` → frontend
- Replace `docker-compose` networking with Kubernetes `ClusterIP` services

---

## Environment Variables

| Service | Variable | Default |
|---------|----------|---------|
| backend | `DATABASE_URL` | `postgresql+asyncpg://harbor_user:harbor_pass@db:5432/harbor_ops` |
| backend | `SECRET_KEY` | Change in production! |
| backend | `ACCESS_TOKEN_EXPIRE_MINUTES` | `480` |
| db | `POSTGRES_DB` | `harbor_ops` |
| db | `POSTGRES_USER` | `harbor_user` |
| db | `POSTGRES_PASSWORD` | `harbor_pass` |
