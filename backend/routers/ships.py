from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from typing import List
from core.database import get_db
from core.auth import get_current_user
from models.domain import Ship
from schemas.schemas import ShipCreate, ShipUpdate, ShipOut

router = APIRouter(prefix="/api/ships", tags=["ships"])

@router.get("/", response_model=List[ShipOut])
async def get_ships(db: AsyncSession = Depends(get_db), current_user=Depends(get_current_user)):
    result = await db.execute(select(Ship).order_by(Ship.created_at.desc()))
    return result.scalars().all()

@router.get("/{ship_id}", response_model=ShipOut)
async def get_ship(ship_id: str, db: AsyncSession = Depends(get_db), current_user=Depends(get_current_user)):
    result = await db.execute(select(Ship).where(Ship.id == ship_id))
    ship = result.scalar_one_or_none()
    if not ship:
        raise HTTPException(status_code=404, detail="Ship not found")
    return ship

@router.post("/", response_model=ShipOut)
async def create_ship(ship: ShipCreate, db: AsyncSession = Depends(get_db), current_user=Depends(get_current_user)):
    db_ship = Ship(**ship.model_dump())
    db.add(db_ship)
    await db.commit()
    await db.refresh(db_ship)
    return db_ship

@router.put("/{ship_id}", response_model=ShipOut)
async def update_ship(ship_id: str, ship: ShipUpdate, db: AsyncSession = Depends(get_db), current_user=Depends(get_current_user)):
    result = await db.execute(select(Ship).where(Ship.id == ship_id))
    db_ship = result.scalar_one_or_none()
    if not db_ship:
        raise HTTPException(status_code=404, detail="Ship not found")
    for key, value in ship.model_dump(exclude_unset=True).items():
        setattr(db_ship, key, value)
    await db.commit()
    await db.refresh(db_ship)
    return db_ship

@router.delete("/{ship_id}")
async def delete_ship(ship_id: str, db: AsyncSession = Depends(get_db), current_user=Depends(get_current_user)):
    result = await db.execute(select(Ship).where(Ship.id == ship_id))
    db_ship = result.scalar_one_or_none()
    if not db_ship:
        raise HTTPException(status_code=404, detail="Ship not found")
    await db.delete(db_ship)
    await db.commit()
    return {"message": "Ship deleted"}
