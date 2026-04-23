from pydantic import BaseModel
from typing import Optional
from datetime import datetime
import uuid

# Auth
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

# Ships
class ShipBase(BaseModel):
    name: str
    imo_number: str
    flag: Optional[str] = None
    type: Optional[str] = None
    gross_tonnage: Optional[float] = None
    status: Optional[str] = "expected"
    berth: Optional[str] = None
    eta: Optional[datetime] = None
    etd: Optional[datetime] = None
    actual_arrival: Optional[datetime] = None
    actual_departure: Optional[datetime] = None
    captain_name: Optional[str] = None
    agent_name: Optional[str] = None

class ShipCreate(ShipBase):
    pass

class ShipUpdate(BaseModel):
    name: Optional[str] = None
    flag: Optional[str] = None
    type: Optional[str] = None
    gross_tonnage: Optional[float] = None
    status: Optional[str] = None
    berth: Optional[str] = None
    eta: Optional[datetime] = None
    etd: Optional[datetime] = None
    actual_arrival: Optional[datetime] = None
    actual_departure: Optional[datetime] = None
    captain_name: Optional[str] = None
    agent_name: Optional[str] = None

class ShipOut(ShipBase):
    id: uuid.UUID
    created_at: Optional[datetime] = None
    class Config:
        from_attributes = True

# Containers
class ContainerBase(BaseModel):
    container_number: str
    ship_id: Optional[uuid.UUID] = None
    type: Optional[str] = "20ft"
    status: Optional[str] = "inbound"
    cargo_type: Optional[str] = None
    weight_kg: Optional[float] = None
    owner: Optional[str] = None
    destination: Optional[str] = None
    position: Optional[str] = None
    is_hazardous: Optional[bool] = False
    notes: Optional[str] = None

class ContainerCreate(ContainerBase):
    pass

class ContainerUpdate(BaseModel):
    ship_id: Optional[uuid.UUID] = None
    type: Optional[str] = None
    status: Optional[str] = None
    cargo_type: Optional[str] = None
    weight_kg: Optional[float] = None
    owner: Optional[str] = None
    destination: Optional[str] = None
    position: Optional[str] = None
    is_hazardous: Optional[bool] = None
    notes: Optional[str] = None

class ContainerOut(ContainerBase):
    id: uuid.UUID
    created_at: Optional[datetime] = None
    class Config:
        from_attributes = True

# Equipment
class EquipmentBase(BaseModel):
    name: str
    type: str
    status: Optional[str] = "available"
    location: Optional[str] = None
    operator_name: Optional[str] = None
    assigned_ship_id: Optional[uuid.UUID] = None
    capacity_tons: Optional[float] = None
    last_maintenance: Optional[datetime] = None
    notes: Optional[str] = None

class EquipmentCreate(EquipmentBase):
    pass

class EquipmentUpdate(BaseModel):
    name: Optional[str] = None
    type: Optional[str] = None
    status: Optional[str] = None
    location: Optional[str] = None
    operator_name: Optional[str] = None
    assigned_ship_id: Optional[uuid.UUID] = None
    capacity_tons: Optional[float] = None
    last_maintenance: Optional[datetime] = None
    notes: Optional[str] = None

class EquipmentOut(EquipmentBase):
    id: uuid.UUID
    created_at: Optional[datetime] = None
    class Config:
        from_attributes = True

# Cargo
class CargoBase(BaseModel):
    tracking_number: str
    container_id: Optional[uuid.UUID] = None
    ship_id: Optional[uuid.UUID] = None
    description: Optional[str] = None
    shipper: Optional[str] = None
    consignee: Optional[str] = None
    origin: Optional[str] = None
    destination: Optional[str] = None
    weight_kg: Optional[float] = None
    status: Optional[str] = "in_transit"
    customs_cleared: Optional[bool] = False

class CargoCreate(CargoBase):
    pass

class CargoUpdate(BaseModel):
    container_id: Optional[uuid.UUID] = None
    ship_id: Optional[uuid.UUID] = None
    description: Optional[str] = None
    shipper: Optional[str] = None
    consignee: Optional[str] = None
    origin: Optional[str] = None
    destination: Optional[str] = None
    weight_kg: Optional[float] = None
    status: Optional[str] = None
    customs_cleared: Optional[bool] = None

class CargoOut(CargoBase):
    id: uuid.UUID
    created_at: Optional[datetime] = None
    class Config:
        from_attributes = True

# Communication
class CommunicationBase(BaseModel):
    ship_id: Optional[uuid.UUID] = None
    type: str
    subject: str
    body: str
    authority: Optional[str] = None
    status: Optional[str] = "sent"
    priority: Optional[str] = "normal"

class CommunicationCreate(CommunicationBase):
    pass

class CommunicationUpdate(BaseModel):
    type: Optional[str] = None
    subject: Optional[str] = None
    body: Optional[str] = None
    authority: Optional[str] = None
    status: Optional[str] = None
    priority: Optional[str] = None

class CommunicationOut(CommunicationBase):
    id: uuid.UUID
    created_at: Optional[datetime] = None
    class Config:
        from_attributes = True

# Dashboard stats
class DashboardStats(BaseModel):
    ships_total: int
    ships_docked: int
    ships_expected: int
    ships_departed: int
    containers_total: int
    containers_in_yard: int
    equipment_available: int
    equipment_in_use: int
    cargo_pending_customs: int
    communications_urgent: int
