import uuid
from sqlalchemy import Column, String, Boolean, Numeric, DateTime, Text, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from core.database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    username = Column(String(100), unique=True, nullable=False)
    hashed_password = Column(Text, nullable=False)
    created_at = Column(DateTime, server_default=func.now())
