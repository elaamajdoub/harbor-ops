from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from core.database import get_db
from core.auth import get_current_user
from models.domain import Container, Equipment, Cargo, Communication, Ship
from schemas.schemas import (
    ContainerCreate, ContainerUpdate, ContainerOut,
    EquipmentCreate, EquipmentUpdate, EquipmentOut,
    CargoCreate, CargoUpdate, CargoOut,
    CommunicationCreate, CommunicationUpdate, CommunicationOut,
    DashboardStats
)

# --- Containers ---
containers_router = APIRouter(prefix="/api/containers", tags=["containers"])

@containers_router.get("/", response_model=List[ContainerOut])
async def get_containers(db: AsyncSession = Depends(get_db), current_user=Depends(get_current_user)):
    result = await db.execute(select(Container).order_by(Container.created_at.desc()))
    return result.scalars().all()

@containers_router.get("/{container_id}", response_model=ContainerOut)
async def get_container(container_id: str, db: AsyncSession = Depends(get_db), current_user=Depends(get_current_user)):
    result = await db.execute(select(Container).where(Container.id == container_id))
    c = result.scalar_one_or_none()
    if not c:
        raise HTTPException(status_code=404, detail="Container not found")
    return c

@containers_router.post("/", response_model=ContainerOut)
async def create_container(container: ContainerCreate, db: AsyncSession = Depends(get_db), current_user=Depends(get_current_user)):
    db_c = Container(**container.model_dump())
    db.add(db_c)
    await db.commit()
    await db.refresh(db_c)
    return db_c

@containers_router.put("/{container_id}", response_model=ContainerOut)
async def update_container(container_id: str, container: ContainerUpdate, db: AsyncSession = Depends(get_db), current_user=Depends(get_current_user)):
    result = await db.execute(select(Container).where(Container.id == container_id))
    db_c = result.scalar_one_or_none()
    if not db_c:
        raise HTTPException(status_code=404, detail="Container not found")
    for key, value in container.model_dump(exclude_unset=True).items():
        setattr(db_c, key, value)
    await db.commit()
    await db.refresh(db_c)
    return db_c

@containers_router.delete("/{container_id}")
async def delete_container(container_id: str, db: AsyncSession = Depends(get_db), current_user=Depends(get_current_user)):
    result = await db.execute(select(Container).where(Container.id == container_id))
    db_c = result.scalar_one_or_none()
    if not db_c:
        raise HTTPException(status_code=404, detail="Container not found")
    await db.delete(db_c)
    await db.commit()
    return {"message": "Container deleted"}

# --- Equipment ---
equipment_router = APIRouter(prefix="/api/equipment", tags=["equipment"])

@equipment_router.get("/", response_model=List[EquipmentOut])
async def get_equipment(db: AsyncSession = Depends(get_db), current_user=Depends(get_current_user)):
    result = await db.execute(select(Equipment).order_by(Equipment.created_at.desc()))
    return result.scalars().all()

@equipment_router.post("/", response_model=EquipmentOut)
async def create_equipment(eq: EquipmentCreate, db: AsyncSession = Depends(get_db), current_user=Depends(get_current_user)):
    db_eq = Equipment(**eq.model_dump())
    db.add(db_eq)
    await db.commit()
    await db.refresh(db_eq)
    return db_eq

@equipment_router.put("/{eq_id}", response_model=EquipmentOut)
async def update_equipment(eq_id: str, eq: EquipmentUpdate, db: AsyncSession = Depends(get_db), current_user=Depends(get_current_user)):
    result = await db.execute(select(Equipment).where(Equipment.id == eq_id))
    db_eq = result.scalar_one_or_none()
    if not db_eq:
        raise HTTPException(status_code=404, detail="Equipment not found")
    for key, value in eq.model_dump(exclude_unset=True).items():
        setattr(db_eq, key, value)
    await db.commit()
    await db.refresh(db_eq)
    return db_eq

@equipment_router.delete("/{eq_id}")
async def delete_equipment(eq_id: str, db: AsyncSession = Depends(get_db), current_user=Depends(get_current_user)):
    result = await db.execute(select(Equipment).where(Equipment.id == eq_id))
    db_eq = result.scalar_one_or_none()
    if not db_eq:
        raise HTTPException(status_code=404, detail="Equipment not found")
    await db.delete(db_eq)
    await db.commit()
    return {"message": "Equipment deleted"}

# --- Cargo ---
cargo_router = APIRouter(prefix="/api/cargo", tags=["cargo"])

@cargo_router.get("/", response_model=List[CargoOut])
async def get_cargo(db: AsyncSession = Depends(get_db), current_user=Depends(get_current_user)):
    result = await db.execute(select(Cargo).order_by(Cargo.created_at.desc()))
    return result.scalars().all()

@cargo_router.post("/", response_model=CargoOut)
async def create_cargo(cargo: CargoCreate, db: AsyncSession = Depends(get_db), current_user=Depends(get_current_user)):
    db_c = Cargo(**cargo.model_dump())
    db.add(db_c)
    await db.commit()
    await db.refresh(db_c)
    return db_c

@cargo_router.put("/{cargo_id}", response_model=CargoOut)
async def update_cargo(cargo_id: str, cargo: CargoUpdate, db: AsyncSession = Depends(get_db), current_user=Depends(get_current_user)):
    result = await db.execute(select(Cargo).where(Cargo.id == cargo_id))
    db_c = result.scalar_one_or_none()
    if not db_c:
        raise HTTPException(status_code=404, detail="Cargo not found")
    for key, value in cargo.model_dump(exclude_unset=True).items():
        setattr(db_c, key, value)
    await db.commit()
    await db.refresh(db_c)
    return db_c

@cargo_router.delete("/{cargo_id}")
async def delete_cargo(cargo_id: str, db: AsyncSession = Depends(get_db), current_user=Depends(get_current_user)):
    result = await db.execute(select(Cargo).where(Cargo.id == cargo_id))
    db_c = result.scalar_one_or_none()
    if not db_c:
        raise HTTPException(status_code=404, detail="Cargo not found")
    await db.delete(db_c)
    await db.commit()
    return {"message": "Cargo deleted"}

# --- Communications ---
comms_router = APIRouter(prefix="/api/communications", tags=["communications"])

@comms_router.get("/", response_model=List[CommunicationOut])
async def get_communications(db: AsyncSession = Depends(get_db), current_user=Depends(get_current_user)):
    result = await db.execute(select(Communication).order_by(Communication.created_at.desc()))
    return result.scalars().all()

@comms_router.post("/", response_model=CommunicationOut)
async def create_communication(comm: CommunicationCreate, db: AsyncSession = Depends(get_db), current_user=Depends(get_current_user)):
    db_comm = Communication(**comm.model_dump())
    db.add(db_comm)
    await db.commit()
    await db.refresh(db_comm)
    return db_comm

@comms_router.put("/{comm_id}", response_model=CommunicationOut)
async def update_communication(comm_id: str, comm: CommunicationUpdate, db: AsyncSession = Depends(get_db), current_user=Depends(get_current_user)):
    result = await db.execute(select(Communication).where(Communication.id == comm_id))
    db_comm = result.scalar_one_or_none()
    if not db_comm:
        raise HTTPException(status_code=404, detail="Communication not found")
    for key, value in comm.model_dump(exclude_unset=True).items():
        setattr(db_comm, key, value)
    await db.commit()
    await db.refresh(db_comm)
    return db_comm

@comms_router.delete("/{comm_id}")
async def delete_communication(comm_id: str, db: AsyncSession = Depends(get_db), current_user=Depends(get_current_user)):
    result = await db.execute(select(Communication).where(Communication.id == comm_id))
    db_comm = result.scalar_one_or_none()
    if not db_comm:
        raise HTTPException(status_code=404, detail="Communication not found")
    await db.delete(db_comm)
    await db.commit()
    return {"message": "Communication deleted"}

# --- Dashboard ---
dashboard_router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])

@dashboard_router.get("/stats", response_model=DashboardStats)
async def get_stats(db: AsyncSession = Depends(get_db), current_user=Depends(get_current_user)):
    ships = (await db.execute(select(Ship))).scalars().all()
    containers = (await db.execute(select(Container))).scalars().all()
    equipment = (await db.execute(select(Equipment))).scalars().all()
    cargo = (await db.execute(select(Cargo))).scalars().all()
    comms = (await db.execute(select(Communication))).scalars().all()

    return DashboardStats(
        ships_total=len(ships),
        ships_docked=sum(1 for s in ships if s.status == 'docked'),
        ships_expected=sum(1 for s in ships if s.status == 'expected'),
        ships_departed=sum(1 for s in ships if s.status == 'departed'),
        containers_total=len(containers),
        containers_in_yard=sum(1 for c in containers if c.status == 'in_yard'),
        equipment_available=sum(1 for e in equipment if e.status == 'available'),
        equipment_in_use=sum(1 for e in equipment if e.status == 'in_use'),
        cargo_pending_customs=sum(1 for c in cargo if not c.customs_cleared),
        communications_urgent=sum(1 for c in comms if c.priority == 'urgent' and c.status != 'resolved'),
    )
