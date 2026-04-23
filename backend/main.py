from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers.auth import router as auth_router
from routers.ships import router as ships_router
from routers.domain import (
    containers_router, equipment_router,
    cargo_router, comms_router, dashboard_router
)

app = FastAPI(title="Harbor Operations API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(ships_router)
app.include_router(containers_router)
app.include_router(equipment_router)
app.include_router(cargo_router)
app.include_router(comms_router)
app.include_router(dashboard_router)

@app.get("/api/health")
async def health():
    return {"status": "ok", "service": "harbor-ops-backend"}
