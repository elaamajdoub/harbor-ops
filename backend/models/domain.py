import uuid
from sqlalchemy import Column, String, Boolean, Numeric, DateTime, Text, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from core.database import Base

class Ship(Base):
    __tablename__ = "ships"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(200), nullable=False)
    imo_number = Column(String(20), unique=True, nullable=False)
    flag = Column(String(100))
    type = Column(String(100))
    gross_tonnage = Column(Numeric)
    status = Column(String(50), default='expected')
    berth = Column(String(50))
    eta = Column(DateTime)
    etd = Column(DateTime)
    actual_arrival = Column(DateTime)
    actual_departure = Column(DateTime)
    captain_name = Column(String(200))
    agent_name = Column(String(200))
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

class Container(Base):
    __tablename__ = "containers"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    container_number = Column(String(20), unique=True, nullable=False)
    ship_id = Column(UUID(as_uuid=True), ForeignKey("ships.id", ondelete="SET NULL"), nullable=True)
    type = Column(String(20), default='20ft')
    status = Column(String(50), default='inbound')
    cargo_type = Column(String(100))
    weight_kg = Column(Numeric)
    owner = Column(String(200))
    destination = Column(String(200))
    position = Column(String(50))
    is_hazardous = Column(Boolean, default=False)
    notes = Column(Text)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

class Equipment(Base):
    __tablename__ = "equipment"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(100), nullable=False)
    type = Column(String(50), nullable=False)
    status = Column(String(50), default='available')
    location = Column(String(100))
    operator_name = Column(String(200))
    assigned_ship_id = Column(UUID(as_uuid=True), ForeignKey("ships.id", ondelete="SET NULL"), nullable=True)
    capacity_tons = Column(Numeric)
    last_maintenance = Column(DateTime)
    notes = Column(Text)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

class Cargo(Base):
    __tablename__ = "cargo"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tracking_number = Column(String(50), unique=True, nullable=False)
    container_id = Column(UUID(as_uuid=True), ForeignKey("containers.id", ondelete="SET NULL"), nullable=True)
    ship_id = Column(UUID(as_uuid=True), ForeignKey("ships.id", ondelete="SET NULL"), nullable=True)
    description = Column(Text)
    shipper = Column(String(200))
    consignee = Column(String(200))
    origin = Column(String(200))
    destination = Column(String(200))
    weight_kg = Column(Numeric)
    status = Column(String(50), default='in_transit')
    customs_cleared = Column(Boolean, default=False)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

class Communication(Base):
    __tablename__ = "communications"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    ship_id = Column(UUID(as_uuid=True), ForeignKey("ships.id", ondelete="SET NULL"), nullable=True)
    type = Column(String(50), nullable=False)
    subject = Column(String(300), nullable=False)
    body = Column(Text, nullable=False)
    authority = Column(String(200))
    status = Column(String(50), default='sent')
    priority = Column(String(20), default='normal')
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
